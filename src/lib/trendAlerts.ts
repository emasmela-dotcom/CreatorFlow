/**
 * Real-Time Trend Alerts
 * Monitor and alert on relevant trends
 */

import { db } from './db'

export interface TrendSubscription {
  id?: number
  keywords: string[]
  platforms: string[]
  alertFrequency: 'realtime' | 'daily' | 'weekly'
  isActive: boolean
}

export interface TrendAlert {
  keyword: string
  platform: string
  trendData: {
    mentions: number
    growth: number
    topPosts: any[]
  }
  timestamp: string
}

/**
 * Subscribe to trend alerts
 */
export async function subscribeToTrends(
  userId: string,
  subscription: TrendSubscription
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO trend_subscriptions (
          user_id, keywords, platforms, alert_frequency, is_active
        ) VALUES (?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        userId,
        JSON.stringify(subscription.keywords),
        subscription.platforms.join(','),
        subscription.alertFrequency,
        subscription.isActive ?? true
      ]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error subscribing to trends:', error)
    throw error
  }
}

/**
 * Get user's trend subscriptions
 */
export async function getUserTrendSubscriptions(userId: string): Promise<TrendSubscription[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM trend_subscriptions
        WHERE user_id = ? AND is_active = TRUE
        ORDER BY created_at DESC
      `,
      args: [userId]
    })

    return result.rows.map((row: any) => ({
      id: row.id,
      keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : row.keywords,
      platforms: (row.platforms || '').split(',').filter((p: string) => p),
      alertFrequency: row.alert_frequency,
      isActive: row.is_active
    }))
  } catch (error: any) {
    console.error('Error getting trend subscriptions:', error)
    return []
  }
}

/**
 * Create trend alert (called by background job)
 */
export async function createTrendAlert(
  userId: string,
  subscriptionId: number,
  alert: TrendAlert
): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO trend_alerts (
          user_id, subscription_id, trend_keyword, platform, trend_data
        ) VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        userId,
        subscriptionId,
        alert.keyword,
        alert.platform,
        JSON.stringify(alert.trendData)
      ]
    })
  } catch (error: any) {
    console.error('Error creating trend alert:', error)
  }
}

/**
 * Get user's trend alerts
 */
export async function getUserTrendAlerts(
  userId: string,
  limit: number = 20
): Promise<any[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM trend_alerts
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `,
      args: [userId, limit]
    })

    return result.rows.map((row: any) => ({
      id: row.id,
      keyword: row.trend_keyword,
      platform: row.platform,
      trendData: typeof row.trend_data === 'string' ? JSON.parse(row.trend_data) : row.trend_data,
      alertSent: row.alert_sent,
      createdAt: row.created_at
    }))
  } catch (error: any) {
    console.error('Error getting trend alerts:', error)
    return []
  }
}

