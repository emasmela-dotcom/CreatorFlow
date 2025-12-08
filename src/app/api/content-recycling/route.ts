import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { findRecyclableContent, getRecyclingQueue } from '@/lib/contentRecycling'

export const dynamic = 'force-dynamic'

/**
 * GET - Get recyclable content
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const queue = searchParams.get('queue') === 'true'

    if (queue) {
      const recyclingQueue = await getRecyclingQueue(user.userId)
      return NextResponse.json({ success: true, queue: recyclingQueue })
    }

    const recyclable = await findRecyclableContent(user.userId)
    return NextResponse.json({ success: true, recyclable })
  } catch (error: any) {
    console.error('Content recycling error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get recyclable content' },
      { status: 500 }
    )
  }
}

