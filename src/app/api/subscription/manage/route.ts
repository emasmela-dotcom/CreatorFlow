import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-09-30.clover',
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Get user's subscription status
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user from database
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]
    const stripeCustomerId = user.stripe_customer_id as string

    let subscription = null
    let isInTrial = false
    let trialEndsAt = null
    let daysRemaining = null

    if (stripeCustomerId) {
      // Get active subscriptions from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'all',
        limit: 1,
      })

      if (subscriptions.data.length > 0) {
        subscription = subscriptions.data[0]
        
        // Check if in trial
        if (subscription.status === 'trialing' && subscription.trial_end) {
          isInTrial = true
          trialEndsAt = new Date(subscription.trial_end * 1000).toISOString()
          const now = Date.now()
          const trialEnd = subscription.trial_end * 1000
          daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
        }
      }
    }

    // Calculate from database if no Stripe subscription yet
    if (!isInTrial && user.trial_end_at) {
      const trialEnd = new Date(user.trial_end_at as string).getTime()
      const now = Date.now()
      if (trialEnd > now) {
        isInTrial = true
        trialEndsAt = user.trial_end_at as string
        daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
      }
    }

    return NextResponse.json({
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
      } : null,
      isInTrial,
      trialEndsAt,
      daysRemaining,
      plan: user.subscription_tier,
      trialPlan: user.trial_plan,
    })
  } catch (error: any) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch subscription' }, { status: 500 })
  }
}

/**
 * Cancel subscription (triggers restore process)
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user from database
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]
    const stripeCustomerId = user.stripe_customer_id as string

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 })
    }

    // Cancel subscription in Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      await stripe.subscriptions.cancel(subscriptions.data[0].id)
    }

    // Update user in database
    await db.execute({
      sql: `UPDATE users 
            SET subscription_tier = NULL,
                updated_at = ?
            WHERE id = ?`,
      args: [new Date().toISOString(), decoded.userId]
    })

    // Trigger restore process
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('Restore trigger failed:', error)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Subscription canceled. Your project has been restored to its original state.',
    })
  } catch (error: any) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to cancel subscription' }, { status: 500 })
  }
}

