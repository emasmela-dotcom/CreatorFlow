import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  ASSISTANT_JOBS,
  CONTENT_WRITER_JOBS,
  DEMO_EMAIL,
  HASHTAG_SAVE_JOBS,
  POST_JOBS,
  REPURPOSING_JOBS,
  TEMPLATE_JOBS,
} from '@/lib/demoLibrarySeed'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

type SeedResult = {
  ok: boolean
  label: string
  error?: string
}

async function ensureDemoTrialAccess(userId: string) {
  await db.execute({
    sql: `
      UPDATE users
      SET subscription_tier = 'starter',
          trial_end_at = NOW() + INTERVAL '30 days'
      WHERE id = ?
    `,
    args: [userId],
  })
}

async function callApi(
  origin: string,
  token: string,
  path: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const res = await fetch(`${origin}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  let data: Record<string, unknown> = {}
  try {
    data = (await res.json()) as Record<string, unknown>
  } catch {
    data = { error: 'Invalid JSON response' }
  }
  return { ok: res.ok, data }
}

/**
 * POST — Fill demo library via in-app bots (content writer, repurposing, templates, posts, hashtags).
 * Requires demo account JWT from POST /api/demo/activate.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRow = await db.execute({
      sql: 'SELECT email FROM users WHERE id = ?',
      args: [user.userId],
    })
    const email = (userRow.rows[0] as { email?: string } | undefined)?.email
    if (email !== DEMO_EMAIL) {
      return NextResponse.json(
        { error: 'Only the demo account can run library seeding' },
        { status: 403 }
      )
    }

    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Bearer token required' }, { status: 401 })
    }

    await ensureDemoTrialAccess(user.userId)

    const origin = new URL(request.url).origin
    const results: SeedResult[] = []

    for (const job of CONTENT_WRITER_JOBS) {
      const label = `content-writer:${job.type}`
      const { ok, data } = await callApi(origin, token, '/api/bots/content-writer', { ...job })
      results.push({ ok, label, error: ok ? undefined : String(data.error || 'failed') })
    }

    for (const job of REPURPOSING_JOBS) {
      const label = `repurposing:${job.targetPlatforms.join('+')}`
      const { ok, data } = await callApi(origin, token, '/api/bots/content-repurposing', { ...job })
      results.push({ ok, label, error: ok ? undefined : String(data.error || 'failed') })
    }

    for (const job of ASSISTANT_JOBS) {
      const label = `content-assistant:${job.platform}`
      const { ok, data } = await callApi(origin, token, '/api/bots/content-assistant', { ...job })
      results.push({ ok, label, error: ok ? undefined : String(data.error || 'failed') })
    }

    for (const job of HASHTAG_SAVE_JOBS) {
      const label = `hashtag-save:${job.name}`
      const { ok, data } = await callApi(origin, token, '/api/hashtag-research', {
        action: 'save',
        ...job,
      })
      results.push({ ok, label, error: ok ? undefined : String(data.error || 'failed') })
    }

    for (const job of TEMPLATE_JOBS) {
      const label = `template:${job.name}`
      const { ok, data } = await callApi(origin, token, '/api/content-templates', {
        ...job,
        variables: JSON.stringify(job.variables),
      })
      results.push({ ok, label, error: ok ? undefined : String(data.error || 'failed') })
    }

    for (const job of POST_JOBS) {
      const label = `post:${job.platform}`
      const { ok, data } = await callApi(origin, token, '/api/posts', { ...job })
      results.push({ ok, label, error: ok ? undefined : String(data.error || 'failed') })
    }

    const passed = results.filter((r) => r.ok).length
    const failed = results.filter((r) => !r.ok)

    return NextResponse.json({
      success: failed.length === 0,
      summary: {
        total: results.length,
        passed,
        failed: failed.length,
      },
      results,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Seed failed'
    console.error('Demo seed-library error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
