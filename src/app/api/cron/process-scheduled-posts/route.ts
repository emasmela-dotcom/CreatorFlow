import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { postToPlatform } from '@/lib/platformPosting'

export const dynamic = 'force-dynamic'

/**
 * Cron job to process scheduled posts
 * Should be called every minute via Vercel Cron or external scheduler
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is called by cron (add secret check in production)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)

    // Get posts scheduled for now (within last minute)
    const scheduledPosts = await db.execute({
      sql: `
        SELECT * FROM content_posts 
        WHERE status = 'scheduled' 
          AND scheduled_at <= ?
          AND scheduled_at >= ?
        ORDER BY scheduled_at ASC
        LIMIT 50
      `,
      args: [now.toISOString(), oneMinuteAgo.toISOString()]
    })

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const post of scheduledPosts.rows as any[]) {
      try {
        results.processed++

        const postResult = await postToPlatform(
          post.user_id,
          post.platform,
          {
            content: post.content,
            mediaUrls: typeof post.media_urls === 'string' 
              ? JSON.parse(post.media_urls || '[]') 
              : post.media_urls || [],
            scheduledAt: post.scheduled_at
          }
        )

        if (postResult.success) {
          // Update post status to published
          await db.execute({
            sql: `
              UPDATE content_posts 
              SET status = 'published', 
                  published_at = NOW(),
                  platform_post_id = ?,
                  updated_at = NOW()
              WHERE id = ?
            `,
            args: [postResult.platformPostId || null, post.id]
          })
          results.succeeded++
        } else {
          // Mark as failed
          await db.execute({
            sql: `
              UPDATE content_posts 
              SET status = 'failed',
                  updated_at = NOW()
              WHERE id = ?
            `,
            args: [post.id]
          })
          results.failed++
          results.errors.push(`${post.platform}: ${postResult.error}`)
        }
      } catch (error: any) {
        console.error(`Failed to process post ${post.id}:`, error)
        results.failed++
        results.errors.push(`Post ${post.id}: ${error.message}`)
        
        // Mark as failed
        await db.execute({
          sql: `
            UPDATE content_posts 
            SET status = 'failed',
                updated_at = NOW()
            WHERE id = ?
          `,
          args: [post.id]
        })
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString()
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to process scheduled posts'
    }, { status: 500 })
  }
}

