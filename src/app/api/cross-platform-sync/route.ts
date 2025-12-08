import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { createSyncGroup, syncToPlatforms } from '@/lib/crossPlatformSync'

export const dynamic = 'force-dynamic'

/**
 * POST - Create sync group and sync to platforms
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { masterPostId, platforms, content, mediaUrls } = await request.json()

    if (!masterPostId || !platforms || !Array.isArray(platforms)) {
      return NextResponse.json(
        { error: 'masterPostId and platforms array are required' },
        { status: 400 }
      )
    }

    // Create sync group
    const syncGroupId = await createSyncGroup(user.userId, masterPostId, platforms)

    // Sync to all platforms
    const syncResult = await syncToPlatforms(
      user.userId,
      syncGroupId,
      content || '',
      mediaUrls || []
    )

    return NextResponse.json({
      success: syncResult.success,
      syncGroupId,
      results: syncResult.results
    })
  } catch (error: any) {
    console.error('Cross-platform sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync to platforms' },
      { status: 500 }
    )
  }
}

