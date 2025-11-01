import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Start trial for user with selected plan
 */
export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify token
    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { subscription_tier, trial_plan, trial_started_at, trial_end_at } = await request.json()

    if (!subscription_tier || !trial_plan || !trial_started_at || !trial_end_at) {
      return NextResponse.json({ 
        error: 'Missing required fields: subscription_tier, trial_plan, trial_started_at, trial_end_at' 
      }, { status: 400 })
    }

    // Validate plan types
    const validPlans = ['starter', 'growth', 'pro', 'business', 'agency']
    if (!validPlans.includes(subscription_tier) || !validPlans.includes(trial_plan)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // Update user with trial information
    const result = await db.execute({
      sql: `UPDATE users 
            SET subscription_tier = ?, 
                trial_plan = ?, 
                trial_started_at = ?, 
                trial_end_at = ?,
                updated_at = ?
            WHERE id = ?`,
      args: [
        subscription_tier,
        trial_plan,
        trial_started_at,
        trial_end_at,
        new Date().toISOString(),
        decoded.userId
      ]
    })

    // Verify update was successful
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]

    return NextResponse.json({ 
      success: true,
      message: 'Trial started successfully',
      user: {
        id: user.id,
        email: user.email,
        subscription_tier: user.subscription_tier,
        trial_plan: user.trial_plan,
        trial_started_at: user.trial_started_at,
        trial_end_at: user.trial_end_at
      }
    })
  } catch (error: any) {
    console.error('Trial start error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to start trial' 
    }, { status: 500 })
  }
}

