/**
 * Platform Posting Service
 * Handles posting to social media platforms via their APIs
 */

import { db } from './db'
import { google } from 'googleapis'
import { Readable } from 'stream'

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
      case 'facebook':
        return await postToFacebook(connection.access_token, connection.platform_user_id, postData)
      case 'threads':
        return await postToThreads(connection.access_token, connection.platform_user_id, postData)
      case 'twitter':
        return await postToTwitter(connection.access_token, postData)
      case 'linkedin':
        return await postToLinkedIn(connection.access_token, connection.platform_user_id, postData)
      case 'tiktok':
        return await postToTikTok(connection.access_token, postData)
      case 'youtube':
        return await postToYouTube(connection.access_token, postData)
      case 'pinterest':
        return await postToPinterest(connection.access_token, postData)
      case 'snapchat':
        return await postToSnapchat(connection.access_token, postData)
      case 'reddit':
        return await postToReddit(connection.access_token, postData)
      case 'bluesky':
        return await postToBluesky(userId, connection, postData)
      case 'mastodon':
        return await postToMastodon(connection.access_token, postData)
      case 'discord':
        return await postToDiscord(connection.access_token, connection.platform_user_id, postData)
      case 'telegram':
        return await postToTelegram(connection.access_token, connection.platform_user_id, postData)
      case 'tumblr':
        return await postToTumblr(connection.access_token, connection.platform_user_id, postData)
      case 'wordpress':
        return await postToWordPress(connection.access_token, connection.platform_user_id, postData)
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

      case 'reddit': {
        const clientId = process.env.REDDIT_CLIENT_ID
        const clientSecret = process.env.REDDIT_CLIENT_SECRET
        if (!clientId || !clientSecret) {
          return false
        }

        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        })

        const data = await response.json().catch(() => null)
        const refreshedAccessToken = data?.access_token
        if (!response.ok || !refreshedAccessToken) {
          return false
        }

        const expiresIn = Number(data?.expires_in || 0)
        const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000).toISOString() : null
        await db.execute({
          sql: `
            UPDATE platform_connections
            SET access_token = ?,
                token_expires_at = ?,
                updated_at = NOW()
            WHERE user_id = ? AND platform = ?
          `,
          args: [refreshedAccessToken, expiresAt, userId, platform]
        })
        return true
      }

      case 'youtube': {
        const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
        if (!clientId || !clientSecret) {
          return false
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        })

        const data = await response.json().catch(() => null)
        const refreshedAccessToken = data?.access_token
        if (!response.ok || !refreshedAccessToken) {
          return false
        }

        const expiresIn = Number(data?.expires_in || 0)
        const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000).toISOString() : null
        await db.execute({
          sql: `
            UPDATE platform_connections
            SET access_token = ?,
                token_expires_at = ?,
                updated_at = NOW()
            WHERE user_id = ? AND platform = ?
          `,
          args: [refreshedAccessToken, expiresAt, userId, platform]
        })
        return true
      }

      case 'snapchat': {
        const clientId = process.env.SNAPCHAT_CLIENT_ID
        const clientSecret = process.env.SNAPCHAT_CLIENT_SECRET
        if (!clientId || !clientSecret) {
          return false
        }

        const response = await fetch('https://accounts.snapchat.com/accounts/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        })

        const data = await response.json().catch(() => null)
        const refreshedAccessToken = data?.access_token
        if (!response.ok || !refreshedAccessToken) {
          return false
        }

        const refreshedToken = data?.refresh_token || refreshToken
        const expiresIn = Number(data?.expires_in || 0)
        const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000).toISOString() : null
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

      case 'bluesky': {
        const service = process.env.BLUESKY_SERVICE_URL || 'https://bsky.social'
        const response = await fetch(`${service}/xrpc/com.atproto.server.refreshSession`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${refreshToken}` }
        })
        const data = await response.json().catch(() => null)
        const refreshedAccessToken = data?.accessJwt
        if (!response.ok || !refreshedAccessToken) {
          return false
        }
        const refreshedToken = data?.refreshJwt || refreshToken
        await db.execute({
          sql: `
            UPDATE platform_connections
            SET access_token = ?,
                refresh_token = ?,
                updated_at = NOW()
            WHERE user_id = ? AND platform = ?
          `,
          args: [refreshedAccessToken, refreshedToken, userId, platform]
        })
        return true
      }

      case 'tumblr': {
        const clientId = process.env.TUMBLR_CLIENT_ID
        const clientSecret = process.env.TUMBLR_CLIENT_SECRET
        if (!clientId || !clientSecret) {
          return false
        }
        const response = await fetch('https://api.tumblr.com/v2/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          })
        })
        const data = await response.json().catch(() => null)
        const refreshedAccessToken = data?.access_token
        if (!response.ok || !refreshedAccessToken) {
          return false
        }
        const refreshedToken = data?.refresh_token || refreshToken
        const expiresIn = Number(data?.expires_in || 0)
        const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000).toISOString() : null
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
    if (!instagramAccountId) {
      return {
        success: false,
        error: 'Instagram direct posting requires a Business/Creator account connected to a Facebook Page. Reconnect after meeting those requirements.',
        errorCode: 'INVALID_ACCOUNT'
      }
    }

    if (!postData.mediaUrls || postData.mediaUrls.length === 0) {
      return {
        success: false,
        error: 'Instagram direct posting requires at least one media URL (image or video).',
        errorCode: 'INSTAGRAM_MEDIA_REQUIRED'
      }
    }

    const mediaUrl = postData.mediaUrls[0]
    const isVideo = /\.(mp4|mov|m4v|webm)(\?.*)?$/i.test(mediaUrl)
    const caption = postData.content.slice(0, 2200)

    const createParams = new URLSearchParams({
      caption,
      access_token: accessToken
    })

    if (isVideo) {
      createParams.set('media_type', 'REELS')
      createParams.set('video_url', mediaUrl)
      createParams.set('share_to_feed', 'true')
    } else {
      createParams.set('image_url', mediaUrl)
    }

    const createResponse = await fetch(
      `https://graph.facebook.com/v20.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: createParams
      }
    )
    const createData = await createResponse.json().catch(() => null)
    const creationId = createData?.id

    if (!createResponse.ok || !creationId) {
      return {
        success: false,
        error: createData?.error?.message || 'Instagram API rejected media creation.',
        errorCode: 'INSTAGRAM_MEDIA_CREATE_ERROR'
      }
    }

    const publishResponse = await fetch(
      `https://graph.facebook.com/v20.0/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          creation_id: creationId,
          access_token: accessToken
        })
      }
    )
    const publishData = await publishResponse.json().catch(() => null)
    const instagramPostId = publishData?.id

    if (!publishResponse.ok || !instagramPostId) {
      return {
        success: false,
        error: publishData?.error?.message || 'Instagram API rejected publishing.',
        errorCode: 'INSTAGRAM_PUBLISH_ERROR'
      }
    }

    return {
      success: true,
      platformPostId: instagramPostId,
      postId: instagramPostId
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
 * Post to Facebook Page feed
 */
async function postToFacebook(
  accessToken: string,
  pageId: string | null,
  postData: PostData
): Promise<PostResult> {
  try {
    if (!pageId) {
      return {
        success: false,
        error: 'Facebook Page not connected. Reconnect and select a Page.',
        errorCode: 'INVALID_ACCOUNT'
      }
    }

    const response = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        message: postData.content.slice(0, 63206),
        access_token: accessToken
      })
    })

    const data = await response.json().catch(() => null)
    if (!response.ok || !data?.id) {
      return {
        success: false,
        error: data?.error?.message || 'Failed to post to Facebook',
        errorCode: 'FACEBOOK_API_ERROR'
      }
    }

    return { success: true, platformPostId: data.id, postId: data.id }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Facebook', errorCode: 'FACEBOOK_ERROR' }
  }
}

/**
 * Post to Threads (basic text publishing flow)
 */
async function postToThreads(
  accessToken: string,
  threadsUserId: string | null,
  postData: PostData
): Promise<PostResult> {
  try {
    if (!threadsUserId) {
      return {
        success: false,
        error: 'Threads account not properly connected. Please reconnect.',
        errorCode: 'INVALID_ACCOUNT'
      }
    }

    const createResponse = await fetch(`https://graph.facebook.com/v20.0/${threadsUserId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        media_type: 'TEXT',
        text: postData.content.slice(0, 500),
        access_token: accessToken
      })
    })
    const createData = await createResponse.json().catch(() => null)
    const creationId = createData?.id

    if (!createResponse.ok || !creationId) {
      return {
        success: false,
        error: createData?.error?.message || 'Failed to create Threads post.',
        errorCode: 'THREADS_CREATE_ERROR'
      }
    }

    const publishResponse = await fetch(`https://graph.facebook.com/v20.0/${threadsUserId}/threads_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken
      })
    })
    const publishData = await publishResponse.json().catch(() => null)
    const threadId = publishData?.id
    if (!publishResponse.ok || !threadId) {
      return {
        success: false,
        error: publishData?.error?.message || 'Failed to publish Threads post.',
        errorCode: 'THREADS_PUBLISH_ERROR'
      }
    }

    return { success: true, platformPostId: threadId, postId: threadId }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Threads', errorCode: 'THREADS_ERROR' }
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
  try {
    if (!postData.mediaUrls || postData.mediaUrls.length === 0) {
      return {
        success: false,
        error: 'YouTube direct posting requires at least one public video URL.',
        errorCode: 'YOUTUBE_VIDEO_REQUIRED'
      }
    }

    const videoUrl = postData.mediaUrls[0]
    const mediaResponse = await fetch(videoUrl)
    if (!mediaResponse.ok) {
      return {
        success: false,
        error: 'CreatorFlow could not download your video URL for YouTube upload.',
        errorCode: 'YOUTUBE_MEDIA_FETCH_FAILED'
      }
    }

    const arrayBuffer = await mediaResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const stream = Readable.from(buffer)

    const firstLine = postData.content.split('\n').find((line) => line.trim().length > 0) || 'CreatorFlow Upload'
    const title = firstLine.replace(/^Title:\s*/i, '').slice(0, 100)
    const description = postData.content
      .replace(/^Title:.*\n?/i, '')
      .replace(/^Description:\s*/i, '')
      .slice(0, 5000)

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client })
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          categoryId: process.env.YOUTUBE_DEFAULT_CATEGORY_ID || '22'
        },
        status: {
          privacyStatus: (process.env.YOUTUBE_DEFAULT_PRIVACY_STATUS as 'private' | 'public' | 'unlisted') || 'private'
        }
      },
      media: {
        mimeType: mediaResponse.headers.get('content-type') || 'video/mp4',
        body: stream
      }
    })

    const videoId = uploadResponse.data.id
    if (!videoId) {
      return {
        success: false,
        error: 'YouTube upload finished without a video id.',
        errorCode: 'YOUTUBE_INVALID_RESPONSE'
      }
    }

    return {
      success: true,
      platformPostId: videoId,
      postId: videoId
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to YouTube',
      errorCode: 'YOUTUBE_ERROR'
    }
  }
}

/**
 * Post to Pinterest (requires board + media support)
 */
async function postToPinterest(accessToken: string, postData: PostData): Promise<PostResult> {
  try {
    if (!postData.mediaUrls || postData.mediaUrls.length === 0) {
      return {
        success: false,
        error: 'Pinterest direct posting requires at least one media URL.',
        errorCode: 'PINTEREST_MEDIA_REQUIRED'
      }
    }

    const defaultBoardId = process.env.PINTEREST_DEFAULT_BOARD_ID
    if (!defaultBoardId) {
      return {
        success: false,
        error: 'Pinterest direct posting requires PINTEREST_DEFAULT_BOARD_ID env var.',
        errorCode: 'PINTEREST_BOARD_REQUIRED'
      }
    }

    const firstLine = postData.content.split('\n').find((line) => line.trim().length > 0) || 'CreatorFlow Post'
    const title = firstLine.replace(/^Pin title:\s*/i, '').slice(0, 100)
    const description = postData.content.replace(/^Pin title:.*\n?/i, '').replace(/^Pin description:\s*/i, '').slice(0, 500)
    const mediaUrl = postData.mediaUrls[0]

    const response = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        board_id: defaultBoardId,
        title,
        description,
        media_source: {
          source_type: 'image_url',
          url: mediaUrl
        }
      })
    })

    const data = await response.json().catch(() => null)
    const pinId = data?.id
    if (!response.ok || !pinId) {
      return {
        success: false,
        error: data?.message || data?.error || 'Pinterest API rejected the publish request.',
        errorCode: 'PINTEREST_API_ERROR'
      }
    }

    return {
      success: true,
      platformPostId: pinId,
      postId: pinId
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to Pinterest',
      errorCode: 'PINTEREST_ERROR'
    }
  }
}

/**
 * Post to Snapchat (requires Snapchat publishing setup)
 */
async function postToSnapchat(accessToken: string, postData: PostData): Promise<PostResult> {
  try {
    if (!postData.mediaUrls || postData.mediaUrls.length === 0) {
      return {
        success: false,
        error: 'Snapchat direct posting requires at least one public media URL.',
        errorCode: 'SNAPCHAT_MEDIA_REQUIRED'
      }
    }

    const publishEndpoint = process.env.SNAPCHAT_PUBLISH_ENDPOINT
    if (!publishEndpoint) {
      return {
        success: false,
        error: 'Snapchat direct posting requires SNAPCHAT_PUBLISH_ENDPOINT env var.',
        errorCode: 'SNAPCHAT_ENDPOINT_REQUIRED'
      }
    }

    const response = await fetch(publishEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        caption: postData.content.slice(0, 250),
        media_url: postData.mediaUrls[0],
        profile_id: process.env.SNAPCHAT_PROFILE_ID || undefined
      })
    })

    const data = await response.json().catch(() => null)
    const snapPostId = data?.id || data?.post_id || data?.post?.id || null
    if (!response.ok || !snapPostId) {
      return {
        success: false,
        error: data?.error_description || data?.message || data?.error || 'Snapchat API rejected the publish request.',
        errorCode: 'SNAPCHAT_API_ERROR'
      }
    }

    return {
      success: true,
      platformPostId: snapPostId,
      postId: snapPostId
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to Snapchat',
      errorCode: 'SNAPCHAT_ERROR'
    }
  }
}

/**
 * Post to Reddit
 */
async function postToReddit(accessToken: string, postData: PostData): Promise<PostResult> {
  try {
    const defaultSubreddit = process.env.REDDIT_DEFAULT_SUBREDDIT
    if (!defaultSubreddit) {
      return {
        success: false,
        error: 'Reddit direct posting requires REDDIT_DEFAULT_SUBREDDIT env var.',
        errorCode: 'REDDIT_SUBREDDIT_REQUIRED'
      }
    }

    const content = postData.content || ''
    let title = ''
    let text = ''
    const titleMatch = content.match(/Reddit title:\s*(.+)/i)
    const bodyMatch = content.match(/Post body:\s*([\s\S]*)/i)

    if (titleMatch?.[1]) {
      title = titleMatch[1].trim().slice(0, 300)
    } else {
      title = content.split('\n').find((line) => line.trim().length > 0)?.trim().slice(0, 300) || 'CreatorFlow Post'
    }

    if (bodyMatch?.[1]) {
      text = bodyMatch[1].trim().slice(0, 40000)
    } else {
      text = content.slice(0, 40000)
    }

    const response = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'creatorflow365/1.0'
      },
      body: new URLSearchParams({
        api_type: 'json',
        kind: 'self',
        sr: defaultSubreddit,
        title,
        text
      })
    })

    const data = await response.json().catch(() => null)
    const errors = data?.json?.errors || []
    if (!response.ok || errors.length > 0) {
      const errText = errors[0]?.join(': ') || data?.message || 'Reddit API rejected the post.'
      return {
        success: false,
        error: errText,
        errorCode: 'REDDIT_API_ERROR'
      }
    }

    const postId = data?.json?.data?.id || null
    return {
      success: true,
      platformPostId: postId || undefined,
      postId: postId || undefined
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Reddit', errorCode: 'REDDIT_ERROR' }
  }
}

async function postToBluesky(
  userId: string,
  connection: any,
  postData: PostData
): Promise<PostResult> {
  try {
    const service = process.env.BLUESKY_SERVICE_URL || 'https://bsky.social'
    let accessToken = connection.access_token as string
    let did = (connection.platform_user_id as string | null) || null

    const ensureSession = async (): Promise<{ ok: boolean; error?: string }> => {
      const sessionResponse = await fetch(`${service}/xrpc/com.atproto.server.getSession`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json().catch(() => null)
        if (sessionData?.did) did = sessionData.did
        return { ok: true }
      }

      const refreshToken = connection.refresh_token as string | null
      if (!refreshToken) {
        return {
          ok: false,
          error: 'Bluesky session expired. Reconnect Bluesky in Connections.'
        }
      }

      const refreshed = await refreshPlatformToken(userId, 'bluesky')
      if (!refreshed) {
        return {
          ok: false,
          error: 'Bluesky session expired. Reconnect Bluesky in Connections.'
        }
      }

      const refreshedResult = await db.execute({
        sql: `
          SELECT access_token, platform_user_id FROM platform_connections
          WHERE user_id = ? AND platform = 'bluesky' AND is_active = TRUE
        `,
        args: [userId]
      })
      if (refreshedResult.rows.length === 0) {
        return { ok: false, error: 'Bluesky not connected.' }
      }
      accessToken = refreshedResult.rows[0].access_token as string
      did = (refreshedResult.rows[0].platform_user_id as string | null) || did

      const retrySession = await fetch(`${service}/xrpc/com.atproto.server.getSession`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const retryData = await retrySession.json().catch(() => null)
      if (!retrySession.ok || !retryData?.did) {
        return {
          ok: false,
          error: 'Bluesky session expired. Reconnect Bluesky in Connections.'
        }
      }
      did = retryData.did
      return { ok: true }
    }

    const session = await ensureSession()
    if (!session.ok) {
      return { success: false, error: session.error, errorCode: 'BLUESKY_SESSION_ERROR' }
    }
    if (!did) {
      return { success: false, error: 'Failed to resolve Bluesky account DID.', errorCode: 'BLUESKY_REPO_ERROR' }
    }

    const text = postData.content.slice(0, 300)
    const body: any = {
      repo: did,
      collection: 'app.bsky.feed.post',
      record: {
        $type: 'app.bsky.feed.post',
        text,
        createdAt: new Date().toISOString()
      }
    }

    const createResponse = await fetch(`${service}/xrpc/com.atproto.repo.createRecord`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const createData = await createResponse.json().catch(() => null)
    const uri = createData?.uri
    if (!createResponse.ok || !uri) {
      return { success: false, error: createData?.message || 'Bluesky API rejected the post.', errorCode: 'BLUESKY_API_ERROR' }
    }
    return { success: true, platformPostId: uri, postId: uri }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Bluesky', errorCode: 'BLUESKY_ERROR' }
  }
}

async function postToMastodon(accessToken: string, postData: PostData): Promise<PostResult> {
  try {
    const instanceUrl = process.env.MASTODON_INSTANCE_URL
    if (!instanceUrl) {
      return { success: false, error: 'MASTODON_INSTANCE_URL env var is required.', errorCode: 'MASTODON_INSTANCE_REQUIRED' }
    }
    const response = await fetch(`${instanceUrl.replace(/\/$/, '')}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        status: postData.content.slice(0, 500),
        visibility: 'public'
      })
    })
    const data = await response.json().catch(() => null)
    const statusId = data?.id
    if (!response.ok || !statusId) {
      return { success: false, error: data?.error || 'Mastodon API rejected the publish request.', errorCode: 'MASTODON_API_ERROR' }
    }
    return { success: true, platformPostId: statusId, postId: statusId }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Mastodon', errorCode: 'MASTODON_ERROR' }
  }
}

