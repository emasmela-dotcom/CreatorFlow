import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getUserProfileTooltip, updateUserContentTypes, getUserContentTypes, CONTENT_TYPES } from '@/lib/userProfile'

export const dynamic = 'force-dynamic'

/**
 * GET - Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.userId

    const profile = await getUserProfileTooltip(userId)

    return NextResponse.json({
      success: true,
      profile,
      availableContentTypes: CONTENT_TYPES
    })
  } catch (error: any) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get profile' },
      { status: 500 }
    )
  }
}

/**
 * POST - Update content types
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentTypes } = await request.json()

    if (!Array.isArray(contentTypes)) {
      return NextResponse.json(
        { error: 'contentTypes must be an array' },
        { status: 400 }
      )
    }

    if (contentTypes.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 content types allowed' },
        { status: 400 }
      )
    }

    await updateUserContentTypes(user.userId, contentTypes)

    return NextResponse.json({
      success: true,
      message: 'Content types updated successfully'
    })
  } catch (error: any) {
    console.error('Update content types error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update content types' },
      { status: 500 }
    )
  }
}

