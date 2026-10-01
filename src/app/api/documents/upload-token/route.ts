import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const blobToken = process.env.VIDEO_BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    return NextResponse.json({ error: 'Video save is not set up' }, { status: 500 })
  }

  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: 'Could not start video save' }, { status: 400 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: blobToken,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const secret = process.env.JWT_SECRET
        if (!secret || !clientPayload) {
          throw new Error('Unauthorized')
        }
        jwt.verify(clientPayload, secret)
        return {
          maximumSizeInBytes: 100 * 1024 * 1024,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(jsonResponse)
  } catch (err: unknown) {
    console.error('Video upload token error:', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
