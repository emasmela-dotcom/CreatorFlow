import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getUserProfileTooltip } from '@/lib/userProfile'

export const dynamic = 'force-dynamic'

/**
 * GET - Get user profile for tooltip
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const profile = await getUserProfileTooltip(userId)

    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error: any) {
    console.error('Profile tooltip error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get profile' },
      { status: 500 }
    )
  }
}

