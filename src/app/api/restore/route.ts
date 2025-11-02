import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Restore user's project to original state from backup
 * Called when user chooses NOT to continue after trial
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

    // Check if user has been paying for 3+ months (content ownership protection)
    const userResult = await db.execute({
      sql: 'SELECT trial_end_at, subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]
    const trialEndAt = user.trial_end_at as string | null
    const subscriptionTier = user.subscription_tier as string | null

    // If user has an active subscription and trial ended, check if 3 months have passed
    if (trialEndAt && subscriptionTier) {
      const trialEndDate = new Date(trialEndAt)
      const now = new Date()
      
      // Calculate months since trial ended (when they started paying)
      const monthsDiff = (now.getTime() - trialEndDate.getTime()) / (1000 * 60 * 60 * 24 * 30) // Approximate months
      
      if (monthsDiff >= 3) {
        // User has been paying for 3+ months - content is permanently theirs
        return NextResponse.json({ 
          success: false,
          message: 'Content ownership protected',
          reason: 'Your content is permanently yours. You have been a paying customer for 3 or more months, so your content will not be restored even after cancellation.',
          monthsPaid: Math.floor(monthsDiff),
          policy: 'After 3 consecutive paid months, content ownership is permanent per CreatorFlow policy.'
        }, { status: 200 })
      }
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

    // Start restoration process
    try {
      // 1. Delete all current content_posts that were created after trial started
      // Keep only posts that existed before trial (in backup)
      const backupPostIds = backupData.content_posts.map((post: any) => post.id)
      
      if (backupPostIds.length > 0) {
        // Delete posts not in backup
        const placeholders = backupPostIds.map(() => '?').join(',')
        await db.execute({
          sql: `DELETE FROM content_posts 
                WHERE user_id = ? AND id NOT IN (${placeholders})`,
          args: [userId, ...backupPostIds]
        })

        // Restore original content_posts
        for (const post of backupData.content_posts) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO content_posts 
                  (id, user_id, platform, content, media_urls, scheduled_at, published_at, status, engagement_metrics, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            sql: `INSERT OR REPLACE INTO analytics 
                  (id, user_id, platform, metric_type, value, date, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

