import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { enforceContentLock, hasActiveSubscription } from '@/lib/contentLockCheck'
import { verifyAuth, isValidEmail, sanitizeContent } from '@/lib/auth'
import { postToPlatform } from '@/lib/platformPosting'

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

    // Check user's subscription tier
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier, trial_end_at FROM users WHERE id = ?',
      args: [userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userResult.rows[0] as any
    const subscriptionTier = userData.subscription_tier

    // FREE PLAN RESTRICTION: Free plan users cannot create posts
    // Free plan is for learning tools only, not for posting
    if (subscriptionTier === 'free') {
      return NextResponse.json({ 
        error: 'Post creation is not available on the free plan. The free plan is designed for learning and exploring CreatorFlow tools. Upgrade to a paid plan to create and publish posts.',
        upgradeRequired: true,
        plan: 'free'
      }, { status: 403 })
    }

    // Check if user has active subscription (for paid plans)
    const hasSubscription = await hasActiveSubscription(userId)
    if (!hasSubscription) {
      // Check if user is in trial period
      const trialEnd = userData.trial_end_at ? new Date(userData.trial_end_at) : null
      const now = new Date()

      if (!trialEnd || now > trialEnd) {
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

    // If status is 'published' and not scheduled, try to post directly
    let platformPostId: string | null = null
    let postingError: string | null = null

    if (status === 'published' && (!scheduled_at || new Date(scheduled_at) <= new Date())) {
      try {
        const postResult = await postToPlatform(userId, platform, {
          content,
          mediaUrls: media_urls || [],
          scheduledAt: scheduled_at
        })

        if (postResult.success) {
          platformPostId = postResult.platformPostId || null
          status = 'published'
        } else {
          // If posting fails, save as draft and return error
          status = 'draft'
          postingError = postResult.error || 'Failed to post to platform'
        }
      } catch (error: any) {
        // If posting fails, save as draft
        status = 'draft'
        postingError = error.message || 'Failed to post to platform'
      }
    }

    await db.execute({
      sql: `INSERT INTO content_posts 
            (id, user_id, platform, content, media_urls, scheduled_at, status, platform_post_id, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        postId,
        userId,
        platform,
        content,
        JSON.stringify(media_urls || []),
        scheduled_at || null,
        status,
        platformPostId,
        status === 'published' ? now : null,
        now,
        now
      ]
    })

    if (postingError) {
      return NextResponse.json({ 
        success: false,
        postId,
        error: postingError,
        message: 'Post saved as draft. Please connect your platform account or post manually.',
        savedAsDraft: true
      }, { status: 200 })
    }

    return NextResponse.json({ 
      success: true,
      postId,
      platformPostId,
      status,
      message: status === 'published' 
        ? 'Post published successfully!' 
        : status === 'scheduled'
        ? 'Post scheduled successfully!'
        : 'Post saved successfully'
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
