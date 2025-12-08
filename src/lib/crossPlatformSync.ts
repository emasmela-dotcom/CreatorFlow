/**
 * Cross-Platform Content Sync
 * Post once, automatically adapts to all platforms
 */

import { db } from './db'
import { postToPlatform, PostData } from './platformPosting'

export interface SyncGroup {
  id?: number
  masterPostId: string
  platforms: string[]
  status: 'pending' | 'syncing' | 'completed' | 'failed'
}

/**
 * Create sync group for cross-platform posting
 */
export async function createSyncGroup(
  userId: string,
  masterPostId: string,
  platforms: string[]
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO content_sync_groups (
          user_id, master_post_id, platforms, sync_status
        ) VALUES (?, ?, ?, 'pending')
        RETURNING id
      `,
      args: [userId, masterPostId, platforms.join(',')]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error creating sync group:', error)
    throw error
  }
}

/**
 * Sync content to all platforms in group
 */
export async function syncToPlatforms(
  userId: string,
  syncGroupId: number,
  content: string,
  mediaUrls: string[] = []
): Promise<{
  success: boolean
  results: Record<string, { success: boolean; postId?: string; error?: string }>
}> {
  try {
    // Get sync group
    const groupResult = await db.execute({
      sql: 'SELECT * FROM content_sync_groups WHERE id = ?',
      args: [syncGroupId]
    })

    if (groupResult.rows.length === 0) {
      throw new Error('Sync group not found')
    }

    const group = groupResult.rows[0] as any
    const platforms = (group.platforms || '').split(',').filter((p: string) => p.trim())

    // Update status to syncing
    await db.execute({
      sql: 'UPDATE content_sync_groups SET sync_status = ? WHERE id = ?',
      args: ['syncing', syncGroupId]
    })

    const results: Record<string, { success: boolean; postId?: string; error?: string }> = {}

    // Adapt and post to each platform
    for (const platform of platforms) {
      try {
        const adaptedContent = adaptContentForPlatform(content, platform)
        
        const postData: PostData = {
          content: adaptedContent,
          mediaUrls,
          scheduledAt: undefined
        }
        const postResult = await postToPlatform(userId, platform, postData)

        results[platform] = {
          success: postResult.success,
          postId: postResult.platformPostId || undefined,
          error: postResult.error || undefined
        }
      } catch (error: any) {
        results[platform] = {
          success: false,
          error: error.message || 'Failed to sync'
        }
      }
    }

    // Update status
    const allSuccess = Object.values(results).every(r => r.success)
    await db.execute({
      sql: 'UPDATE content_sync_groups SET sync_status = ?, synced_at = NOW() WHERE id = ?',
      args: [allSuccess ? 'completed' : 'failed', syncGroupId]
    })

    return {
      success: allSuccess,
      results
    }
  } catch (error: any) {
    console.error('Error syncing to platforms:', error)
    await db.execute({
      sql: 'UPDATE content_sync_groups SET sync_status = ? WHERE id = ?',
      args: ['failed', syncGroupId]
    })
    throw error
  }
}

/**
 * Adapt content for specific platform
 */
function adaptContentForPlatform(content: string, platform: string): string {
  let adapted = content

  // Platform-specific adaptations
  switch (platform) {
    case 'twitter':
      // Twitter: 280 char limit, use @ mentions
      if (adapted.length > 280) {
        adapted = adapted.substring(0, 277) + '...'
      }
      break

    case 'instagram':
      // Instagram: Add line breaks for readability
      adapted = adapted.replace(/\. /g, '.\n\n')
      break

    case 'linkedin':
      // LinkedIn: More professional, add hashtags if missing
      if (!adapted.includes('#')) {
        adapted += '\n\n#ContentCreator #SocialMedia'
      }
      break

    case 'tiktok':
      // TikTok: Shorter, more engaging
      if (adapted.length > 150) {
        adapted = adapted.substring(0, 147) + '...'
      }
      break

    case 'youtube':
      // YouTube: Can be longer, add call-to-action
      if (!adapted.toLowerCase().includes('subscribe') && !adapted.toLowerCase().includes('like')) {
        adapted += '\n\nLike and subscribe for more!'
      }
      break
  }

  return adapted
}

