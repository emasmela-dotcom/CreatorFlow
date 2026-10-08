import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { canMakeClaudeCall, logAICall } from '@/lib/usageTracking'
import { callClaude } from '@/lib/ai/llm'
import { canUsePaidTools } from '@/lib/aiUsagePolicy'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let topic = ''
  try {
    const body = await request.json()
    topic = String(body?.topic || '').trim()
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 })
  }

  if (!topic) {
    return NextResponse.json({ error: 'Type what to write about.' }, { status: 400 })
  }

  let plan: string | null = null
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [user.userId],
    })
    plan = (userResult.rows[0] as { subscription_tier?: string | null } | undefined)?.subscription_tier || null
  } catch {
    plan = null
  }

  if (!canUsePaidTools(user.email, plan)) {
    return NextResponse.json(
      { error: 'Claude is on a paid plan. You can see it. Use starts when you pay.' },
      { status: 403 }
    )
  }

  const limit = await canMakeClaudeCall(user.userId)
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.message }, { status: 429 })
  }

  const result = await callClaude({
    userId: user.userId,
    temperature: 0.7,
    maxTokens: 1024,
    messages: [
      {
        role: 'system',
        content:
          'You write social posts for CreatorFlow365. Stay on the topic. Write a full draft the user can edit. Do not invent unrelated subjects.',
      },
      {
        role: 'user',
        content: topic,
      },
    ],
  })

  if (!result.ok) {
    const status = result.code === 'NOT_CONFIGURED' ? 503 : result.code === 'USAGE_LIMIT' ? 429 : 502
    return NextResponse.json({ error: result.error }, { status })
  }

  await logAICall(limit.planOwnerId, 'Claude', '/api/ai/claude-write')

  return NextResponse.json({ success: true, content: result.text })
}
