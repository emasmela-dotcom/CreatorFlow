import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
    return NextResponse.json({ error: 'Snapchat not connected' }, { status: 403 })
  }

  const publishEndpoint = process.env.SNAPCHAT_PUBLISH_ENDPOINT
  if (!publishEndpoint) {
    return NextResponse.json(
      { error: 'SNAPCHAT_PUBLISH_ENDPOINT is not configured' },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const caption = ((formData.get('caption') as string) || '').slice(0, 250)

  if (!file) {
    return NextResponse.json({ error: 'No media file provided' }, { status: 400 })
  }

  const tokenRow = tokenResult.rows[0] as { access_token: string }
  const payload = new FormData()
  payload.append('caption', caption)
  payload.append(
    'media',
    new Blob([await file.arrayBuffer()], { type: file.type || 'application/octet-stream' }),
    file.name || 'snapchat-media'
  )

  if (process.env.SNAPCHAT_PROFILE_ID) {
    payload.append('profile_id', process.env.SNAPCHAT_PROFILE_ID)
  }

  try {
    const response = await fetch(publishEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenRow.access_token}`
      },
      body: payload
    })

    const responseText = await response.text()
    let data: any = null
    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch {
      data = { raw: responseText }
    }

    const snapPostId = data?.id || data?.post_id || data?.post?.id || null
    if (!response.ok || !snapPostId) {
      return NextResponse.json(
        {
          error:
            data?.error_description ||
            data?.message ||
            data?.error ||
            'Snapchat API rejected the upload'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        postId: snapPostId,
        platformPostId: snapPostId
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Snapchat upload failed' }, { status: 500 })
  }
}
