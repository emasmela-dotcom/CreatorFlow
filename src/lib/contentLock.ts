/**
 * Content Lock Utilities
 * 
 * Implements Option 1: "Keep but Restrict" policy
 * - Content created during trial stays with the user
 * - After cancel, content becomes read-only (locked)
 * - User must upgrade to edit/export locked content
 */

import { User, ContentPost } from './db'

/**
 * Check if content is locked (read-only)
 * Content is locked if:
 * 1. User has no active subscription (subscription_tier is null)
 * 2. Content was created during a trial period (between trial_started_at and trial_end_at)
 */
export function isContentLocked(
  content: ContentPost,
  user: User
): boolean {
  // If user has active subscription, content is never locked
  if (user.subscription_tier) {
    return false
  }

  // If no trial period exists, content is not locked
  if (!user.trial_started_at || !user.trial_end_at) {
    return false
  }

  // Check if content was created during trial period
  const contentCreatedAt = new Date(content.created_at)
  const trialStart = new Date(user.trial_started_at)
  const trialEnd = new Date(user.trial_end_at)

  // Content created during trial is locked if user has no subscription
  const wasCreatedDuringTrial = 
    contentCreatedAt >= trialStart && contentCreatedAt <= trialEnd

  return wasCreatedDuringTrial
}

/**
 * Check if user can edit content
 */
export function canEditContent(
  content: ContentPost,
  user: User
): boolean {
  return !isContentLocked(content, user)
}

/**
 * Check if user can export content
 */
export function canExportContent(
  content: ContentPost,
  user: User
): boolean {
  return !isContentLocked(content, user)
}

/**
 * Get lock reason message
 */
export function getLockMessage(content: ContentPost, user: User): string | null {
  if (!isContentLocked(content, user)) {
    return null
  }

  return 'This content was created during your trial. Upgrade to a paid plan to edit or export it.'
}
