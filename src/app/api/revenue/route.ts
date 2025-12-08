import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  getRevenueSources,
  addRevenueSource,
  addRevenueTransaction,
  getRevenueSummary
} from '@/lib/revenueTracker'

export const dynamic = 'force-dynamic'

/**
 * GET - Get revenue data
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'sources') {
      const sources = await getRevenueSources(user.userId)
      return NextResponse.json({ success: true, sources })
    }

    if (type === 'summary') {
      const startDate = searchParams.get('startDate') || undefined
      const endDate = searchParams.get('endDate') || undefined
      const summary = await getRevenueSummary(user.userId, startDate, endDate)
      return NextResponse.json({ success: true, summary })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error: any) {
    console.error('Revenue API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get revenue data' },
      { status: 500 }
    )
  }
}

/**
 * POST - Add revenue source or transaction
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, ...data } = body

    if (type === 'source') {
      const id = await addRevenueSource(user.userId, data)
      return NextResponse.json({ success: true, id })
    }

    if (type === 'transaction') {
      const id = await addRevenueTransaction(user.userId, data)
      return NextResponse.json({ success: true, id })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    console.error('Revenue API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add revenue data' },
      { status: 500 }
    )
  }
}

