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
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: 'Could not read the video. Try again.' }, { status: 400 })
    }
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const type = file.type || (file.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/) ? 'image/jpeg' : 'video/mp4')
    if (!type.startsWith('video/') && !type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only photos and videos are allowed' },
        { status: 400 }
      )
    }

    const maxBytes = 100 * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json({ error: 'Max file size is 100MB' }, { status: 400 })
    }

    const uuid = crypto.randomUUID()
    const filename = file.name?.trim() || 'video.mp4'
    const pathname = `documents/${user.userId}/${uuid}-${filename}`

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: type,
      token: process.env.VIDEO_BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      success: true,
      video_url: blob.url,
      video_filename: filename,
      video_size_bytes: file.size,
    })
  } catch (err: unknown) {
    console.error('Video upload error:', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
