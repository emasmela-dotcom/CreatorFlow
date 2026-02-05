import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug: is DATABASE_URL (or NEON_DATABASE_URL) set and valid-looking?
 * GET /api/debug/db-status?secret=CHECK_USER_SECRET
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CHECK_USER_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 404 })
  }
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 404 })
  }
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || ''
  const hasUrl = url.length > 0
  const startsOk = url.startsWith('postgresql://') || url.startsWith('postgres://')
  return NextResponse.json({
    db_configured: hasUrl,
    url_starts_ok: startsOk,
    ok: hasUrl && startsOk,
  })
}
