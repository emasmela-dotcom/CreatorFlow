import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Only video files are allowed (mp4, mov, webm)' },
        { status: 400 }
      )
    }

    const maxBytes = 100 * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json({ error: 'Max file size is 100MB' }, { status: 400 })
    }

    const uuid = crypto.randomUUID()
    const pathname = `documents/${user.userId}/${uuid}-${file.name}`

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({
      success: true,
      video_url: blob.url,
      video_filename: file.name,
      video_size_bytes: file.size,
    })
  } catch (err: unknown) {
    console.error('Video upload error:', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
