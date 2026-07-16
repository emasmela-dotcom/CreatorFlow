import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    return NextResponse.json(
      { error: 'Telegram direct posting requires TELEGRAM_BOT_TOKEN env var.' },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => null)
  const chatId = body?.chatId as string | undefined

  if (!chatId) {
    return NextResponse.json({ error: 'Telegram chat id is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${encodeURIComponent(chatId)}`)
    const data = await response.json().catch(() => null)

    if (!response.ok || !data?.ok) {
      return NextResponse.json(
        {
          error:
            data?.description ||
            'Telegram could not find that chat. Make sure the bot has been added as an admin.'
        },
        { status: 400 }
      )
    }

    const chatTitle = data.result?.title || data.result?.username || chatId

    await db.execute({
      sql: `
        INSERT INTO platform_connections
        (user_id, platform, access_token, refresh_token, token_expires_at,
         platform_user_id, platform_username, platform_account_name, is_active, updated_at)
        VALUES (?, 'telegram', ?, NULL, NULL, ?, ?, ?, TRUE, NOW())
        ON CONFLICT (user_id, platform)
        DO UPDATE SET
          access_token = EXCLUDED.access_token,
          platform_user_id = EXCLUDED.platform_user_id,
          platform_username = EXCLUDED.platform_username,
          platform_account_name = EXCLUDED.platform_account_name,
          is_active = TRUE,
          updated_at = NOW()
      `,
      args: [user.userId, botToken, chatId, chatTitle, chatTitle]
    })

    return NextResponse.json({ success: true, platform: 'telegram', chatTitle })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to connect Telegram' }, { status: 500 })
  }
}
