import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'

/**
 * Create a backup/save point of user's project BEFORE any CreatorFlow changes
 * This is called when user starts their trial
 */
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify token and get user ID
    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decoded.userId

    // Fetch all current user data to create backup
    const contentPostsResult = await db.execute({
      sql: 'SELECT * FROM content_posts WHERE user_id = ?',
      args: [userId]
    })

    const analyticsResult = await db.execute({
      sql: 'SELECT * FROM analytics WHERE user_id = ?',
      args: [userId]
    })

    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId]
    })

    const user = userResult.rows.length > 0 ? userResult.rows[0] : null

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse JSON fields and prepare backup data
    const contentPosts = contentPostsResult.rows.map((row: any) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      platform: row.platform as string,
      content: row.content as string,
      media_urls: JSON.parse(row.media_urls as string || '[]'),
      scheduled_at: row.scheduled_at as string | null,
      published_at: row.published_at as string | null,
      status: row.status as string,
      engagement_metrics: row.engagement_metrics ? JSON.parse(row.engagement_metrics as string) : null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string
    }))

    const analytics = analyticsResult.rows.map((row: any) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      platform: row.platform as string,
      metric_type: row.metric_type as string,
      value: row.value as number,
      date: row.date as string,
      created_at: row.created_at as string
    }))

    // Create backup data snapshot
    const backupData = {
      content_posts: contentPosts,
      analytics: analytics,
      user_settings: {
        subscription_tier: user.subscription_tier as string | null,
        full_name: user.full_name as string | null,
        avatar_url: user.avatar_url as string | null,
      }
    }

    // Check if backup already exists for this user (should only have one active backup)
    const existingBackupResult = await db.execute({
      sql: 'SELECT * FROM project_backups WHERE user_id = ? AND is_restored = 0 ORDER BY created_at DESC LIMIT 1',
      args: [userId]
    })

    let backupId: string
    const now = new Date().toISOString()

    if (existingBackupResult.rows.length > 0) {
      // Update existing backup
      backupId = existingBackupResult.rows[0].id as string
      await db.execute({
        sql: `UPDATE project_backups 
              SET backup_data = ?, trial_started_at = ? 
              WHERE id = ?`,
        args: [JSON.stringify(backupData), now, backupId]
      })
    } else {
      // Create new backup
      backupId = randomUUID()
      await db.execute({
        sql: `INSERT INTO project_backups (id, user_id, trial_started_at, backup_data, is_restored, created_at)
              VALUES (?, ?, ?, ?, 0, ?)`,
        args: [backupId, userId, now, JSON.stringify(backupData), now]
      })
    }

    return NextResponse.json({ 
      success: true,
      backupId: backupId,
      message: 'Project backup created successfully',
      backupCreatedAt: now
    })
  } catch (error: any) {
    console.error('Backup creation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create project backup' 
    }, { status: 500 })
  }
}

/**
 * Get backup information for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const result = await db.execute({
      sql: 'SELECT * FROM project_backups WHERE user_id = ? AND is_restored = 0 ORDER BY created_at DESC LIMIT 1',
      args: [userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        message: 'No backup found for this user',
        hasBackup: false
      })
    }

    const backup = result.rows[0]
    const backupData = JSON.parse(backup.backup_data as string)

    return NextResponse.json({ 
      hasBackup: true,
      backup: {
        id: backup.id as string,
        trialStartedAt: backup.trial_started_at as string,
        createdAt: backup.created_at as string,
        // Don't send full backup_data for security, just metadata
        dataSize: {
          contentPosts: backupData.content_posts?.length || 0,
          analytics: backupData.analytics?.length || 0
        }
      }
    })
  } catch (error: any) {
    console.error('Backup fetch error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch backup' 
    }, { status: 500 })
  }
}

