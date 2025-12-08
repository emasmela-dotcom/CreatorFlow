import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  createTeam,
  getUserTeams,
  getTeamMembers,
  addTeamMember,
  hasTeamPermission
} from '@/lib/teamCollaboration'

export const dynamic = 'force-dynamic'

/**
 * Teams API
 * Manage teams, members, and collaboration
 */

/**
 * POST - Create team or add member
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'create-team') {
      const { name, description } = body

      if (!name) {
        return NextResponse.json({
          error: 'Team name is required'
        }, { status: 400 })
      }

      const team = await createTeam(user.userId, name, description)
      return NextResponse.json({
        success: true,
        team
      })
    } else if (action === 'add-member') {
      const { teamId, userId, role, permissions } = body

      if (!teamId || !userId) {
        return NextResponse.json({
          error: 'Team ID and user ID are required'
        }, { status: 400 })
      }

      // Check if user has permission to add members
      const canAdd = await hasTeamPermission(user.userId, teamId, 'manage_members')
      if (!canAdd) {
        return NextResponse.json({
          error: 'You do not have permission to add members'
        }, { status: 403 })
      }

      const member = await addTeamMember(
        teamId,
        userId,
        role || 'member',
        permissions
      )

      return NextResponse.json({
        success: true,
        member
      })
    } else {
      return NextResponse.json({
        error: 'Invalid action'
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Teams POST error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to process request'
    }, { status: 500 })
  }
}

/**
 * GET - Get user's teams or team members
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const type = searchParams.get('type') // 'teams' or 'members'

    if (type === 'members' && teamId) {
      const members = await getTeamMembers(parseInt(teamId))
      return NextResponse.json({
        success: true,
        members
      })
    } else {
      // Get user's teams
      const teams = await getUserTeams(user.userId)
      return NextResponse.json({
        success: true,
        teams
      })
    }
  } catch (error: any) {
    console.error('Teams GET error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get teams'
    }, { status: 500 })
  }
}

