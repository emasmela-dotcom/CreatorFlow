import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET - Get user's connected platforms
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connections = await db.execute({
      sql: `
        SELECT 
          platform,
          platform_username,
          platform_account_name,
          is_active,
          created_at,
          last_used_at
        FROM platform_connections
        WHERE user_id = ? AND is_active = TRUE
        ORDER BY created_at DESC
      `,
      args: [user.userId]
    })

    return NextResponse.json({
      success: true,
      connections: connections.rows
    })
  } catch (error: any) {
    console.error('Get connections error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get connections'
    }, { status: 500 })
  }
}

/**
 * DELETE - Disconnect a platform
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    if (!platform) {
      return NextResponse.json({ error: 'Platform is required' }, { status: 400 })
    }

    await db.execute({
      sql: `
        UPDATE platform_connections
        SET is_active = FALSE, updated_at = NOW()
        WHERE user_id = ? AND platform = ?
      `,
      args: [user.userId, platform]
    })

    return NextResponse.json({
      success: true,
      message: 'Platform disconnected successfully'
    })
  } catch (error: any) {
    console.error('Disconnect platform error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to disconnect platform'
    }, { status: 500 })
  }
}

