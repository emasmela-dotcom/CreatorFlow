import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * OAuth Callback Route
 * Handles OAuth callbacks from social media platforms
 */

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'}/dashboard?error=oauth_cancelled`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'}/dashboard?error=oauth_failed`
    )
  }

  try {
    // Decode state to get userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const userId = stateData.userId
    const codeVerifier = stateData.codeVerifier as string | undefined

    if (!userId) {
      throw new Error('Invalid state parameter')
    }

    const platformLower = platform.toLowerCase()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'
    const redirectUri = `${baseUrl}/api/auth/callback/${platformLower}`

    // Exchange code for access token (platform-specific)
    const tokenResponse = await exchangeCodeForToken(platform, code, redirectUri, codeVerifier)
    
    if (!tokenResponse.access_token) {
      throw new Error('Failed to get access token')
    }

    // Get user info from platform
    const userInfo = await getPlatformUserInfo(platform, tokenResponse.access_token)

    // Calculate token expiration
    const expiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000)
      : null

    // Store connection in database
    await db.execute({
      sql: `
        INSERT INTO platform_connections 
        (user_id, platform, access_token, refresh_token, token_expires_at, 
         platform_user_id, platform_username, platform_account_name, is_active, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())
        ON CONFLICT (user_id, platform) 
        DO UPDATE SET 
          access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          token_expires_at = EXCLUDED.token_expires_at,
          platform_user_id = EXCLUDED.platform_user_id,
          platform_username = EXCLUDED.platform_username,
          platform_account_name = EXCLUDED.platform_account_name,
          is_active = TRUE,
          updated_at = NOW()
      `,
      args: [
        userId,
        platform,
        tokenResponse.access_token,
        tokenResponse.refresh_token || null,
        expiresAt,
        userInfo.id || null,
        userInfo.username || null,
        userInfo.name || null
      ]
    })

    return NextResponse.redirect(
      `${baseUrl}/dashboard?connected=${platform}&success=true`
    )
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'}/dashboard?error=oauth_failed&message=${encodeURIComponent(error.message)}`
    )
  }
}

/**
 * Exchange OAuth code for access token (platform-specific)
 */
