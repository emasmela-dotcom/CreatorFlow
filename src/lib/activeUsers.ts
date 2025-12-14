/**
 * Who's On - Active Users Tracking
 * Tracks and displays currently active creators
 */

import { db } from './db'

/**
 * Update user's active status
 */
export async function updateUserActivity(userId: string): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO active_users (user_id, last_active_at, status, is_visible, updated_at)
        VALUES (?, NOW(), 'online', TRUE, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET
          last_active_at = NOW(),
          status = 'online',
          updated_at = NOW()
      `,
      args: [userId]
    })
  } catch (error) {
    console.error('Error updating user activity:', error)
  }
}

/**
 * Get active users (online in last 5 minutes)
 */
export async function getActiveUsers(limit: number = 50): Promise<any[]> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    const result = await db.execute({
      sql: `
        SELECT 
          au.user_id,
          au.last_active_at,
          au.status,
          u.email,
          u.full_name,
          u.avatar_url,
          u.subscription_tier,
          u.content_types
        FROM active_users au
        JOIN users u ON u.id = au.user_id
        WHERE au.is_visible = TRUE
          AND au.last_active_at >= ?
        ORDER BY au.last_active_at DESC
        LIMIT ?
      `,
      args: [fiveMinutesAgo, limit]
    })

    return result.rows.map((row: any) => {
      const contentTypes = row.content_types
        ? (typeof row.content_types === 'string' ? JSON.parse(row.content_types) : row.content_types)
        : []

      return {
        userId: row.user_id,
        email: row.email,
        fullName: row.full_name || row.email?.split('@')[0] || 'Creator',
        avatarUrl: row.avatar_url,
        lastActiveAt: row.last_active_at,
        status: row.status,
        subscriptionTier: row.subscription_tier,
        contentTypes: Array.isArray(contentTypes) ? contentTypes : []
      }
    })
  } catch (error: any) {
    console.error('Error getting active users:', error)
    return []
  }
}

/**
 * Set user visibility (opt-out)
 */
export async function setUserVisibility(userId: string, isVisible: boolean): Promise<void> {
  try {
    await db.execute({
      sql: `
        UPDATE active_users
        SET is_visible = ?, updated_at = NOW()
        WHERE user_id = ?
      `,
      args: [isVisible, userId]
    })
  } catch (error) {
    console.error('Error setting user visibility:', error)
  }
}

/**
 * Mark user as offline
 */
export async function markUserOffline(userId: string): Promise<void> {
  try {
    await db.execute({
      sql: `
        UPDATE active_users
        SET status = 'offline', updated_at = NOW()
        WHERE user_id = ?
      `,
      args: [userId]
    })
  } catch (error) {
    console.error('Error marking user offline:', error)
  }
}

