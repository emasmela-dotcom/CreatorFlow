import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyAuth, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * OAuth Connection Route
 * Initiates OAuth flow for connecting social media platforms
 */

function getPlatformClientId(platform: string): string | undefined {
  const env: Record<string, string | undefined> = {
    instagram: process.env.FACEBOOK_APP_ID,
    facebook: process.env.FACEBOOK_APP_ID,
    threads: process.env.FACEBOOK_APP_ID,
    twitter: process.env.TWITTER_CLIENT_ID,
    linkedin: process.env.LINKEDIN_CLIENT_ID,
    tiktok: process.env.TIKTOK_CLIENT_KEY,
    youtube: process.env.GOOGLE_CLIENT_ID,
    twitch: process.env.TWITCH_CLIENT_ID,
    pinterest: process.env.PINTEREST_APP_ID,
    snapchat: process.env.SNAPCHAT_CLIENT_ID,
    reddit: process.env.REDDIT_CLIENT_ID,
    mastodon: process.env.MASTODON_CLIENT_ID,
    discord: process.env.DISCORD_CLIENT_ID,
    tumblr: process.env.TUMBLR_CLIENT_ID,
    wordpress: process.env.WORDPRESS_CLIENT_ID
  }
  return env[platform]
}

// Bluesky and Telegram use manual credential connection routes.
const MANUAL_CONNECT_PLATFORMS = new Set(['bluesky', 'telegram'])

const PLATFORM_OAUTH_URLS: Record<string, (redirectUri: string, state: string) => string> = {
  instagram: (redirectUri, state) => {
    const clientId = process.env.FACEBOOK_APP_ID
    if (!clientId) throw new Error('FACEBOOK_APP_ID not configured')
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement&state=${state}`
  },
  facebook: (redirectUri, state) => {
    const clientId = process.env.FACEBOOK_APP_ID
    if (!clientId) throw new Error('FACEBOOK_APP_ID not configured')
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_show_list,pages_manage_posts,pages_read_engagement&state=${state}`
  },
  threads: (redirectUri, state) => {
    const clientId = process.env.FACEBOOK_APP_ID
    if (!clientId) throw new Error('FACEBOOK_APP_ID not configured')
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=threads_basic,threads_content_publish&state=${state}`
  },
  twitter: (redirectUri, state) => {
    const clientId = process.env.TWITTER_CLIENT_ID
    if (!clientId) throw new Error('TWITTER_CLIENT_ID not configured')
    return `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20tweet.write%20users.read&response_type=code&state=${state}`
  },
  linkedin: (redirectUri, state) => {
    const clientId = process.env.LINKEDIN_CLIENT_ID
    if (!clientId) throw new Error('LINKEDIN_CLIENT_ID not configured')
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social&state=${state}`
  },
  tiktok: (redirectUri, state) => {
    const clientId = process.env.TIKTOK_CLIENT_KEY
    if (!clientId) throw new Error('TIKTOK_CLIENT_KEY not configured')
    return `https://www.tiktok.com/v2/auth/authorize?client_key=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.info.basic,video.upload&response_type=code&state=${state}`
  },
  youtube: (redirectUri, state) => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) throw new Error('GOOGLE_CLIENT_ID not configured')
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code&state=${state}`
  },
  twitch: (redirectUri, state) => {
    const clientId = process.env.TWITCH_CLIENT_ID
    if (!clientId) throw new Error('TWITCH_CLIENT_ID not configured')
    return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user:read:email&state=${state}`
  },
  pinterest: (redirectUri, state) => {
    const clientId = process.env.PINTEREST_APP_ID
    if (!clientId) throw new Error('PINTEREST_APP_ID not configured')
    return `https://www.pinterest.com/oauth/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_accounts:read,pins:read,pins:write,boards:read,boards:write&response_type=code&state=${state}`
  },
  snapchat: (redirectUri, state) => {
    const clientId = process.env.SNAPCHAT_CLIENT_ID
    if (!clientId) throw new Error('SNAPCHAT_CLIENT_ID not configured')
    return `https://accounts.snapchat.com/accounts/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snapchat-marketing-api&state=${state}`
  },
  reddit: (redirectUri, state) => {
    const clientId = process.env.REDDIT_CLIENT_ID
    if (!clientId) throw new Error('REDDIT_CLIENT_ID not configured')
    return `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}&duration=permanent&scope=identity,submit,read`
  },
  mastodon: (redirectUri, state) => {
    const clientId = process.env.MASTODON_CLIENT_ID
    const instanceUrl = process.env.MASTODON_INSTANCE_URL
    if (!clientId) throw new Error('MASTODON_CLIENT_ID not configured')
    if (!instanceUrl) throw new Error('MASTODON_INSTANCE_URL not configured')
    return `${instanceUrl.replace(/\/$/, '')}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('read write')}&state=${state}`
  },
  discord: (redirectUri, state) => {
    const clientId = process.env.DISCORD_CLIENT_ID
    if (!clientId) throw new Error('DISCORD_CLIENT_ID not configured')
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=bot%20identify&permissions=2048&state=${state}`
  },
  tumblr: (redirectUri, state) => {
    const clientId = process.env.TUMBLR_CLIENT_ID
    if (!clientId) throw new Error('TUMBLR_CLIENT_ID not configured')
    return `https://www.tumblr.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=write%20offline_access&state=${state}`
  },
  wordpress: (redirectUri, state) => {
    const clientId = process.env.WORDPRESS_CLIENT_ID
    if (!clientId) throw new Error('WORDPRESS_CLIENT_ID not configured')
    return `https://public-api.wordpress.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=global&state=${state}`
  }
}