async function exchangeCodeForToken(
  platform: string,
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<TokenResponse> {
  const clientId = getClientId(platform)
  const clientSecret = getClientSecret(platform)

  switch (platform) {
    case 'instagram':
    case 'facebook':
    case 'threads':
      // Instagram uses Facebook Graph API
      const fbResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code
        })
      })
      return await fbResponse.json()

    case 'twitter':
      const twitterResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          ...(codeVerifier ? { code_verifier: codeVerifier } : {})
        })
      })
      return await twitterResponse.json()

    case 'linkedin':
      const linkedinResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
        })
      })
      const linkedinTokenData = await linkedinResponse.json()
      if (!linkedinTokenData.access_token) {
        throw new Error(linkedinTokenData.error_description || linkedinTokenData.error || 'LinkedIn token exchange failed')
      }
      return linkedinTokenData

    case 'tiktok': {
      const tiktokResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        body: new URLSearchParams({
          client_key: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      })
      const tiktokData = await tiktokResponse.json()

      const accessToken = tiktokData.access_token || tiktokData.data?.access_token
      if (accessToken) {
        const source = tiktokData.access_token ? tiktokData : tiktokData.data
        return {
          access_token: accessToken,
          refresh_token: source.refresh_token,
          expires_in: source.expires_in,
          token_type: source.token_type
        }
      }

      const errorMsg =
        tiktokData.error_description ||
        tiktokData.data?.error_description ||
        tiktokData.error?.message ||
        tiktokData.data?.error?.message ||
        tiktokData.error ||
        tiktokData.data?.error ||
        'TikTok token exchange failed'
      throw new Error(errorMsg)
    }

    case 'youtube': {
      const googleResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      })
      return await googleResponse.json()
    }

    case 'twitch': {
      const twitchResponse = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      })
      const data = await twitchResponse.json()
      if (!data.access_token) {
        throw new Error(data.message || data.error || 'Twitch token exchange failed')
      }
      return data
    }

    case 'pinterest': {
      const pinterestResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        }).toString()
      })
      const data = await pinterestResponse.json()
      if (!data.access_token) {
        throw new Error(data.message || data.error_description || data.error || 'Pinterest token exchange failed')
      }
      return data
    }

    case 'snapchat': {
      const snapchatResponse = await fetch('https://accounts.snapchat.com/accounts/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
        })
      })
      const data = await snapchatResponse.json()
      if (!data.access_token) {
        throw new Error(data.error_description || 'Snapchat token exchange failed')
      }
      return data
    }

    case 'reddit': {
      const redditResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        })
      })
      const data = await redditResponse.json()
      if (!data.access_token) {
        throw new Error(data.error || 'Reddit token exchange failed')
      }
      return data
    }

    case 'mastodon': {
      const instanceUrl = process.env.MASTODON_INSTANCE_URL
      if (!clientId) throw new Error('MASTODON_CLIENT_ID not configured')
      if (!clientSecret) throw new Error('MASTODON_CLIENT_SECRET not configured')
      if (!instanceUrl) throw new Error('MASTODON_INSTANCE_URL not configured')
      const body = new URLSearchParams()
      body.set('grant_type', 'authorization_code')
      body.set('code', code)
      body.set('redirect_uri', redirectUri)
      body.set('client_id', clientId)
      body.set('client_secret', clientSecret)
      const mastodonResponse = await fetch(`${instanceUrl.replace(/\/$/, '')}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      })
      if (!mastodonResponse.ok) {
        const err = await mastodonResponse.text()
        throw new Error(`Mastodon token exchange failed: ${mastodonResponse.status} ${err}`)
      }
      const data = await mastodonResponse.json()
      if (!data.access_token) {
        throw new Error(data.error_description || data.error || 'Mastodon token exchange failed')
      }
      return data
    }

    case 'discord': {
      const discordResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      })
      const data = await discordResponse.json()
      if (!data.access_token) {
        throw new Error(data.error_description || data.error || 'Discord token exchange failed')
      }
      return data
    }

    case 'tumblr': {
      const tumblrResponse = await fetch('https://api.tumblr.com/v2/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      })
      const data = await tumblrResponse.json()
      if (!data.access_token) {
        throw new Error(data.error_description || data.error || 'Tumblr token exchange failed')
      }
      return data
    }

    case 'wordpress': {
      const wordpressResponse = await fetch('https://public-api.wordpress.com/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      })
      const data = await wordpressResponse.json()
      if (!data.access_token) {
        throw new Error(data.error_description || data.error || 'WordPress token exchange failed')
      }
      return data
    }

    default:
      throw new Error(`Token exchange not implemented for ${platform}`)
  }
}

/**
 * Get user info from platform
 */
async function getPlatformUserInfo(platform: string, accessToken: string): Promise<{
  id: string | null
  username: string | null
  name: string | null
}> {
  try {
    switch (platform) {
      case 'instagram':
        // Instagram direct publishing requires a Business/Creator account
        // connected to a Facebook Page.
        const pagesResponse = await fetch(
          'https://graph.facebook.com/v20.0/me/accounts?fields=id,name,instagram_business_account{id,username}',
          {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }
        )
        const pagesData = await pagesResponse.json().catch(() => null)
        const pages = Array.isArray(pagesData?.data) ? pagesData.data : []
        const pageWithInstagram = pages.find((p: any) => p?.instagram_business_account?.id)

        if (!pageWithInstagram?.instagram_business_account?.id) {
          return { id: null, username: null, name: null }
        }

        return {
          id: String(pageWithInstagram.instagram_business_account.id),
          username: pageWithInstagram.instagram_business_account.username || null,
          name: pageWithInstagram.name || null
        }

      case 'facebook':
      case 'threads': {
        const fbResponse = await fetch('https://graph.facebook.com/me?fields=id,name&access_token=' + encodeURIComponent(accessToken))
        const fbData = await fbResponse.json()
        return {
          id: fbData.id || null,
          username: null,
          name: fbData.name || null
        }
      }

      case 'twitter':
        const twitterResponse = await fetch('https://api.twitter.com/2/users/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const twitterData = await twitterResponse.json()
        return {
          id: twitterData.data?.id || null,
          username: twitterData.data?.username || null,
          name: twitterData.data?.name || null
        }

      case 'linkedin':
        const linkedinResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const linkedinData = await linkedinResponse.json()
        return {
          id: linkedinData.id || null,
          username: null,
          name: `${linkedinData.localizedFirstName || ''} ${linkedinData.localizedLastName || ''}`.trim() || null
        }

      case 'tiktok': {
        const tiktokResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const tiktokData = await tiktokResponse.json()
        const user = tiktokData.data?.user
        return {
          id: user?.open_id || null,
          username: user?.display_name || null,
          name: user?.display_name || null
        }
      }

      case 'youtube': {
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const googleData = await googleResponse.json()
        return {
          id: googleData.id || null,
          username: googleData.email?.split('@')[0] || null,
          name: googleData.name || null
        }
      }

      case 'twitch': {
        const clientId = process.env.TWITCH_CLIENT_ID || ''
        const twitchUserResponse = await fetch('https://api.twitch.tv/helix/users', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': clientId
          }
        })
        const twitchUserData = await twitchUserResponse.json()
        const user = twitchUserData.data?.[0]
        return {
          id: user?.id || null,
          username: user?.login || null,
          name: user?.display_name || null
        }
      }

      case 'pinterest': {
        const pinterestResponse = await fetch('https://api.pinterest.com/v5/user_account', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const pinterestData = await pinterestResponse.json()
        return {
          id: pinterestData?.id || null,
          username: pinterestData?.username || null,
          name: pinterestData?.business_name || pinterestData?.username || null
        }
      }

      case 'snapchat': {
        return {
          id: null,
          username: null,
          name: 'Snapchat Account'
        }
      }

      case 'reddit': {
        const redditResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'creatorflow365/1.0'
          }
        })
        const redditData = await redditResponse.json()
        return {
          id: redditData?.id || null,
          username: redditData?.name || null,
          name: redditData?.subreddit?.title || redditData?.name || null
        }
      }

      case 'mastodon': {
        const instanceUrl = process.env.MASTODON_INSTANCE_URL
        if (!instanceUrl) return { id: null, username: null, name: null }
        const mastodonResponse = await fetch(`${instanceUrl.replace(/\/$/, '')}/api/v1/accounts/verify_credentials`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const mastodonData = await mastodonResponse.json()
        return {
          id: mastodonData?.id || null,
          username: mastodonData?.username || null,
          name: mastodonData?.display_name || mastodonData?.username || null
        }
      }

      case 'discord': {
        const discordResponse = await fetch('https://discord.com/api/v10/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const discordData = await discordResponse.json()
        return {
          id: discordData?.id || null,
          username: discordData?.username || null,
          name: discordData?.global_name || discordData?.username || null
        }
      }

      case 'tumblr': {
        const tumblrResponse = await fetch('https://api.tumblr.com/v2/user/info', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const tumblrData = await tumblrResponse.json()
        const primaryBlog = tumblrData?.response?.user?.blogs?.find((b: any) => b.primary) || tumblrData?.response?.user?.blogs?.[0]
        return {
          id: primaryBlog?.name || null,
          username: primaryBlog?.name || null,
          name: primaryBlog?.title || primaryBlog?.name || null
        }
      }

      case 'wordpress': {
        const meResponse = await fetch('https://public-api.wordpress.com/rest/v1.1/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const meData = await meResponse.json()
        const sitesResponse = await fetch('https://public-api.wordpress.com/rest/v1.1/me/sites', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const sitesData = await sitesResponse.json().catch(() => null)
        const primarySite = sitesData?.sites?.[0]
        return {
          id: primarySite?.ID ? String(primarySite.ID) : null,
          username: meData?.username || null,
          name: primarySite?.name || meData?.display_name || meData?.username || null
        }
      }

      default:
        return { id: null, username: null, name: null }
    }
  } catch (error) {
    console.error(`Error getting user info for ${platform}:`, error)
    return { id: null, username: null, name: null }
  }
}

function getClientId(platform: string): string {
  const envVars: Record<string, string> = {
    instagram: process.env.FACEBOOK_APP_ID || '',
    facebook: process.env.FACEBOOK_APP_ID || '',
    threads: process.env.FACEBOOK_APP_ID || '',
    twitter: process.env.TWITTER_CLIENT_ID || '',
    linkedin: process.env.LINKEDIN_CLIENT_ID || '',
    tiktok: process.env.TIKTOK_CLIENT_KEY || '',
    youtube: process.env.GOOGLE_CLIENT_ID || '',
    twitch: process.env.TWITCH_CLIENT_ID || '',
    pinterest: process.env.PINTEREST_APP_ID || '',
    snapchat: process.env.SNAPCHAT_CLIENT_ID || '',
    reddit: process.env.REDDIT_CLIENT_ID || '',
    mastodon: process.env.MASTODON_CLIENT_ID || '',
    discord: process.env.DISCORD_CLIENT_ID || '',
    tumblr: process.env.TUMBLR_CLIENT_ID || '',
    wordpress: process.env.WORDPRESS_CLIENT_ID || ''
  }
  return envVars[platform] || ''
}

function getClientSecret(platform: string): string {
  const envVars: Record<string, string> = {
    instagram: process.env.FACEBOOK_APP_SECRET || '',
    facebook: process.env.FACEBOOK_APP_SECRET || '',
    threads: process.env.FACEBOOK_APP_SECRET || '',
    twitter: process.env.TWITTER_CLIENT_SECRET || '',
    linkedin: process.env.LINKEDIN_CLIENT_SECRET || '',
    tiktok: process.env.TIKTOK_CLIENT_SECRET || '',
    youtube: process.env.GOOGLE_CLIENT_SECRET || '',
    twitch: process.env.TWITCH_CLIENT_SECRET || '',
    pinterest: process.env.PINTEREST_APP_SECRET || '',
    snapchat: process.env.SNAPCHAT_CLIENT_SECRET || '',
    reddit: process.env.REDDIT_CLIENT_SECRET || '',
    mastodon: process.env.MASTODON_CLIENT_SECRET || '',
    discord: process.env.DISCORD_CLIENT_SECRET || '',
    tumblr: process.env.TUMBLR_CLIENT_SECRET || '',
    wordpress: process.env.WORDPRESS_CLIENT_SECRET || ''
  }
  return envVars[platform] || ''
}

