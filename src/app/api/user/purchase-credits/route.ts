import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CREDIT_BUNDLES } from '@/lib/creditBundles'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-09-30.clover',
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * GET - Get user's current credits balance and available bundles
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

    const userResult = await db.execute({
      sql: 'SELECT credits_balance FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const creditsBalance = (userResult.rows[0] as { credits_balance: number | null }).credits_balance ?? 0

    return NextResponse.json({
      creditsBalance,
      bundles: CREDIT_BUNDLES,
    })
  } catch (error: any) {
    console.error('Get credits info error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get credits info' }, { status: 500 })
  }
}

/**
 * POST - Create Stripe Checkout session for a credit bundle
 * Body: { bundle: 'starter' | 'popular' | 'power' }
 */
export async function POST(request: NextRequest) {
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

    const { bundle } = await request.json()

    const bundleConfig = CREDIT_BUNDLES.find(b => b.id === bundle)
    if (!bundleConfig) {
      return NextResponse.json({ error: 'Invalid bundle. Use starter, popular, or power.' }, { status: 400 })
    }

    const userResult = await db.execute({
      sql: 'SELECT stripe_customer_id FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stripeCustomerId = (userResult.rows[0] as { stripe_customer_id: string | null }).stripe_customer_id
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId || undefined,
      customer_email: stripeCustomerId ? undefined : decoded.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bundleConfig.name} - ${bundleConfig.credits} credits`,
              description: bundleConfig.description,
            },
            unit_amount: Math.round(bundleConfig.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/dashboard?credits=success&credits=${bundleConfig.credits}`,
      cancel_url: `${appUrl}/dashboard?credits=canceled`,
      metadata: {
        userId: decoded.userId,
        type: 'credit_bundle',
        bundle: bundleConfig.id,
        credits: bundleConfig.credits.toString(),
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      bundle: bundleConfig.id,
      credits: bundleConfig.credits,
      price: bundleConfig.price,
    })
  } catch (error: any) {
    console.error('Purchase credits error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 })
  }
}
