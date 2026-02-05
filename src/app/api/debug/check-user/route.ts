import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * One-off debug: check if a user exists in the same DB signup/signin use.
 * Only works when CHECK_USER_SECRET is set in env and ?secret= matches.
 * Remove or disable after fixing signin.
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
  const email = searchParams.get('email')?.trim()?.toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }
  try {
    const result = await db.execute({
      sql: 'SELECT id, email, created_at FROM users WHERE LOWER(TRIM(email)) = ?',
      args: [email],
    })
    const exists = result.rows.length > 0
    return NextResponse.json({
      exists,
      count: result.rows.length,
      ...(exists && result.rows[0] ? { id: (result.rows[0] as any).id, created_at: (result.rows[0] as any).created_at } : {}),
    })
  } catch (e) {
    console.error('check-user error:', e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
