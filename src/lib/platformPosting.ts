/**
 * Platform Posting Service
 * Handles posting to social media platforms via their APIs
 */

import { db } from './db'

export interface PostData {
  content: string
  mediaUrls?: string[]
  scheduledAt?: string
  hashtags?: string[]
}

export interface PostResult {
  success: boolean
  postId?: string
  platformPostId?: string
  error?: string
  errorCode?: string
}

/**
 * Post to a platform (or schedule if scheduledAt is in future)
 */
export async function postToPlatform(
  userId: string,
  platform: string,
  postData: PostData
): Promise<PostResult> {
  try {
    // Get user's platform connection
    const connectionResult = await db.execute({
      sql: `
        SELECT * FROM platform_connections 
        WHERE user_id = ? AND platform = ? AND is_active = TRUE
      `,
      args: [userId, platform]
    })

    if (connectionResult.rows.length === 0) {
      return { 
        success: false, 
        error: 'Platform not connected. Please connect your account first.',
        errorCode: 'NOT_CONNECTED'
      }
    }

    const connection = connectionResult.rows[0] as any

    // Check if token is expired
    if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
      // Try to refresh token
      const refreshed = await refreshPlatformToken(userId, platform)
      if (!refreshed) {
        return {
          success: false,
          error: 'Platform connection expired. Please reconnect your account.',
          errorCode: 'TOKEN_EXPIRED'
        }
      }
    }

    // If scheduled for future, just save to database (scheduler will handle posting)
    if (postData.scheduledAt && new Date(postData.scheduledAt) > new Date()) {
      return {
        success: true,
        postId: 'scheduled', // Will be created by calendar API
        error: 'Post scheduled for future posting'
      }
    }

    // Post immediately based on platform
    switch (platform) {
      case 'instagram':
        return await postToInstagram(connection.access_token, connection.platform_user_id, postData)
      case 'twitter':
        return await postToTwitter(connection.access_token, postData)
      case 'linkedin':
        return await postToLinkedIn(connection.access_token, connection.platform_user_id, postData)
      case 'tiktok':
        return await postToTikTok(connection.access_token, postData)
      case 'youtube':
        return await postToYouTube(connection.access_token, postData)
      default:
        return {
          success: false,
          error: 'Platform not supported for direct posting',
          errorCode: 'UNSUPPORTED_PLATFORM'
        }
    }
  } catch (error: any) {
    console.error(`Post to ${platform} error:`, error)
    return {
      success: false,
      error: error.message || 'Failed to post to platform',
      errorCode: 'POSTING_ERROR'
    }
  }
}

/**
 * Refresh platform access token
 */
async function refreshPlatformToken(userId: string, platform: string): Promise<boolean> {
  try {
    const connectionResult = await db.execute({
      sql: 'SELECT refresh_token FROM platform_connections WHERE user_id = ? AND platform = ?',
      args: [userId, platform]
    })

    if (connectionResult.rows.length === 0 || !connectionResult.rows[0].refresh_token) {
      return false
    }

    // Platform-specific token refresh
    // This will be implemented when we add OAuth flows
    // For now, return false to indicate refresh needed
    return false
  } catch (error) {
    console.error('Token refresh error:', error)
    return false
  }
}

/**
 * Post to Instagram via Facebook Graph API
 */
async function postToInstagram(
  accessToken: string,
  instagramAccountId: string | null,
  postData: PostData
): Promise<PostResult> {
  try {
    // Instagram requires Business/Creator account and Facebook Page connection
    // This is a placeholder - actual implementation requires:
    // 1. Facebook Page ID
    // 2. Instagram Business Account ID
    // 3. Image upload to Facebook first
    
    if (!instagramAccountId) {
      return {
        success: false,
        error: 'Instagram account not properly connected. Please reconnect.',
        errorCode: 'INVALID_ACCOUNT'
      }
    }

    // For now, return success but note that actual API integration needs to be completed
    // TODO: Implement actual Instagram Graph API posting
    return {
      success: false,
      error: 'Instagram posting requires API setup. Please post manually for now.',
      errorCode: 'API_NOT_CONFIGURED'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to Instagram',
      errorCode: 'INSTAGRAM_ERROR'
    }
  }
}

/**
 * Post to Twitter/X via Twitter API v2
 */
async function postToTwitter(accessToken: string, postData: PostData): Promise<PostResult> {
  try {
    // Twitter API v2 posting
    // This is a placeholder - actual implementation requires:
    // 1. Twitter API v2 credentials
    // 2. Media upload endpoint if media included
    
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: postData.content.substring(0, 280) // Twitter character limit
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Failed to post to Twitter',
        errorCode: 'TWITTER_API_ERROR'
      }
    }

    const data = await response.json()
    return {
      success: true,
      platformPostId: data.data?.id,
      postId: data.data?.id
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to Twitter',
      errorCode: 'TWITTER_ERROR'
    }
  }
}

/**
 * Post to LinkedIn via LinkedIn API
 */
async function postToLinkedIn(
  accessToken: string,
  personUrn: string | null,
  postData: PostData
): Promise<PostResult> {
  try {
    // LinkedIn posting requires person URN
    if (!personUrn) {
      return {
        success: false,
        error: 'LinkedIn account not properly connected. Please reconnect.',
        errorCode: 'INVALID_ACCOUNT'
      }
    }

    // LinkedIn UGC Posts API
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: personUrn.startsWith('urn:li:person:') ? personUrn : `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postData.content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      return {
        success: false,
        error: error || 'Failed to post to LinkedIn',
        errorCode: 'LINKEDIN_API_ERROR'
      }
    }

    const data = await response.json()
    return {
      success: true,
      platformPostId: data.id,
      postId: data.id
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to LinkedIn',
      errorCode: 'LINKEDIN_ERROR'
    }
  }
}

/**
 * Post to TikTok
 */
async function postToTikTok(accessToken: string, postData: PostData): Promise<PostResult> {
  // TikTok API is very limited and may require partnership
  return {
    success: false,
    error: 'TikTok direct posting requires API partnership. Please post manually for now.',
    errorCode: 'TIKTOK_NOT_AVAILABLE'
  }
}

/**
 * Post to YouTube
 */
async function postToYouTube(accessToken: string, postData: PostData): Promise<PostResult> {
  // YouTube API is primarily for video uploads, not text posts
  return {
    success: false,
    error: 'YouTube posting requires video upload. Please use YouTube Studio for now.',
    errorCode: 'YOUTUBE_VIDEO_REQUIRED'
  }
}

/**
 * Check if user has platform connected
 */
export async function hasPlatformConnected(userId: string, platform: string): Promise<boolean> {
  try {
    const result = await db.execute({
      sql: `
        SELECT id FROM platform_connections 
        WHERE user_id = ? AND platform = ? AND is_active = TRUE
      `,
      args: [userId, platform]
    })
    return result.rows.length > 0
  } catch (error) {
    return false
  }
}

/**
 * Get user's connected platforms
 */
export async function getConnectedPlatforms(userId: string): Promise<string[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT platform FROM platform_connections 
        WHERE user_id = ? AND is_active = TRUE
      `,
      args: [userId]
    })
    return result.rows.map((row: any) => row.platform)
  } catch (error) {
    return []
  }
}

