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

    const refreshToken = String(connectionResult.rows[0].refresh_token)

    switch (platform) {
      case 'tiktok': {
        const clientKey = process.env.TIKTOK_CLIENT_KEY
        const clientSecret = process.env.TIKTOK_CLIENT_SECRET

        if (!clientKey || !clientSecret) {
          return false
        }

        const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          },
          body: new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        })

        const data = await response.json().catch(() => null)
        const refreshedAccessToken = data?.data?.access_token

        if (!response.ok || !refreshedAccessToken) {
          return false
        }

        const refreshedToken = data?.data?.refresh_token || refreshToken
        const expiresIn = Number(data?.data?.expires_in || 0)
        const expiresAt = expiresIn > 0
          ? new Date(Date.now() + expiresIn * 1000).toISOString()
          : null

        await db.execute({
          sql: `
            UPDATE platform_connections
            SET access_token = ?,
                refresh_token = ?,
                token_expires_at = ?,
                updated_at = NOW()
            WHERE user_id = ? AND platform = ?
          `,
          args: [refreshedAccessToken, refreshedToken, expiresAt, userId, platform]
        })

        return true
      }

      default:
        return false
    }
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
  try {
    // TikTok Content Posting API requires media URL input.
    if (!postData.mediaUrls || postData.mediaUrls.length === 0) {
      return {
        success: false,
        error: 'TikTok auto-publishing requires at least one media URL (video or image).',
        errorCode: 'TIKTOK_MEDIA_REQUIRED'
      }
    }

    const mediaUrl = postData.mediaUrls[0]
    const title = postData.content.substring(0, 2200)

    // Uses TikTok's direct post initialization endpoint.
    // This succeeds only if your TikTok app has approved Content Posting API access.
    const response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_info: {
          title,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: mediaUrl
        }
      })
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.error?.code ||
        'TikTok API rejected the publish request.'

      return {
        success: false,
        error: `${errorMessage} Ensure your TikTok app has Content Posting API approval and required scopes.`,
        errorCode: 'TIKTOK_API_ERROR'
      }
    }

    const publishId = data?.data?.publish_id || data?.data?.share_id || null

    if (!publishId) {
      return {
        success: false,
        error: 'TikTok publish request was accepted, but no publish id was returned.',
        errorCode: 'TIKTOK_INVALID_RESPONSE'
      }
    }

    return {
      success: true,
      platformPostId: publishId,
      postId: publishId
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to TikTok',
      errorCode: 'TIKTOK_ERROR'
    }
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

