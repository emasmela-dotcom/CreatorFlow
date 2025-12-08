/**
 * Usage Tracking System
 * Tracks AI calls and storage usage per user
 */

import { db } from './db'
import { getPlanLimits, PlanType } from './planLimits'

/**
 * Initialize usage tracking tables
 */
export async function initUsageTrackingTables() {
  try {
    // Create AI call logs table
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS ai_call_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          bot_name VARCHAR(100) NOT NULL,
          endpoint VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
    })

    // Create index for faster queries
    await db.execute({
      sql: `
        CREATE INDEX IF NOT EXISTS idx_ai_call_logs_user_month 
        ON ai_call_logs(user_id, created_at)
      `
    })

    // Create user usage stats table (monthly aggregates)
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS user_usage_stats (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          month_year VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
          ai_calls_count INTEGER DEFAULT 0,
          storage_bytes BIGINT DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, month_year)
        )
      `
    })

    // Create index for faster queries
    await db.execute({
      sql: `
        CREATE INDEX IF NOT EXISTS idx_user_usage_stats_user_month 
        ON user_usage_stats(user_id, month_year)
      `
    })

    console.log('✅ Usage tracking tables initialized')
  } catch (error: any) {
    console.error('Error initializing usage tracking tables:', error)
    throw error
  }
}

/**
 * Log an AI bot call
 */
export async function logAICall(
  userId: string,
  botName: string,
  endpoint: string
): Promise<void> {
  try {
    // Log the call
    await db.execute({
      sql: `
        INSERT INTO ai_call_logs (user_id, bot_name, endpoint, created_at)
        VALUES (?, ?, ?, NOW())
      `,
      args: [userId, botName, endpoint]
    })

    // Update monthly stats
    const monthYear = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
    
    // Try to update existing record
    const updateResult = await db.execute({
      sql: `
        UPDATE user_usage_stats
        SET ai_calls_count = ai_calls_count + 1,
            updated_at = NOW()
        WHERE user_id = ? AND month_year = ?
      `,
      args: [userId, monthYear]
    })

    // If no rows updated, create new record
    if (updateResult.rowsAffected === 0) {
      try {
        await db.execute({
          sql: `
            INSERT INTO user_usage_stats (user_id, month_year, ai_calls_count, storage_bytes, created_at, updated_at)
            VALUES (?, ?, 1, 0, NOW(), NOW())
          `,
          args: [userId, monthYear]
        })
      } catch (error: any) {
        // If record exists (unique constraint), update it
        if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
          await db.execute({
            sql: `
              UPDATE user_usage_stats
              SET ai_calls_count = ai_calls_count + 1,
                  updated_at = NOW()
              WHERE user_id = ? AND month_year = ?
            `,
            args: [userId, monthYear]
          })
        } else {
          throw error
        }
      }
    }
  } catch (error: any) {
    console.error('Error logging AI call:', error)
    // Don't throw - tracking failure shouldn't break the app
  }
}

/**
 * Get current month's AI call count for a user
 */
export async function getCurrentMonthAICalls(userId: string): Promise<number> {
  try {
    const monthYear = new Date().toISOString().slice(0, 7)
    
    const result = await db.execute({
      sql: `
        SELECT ai_calls_count
        FROM user_usage_stats
        WHERE user_id = ? AND month_year = ?
      `,
      args: [userId, monthYear]
    })

    if (result.rows.length === 0) {
      return 0
    }

    return parseInt(result.rows[0]?.ai_calls_count || 0)
  } catch (error: any) {
    console.error('Error getting AI call count:', error)
    return 0
  }
}

/**
 * Get user's plan tier
 */
async function getUserPlanTier(userId: string): Promise<PlanType | null> {
  try {
    const result = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })

    if (result.rows.length === 0) {
      return null
    }

    return (result.rows[0] as any).subscription_tier as PlanType | null
  } catch (error: any) {
    console.error('Error getting user plan tier:', error)
    return null
  }
}

/**
 * Check if user can make an AI call (hasn't exceeded limit)
 */
export async function canMakeAICall(userId: string): Promise<{
  allowed: boolean
  current: number
  limit: number
  message?: string
}> {
  try {
    const planTier = await getUserPlanTier(userId)
    const limits = getPlanLimits(planTier)
    const current = await getCurrentMonthAICalls(userId)

    // -1 means unlimited
    if (limits.aiCallsPerMonth === -1) {
      return {
        allowed: true,
        current,
        limit: -1
      }
    }

    if (current >= limits.aiCallsPerMonth) {
      return {
        allowed: false,
        current,
        limit: limits.aiCallsPerMonth,
        message: `You've reached your AI call limit (${current}/${limits.aiCallsPerMonth}). Upgrade to continue.`
      }
    }

    return {
      allowed: true,
      current,
      limit: limits.aiCallsPerMonth
    }
  } catch (error: any) {
    console.error('Error checking AI call limit:', error)
    // On error, allow the call (fail open)
    return {
      allowed: true,
      current: 0,
      limit: -1
    }
  }
}

/**
 * Calculate storage used by a user (in bytes)
 */
