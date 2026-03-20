import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const tokenFromQuery = request.nextUrl.searchParams.get('token')
  const token = tokenFromHeader || tokenFromQuery
  const user = token ? await verifyToken(token) : await verifyAuth(request)

  if (!user) {
    const baseUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'
    return NextResponse.redirect(`${baseUrl}/dashboard?tab=connections&error=connect_unauthorized`)
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'YouTube OAuth not configured' }, { status: 500 })
  }

  // IMPORTANT: use the current origin/port so local callbacks work.
  const redirectUri = `${request.nextUrl.origin}/api/auth/callback/youtube`

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  const state = Buffer.from(JSON.stringify({ userId: user.userId })).toString('base64')
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ],
    redirect_uri: redirectUri,
    state
  })

  return NextResponse.redirect(url)
}
