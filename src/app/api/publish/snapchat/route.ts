import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const SNAPCHAT_API_BASE = 'https://businessapi.snapchat.com'

async function snapchatApi(
  accessToken: string,
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = path.startsWith('http')
    ? path
    : `${SNAPCHAT_API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)
  const body = options.body
  if (body && typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Snapchat API ${res.status}: ${text}`)
  }
  return text ? JSON.parse(text) : {}
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated', success: false }, { status: 401 })
  }

  const profileId = process.env.SNAPCHAT_PROFILE_ID
  if (!profileId) {
    return NextResponse.json(
      { error: 'SNAPCHAT_PROFILE_ID is not configured', success: false },
      { status: 500 }
    )
  }

  const tokenResult = await db.execute({
    sql: `
      SELECT access_token
      FROM platform_connections
      WHERE user_id = ? AND platform = 'snapchat' AND is_active = TRUE
      LIMIT 1
    `,
    args: [user.userId]
  })

  if (tokenResult.rows.length === 0) {
    return NextResponse.json({ error: 'Snapchat not connected', success: false }, { status: 403 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message?.includes('Entity') || error?.message?.includes('size')
            ? 'Media file too large for upload. Use a smaller image or shorter video.'
            : error?.message || 'Could not read upload',
        success: false
      },
      { status: 413 }
    )
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No media file provided', success: false }, { status: 400 })
  }

  // Keep uploads small for Vercel request limits (~4.5MB on many plans)
  const maxBytes = 4 * 1024 * 1024
  if (typeof file.size === 'number' && file.size > maxBytes) {
    return NextResponse.json(
      {
        error: 'Media file too large. Use an image under about 4 MB (or a short small video).',
        success: false
      },
      { status: 413 }
    )
  }

  const tokenRow = tokenResult.rows[0] as { access_token: string }
  const accessToken = tokenRow.access_token
  const mediaBuffer = await file.arrayBuffer()
  const contentType = file.type || 'application/octet-stream'
  const mediaType = contentType.startsWith('video/') ? 'VIDEO' : 'IMAGE'

  try {
    const createJson = await snapchatApi(
      accessToken,
      `/v1/public_profiles/${profileId}/media`,
      {
        method: 'POST',
        body: JSON.stringify({ media_type: mediaType })
      }
    )
    const media = createJson.media || createJson
    const mediaId = media?.id as string | undefined
    const addPath = media?.add_path as string | undefined
    const finalizePath = media?.finalize_path as string | undefined
    if (!mediaId || !addPath) {
      throw new Error('Snapchat media creation response missing id or add_path')
    }

    const uploadForm = new FormData()
    uploadForm.append('file', new Blob([mediaBuffer], { type: contentType }), file.name || 'snapchat-media')
    await snapchatApi(accessToken, addPath, { method: 'POST', body: uploadForm })

    if (finalizePath) {
      await snapchatApi(accessToken, finalizePath, { method: 'POST' })
    }

    const storyJson = await snapchatApi(
      accessToken,
      `/v1/public_profiles/${profileId}/stories`,
      {
        method: 'POST',
        body: JSON.stringify({ media_id: mediaId })
      }
    )
    const storyId = storyJson.story?.id || storyJson.id || mediaId

    return NextResponse.json(
      {
        success: true,
        postId: storyId,
        platformPostId: storyId
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Snapchat upload failed', success: false },
      { status: 500 }
    )
  }
}
