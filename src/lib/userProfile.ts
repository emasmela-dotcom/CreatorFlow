/**
 * User Profile - Content Types
 * Manages user content types for tooltip display
 */

import { db } from './db'

export const CONTENT_TYPES = [
  'Fashion',
  'Tech',
  'Comedy',
  'Fitness',
  'Food',
  'Travel',
  'Lifestyle',
  'Education',
  'Gaming',
  'Beauty',
  'Business',
  'Music',
  'Art',
  'Photography',
  'DIY',
  'Parenting',
  'Finance',
  'Health',
  'Sports',
  'Entertainment'
] as const

export type ContentType = typeof CONTENT_TYPES[number]

/**
 * Get user's content types
 */
export async function getUserContentTypes(userId: string): Promise<ContentType[]> {
  try {
    const result = await db.execute({
      sql: 'SELECT content_types FROM users WHERE id = ?',
      args: [userId]
    })

    if (result.rows.length === 0) {
      return []
    }

    const contentTypes = (result.rows[0] as any).content_types
    if (!contentTypes) {
      return []
    }

    try {
      const parsed = typeof contentTypes === 'string' ? JSON.parse(contentTypes) : contentTypes
      return Array.isArray(parsed) ? parsed.filter((type: string) => CONTENT_TYPES.includes(type as ContentType)) : []
    } catch {
      return []
    }
  } catch (error: any) {
    console.error('Error getting user content types:', error)
    return []
  }
}

/**
 * Update user's content types
 */
export async function updateUserContentTypes(userId: string, contentTypes: ContentType[]): Promise<void> {
  try {
    // Validate content types (max 3)
    const validTypes = contentTypes
      .filter(type => CONTENT_TYPES.includes(type))
      .slice(0, 3) // Max 3 types

    await db.execute({
      sql: 'UPDATE users SET content_types = ?, updated_at = NOW() WHERE id = ?',
      args: [JSON.stringify(validTypes), userId]
    })
  } catch (error: any) {
    console.error('Error updating user content types:', error)
    throw error
  }
}

/**
 * Get user profile for tooltip
 */
export async function getUserProfileTooltip(userId: string): Promise<{
  userId: string
  email: string
  fullName?: string
  avatarUrl?: string
  contentTypes: ContentType[]
  subscriptionTier: string
}> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          id, email, full_name, avatar_url, content_types, subscription_tier
        FROM users
        WHERE id = ?
      `,
      args: [userId]
    })

    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    const user = result.rows[0] as any
    let contentTypes: ContentType[] = []
    
    try {
      const parsed = typeof user.content_types === 'string' 
        ? JSON.parse(user.content_types || '[]') 
        : user.content_types || []
      contentTypes = Array.isArray(parsed) 
        ? parsed.filter((type: string) => CONTENT_TYPES.includes(type as ContentType))
        : []
    } catch {
      contentTypes = []
    }

    return {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      contentTypes,
      subscriptionTier: user.subscription_tier || 'free'
    }
  } catch (error: any) {
    console.error('Error getting user profile tooltip:', error)
    throw error
  }
}
