import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getTeamActivityLogs } from '@/lib/teamCollaboration'

export const dynamic = 'force-dynamic'

/**
 * GET - Get team activity logs
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
    }

    const activity = await getTeamActivityLogs(parseInt(teamId), limit)

    return NextResponse.json({
      success: true,
      activity
    })
  } catch (error: any) {
    console.error('Get team activity error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get team activity'
    }, { status: 500 })
  }
}

