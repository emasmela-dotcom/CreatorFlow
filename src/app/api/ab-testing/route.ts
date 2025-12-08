import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { createABTest, recordABTestResult, getABTestResults } from '@/lib/abTesting'

export const dynamic = 'force-dynamic'

/**
 * POST - Create A/B test or record results
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create') {
      const id = await createABTest(user.userId, data)
      return NextResponse.json({ success: true, id })
    }

    if (action === 'record') {
      await recordABTestResult(data.testGroupId, data.postId, data.variant, data.metrics)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('A/B testing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process A/B test' },
      { status: 500 }
    )
  }
}

/**
 * GET - Get A/B test results
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const testGroupId = parseInt(searchParams.get('testGroupId') || '0')

    if (!testGroupId) {
      return NextResponse.json({ error: 'testGroupId is required' }, { status: 400 })
    }

    const results = await getABTestResults(testGroupId)
    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('A/B test results error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get A/B test results' },
      { status: 500 }
    )
  }
}

