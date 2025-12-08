import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  subscribeToTrends,
  getUserTrendSubscriptions,
  getUserTrendAlerts
} from '@/lib/trendAlerts'

export const dynamic = 'force-dynamic'

/**
 * GET - Get trend subscriptions or alerts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'subscriptions') {
      const subscriptions = await getUserTrendSubscriptions(user.userId)
      return NextResponse.json({ success: true, subscriptions })
    }

    if (type === 'alerts') {
      const limit = parseInt(searchParams.get('limit') || '20')
      const alerts = await getUserTrendAlerts(user.userId, limit)
      return NextResponse.json({ success: true, alerts })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error: any) {
    console.error('Trend alerts error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get trend data' },
      { status: 500 }
    )
  }
}

/**
 * POST - Subscribe to trends
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await request.json()
    const id = await subscribeToTrends(user.userId, subscription)

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error('Trend subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe to trends' },
      { status: 500 }
    )
  }
}

