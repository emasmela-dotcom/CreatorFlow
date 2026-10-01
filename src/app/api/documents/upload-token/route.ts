import { NextRequest, NextResponse } from 'next/server'
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const blobToken = process.env.VIDEO_BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    return NextResponse.json({ error: 'Video save is not set up' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const filename =
      typeof body.filename === 'string' && body.filename.trim()
        ? body.filename.trim()
        : 'video.mp4'
    const size = Number(body.size) || 0
    const maxBytes = 100 * 1024 * 1024
    if (size > maxBytes) {
      return NextResponse.json({ error: 'That video is over 100MB. Record a shorter clip.' }, { status: 400 })
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 80) || 'video.mp4'
    const pathname = `documents/${user.userId}/${crypto.randomUUID()}-${safeName}`

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: blobToken,
      pathname,
      maximumSizeInBytes: maxBytes,
    })

    return NextResponse.json({
      success: true,
      token: clientToken,
      pathname,
    })
  } catch (err: unknown) {
    console.error('Video upload token error:', err)
    const message = err instanceof Error ? err.message : 'Could not save the video'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
