import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { canMakeClaudeCall, logAICall } from '@/lib/usageTracking'
import { callClaude } from '@/lib/ai/llm'

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
