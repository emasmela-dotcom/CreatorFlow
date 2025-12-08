/**
 * Automated Hashtag Optimization
 * AI suggests best hashtags based on performance data
 */

import { db } from './db'

export interface HashtagPerformance {
  hashtag: string
  platform: string
  usageCount: number
  avgEngagement: number
  bestEngagement: number
  performanceScore: number
}

/**
 * Track hashtag performance from posts
 */
export async function trackHashtagPerformance(
  userId: string,
  postId: string
): Promise<void> {
  try {
    // Get post with engagement metrics
    const postResult = await db.execute({
      sql: `
        SELECT content, platform, engagement_metrics
        FROM content_posts
        WHERE id = ? AND user_id = ?
      `,
      args: [postId, userId]
    })

    if (postResult.rows.length === 0) return

    const post = postResult.rows[0] as any
    const metrics = typeof post.engagement_metrics === 'string'
      ? JSON.parse(post.engagement_metrics || '{}')
      : post.engagement_metrics || {}

    const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)

    // Extract hashtags from content
    const hashtagRegex = /#(\w+)/g
    const hashtags = (post.content || '').match(hashtagRegex) || []
    const hashtagNames = hashtags.map((h: string) => h.substring(1).toLowerCase())

    // Update performance data for each hashtag
    for (const hashtag of hashtagNames) {
      try {
        // Check if exists
        const existing = await db.execute({
          sql: `
            SELECT * FROM hashtag_performance_data
            WHERE user_id = ? AND hashtag = ? AND platform = ?
          `,
          args: [userId, hashtag, post.platform]
        })

        if (existing.rows.length > 0) {
          // Update existing
          const existingData = existing.rows[0] as any
          const newUsageCount = existingData.usage_count + 1
          const newAvgEngagement = Math.round(
            ((existingData.avg_engagement * existingData.usage_count) + engagement) / newUsageCount
          )
          const newBestEngagement = Math.max(existingData.best_engagement || 0, engagement)
          const newPerformanceScore = calculatePerformanceScore(newAvgEngagement, newBestEngagement, newUsageCount)

          await db.execute({
            sql: `
              UPDATE hashtag_performance_data
              SET 
                usage_count = ?,
                avg_engagement = ?,
                best_engagement = ?,
                performance_score = ?,
                last_used_at = NOW(),
                updated_at = NOW()
              WHERE user_id = ? AND hashtag = ? AND platform = ?
            `,
            args: [
              newUsageCount,
              newAvgEngagement,
              newBestEngagement,
              newPerformanceScore,
              userId,
              hashtag,
              post.platform
            ]
          })
        } else {
          // Insert new
          const performanceScore = calculatePerformanceScore(engagement, engagement, 1)
          await db.execute({
            sql: `
              INSERT INTO hashtag_performance_data (
                user_id, hashtag, platform, usage_count, avg_engagement,
                best_engagement, performance_score, last_used_at
              ) VALUES (?, ?, ?, 1, ?, ?, ?, NOW())
            `,
            args: [
              userId,
              hashtag,
              post.platform,
              engagement,
              engagement,
              performanceScore
            ]
          })
        }
      } catch (error) {
        console.error(`Error tracking hashtag ${hashtag}:`, error)
      }
    }
  } catch (error: any) {
    console.error('Error tracking hashtag performance:', error)
  }
}

/**
 * Get optimized hashtags for content
 */
export async function getOptimizedHashtags(
  userId: string,
  platform: string,
  content: string,
  count: number = 10
): Promise<string[]> {
  try {
    // Get top-performing hashtags for platform
    const result = await db.execute({
      sql: `
        SELECT hashtag, performance_score
        FROM hashtag_performance_data
        WHERE user_id = ? AND platform = ?
          AND usage_count >= 2
        ORDER BY performance_score DESC
        LIMIT ?
      `,
      args: [userId, platform, count * 2] // Get more to filter
    })

    const hashtags = result.rows.map((r: any) => r.hashtag)

    // Filter out hashtags already in content
    const contentHashtags = (content.match(/#\w+/g) || []).map((h: string) => h.substring(1).toLowerCase())
    const suggested = hashtags
      .filter(h => !contentHashtags.includes(h.toLowerCase()))
      .slice(0, count)

    return suggested.map(h => `#${h}`)
  } catch (error: any) {
    console.error('Error getting optimized hashtags:', error)
    return []
  }
}

/**
 * Calculate performance score
 */
function calculatePerformanceScore(
  avgEngagement: number,
  bestEngagement: number,
  usageCount: number
): number {
  // Score based on average engagement (70%), best engagement (20%), usage count (10%)
  const avgScore = Math.min(70, (avgEngagement / 1000) * 70)
  const bestScore = Math.min(20, (bestEngagement / 5000) * 20)
  const usageScore = Math.min(10, (usageCount / 10) * 10)

  return Math.round(avgScore + bestScore + usageScore)
}

