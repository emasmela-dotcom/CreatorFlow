import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  createBrandOpportunity,
  getActiveOpportunities,
  applyToOpportunity,
  getUserCollaborations
} from '@/lib/collaborationMarketplace'

export const dynamic = 'force-dynamic'

/**
 * GET - Get opportunities or user collaborations
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'opportunities') {
      const limit = parseInt(searchParams.get('limit') || '20')
      const opportunities = await getActiveOpportunities(limit)
      return NextResponse.json({ success: true, opportunities })
    }

    if (type === 'collaborations') {
      const collaborations = await getUserCollaborations(user.userId)
      return NextResponse.json({ success: true, collaborations })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error: any) {
    console.error('Collaboration marketplace error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get marketplace data' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create opportunity or apply
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create-opportunity') {
      const id = await createBrandOpportunity(data)
      return NextResponse.json({ success: true, id })
    }

    if (action === 'apply') {
      const id = await applyToOpportunity(user.userId, data.opportunityId)
      return NextResponse.json({ success: true, id })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Collaboration marketplace error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}