function createTwitterPkce() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  return { codeVerifier, codeChallenge }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
    const tokenFromQuery = request.nextUrl.searchParams.get('token')
    const token = tokenFromHeader || tokenFromQuery
    const user = token
      ? await verifyToken(token)
      : await verifyAuth(request)
    if (!user) {
      const baseUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'
      return NextResponse.redirect(`${baseUrl}/dashboard?tab=connections&error=connect_unauthorized`)
    }

    const { platform: platformParam } = await params
    const platform = platformParam.toLowerCase()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'

    if (MANUAL_CONNECT_PLATFORMS.has(platform)) {
      return NextResponse.redirect(`${baseUrl}/dashboard?tab=connections&manualConnect=${platform}`)
    }
    
    if (!PLATFORM_OAUTH_URLS[platform]) {
      return NextResponse.json({ 
        error: 'Invalid platform. Supported: instagram, facebook, threads, twitter, linkedin, tiktok, youtube, twitch, pinterest, snapchat, reddit, bluesky, mastodon, discord, telegram, tumblr, wordpress' 
      }, { status: 400 })
    }

    if (!getPlatformClientId(platform)) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=platform_not_configured&platform=${platform}`
      )
    }

    const redirectUri = `${baseUrl}/api/auth/callback/${platform}`
    const pkce = platform === 'twitter' ? createTwitterPkce() : null
    const state = Buffer.from(JSON.stringify({
      userId: user.userId,
      ...(pkce ? { codeVerifier: pkce.codeVerifier } : {})
    })).toString('base64')

    let oauthUrl = PLATFORM_OAUTH_URLS[platform](redirectUri, state)
    if (pkce) {
      oauthUrl += `&code_challenge=${pkce.codeChallenge}&code_challenge_method=S256`
    }

    // If token was in URL (direct navigation), redirect to OAuth so user never sees JSON. Otherwise return JSON for fetch-based flow.
    if (tokenFromQuery) {
      return NextResponse.redirect(oauthUrl)
    }
    return NextResponse.json({ url: oauthUrl })
  } catch (error: any) {
    console.error('OAuth initiation error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=oauth_failed&message=${encodeURIComponent(error.message)}`
    )
  }
}

