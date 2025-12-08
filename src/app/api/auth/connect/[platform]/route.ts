import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * OAuth Connection Route
 * Initiates OAuth flow for connecting social media platforms
 */

const PLATFORM_OAUTH_URLS: Record<string, (redirectUri: string, state: string) => string> = {
  instagram: (redirectUri, state) => {
    const clientId = process.env.FACEBOOK_APP_ID
    if (!clientId) {
      throw new Error('FACEBOOK_APP_ID not configured')
    }
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,pages_show_list&state=${state}`
  },
  twitter: (redirectUri, state) => {
    const clientId = process.env.TWITTER_CLIENT_ID
    if (!clientId) {
      throw new Error('TWITTER_CLIENT_ID not configured')
    }
    return `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20tweet.write%20users.read&response_type=code&state=${state}`
  },
  linkedin: (redirectUri, state) => {
    const clientId = process.env.LINKEDIN_CLIENT_ID
    if (!clientId) {
      throw new Error('LINKEDIN_CLIENT_ID not configured')
    }
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social&state=${state}`
  },
  tiktok: (redirectUri, state) => {
    const clientId = process.env.TIKTOK_CLIENT_KEY
    if (!clientId) {
      throw new Error('TIKTOK_CLIENT_KEY not configured')
    }
    return `https://www.tiktok.com/v2/auth/authorize?client_key=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.info.basic,video.upload&response_type=code&state=${state}`
  },
  youtube: (redirectUri, state) => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID not configured')
    }
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code&state=${state}`
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { platform: platformParam } = await params
    const platform = platformParam.toLowerCase()
    
    if (!PLATFORM_OAUTH_URLS[platform]) {
      return NextResponse.json({ 
        error: 'Invalid platform. Supported: instagram, twitter, linkedin, tiktok, youtube' 
      }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/auth/callback/${platform}`
    const state = Buffer.from(JSON.stringify({ userId: user.userId })).toString('base64')

    const oauthUrl = PLATFORM_OAUTH_URLS[platform](redirectUri, state)

    return NextResponse.redirect(oauthUrl)
  } catch (error: any) {
    console.error('OAuth initiation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to initiate OAuth flow' 
    }, { status: 500 })
  }
}

