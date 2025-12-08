import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getOptimizedHashtags, trackHashtagPerformance } from '@/lib/hashtagOptimizer'

export const dynamic = 'force-dynamic'

/**
 * GET - Get optimized hashtags
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const content = searchParams.get('content')
    const count = parseInt(searchParams.get('count') || '10')

    if (!platform || !content) {
      return NextResponse.json(
        { error: 'Platform and content are required' },
        { status: 400 }
      )
    }

    const hashtags = await getOptimizedHashtags(user.userId, platform, content, count)
    return NextResponse.json({ success: true, hashtags })
  } catch (error: any) {
    console.error('Hashtag optimizer error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get optimized hashtags' },
      { status: 500 }
    )
  }
}

/**
 * POST - Track hashtag performance
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    await trackHashtagPerformance(user.userId, postId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Hashtag tracking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track hashtag performance' },
      { status: 500 }
    )
  }
}

