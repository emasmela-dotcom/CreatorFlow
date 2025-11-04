import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Restore user's project to original state from backup (OPTIONAL - user-initiated only)
 * 
 * NEW POLICY: Content created during trial is kept but becomes read-only (locked) after cancel
 * This endpoint is now optional - users can manually restore if they want to revert to original state
 * When subscription is cancelled, trial content is automatically locked (no deletion)
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get userId from auth token first, then from body (for webhook calls)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    let userId: string | null = null

    if (token) {
      // User-initiated restore (with auth token)
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
        userId = decoded.userId
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
    } else {
      // Webhook-initiated restore (userId in body)
      // Parse body once
      const body = await request.json().catch(() => ({}))
      userId = body.userId || null
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verify user exists
    const userResult = await db.execute({
      sql: 'SELECT id FROM users WHERE id = ?',
      args: [userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find the active backup for this user
    const backupResult = await db.execute({
      sql: 'SELECT * FROM project_backups WHERE user_id = ? AND is_restored = 0 ORDER BY created_at DESC LIMIT 1',
      args: [userId]
    })

    if (backupResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'No backup found for this user. Cannot restore.' 
      }, { status: 404 })
    }

    const backup = backupResult.rows[0]
    const backupData = JSON.parse(backup.backup_data as string)

    // OPTIONAL RESTORE: User wants to revert to original state
    // This is completely optional - by default, trial content is kept but locked
    try {
      // 1. Delete all current content_posts that were created after trial started
      // Keep only posts that existed before trial (in backup)
      const backupPostIds = backupData.content_posts.map((post: any) => post.id)
      
      if (backupPostIds.length > 0) {
        // Delete posts not in backup (trial content will be deleted)
        const placeholders = backupPostIds.map(() => '?').join(',')
        await db.execute({
          sql: `DELETE FROM content_posts 
                WHERE user_id = ? AND id NOT IN (${placeholders})`,
          args: [userId, ...backupPostIds]
        })

        // Restore original content_posts
        for (const post of backupData.content_posts) {
          await db.execute({
            sql: `INSERT INTO content_posts 
                  (id, user_id, platform, content, media_urls, scheduled_at, published_at, status, engagement_metrics, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                  ON CONFLICT (id) DO UPDATE SET
                    platform = EXCLUDED.platform,
                    content = EXCLUDED.content,
                    media_urls = EXCLUDED.media_urls,
                    scheduled_at = EXCLUDED.scheduled_at,
                    published_at = EXCLUDED.published_at,
                    status = EXCLUDED.status,
                    engagement_metrics = EXCLUDED.engagement_metrics,
                    created_at = EXCLUDED.created_at,
                    updated_at = EXCLUDED.updated_at`,
            args: [
              post.id,
              post.user_id,
              post.platform,
              post.content,
              JSON.stringify(post.media_urls || []),
              post.scheduled_at,
              post.published_at,
              post.status,
              post.engagement_metrics ? JSON.stringify(post.engagement_metrics) : null,
              post.created_at,
              new Date().toISOString()
            ]
          })
        }
      } else {
        // If no posts in backup, delete all user's posts
        await db.execute({
          sql: 'DELETE FROM content_posts WHERE user_id = ?',
          args: [userId]
        })
      }

      // 2. Delete all analytics created after trial started
      const backupAnalyticsIds = backupData.analytics.map((analytics: any) => analytics.id)
      
      if (backupAnalyticsIds.length > 0) {
        // Delete analytics not in backup
        const placeholders = backupAnalyticsIds.map(() => '?').join(',')
        await db.execute({
          sql: `DELETE FROM analytics 
                WHERE user_id = ? AND id NOT IN (${placeholders})`,
          args: [userId, ...backupAnalyticsIds]
        })

        // Restore original analytics
        for (const analytics of backupData.analytics) {
          await db.execute({
            sql: `INSERT INTO analytics 
                  (id, user_id, platform, metric_type, value, date, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                  ON CONFLICT (id) DO UPDATE SET
                    platform = EXCLUDED.platform,
                    metric_type = EXCLUDED.metric_type,
                    value = EXCLUDED.value,
                    date = EXCLUDED.date,
                    created_at = EXCLUDED.created_at`,
            args: [
              analytics.id,
              analytics.user_id,
              analytics.platform,
              analytics.metric_type,
              analytics.value,
              analytics.date,
              analytics.created_at
            ]
          })
        }
      } else {
        // If no analytics in backup, delete all user's analytics
        await db.execute({
          sql: 'DELETE FROM analytics WHERE user_id = ?',
          args: [userId]
        })
      }

      // 3. Restore user settings to pre-trial state
      if (backupData.user_settings) {
        await db.execute({
          sql: `UPDATE users 
                SET subscription_tier = ?, updated_at = ?
                WHERE id = ?`,
          args: [
            backupData.user_settings.subscription_tier,
            new Date().toISOString(),
            userId
          ]
        })
      }

      // 4. Mark backup as restored
      await db.execute({
        sql: `UPDATE project_backups 
              SET is_restored = 1, restored_at = ?
              WHERE id = ?`,
        args: [new Date().toISOString(), backup.id as string]
      })

      return NextResponse.json({ 
        success: true,
        message: 'Project restored to original state successfully',
        restoredAt: new Date().toISOString(),
        restoredItems: {
          contentPosts: backupData.content_posts?.length || 0,
          analytics: backupData.analytics?.length || 0
        }
      })
    } catch (restoreError: any) {
      console.error('Restoration error:', restoreError)
      return NextResponse.json({ 
        error: `Restoration failed: ${restoreError.message}` 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Restore error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to restore project' 
    }, { status: 500 })
  }
}

