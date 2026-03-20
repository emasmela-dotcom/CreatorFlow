import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const oauthError = searchParams.get('error')
  // Force HTTP for local hosts (prevents ERR_SSL_PROTOCOL_ERROR).
  const isLocal =
    request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1'
  const protocol = isLocal ? 'http:' : request.nextUrl.protocol
  const baseUrl = `${protocol}//${request.nextUrl.host}` || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'

  if (oauthError) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_cancelled`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_failed`)
  }

  let userId = ''
  try {
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    userId = stateData.userId
  } catch {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_failed&message=invalid_state`)
  }

  if (!userId) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_failed&message=missing_user`)
  }

  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_failed&message=youtube_oauth_not_configured`)
    }

    // Use the redirect URI matching what we generated in connect.
    const redirectUri = `${protocol}//${request.nextUrl.host}/api/auth/callback/youtube`
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.access_token) {
      return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_failed&message=missing_access_token`)
    }

    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null

    await db.execute({
      sql: `
        INSERT INTO platform_connections
        (user_id, platform, access_token, refresh_token, token_expires_at, is_active, updated_at)
        VALUES (?, 'youtube', ?, ?, ?, TRUE, NOW())
        ON CONFLICT (user_id, platform)
        DO UPDATE SET
          access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          token_expires_at = EXCLUDED.token_expires_at,
          is_active = TRUE,
          updated_at = NOW()
      `,
      args: [userId, tokens.access_token, tokens.refresh_token || null, expiresAt]
    })

    return NextResponse.redirect(`${baseUrl}/dashboard?connected=youtube&success=true`)
  } catch (err) {
    console.error('YouTube OAuth exchange failed:', err)
    return NextResponse.redirect(`${baseUrl}/dashboard?error=oauth_failed&message=youtube_exchange_failed`)
  }
}
