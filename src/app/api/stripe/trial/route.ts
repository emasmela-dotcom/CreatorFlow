import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-09-30.clover',
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Plan price IDs in Stripe (you'll need to set these up in Stripe Dashboard)
const PLAN_PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter',
  growth: process.env.STRIPE_PRICE_GROWTH || 'price_growth',
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro',
  business: process.env.STRIPE_PRICE_BUSINESS || 'price_business',
  agency: process.env.STRIPE_PRICE_AGENCY || 'price_agency',
}

/**
 * Create Stripe checkout session with trial period
 * Free 14-day trial (no charge during trial)
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

    const { planType } = await request.json()

    if (!planType || !['starter', 'growth', 'pro', 'business', 'agency'].includes(planType)) {
      return NextResponse.json({ error: 'Valid plan type is required' }, { status: 400 })
    }

    const priceId = PLAN_PRICE_IDS[planType]

    if (!priceId) {
      return NextResponse.json({ error: `Price ID not configured for plan: ${planType}` }, { status: 400 })
    }

    // Get or create Stripe customer
    let customer
    try {
      // Check if customer already exists (you might want to store stripe_customer_id in your DB)
      // For now, we'll create a new customer each time
      customer = await stripe.customers.create({
        email: decoded.email,
        metadata: {
          userId: decoded.userId,
          planType: planType,
        },
      })
    } catch (error: any) {
      return NextResponse.json({ error: `Failed to create customer: ${error.message}` }, { status: 500 })
    }

    // Create checkout session with free trial period (14 days)
    const trialPeriodDays = 14
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: trialPeriodDays,
        metadata: {
          userId: decoded.userId,
          planType: planType,
          trial_started_at: new Date().toISOString(),
        },
      },
      // Allow customers to set up payment method without immediate charge
      payment_method_collection: 'always', // Require payment method for trial
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/trial-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signup?canceled=true&plan=${planType}`,
      metadata: {
        userId: decoded.userId,
        planType: planType,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      trialDays: trialPeriodDays,
    })
  } catch (error: any) {
    console.error('Stripe trial checkout error:', error)
    return NextResponse.json({ error: error.message || 'Payment processing failed' }, { status: 500 })
  }
}

