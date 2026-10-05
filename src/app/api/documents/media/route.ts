import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function guessType(filename?: string | null): string {
  const name = filename || ''
  if (/\.webm$/i.test(name)) return 'video/webm'
  if (/\.mp4$/i.test(name)) return 'video/mp4'
  if (/\.(jpe?g)$/i.test(name)) return 'image/jpeg'
  if (/\.png$/i.test(name)) return 'image/png'
  return 'video/mp4'
}

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const result = await db.execute({
    sql: 'SELECT video_url, video_filename FROM documents WHERE id = ? AND user_id = ?',
    args: [id, user.userId],
  })
  const row = result.rows[0] as { video_url?: string | null; video_filename?: string | null } | undefined
  if (!row?.video_url) {
    return NextResponse.json({ error: 'No video' }, { status: 404 })
  }

  const remote = await fetch(row.video_url)
  if (!remote.ok || !remote.body) {
    return NextResponse.json({ error: 'Could not load video' }, { status: 502 })
  }

  const remoteType = remote.headers.get('content-type') || ''
  const contentType = remoteType.startsWith('video/') || remoteType.startsWith('image/')
    ? remoteType
    : guessType(row.video_filename)

  return new NextResponse(remote.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store',
    },
  })
}