async function postToDiscord(accessToken: string, storedChannelId: string | null, postData: PostData): Promise<PostResult> {
  try {
    const content = postData.content.slice(0, 2000)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim() || null

    // Prefer channel webhook: avoids bot Missing Access when channel perms block the bot.
    if (webhookUrl) {
      const separator = webhookUrl.includes('?') ? '&' : '?'
      const response = await fetch(`${webhookUrl}${separator}wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      const data = await response.json().catch(() => null)
      const messageId = data?.id
      if (!response.ok || !messageId) {
        return { success: false, error: data?.message || 'Discord webhook rejected the message.', errorCode: 'DISCORD_WEBHOOK_ERROR' }
      }
      return { success: true, platformPostId: messageId, postId: messageId }
    }

    // Fallback: bot token + channel ID (Connect stores Discord user id in platform_user_id, not a channel).
    const channelId = process.env.DISCORD_DEFAULT_CHANNEL_ID || storedChannelId || null
    if (!channelId) {
      return { success: false, error: 'Discord direct posting requires DISCORD_WEBHOOK_URL or DISCORD_DEFAULT_CHANNEL_ID.', errorCode: 'DISCORD_CHANNEL_REQUIRED' }
    }
    const botToken = process.env.DISCORD_BOT_TOKEN
    if (!botToken) {
      return { success: false, error: 'Discord direct posting requires DISCORD_WEBHOOK_URL or DISCORD_BOT_TOKEN.', errorCode: 'DISCORD_BOT_TOKEN_REQUIRED' }
    }
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
    const data = await response.json().catch(() => null)
    const messageId = data?.id
    if (!response.ok || !messageId) {
      return { success: false, error: data?.message || 'Discord API rejected the message.', errorCode: 'DISCORD_API_ERROR' }
    }
    return { success: true, platformPostId: messageId, postId: messageId }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Discord', errorCode: 'DISCORD_ERROR' }
  }
}

async function postToTelegram(accessToken: string, chatId: string | null, postData: PostData): Promise<PostResult> {
  try {
    if (!chatId) {
      return { success: false, error: 'Telegram connection missing chat ID. Reconnect Telegram.', errorCode: 'TELEGRAM_CHAT_REQUIRED' }
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN || accessToken
    const mediaUrl = postData.mediaUrls?.[0]
    const endpoint = mediaUrl
      ? `https://api.telegram.org/bot${botToken}/sendPhoto`
      : `https://api.telegram.org/bot${botToken}/sendMessage`
    const payload = mediaUrl
      ? { chat_id: chatId, photo: mediaUrl, caption: postData.content.slice(0, 1024) }
      : { chat_id: chatId, text: postData.content.slice(0, 4096) }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await response.json().catch(() => null)
    const messageId = data?.result?.message_id
    if (!response.ok || !data?.ok || !messageId) {
      return { success: false, error: data?.description || 'Telegram API rejected the message.', errorCode: 'TELEGRAM_API_ERROR' }
    }
    return { success: true, platformPostId: String(messageId), postId: String(messageId) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Telegram', errorCode: 'TELEGRAM_ERROR' }
  }
}

async function postToTumblr(accessToken: string, blogNameOrId: string | null, postData: PostData): Promise<PostResult> {
  try {
    let blogIdentifier = blogNameOrId
    if (!blogIdentifier) {
      const meRes = await fetch('https://api.tumblr.com/v2/user/info', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const meData = await meRes.json().catch(() => null)
      blogIdentifier = meData?.response?.user?.blogs?.find((b: any) => b.primary)?.name || meData?.response?.user?.blogs?.[0]?.name || null
    }

    if (!blogIdentifier) {
      return { success: false, error: 'Tumblr account has no available blog for posting.', errorCode: 'TUMBLR_BLOG_REQUIRED' }
    }

    const response = await fetch(`https://api.tumblr.com/v2/blog/${blogIdentifier}.tumblr.com/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: [{ type: 'text', text: postData.content.slice(0, 10000) }],
        state: 'published'
      })
    })
    const data = await response.json().catch(() => null)
    const postId = data?.response?.id
    if (!response.ok || !postId) {
      return { success: false, error: data?.meta?.msg || 'Tumblr API rejected the post.', errorCode: 'TUMBLR_API_ERROR' }
    }
    return { success: true, platformPostId: String(postId), postId: String(postId) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to Tumblr', errorCode: 'TUMBLR_ERROR' }
  }
}

async function postToWordPress(accessToken: string, wpSiteId: string | null, postData: PostData): Promise<PostResult> {
  try {
    if (wpSiteId) {
      const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${wpSiteId}/posts/new`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: postData.content.split('\n')[0].slice(0, 100) || 'CreatorFlow Post',
          content: postData.content.slice(0, 50000),
          status: 'publish'
        })
      })
      const data = await response.json().catch(() => null)
      const postId = data?.ID
      if (!response.ok || !postId) {
        return { success: false, error: data?.message || 'WordPress.com API rejected the post.', errorCode: 'WORDPRESS_API_ERROR' }
      }
      return { success: true, platformPostId: String(postId), postId: String(postId) }
    }

    const siteUrl = process.env.WORDPRESS_SITE_URL
    const appUser = process.env.WORDPRESS_APP_USERNAME
    const appPassword = process.env.WORDPRESS_APP_PASSWORD
    if (!siteUrl || !appUser || !appPassword) {
      return {
        success: false,
        error: 'WordPress direct posting needs a connected site ID or self-hosted credentials env vars.',
        errorCode: 'WORDPRESS_CONFIG_REQUIRED'
      }
    }

    const response = await fetch(`${siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${appUser}:${appPassword}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: postData.content.split('\n')[0].slice(0, 100) || 'CreatorFlow Post',
        content: postData.content.slice(0, 50000),
        status: 'publish'
      })
    })
    const data = await response.json().catch(() => null)
    const postId = data?.id
    if (!response.ok || !postId) {
      return { success: false, error: data?.message || 'WordPress REST API rejected the post.', errorCode: 'WORDPRESS_SELF_HOSTED_ERROR' }
    }
    return { success: true, platformPostId: String(postId), postId: String(postId) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post to WordPress', errorCode: 'WORDPRESS_ERROR' }
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

