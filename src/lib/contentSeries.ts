/**
 * Automated Content Series Generator
 * Create multi-part content series automatically
 */

import { db } from './db'

export interface ContentSeries {
  id?: number
  seriesName: string
  topic: string
  totalParts: number
  currentPart: number
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  scheduledStartDate?: string
}

export interface SeriesPost {
  id?: number
  seriesId: number
  postId?: string
  partNumber: number
  title: string
  content: string
  platform: string
  scheduledAt?: string
  publishedAt?: string
}

/**
 * Create content series
 */
export async function createContentSeries(
  userId: string,
  series: ContentSeries
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO content_series (
          user_id, series_name, topic, total_parts, current_part, status, scheduled_start_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        userId,
        series.seriesName,
        series.topic,
        series.totalParts,
        series.currentPart || 1,
        series.status || 'draft',
        series.scheduledStartDate || null
      ]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error creating content series:', error)
    throw error
  }
}

/**
 * Generate series posts (AI-powered)
 */
export async function generateSeriesPosts(
  seriesId: number,
  topic: string,
  totalParts: number
): Promise<SeriesPost[]> {
  // This would integrate with AI to generate series content
  // For now, return structure
  const posts: SeriesPost[] = []

  for (let i = 1; i <= totalParts; i++) {
    posts.push({
      seriesId,
      partNumber: i,
      title: `${topic} - Part ${i}`,
      content: `This is part ${i} of ${totalParts} in our series about ${topic}.`,
      platform: 'instagram',
      scheduledAt: undefined
    })
  }

  return posts
}

/**
 * Save series posts
 */
export async function saveSeriesPosts(posts: SeriesPost[]): Promise<void> {
  try {
    for (const post of posts) {
      await db.execute({
        sql: `
          INSERT INTO content_series_posts (
            series_id, part_number, title, content, platform, scheduled_at
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          post.seriesId,
          post.partNumber,
          post.title,
          post.content,
          post.platform,
          post.scheduledAt || null
        ]
      })
    }
  } catch (error: any) {
    console.error('Error saving series posts:', error)
    throw error
  }
}

/**
 * Get user's content series
 */
export async function getUserContentSeries(userId: string): Promise<ContentSeries[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM content_series
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
      args: [userId]
    })

    return result.rows.map((row: any) => ({
      id: row.id,
      seriesName: row.series_name,
      topic: row.topic,
      totalParts: row.total_parts,
      currentPart: row.current_part,
      status: row.status,
      scheduledStartDate: row.scheduled_start_date
    }))
  } catch (error: any) {
    console.error('Error getting content series:', error)
    return []
  }
}

