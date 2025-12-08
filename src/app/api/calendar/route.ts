import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * Content Calendar API
 * Get scheduled posts by date range, create/update scheduled posts
 */

/**
 * GET - Get calendar events (scheduled posts) for a date range
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') // YYYY-MM-DD
    const endDate = searchParams.get('endDate') // YYYY-MM-DD
    const platform = searchParams.get('platform')

    // Default to current month if no dates provided
    const now = new Date()
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const start = startDate || defaultStart.toISOString().split('T')[0]
    const end = endDate || defaultEnd.toISOString().split('T')[0]

    let sql = `
      SELECT 
        id,
        platform,
        content,
        media_urls,
        scheduled_at,
        published_at,
        status,
        engagement_metrics,
        created_at
      FROM content_posts
      WHERE user_id = ? 
        AND scheduled_at IS NOT NULL
        AND DATE(scheduled_at) >= ?
        AND DATE(scheduled_at) <= ?
    `
    const args: any[] = [user.userId, start, end]

    if (platform) {
      sql += ' AND platform = ?'
      args.push(platform)
    }

    sql += ' ORDER BY scheduled_at ASC'

    const result = await db.execute({ sql, args })

    // Format for calendar view
    const events = result.rows.map((post: any) => ({
      id: post.id,
      title: post.content?.substring(0, 50) || 'Untitled Post',
      platform: post.platform,
      content: post.content,
      mediaUrls: typeof post.media_urls === 'string' ? JSON.parse(post.media_urls || '[]') : post.media_urls,
      scheduledAt: post.scheduled_at,
      publishedAt: post.published_at,
      status: post.status,
      engagementMetrics: typeof post.engagement_metrics === 'string' ? JSON.parse(post.engagement_metrics || '{}') : post.engagement_metrics,
      date: post.scheduled_at ? new Date(post.scheduled_at).toISOString().split('T')[0] : null
    }))

    return NextResponse.json({
      success: true,
      events,
      dateRange: { start, end }
    })
  } catch (error: any) {
    console.error('Calendar GET error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get calendar events' 
    }, { status: 500 })
  }
}

/**
 * POST - Create or update a scheduled post
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      id, // If provided, update existing post
      platform, 
      content, 
      mediaUrls, 
      scheduledAt,
      status = 'scheduled'
    } = body

    if (!platform || !content || !scheduledAt) {
      return NextResponse.json({ 
        error: 'Platform, content, and scheduledAt are required' 
      }, { status: 400 })
    }

    if (id) {
      // Update existing post
      const result = await db.execute({
        sql: `
          UPDATE content_posts
          SET platform = ?,
              content = ?,
              media_urls = ?,
              scheduled_at = ?,
              status = ?,
              updated_at = NOW()
          WHERE id = ? AND user_id = ?
          RETURNING *
        `,
        args: [
          platform,
          content,
          JSON.stringify(mediaUrls || []),
          scheduledAt,
          status,
          id,
          user.userId
        ]
      })

      return NextResponse.json({
        success: true,
        event: result.rows[0]
      })
    } else {
      // Create new scheduled post
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const result = await db.execute({
        sql: `
          INSERT INTO content_posts 
          (id, user_id, platform, content, media_urls, scheduled_at, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          RETURNING *
        `,
        args: [
          postId,
          user.userId,
          platform,
          content,
          JSON.stringify(mediaUrls || []),
          scheduledAt,
          status
        ]
      })

      return NextResponse.json({
        success: true,
        event: result.rows[0]
      })
    }
  } catch (error: any) {
    console.error('Calendar POST error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to schedule post' 
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete a scheduled post
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'Post ID is required' 
      }, { status: 400 })
    }

    await db.execute({
      sql: 'DELETE FROM content_posts WHERE id = ? AND user_id = ?',
      args: [id, user.userId]
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error: any) {
    console.error('Calendar DELETE error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete post' 
    }, { status: 500 })
  }
}


