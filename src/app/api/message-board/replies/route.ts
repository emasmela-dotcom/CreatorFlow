import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getReplies, createReply } from '@/lib/messageBoard'
import { updateUserActivity } from '@/lib/activeUsers'

export const dynamic = 'force-dynamic'

/**
 * GET - Get replies for a post
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = parseInt(searchParams.get('postId') || '0')

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      )
    }

    // Update user activity
    await updateUserActivity(user.userId)

    const replies = await getReplies(postId)

    return NextResponse.json({
      success: true,
      replies
    })
  } catch (error: any) {
    console.error('Replies error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get replies' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a reply
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId, content, parentReplyId } = await request.json()

    if (!postId || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'postId and content are required' },
        { status: 400 }
      )
    }

    // Update user activity
    await updateUserActivity(user.userId)

    const replyId = await createReply(postId, user.userId, content, parentReplyId)

    return NextResponse.json({
      success: true,
      replyId
    })
  } catch (error: any) {
    console.error('Create reply error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create reply' },
      { status: 500 }
    )
  }
}

