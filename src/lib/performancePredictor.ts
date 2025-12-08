/**
 * AI Content Performance Predictor
 * Predicts engagement, reach, and performance before posting
 */

import { db } from './db'

export interface PerformancePrediction {
  predictedEngagement: number
  predictedReach: number
  predictedLikes: number
  confidenceScore: number
  improvementSuggestions: string[]
}

/**
 * Predict content performance based on historical data
 */
export async function predictContentPerformance(
  userId: string,
  content: string,
  platform: string
): Promise<PerformancePrediction> {
  try {
    // Get user's historical post data
    const historicalPosts = await db.execute({
      sql: `
        SELECT 
          content,
          engagement_metrics,
          published_at
        FROM content_posts
        WHERE user_id = ? 
          AND platform = ?
          AND status = 'published'
          AND published_at >= NOW() - INTERVAL '90 days'
        ORDER BY published_at DESC
        LIMIT 50
      `,
      args: [userId, platform]
    })

    const posts = historicalPosts.rows as any[]

    if (posts.length === 0) {
      // No historical data - return baseline predictions
      return {
        predictedEngagement: 50,
        predictedReach: 200,
        predictedLikes: 40,
        confidenceScore: 30,
        improvementSuggestions: [
          'Add more engaging visuals',
          'Include a call-to-action',
          'Post during peak hours (9am-12pm or 5pm-8pm)'
        ]
      }
    }

    // Calculate average engagement metrics
    let totalEngagement = 0
    let totalReach = 0
    let totalLikes = 0
    let count = 0

    posts.forEach((post: any) => {
      const metrics = typeof post.engagement_metrics === 'string'
        ? JSON.parse(post.engagement_metrics || '{}')
        : post.engagement_metrics || {}

      const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)
      totalEngagement += engagement
      totalReach += metrics.reach || metrics.impressions || 0
      totalLikes += metrics.likes || 0
      count++
    })

    const avgEngagement = count > 0 ? Math.round(totalEngagement / count) : 50
    const avgReach = count > 0 ? Math.round(totalReach / count) : 200
    const avgLikes = count > 0 ? Math.round(totalLikes / count) : 40

    // Simple prediction algorithm (can be enhanced with ML)
    // Factors: content length, hashtags, historical average, time of day
    const contentLength = content.length
    const hashtagCount = (content.match(/#\w+/g) || []).length
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(content)
    const hasQuestion = content.includes('?')
    const hasCallToAction = /(click|link|follow|subscribe|check|visit|buy|shop)/i.test(content)

    // Calculate prediction multipliers
    let engagementMultiplier = 1.0
    let reachMultiplier = 1.0

    // Content length factor (optimal: 100-200 chars)
    if (contentLength >= 100 && contentLength <= 200) {
      engagementMultiplier *= 1.2
    } else if (contentLength < 50 || contentLength > 500) {
      engagementMultiplier *= 0.8
    }

    // Hashtag factor (optimal: 5-10 hashtags)
    if (hashtagCount >= 5 && hashtagCount <= 10) {
      engagementMultiplier *= 1.15
    } else if (hashtagCount === 0 || hashtagCount > 20) {
      engagementMultiplier *= 0.9
    }

    // Engagement elements
    if (hasEmoji) engagementMultiplier *= 1.1
    if (hasQuestion) engagementMultiplier *= 1.15
    if (hasCallToAction) engagementMultiplier *= 1.2

    // Calculate predictions
    const predictedEngagement = Math.round(avgEngagement * engagementMultiplier)
    const predictedReach = Math.round(avgReach * reachMultiplier)
    const predictedLikes = Math.round(avgLikes * engagementMultiplier * 0.8) // Likes are ~80% of engagement

    // Confidence score based on data quality
    const confidenceScore = Math.min(95, 30 + (count * 1.5))

    // Generate improvement suggestions
    const suggestions: string[] = []
    if (hashtagCount < 5) {
      suggestions.push(`Add ${5 - hashtagCount} more relevant hashtags`)
    }
    if (hashtagCount > 15) {
      suggestions.push('Reduce hashtags to 5-10 for better engagement')
    }
    if (!hasEmoji) {
      suggestions.push('Add emojis to increase engagement')
    }
    if (!hasQuestion) {
      suggestions.push('Add a question to encourage comments')
    }
    if (!hasCallToAction) {
      suggestions.push('Include a clear call-to-action')
    }
    if (contentLength < 100) {
      suggestions.push('Expand content to 100-200 characters for better reach')
    }
    if (contentLength > 400) {
      suggestions.push('Consider shortening content for better engagement')
    }
    if (suggestions.length === 0) {
      suggestions.push('Content looks great! Consider posting during peak hours')
    }

    return {
      predictedEngagement,
      predictedReach,
      predictedLikes,
      confidenceScore: Math.round(confidenceScore),
      improvementSuggestions: suggestions
    }
  } catch (error: any) {
    console.error('Error predicting performance:', error)
    // Return safe defaults on error
    return {
      predictedEngagement: 50,
      predictedReach: 200,
      predictedLikes: 40,
      confidenceScore: 30,
      improvementSuggestions: ['Unable to generate predictions. Check your historical data.']
    }
  }
}

/**
 * Save prediction to database
 */
export async function savePrediction(
  userId: string,
  postId: string | null,
  content: string,
  platform: string,
  prediction: PerformancePrediction
): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO content_performance_predictions (
          user_id, post_id, content, platform,
          predicted_engagement, predicted_reach, predicted_likes,
          confidence_score, improvement_suggestions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        userId,
        postId,
        content,
        platform,
        prediction.predictedEngagement,
        prediction.predictedReach,
        prediction.predictedLikes,
        prediction.confidenceScore,
        JSON.stringify(prediction.improvementSuggestions)
      ]
    })
  } catch (error) {
    console.error('Error saving prediction:', error)
    // Don't throw - prediction saving is optional
  }
}

