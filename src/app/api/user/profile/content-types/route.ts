import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getUserContentTypes, updateUserContentTypes, CONTENT_TYPES } from '@/lib/userProfile'

export const dynamic = 'force-dynamic'

/**
 * GET - Get user's content types
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.userId

    const contentTypes = await getUserContentTypes(userId)

    return NextResponse.json({
      success: true,
      contentTypes,
      availableTypes: CONTENT_TYPES
    })
  } catch (error: any) {
    console.error('Content types error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get content types' },
      { status: 500 }
    )
  }
}

/**
 * POST - Update user's content types
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

