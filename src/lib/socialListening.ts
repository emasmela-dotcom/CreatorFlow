/**
 * Social Listening Service
 * Tracks mentions, hashtags, competitors, and sentiment
 */

import { db } from './db'

export interface Mention {
  id?: number
  userId: string
  platform: string
  mentionType: 'username' | 'hashtag' | 'keyword' | 'competitor'
  query: string // What we're tracking
  content: string
  authorName?: string
  authorHandle?: string
  postUrl?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  engagementCount?: number
  createdAt?: Date
}

export interface ListeningRule {
  id?: number
  userId: string
  name: string
  platform: string
  type: 'username' | 'hashtag' | 'keyword' | 'competitor'
  query: string
  isActive: boolean
  createdAt?: Date
}

/**
 * Add a listening rule (what to track)
 */
export async function addListeningRule(
  userId: string,
  rule: Omit<ListeningRule, 'id' | 'userId' | 'createdAt'>
): Promise<ListeningRule> {
  const result = await db.execute({
    sql: `
      INSERT INTO social_listening_rules 
      (user_id, name, platform, type, query, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      RETURNING *
    `,
    args: [userId, rule.name, rule.platform, rule.type, rule.query, rule.isActive]
  })

  return result.rows[0] as ListeningRule
}

/**
 * Get user's listening rules
 */
export async function getListeningRules(userId: string): Promise<ListeningRule[]> {
  const result = await db.execute({
    sql: `
      SELECT * FROM social_listening_rules 
      WHERE user_id = ? AND is_active = TRUE
      ORDER BY created_at DESC
    `,
    args: [userId]
  })

  return result.rows as ListeningRule[]
}

/**
 * Save a mention found by listening
 */
export async function saveMention(mention: Omit<Mention, 'id' | 'createdAt'>): Promise<Mention> {
  const result = await db.execute({
    sql: `
      INSERT INTO social_listening_mentions 
      (user_id, platform, mention_type, query, content, author_name, 
       author_handle, post_url, sentiment, engagement_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      RETURNING *
    `,
    args: [
      mention.userId,
      mention.platform,
      mention.mentionType,
      mention.query,
      mention.content,
      mention.authorName || null,
      mention.authorHandle || null,
      mention.postUrl || null,
      mention.sentiment || null,
      mention.engagementCount || 0
    ]
  })

  return result.rows[0] as Mention
}

/**
 * Get mentions for a user
 */
export async function getMentions(
  userId: string,
  filters?: {
    platform?: string
    mentionType?: string
    query?: string
    sentiment?: string
    limit?: number
  }
): Promise<Mention[]> {
  let sql = 'SELECT * FROM social_listening_mentions WHERE user_id = ?'
  const args: any[] = [userId]

  if (filters?.platform) {
    sql += ' AND platform = ?'
    args.push(filters.platform)
  }
  if (filters?.mentionType) {
    sql += ' AND mention_type = ?'
    args.push(filters.mentionType)
  }
  if (filters?.query) {
    sql += ' AND query = ?'
    args.push(filters.query)
  }
  if (filters?.sentiment) {
    sql += ' AND sentiment = ?'
    args.push(filters.sentiment)
  }

  sql += ' ORDER BY created_at DESC LIMIT ?'
  args.push(filters?.limit || 100)

  const result = await db.execute({ sql, args })
  return result.rows as Mention[]
}

/**
 * Analyze sentiment of text (simple implementation)
 */
export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const lowerText = text.toLowerCase()
  
  const positiveWords = ['love', 'great', 'amazing', 'awesome', 'best', 'excellent', 'fantastic', 'wonderful', 'perfect', 'good', 'happy', 'excited']
  const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'bad', 'disappointed', 'sad', 'angry', 'frustrated', 'horrible', 'disgusting']

  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

/**
 * Get listening statistics
 */
export async function getListeningStats(userId: string, days: number = 30): Promise<{
  totalMentions: number
  byPlatform: Record<string, number>
  bySentiment: Record<string, number>
  byType: Record<string, number>
  topQueries: Array<{ query: string; count: number }>
}> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const result = await db.execute({
    sql: `
      SELECT 
        COUNT(*) as total,
        platform,
        sentiment,
        mention_type,
        query
      FROM social_listening_mentions
      WHERE user_id = ? AND created_at >= ?
      GROUP BY platform, sentiment, mention_type, query
    `,
    args: [userId, since.toISOString()]
  })

  const stats = {
    totalMentions: 0,
    byPlatform: {} as Record<string, number>,
    bySentiment: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    topQueries: [] as Array<{ query: string; count: number }>
  }

  const queryCounts: Record<string, number> = {}

  for (const row of result.rows as any[]) {
    stats.totalMentions += parseInt(row.total || 0)
    
    if (row.platform) {
      stats.byPlatform[row.platform] = (stats.byPlatform[row.platform] || 0) + parseInt(row.total || 0)
    }
    
    if (row.sentiment) {
      stats.bySentiment[row.sentiment] = (stats.bySentiment[row.sentiment] || 0) + parseInt(row.total || 0)
    }
    
    if (row.mention_type) {
      stats.byType[row.mention_type] = (stats.byType[row.mention_type] || 0) + parseInt(row.total || 0)
    }
    
    if (row.query) {
      queryCounts[row.query] = (queryCounts[row.query] || 0) + parseInt(row.total || 0)
    }
  }

  stats.topQueries = Object.entries(queryCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return stats
}

