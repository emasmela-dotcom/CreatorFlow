/**
 * Server-side helper to check content locks in API routes
 */

import { db } from './db'
import { isContentLocked } from './contentLock'
import type { User, ContentPost } from './db'

/**
 * Check if content is locked and throw error if it is
 * Use this in API routes to prevent editing locked content
 */
export async function enforceContentLock(
  contentId: string,
  userId: string
): Promise<void> {
  // Get user info
  const userResult = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [userId]
  })

  if (userResult.rows.length === 0) {
    throw new Error('User not found')
  }

  const user = userResult.rows[0] as any as User

  // Get content
  const contentResult = await db.execute({
    sql: 'SELECT * FROM content_posts WHERE id = ? AND user_id = ?',
    args: [contentId, userId]
  })

  if (contentResult.rows.length === 0) {
    throw new Error('Content not found')
  }

  const content = contentResult.rows[0] as any as ContentPost

  // Check if locked
  if (isContentLocked(content, user)) {
    throw new Error('This content is locked. Upgrade to a paid plan to edit or export trial content.')
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const userResult = await db.execute({
    sql: 'SELECT subscription_tier FROM users WHERE id = ?',
    args: [userId]
  })

  if (userResult.rows.length === 0) {
    return false
  }

  const user = userResult.rows[0] as any
  return !!user.subscription_tier
}
