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
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?error=oauth_cancelled`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?error=oauth_failed`
    )
  }

  try {
    // Decode state to get userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const userId = stateData.userId

    if (!userId) {
      throw new Error('Invalid state parameter')
    }

    const platform = params.platform.toLowerCase()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/auth/callback/${platform}`

    // Exchange code for access token (platform-specific)
    const tokenResponse = await exchangeCodeForToken(platform, code, redirectUri)
    
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
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?error=oauth_failed&message=${encodeURIComponent(error.message)}`
    )
  }
}

/**
 * Exchange OAuth code for access token (platform-specific)
 */
async function exchangeCodeForToken(
  platform: string,
  code: string,
  redirectUri: string
): Promise<TokenResponse> {
  const clientId = getClientId(platform)
  const clientSecret = getClientSecret(platform)

  switch (platform) {
    case 'instagram':
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
          redirect_uri: redirectUri
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
      return await linkedinResponse.json()

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
        // Instagram requires Facebook Page and Instagram Business Account
        // This is simplified - actual implementation needs more steps
        return { id: null, username: null, name: null }

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
    twitter: process.env.TWITTER_CLIENT_ID || '',
    linkedin: process.env.LINKEDIN_CLIENT_ID || '',
    tiktok: process.env.TIKTOK_CLIENT_KEY || '',
    youtube: process.env.GOOGLE_CLIENT_ID || ''
  }
  return envVars[platform] || ''
}

function getClientSecret(platform: string): string {
  const envVars: Record<string, string> = {
    instagram: process.env.FACEBOOK_APP_SECRET || '',
    twitter: process.env.TWITTER_CLIENT_SECRET || '',
    linkedin: process.env.LINKEDIN_CLIENT_SECRET || '',
    tiktok: process.env.TIKTOK_CLIENT_SECRET || '',
    youtube: process.env.GOOGLE_CLIENT_SECRET || ''
  }
  return envVars[platform] || ''
}

