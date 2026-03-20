import { google } from 'googleapis'
import { Readable } from 'stream'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creatorflow365.com'}/api/auth/callback/youtube`
)

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const tokenResult = await db.execute({
    sql: `
      SELECT access_token, refresh_token, token_expires_at
      FROM platform_connections
      WHERE user_id = ? AND platform = 'youtube' AND is_active = TRUE
      LIMIT 1
    `,
    args: [user.userId]
  })

  if (tokenResult.rows.length === 0) {
    return NextResponse.json({ error: 'YouTube not connected' }, { status: 403 })
  }

  const tokenRow = tokenResult.rows[0] as {
    access_token: string
    refresh_token: string | null
    token_expires_at: string | Date | null
  }

  oauth2Client.setCredentials({
    access_token: tokenRow.access_token,
    refresh_token: tokenRow.refresh_token || undefined,
    expiry_date: tokenRow.token_expires_at ? new Date(tokenRow.token_expires_at).getTime() : undefined
  })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const title = (formData.get('title') as string) || 'Untitled'
  const description = (formData.get('description') as string) || ''
  const privacyStatus = ((formData.get('privacyStatus') as string) || 'private') as 'private' | 'public' | 'unlisted'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const stream = Readable.from(buffer)

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client })
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus }
      },
      media: {
        mimeType: file.type || 'video/mp4',
        body: stream
      }
    })

    const videoId = response.data.id
    return NextResponse.json(
      {
        success: true,
        videoId,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('YouTube upload failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
