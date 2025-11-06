import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyAuth } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
})

// Price IDs from environment variables
const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  growth: process.env.STRIPE_PRICE_GROWTH || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  business: process.env.STRIPE_PRICE_BUSINESS || '',
  agency: process.env.STRIPE_PRICE_AGENCY || '',
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType } = await request.json()

    if (!planType || !PRICE_IDS[planType]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const priceId = PRICE_IDS[planType]

    // Get user from database to access full user data
    const { db } = await import('@/lib/db')
    const userResult = await db.execute({
      sql: 'SELECT id, email, stripe_customer_id FROM users WHERE id = ?',
      args: [authUser.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0] as { id: string, email: string, stripe_customer_id: string | null }

    // Get or create Stripe customer
    let customerId = user.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id.toString(),
        },
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await db.execute({
        sql: 'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
        args: [customerId, user.id]
      })
    }

    // Create checkout session with 15-day trial
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 15,
        metadata: {
          userId: user.id,
          planType: planType,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://creatorflow-iota.vercel.app'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://creatorflow-iota.vercel.app'}/signup?canceled=true`,
      metadata: {
        userId: user.id,
        planType: planType,
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error: any) {
    console.error('Stripe trial error:', error)
    return NextResponse.json({ 
      error: error.message || 'Payment processing failed' 
    }, { status: 500 })
  }
}