export async function calculateStorageUsed(userId: string): Promise<number> {
  try {
    let totalBytes = 0

    // Calculate documents storage (rough estimate: 1 char = 1 byte)
    const documentsResult = await db.execute({
      sql: `
        SELECT COALESCE(SUM(LENGTH(content) + LENGTH(COALESCE(title, '')))), 0) as total_bytes
        FROM documents
        WHERE user_id = ?
      `,
      args: [userId]
    })
    totalBytes += parseInt(documentsResult.rows[0]?.total_bytes || 0)

    // Calculate templates storage
    const templatesResult = await db.execute({
      sql: `
        SELECT COALESCE(SUM(LENGTH(content) + LENGTH(COALESCE(name, '')))), 0) as total_bytes
        FROM content_templates
        WHERE user_id = ?
      `,
      args: [userId]
    })
    totalBytes += parseInt(templatesResult.rows[0]?.total_bytes || 0)

    // Calculate hashtag sets storage
    const hashtagsResult = await db.execute({
      sql: `
        SELECT COALESCE(SUM(LENGTH(hashtags) + LENGTH(COALESCE(name, '')))), 0) as total_bytes
        FROM hashtag_sets
        WHERE user_id = ?
      `,
      args: [userId]
    })
    totalBytes += parseInt(hashtagsResult.rows[0]?.total_bytes || 0)

    return totalBytes
  } catch (error: any) {
    console.error('Error calculating storage:', error)
    return 0
  }
}

/**
 * Update storage usage in stats table
 */
export async function updateStorageUsage(userId: string): Promise<void> {
  try {
    const storageBytes = await calculateStorageUsed(userId)
    const monthYear = new Date().toISOString().slice(0, 7)

    // Update or insert storage usage
    try {
      await db.execute({
        sql: `
          INSERT INTO user_usage_stats (user_id, month_year, ai_calls_count, storage_bytes, created_at, updated_at)
          VALUES (?, ?, 0, ?, NOW(), NOW())
        `,
        args: [userId, monthYear, storageBytes]
      })
    } catch (error: any) {
      // If record exists (unique constraint), update it
      if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
        await db.execute({
          sql: `
            UPDATE user_usage_stats
            SET storage_bytes = ?,
                updated_at = NOW()
            WHERE user_id = ? AND month_year = ?
          `,
          args: [storageBytes, userId, monthYear]
        })
      } else {
        throw error
      }
    }
  } catch (error: any) {
    console.error('Error updating storage usage:', error)
    // Don't throw - tracking failure shouldn't break the app
  }
}

/**
 * Get current storage usage (in MB)
 */
export async function getCurrentStorageMB(userId: string): Promise<number> {
  try {
    const bytes = await calculateStorageUsed(userId)
    return Math.round((bytes / (1024 * 1024)) * 100) / 100 // Round to 2 decimals
  } catch (error: any) {
    console.error('Error getting storage usage:', error)
    return 0
  }
}

/**
 * Check if user can use more storage
 */
export async function canUseStorage(
  userId: string,
  additionalBytes: number = 0
): Promise<{
  allowed: boolean
  currentMB: number
  limitMB: number
  message?: string
}> {
  try {
    const planTier = await getUserPlanTier(userId)
    const limits = getPlanLimits(planTier)
    const currentBytes = await calculateStorageUsed(userId)
    const newTotalBytes = currentBytes + additionalBytes
    const limitBytes = limits.storageMB === -1 ? -1 : limits.storageMB * 1024 * 1024

    // -1 means unlimited
    if (limitBytes === -1) {
      return {
        allowed: true,
        currentMB: Math.round((currentBytes / (1024 * 1024)) * 100) / 100,
        limitMB: -1
      }
    }

    if (newTotalBytes > limitBytes) {
      return {
        allowed: false,
        currentMB: Math.round((currentBytes / (1024 * 1024)) * 100) / 100,
        limitMB: limits.storageMB,
        message: `You've reached your storage limit (${Math.round((currentBytes / (1024 * 1024)) * 100) / 100}MB/${limits.storageMB}MB). Upgrade to continue.`
      }
    }

    return {
      allowed: true,
      currentMB: Math.round((currentBytes / (1024 * 1024)) * 100) / 100,
      limitMB: limits.storageMB
    }
  } catch (error: any) {
    console.error('Error checking storage limit:', error)
    // On error, allow the usage (fail open)
    return {
      allowed: true,
      currentMB: 0,
      limitMB: -1
    }
  }
}

/**
 * Get usage summary for a user
 */
export async function getUserUsageSummary(userId: string): Promise<{
  aiCalls: {
    current: number
    limit: number
    unlimited: boolean
  }
  storage: {
    currentMB: number
    limitMB: number
    unlimited: boolean
  }
}> {
  try {
    const planTier = await getUserPlanTier(userId)
    const limits = getPlanLimits(planTier)
    const aiCallsCurrent = await getCurrentMonthAICalls(userId)
    const storageMB = await getCurrentStorageMB(userId)

    return {
      aiCalls: {
        current: aiCallsCurrent,
        limit: limits.aiCallsPerMonth,
        unlimited: limits.aiCallsPerMonth === -1
      },
      storage: {
        currentMB: storageMB,
        limitMB: limits.storageMB,
        unlimited: limits.storageMB === -1
      }
    }
  } catch (error: any) {
    console.error('Error getting usage summary:', error)
    return {
      aiCalls: { current: 0, limit: 0, unlimited: false },
      storage: { currentMB: 0, limitMB: 0, unlimited: false }
    }
  }
}

