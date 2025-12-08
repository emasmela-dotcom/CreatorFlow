import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  createContentSeries,
  generateSeriesPosts,
  saveSeriesPosts,
  getUserContentSeries
} from '@/lib/contentSeries'

export const dynamic = 'force-dynamic'

/**
 * GET - Get user's content series
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const series = await getUserContentSeries(user.userId)
    return NextResponse.json({ success: true, series })
  } catch (error: any) {
    console.error('Content series error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get content series' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create content series
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { series, generatePosts } = await request.json()

    const seriesId = await createContentSeries(user.userId, series)

    if (generatePosts) {
      const posts = await generateSeriesPosts(seriesId, series.topic, series.totalParts)
      await saveSeriesPosts(posts)
    }

    return NextResponse.json({ success: true, seriesId })
  } catch (error: any) {
    console.error('Content series creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create content series' },
      { status: 500 }
    )
  }
}

