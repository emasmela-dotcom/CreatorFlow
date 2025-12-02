import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Engagement Inbox Tool
 * Manage comments, messages, mentions, and replies
 */

/**
 * POST - Add engagement item or update status
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, id, status, platform, post_id, type, author_name, 
            author_handle, content, engagement_metrics } = body

    if (action === 'add') {
      // Add new engagement item
      if (!platform || !type || !content) {
        return NextResponse.json({ 
          error: 'Platform, type, and content are required' 
        }, { status: 400 })
      }

      const result = await db.execute({
        sql: `
          INSERT INTO engagement_inbox 
          (user_id, platform, post_id, type, author_name, author_handle, 
           content, status, engagement_metrics, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'unread', ?, NOW(), NOW())
          RETURNING *
        `,
        args: [user.userId, platform, post_id || null, type, 
               author_name || null, author_handle || null, content,
               engagement_metrics ? JSON.stringify(engagement_metrics) : null]
      })

      return NextResponse.json({
        success: true,
        engagement: result.rows[0]
      })
    } else if (action === 'update') {
      // Update engagement status
      if (!id || !status) {
        return NextResponse.json({ 
          error: 'ID and status are required' 
        }, { status: 400 })
      }

      const result = await db.execute({
        sql: `
          UPDATE engagement_inbox 
          SET status = ?, updated_at = NOW()
          WHERE id = ? AND user_id = ?
          RETURNING *
        `,
        args: [status, id, user.userId]
      })

      return NextResponse.json({
        success: true,
        engagement: result.rows[0]
      })
    } else {
      return NextResponse.json({ 
        error: 'Invalid action. Use "add" or "update"' 
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Engagement Inbox error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process engagement' 
    }, { status: 500 })
  }
}

/**
 * GET - Get engagement items (filtered by status, platform, type)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let sql = 'SELECT * FROM engagement_inbox WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (status) {
      sql += ' AND status = ?'
      args.push(status)
    }
    if (platform) {
      sql += ' AND platform = ?'
      args.push(platform)
    }
    if (type) {
      sql += ' AND type = ?'
      args.push(type)
    }

    sql += ' ORDER BY created_at DESC LIMIT ?'
    args.push(limit)

    const result = await db.execute({ sql, args })

    // Get unread count
    const unreadResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM engagement_inbox 
            WHERE user_id = ? AND status = 'unread'`,
      args: [user.userId]
    })
    const unreadCount = (unreadResult.rows[0] as any)?.count || 0

    return NextResponse.json({
      success: true,
      engagements: result.rows,
      unreadCount: parseInt(unreadCount)
    })
  } catch (error: any) {
    console.error('Engagement Inbox GET error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get engagements' 
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete an engagement item
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
        error: 'Engagement ID is required' 
      }, { status: 400 })
    }

    await db.execute({
      sql: `DELETE FROM engagement_inbox 
            WHERE id = ? AND user_id = ?`,
      args: [id, user.userId]
    })

    return NextResponse.json({
      success: true,
      message: 'Engagement deleted'
    })
  } catch (error: any) {
    console.error('Engagement Inbox DELETE error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete engagement' 
    }, { status: 500 })
  }
}

