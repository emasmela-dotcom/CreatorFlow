import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { enforceContentLock, hasActiveSubscription } from '@/lib/contentLockCheck'
import { verifyAuth, isValidEmail, sanitizeContent } from '@/lib/auth'

/**
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify auth from JWT
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId

    // Check if user has active subscription
    const hasSubscription = await hasActiveSubscription(userId)
    if (!hasSubscription) {
      // Check if user is in trial period
      const userResult = await db.execute({
        sql: 'SELECT trial_end_at FROM users WHERE id = ?',
        args: [userId]
      })

      if (userResult.rows.length > 0) {
        const userData = userResult.rows[0] as any
        const trialEnd = userData.trial_end_at ? new Date(userData.trial_end_at) : null
        const now = new Date()

        if (!trialEnd || now > trialEnd) {
          return NextResponse.json({ 
            error: 'Subscription required. Upgrade to a paid plan to create new content.' 
          }, { status: 403 })
        }
      } else {
        return NextResponse.json({ 
          error: 'Subscription required. Upgrade to a paid plan to create new content.' 
        }, { status: 403 })
      }
    }

    const body = await request.json()
    let { platform, content, media_urls, scheduled_at, status = 'draft' } = body

    // SECURITY: Input validation and sanitization
    if (!platform || !content) {
      return NextResponse.json({ error: 'Platform and content are required' }, { status: 400 })
    }

    // Validate platform
    const validPlatforms = ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    // Sanitize and validate content
    if (typeof content !== 'string' || content.length === 0) {
      return NextResponse.json({ error: 'Content must be a non-empty string' }, { status: 400 })
    }
    content = sanitizeContent(content, 50000) // Max 50k chars

    // Validate status
    const validStatuses = ['draft', 'scheduled', 'published', 'failed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    await db.execute({
      sql: `INSERT INTO content_posts 
            (id, user_id, platform, content, media_urls, scheduled_at, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        postId,
        userId,
        platform,
        content,
        JSON.stringify(media_urls || []),
        scheduled_at || null,
        status,
        now,
        now
      ]
    })

    return NextResponse.json({ 
      success: true,
      postId,
      message: 'Post created successfully'
    })
  } catch (error: any) {
    console.error('Create post error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create post' 
    }, { status: 500 })
  }
}

/**
 * Get user's posts
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify auth from JWT
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId

    const postsResult = await db.execute({
      sql: 'SELECT * FROM content_posts WHERE user_id = ? ORDER BY created_at DESC',
      args: [userId]
    })

    // Get user info for lock checking
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId]
    })

    const userData = userResult.rows[0] as any
    const { isContentLocked } = await import('@/lib/contentLock')

    const posts = postsResult.rows.map((post: any) => {
      const isLocked = isContentLocked(post, userData)
      return {
        ...post,
        isLocked
      }
    })

    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error('Get posts error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get posts' 
    }, { status: 500 })
  }
}
