import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getChannelMessages, sendMessage } from '@/lib/chat'
import { updateUserActivity } from '@/lib/activeUsers'

export const dynamic = 'force-dynamic'

/**
 * GET - Get messages for a channel
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const channelId = parseInt(searchParams.get('channelId') || '0')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId is required' },
        { status: 400 }
      )
    }

    // Update user activity
    await updateUserActivity(user.userId)

    const messages = await getChannelMessages(channelId, limit)

    return NextResponse.json({
      success: true,
      messages
    })
  } catch (error: any) {
    console.error('Messages error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get messages' },
      { status: 500 }
    )
  }
}

/**
 * POST - Send a message
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { channelId, message, messageType } = await request.json()

    if (!channelId || !message || !message.trim()) {
      return NextResponse.json(
        { error: 'channelId and message are required' },
        { status: 400 }
      )
    }

    // Update user activity
    await updateUserActivity(user.userId)

    const messageId = await sendMessage(
      channelId,
      user.userId,
      message,
      messageType || 'text'
    )

    return NextResponse.json({
      success: true,
      messageId
    })
  } catch (error: any) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}

