import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'}/api/auth/callback/youtube`
)

export async function GET(request: NextRequest) {
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const tokenFromQuery = request.nextUrl.searchParams.get('token')
  const token = tokenFromHeader || tokenFromQuery
  const user = token ? await verifyToken(token) : await verifyAuth(request)

  if (!user) {
    const baseUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'
    return NextResponse.redirect(`${baseUrl}/dashboard?tab=connections&error=connect_unauthorized`)
  }

  const state = Buffer.from(JSON.stringify({ userId: user.userId })).toString('base64')
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ],
    state
  })

  return NextResponse.redirect(url)
}
