import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const identifier = body?.identifier as string | undefined
  const appPassword = body?.appPassword as string | undefined

  if (!identifier || !appPassword) {
    return NextResponse.json(
      { error: 'Bluesky handle (identifier) and app password are required' },
      { status: 400 }
    )
  }

  const service = process.env.BLUESKY_SERVICE_URL || 'https://bsky.social'

  try {
    const response = await fetch(`${service}/xrpc/com.atproto.server.createSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password: appPassword })
    })

    const data = await response.json().catch(() => null)
    if (!response.ok || !data?.accessJwt || !data?.did) {
      return NextResponse.json(
        { error: data?.message || 'Bluesky rejected those credentials. Check your handle and app password.' },
        { status: 400 }
      )
    }

    await db.execute({
      sql: `
        INSERT INTO platform_connections
        (user_id, platform, access_token, refresh_token, token_expires_at,
         platform_user_id, platform_username, platform_account_name, is_active, updated_at)
        VALUES (?, 'bluesky', ?, ?, NULL, ?, ?, ?, TRUE, NOW())
        ON CONFLICT (user_id, platform)
        DO UPDATE SET
          access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          platform_user_id = EXCLUDED.platform_user_id,
          platform_username = EXCLUDED.platform_username,
          platform_account_name = EXCLUDED.platform_account_name,
          is_active = TRUE,
          updated_at = NOW()
      `,
      args: [
        user.userId,
        data.accessJwt,
        data.refreshJwt || null,
        data.did,
        data.handle || identifier,
        data.handle || identifier
      ]
    })

    return NextResponse.json({ success: true, platform: 'bluesky', handle: data.handle })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to connect Bluesky' }, { status: 500 })
  }
}
