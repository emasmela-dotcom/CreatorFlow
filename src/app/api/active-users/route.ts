import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { updateUserActivity, getActiveUsers, setUserVisibility } from '@/lib/activeUsers'

export const dynamic = 'force-dynamic'

/**
 * GET - Get active users
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update current user's activity
    await updateUserActivity(user.userId)

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const activeUsers = await getActiveUsers(limit)

    return NextResponse.json({
      success: true,
      activeUsers,
      count: activeUsers.length
    })
  } catch (error: any) {
    console.error('Active users error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get active users' },
      { status: 500 }
    )
  }
}

/**
 * POST - Update user visibility (opt-out)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isVisible } = await request.json()

    await setUserVisibility(user.userId, isVisible !== false)

    return NextResponse.json({
      success: true,
      message: isVisible ? 'You are now visible to others' : 'You are now hidden from Who\'s On'
    })
  } catch (error: any) {
    console.error('Visibility update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update visibility' },
      { status: 500 }
    )
  }
}

