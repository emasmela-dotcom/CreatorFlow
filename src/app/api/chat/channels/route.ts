import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getDefaultChannels, createChannel } from '@/lib/chat'

export const dynamic = 'force-dynamic'

/**
 * GET - Get all channels
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const channels = await getDefaultChannels()

    return NextResponse.json({
      success: true,
      channels
    })
  } catch (error: any) {
    console.error('Channels error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get channels' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a new channel
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, channelType } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400 }
      )
    }

    const channelId = await createChannel(
      name.trim(),
      description?.trim() || '',
      user.userId,
      channelType || 'public'
    )

    return NextResponse.json({
      success: true,
      channelId
    })
  } catch (error: any) {
    console.error('Channel creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create channel' },
      { status: 500 }
    )
  }
}

