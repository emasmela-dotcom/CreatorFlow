import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Meeting Scheduler Bot - Advanced meeting scheduling
 * Available for all tiers
 * Note: This complements the existing Scheduling Assistant Bot
 */

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * POST - Schedule a meeting
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check AI call limit
    const limitCheck = await canMakeAICall(user.userId)
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: limitCheck.message || 'AI call limit exceeded',
        current: limitCheck.current,
        limit: limitCheck.limit,
        upgradeRequired: true
      }, { status: 403 })
    }

    // All tiers can use Meeting Scheduler Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { title, description, startTime, endTime, attendees, location, meetingType } = body

    if (!title || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'Title, start time, and end time are required' 
      }, { status: 400 })
    }

    // Ensure table exists (fallback)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS scheduled_meetings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        attendees TEXT,
        location VARCHAR(255),
        meeting_type VARCHAR(50) DEFAULT 'standard',
        status VARCHAR(50) DEFAULT 'scheduled',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Create meeting
    const result = await db.execute({
      sql: `
        INSERT INTO scheduled_meetings (
          user_id, title, description, start_time, end_time,
          attendees, location, meeting_type, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        title,
        description || null,
        startTime,
        endTime,
        JSON.stringify(attendees || []),
        location || null,
        meetingType || 'standard'
      ]
    })

    // Log the AI call
    await logAICall(user.userId, 'Meeting Scheduler', '/api/bots/meeting-scheduler')

    return NextResponse.json({
      success: true,
      meeting: result.rows[0],
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Meeting Scheduler Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to schedule meeting' 
    }, { status: 500 })
  }
}

/**
 * GET - List scheduled meetings
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let sqlQuery = 'SELECT * FROM scheduled_meetings WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (status) {
      sqlQuery += ' AND status = ?'
      args.push(status)
    }

    sqlQuery += ' ORDER BY start_time DESC LIMIT ?'
    args.push(limit)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      meetings: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Meeting Scheduler Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch meetings' 
    }, { status: 500 })
  }
}

