/**
 * Content Recycling System
 * Auto-identifies top-performing posts and suggests when to repost/update
 */

import { db } from './db'

export interface RecyclableContent {
  postId: string
  platform: string
  content: string
  originalEngagement: number
  originalPublishedAt: string
  suggestedRepostDate: string
  daysSinceOriginal: number
}

/**
 * Find top-performing posts that could be recycled
 */
export async function findRecyclableContent(
  userId: string,
  limit: number = 10
): Promise<RecyclableContent[]> {
  try {
    // Get top-performing posts from last 90 days
    const postsResult = await db.execute({
      sql: `
        SELECT 
          id,
          platform,
          content,
          engagement_metrics,
          published_at
        FROM content_posts
        WHERE user_id = ?
          AND status = 'published'
          AND published_at >= NOW() - INTERVAL '90 days'
          AND published_at <= NOW() - INTERVAL '7 days'
        ORDER BY published_at DESC
      `,
      args: [userId]
    })

    const posts = postsResult.rows as any[]
    const recyclable: RecyclableContent[] = []

    posts.forEach((post: any) => {
      const metrics = typeof post.engagement_metrics === 'string'
        ? JSON.parse(post.engagement_metrics || '{}')
        : post.engagement_metrics || {}

      const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)
      const reach = metrics.reach || metrics.impressions || 0
      
      // Only consider posts with good engagement
      if (engagement > 10 || reach > 100) {
        const publishedDate = new Date(post.published_at)
        const daysSince = Math.floor((Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // Suggest reposting after 30-60 days for top posts
        const suggestedRepostDate = new Date(publishedDate)
        suggestedRepostDate.setDate(suggestedRepostDate.getDate() + 45) // 45 days later

        recyclable.push({
          postId: post.id,
          platform: post.platform,
          content: post.content?.substring(0, 200) || '',
          originalEngagement: engagement,
          originalPublishedAt: post.published_at,
          suggestedRepostDate: suggestedRepostDate.toISOString().split('T')[0],
          daysSinceOriginal: daysSince
        })
      }
    })

    // Sort by engagement (highest first)
    recyclable.sort((a, b) => b.originalEngagement - a.originalEngagement)

    // Save to recycling queue (check if exists first to avoid duplicates)
    for (const item of recyclable.slice(0, limit)) {
      try {
        const existing = await db.execute({
          sql: `
            SELECT id FROM content_recycling_queue
            WHERE user_id = ? AND original_post_id = ?
          `,
          args: [userId, item.postId]
        })
        
        if (existing.rows.length === 0) {
          await db.execute({
            sql: `
              INSERT INTO content_recycling_queue (
                user_id, original_post_id, platform, original_engagement, suggested_repost_date
              ) VALUES (?, ?, ?, ?, ?)
            `,
            args: [
              userId,
              item.postId,
              item.platform,
              item.originalEngagement,
              item.suggestedRepostDate
            ]
          })
        }
      } catch (error) {
        // Ignore duplicates
      }
    }

    return recyclable.slice(0, limit)
  } catch (error: any) {
    console.error('Error finding recyclable content:', error)
    return []
  }
}

/**
 * Get recycling queue for user
 */
export async function getRecyclingQueue(userId: string): Promise<any[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          crq.*,
          cp.content as original_content
        FROM content_recycling_queue crq
        LEFT JOIN content_posts cp ON cp.id = crq.original_post_id
        WHERE crq.user_id = ?
          AND crq.recycling_status = 'pending'
        ORDER BY crq.suggested_repost_date ASC
      `,
      args: [userId]
    })

    return result.rows
  } catch (error: any) {
    console.error('Error getting recycling queue:', error)
    return []
  }
}

