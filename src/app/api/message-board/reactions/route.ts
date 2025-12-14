import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { addReaction, removeReaction } from '@/lib/messageBoard'
import { updateUserActivity } from '@/lib/activeUsers'

export const dynamic = 'force-dynamic'

/**
 * POST - Add or remove reaction
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId, replyId, reactionType, action } = await request.json()

    if (!postId && !replyId) {
      return NextResponse.json(
        { error: 'postId or replyId is required' },
        { status: 400 }
      )
    }

    // Update user activity
    await updateUserActivity(user.userId)

    if (action === 'remove') {
      await removeReaction(user.userId, postId, replyId, reactionType)
    } else {
      await addReaction(
        user.userId,
        postId,
        replyId,
        reactionType || 'like'
      )
    }

    return NextResponse.json({
      success: true,
      message: action === 'remove' ? 'Reaction removed' : 'Reaction added'
    })
  } catch (error: any) {
    console.error('Reaction error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update reaction' },
      { status: 500 }
    )
  }
}

