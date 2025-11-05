import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { enforceContentLock } from '@/lib/contentLockCheck'
import { verifyAuth, sanitizeContent } from '@/lib/auth'

/**
 * Update a post - ENFORCES LOCK
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Verify auth from JWT
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId

    const { id } = await params
    const postId = id

    // ENFORCE LOCK - prevent editing locked content
    try {
      await enforceContentLock(postId, userId)
    } catch (lockError: any) {
      return NextResponse.json({ 
        error: lockError.message,
        code: 'CONTENT_LOCKED',
        upgradeRequired: true
      }, { status: 403 })
    }

    const body = await request.json()
    const { platform, content, media_urls, scheduled_at, status } = body

    // Build update query dynamically
    const updates: string[] = []
    const args: any[] = []

    if (platform !== undefined) {
      updates.push('platform = ?')
      args.push(platform)
    }
    if (content !== undefined) {
      updates.push('content = ?')
      args.push(content)
    }
    if (media_urls !== undefined) {
      updates.push('media_urls = ?')
      args.push(JSON.stringify(media_urls))
    }
    if (scheduled_at !== undefined) {
      updates.push('scheduled_at = ?')
      args.push(scheduled_at)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      args.push(status)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updates.push('updated_at = ?')
    args.push(new Date().toISOString())
    args.push(postId, userId)

    await db.execute({
      sql: `UPDATE content_posts 
            SET ${updates.join(', ')}
            WHERE id = ? AND user_id = ?`,
      args
    })

    return NextResponse.json({ 
      success: true,
      message: 'Post updated successfully'
    })
  } catch (error: any) {
    console.error('Update post error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update post' 
    }, { status: 500 })
  }
}

/**
 * Delete a post - ENFORCES LOCK
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Verify auth from JWT
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId

    const { id } = await params
    const postId = id

    // ENFORCE LOCK - prevent deleting locked content
    try {
      await enforceContentLock(postId, userId)
    } catch (lockError: any) {
      return NextResponse.json({ 
        error: lockError.message,
        code: 'CONTENT_LOCKED',
        upgradeRequired: true
      }, { status: 403 })
    }

    await db.execute({
      sql: 'DELETE FROM content_posts WHERE id = ? AND user_id = ?',
      args: [postId, userId]
    })

    return NextResponse.json({ 
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete post error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete post' 
    }, { status: 500 })
  }
}
