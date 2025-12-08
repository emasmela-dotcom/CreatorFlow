import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { predictContentPerformance, savePrediction } from '@/lib/performancePredictor'

export const dynamic = 'force-dynamic'

/**
 * POST - Predict content performance
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, platform, postId } = await request.json()

    if (!content || !platform) {
      return NextResponse.json(
        { error: 'Content and platform are required' },
        { status: 400 }
      )
    }

    // Get prediction
    const prediction = await predictContentPerformance(
      user.userId,
      content,
      platform
    )

    // Save prediction (optional - don't fail if it errors)
    try {
      await savePrediction(user.userId, postId || null, content, platform, prediction)
    } catch (error) {
      console.error('Failed to save prediction:', error)
    }

    return NextResponse.json({
      success: true,
      prediction
    })
  } catch (error: any) {
    console.error('Performance prediction error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to predict performance' },
      { status: 500 }
    )
  }
}

