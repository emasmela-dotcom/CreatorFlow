import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyAuth } from '@/lib/auth'

// Lazy initialize Stripe to avoid build-time errors
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey)
}

// Read price IDs at request time so Vercel Production env is always used (not cached at module load)
function getPriceIds(): Record<string, string> {
  return {
    free: '',
    starter: process.env.STRIPE_PRICE_STARTER || '',
    growth: process.env.STRIPE_PRICE_GROWTH || '',
    pro: process.env.STRIPE_PRICE_PRO || '',
    business: process.env.STRIPE_PRICE_BUSINESS || '',
    agency: process.env.STRIPE_PRICE_AGENCY || '',
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType: rawPlanType } = await request.json()
    const planType = typeof rawPlanType === 'string' ? rawPlanType.toLowerCase().trim() : ''

    if (!planType) {
      return NextResponse.json({ error: 'Plan type is required' }, { status: 400 })
    }

    // Handle FREE plan - no Stripe checkout needed
    if (planType === 'free') {
      // Update user to free plan directly
      const { db } = await import('@/lib/db')
      await db.execute({
        sql: 'UPDATE users SET subscription_tier = ? WHERE id = ?',
        args: ['free', authUser.userId]
      })
      return NextResponse.json({ 
        success: true,
        message: 'Free plan activated',
        redirect: '/dashboard'
      })
    }

    const PRICE_IDS = getPriceIds()
    const priceId = PRICE_IDS[planType]
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for plan "${planType}". Set STRIPE_PRICE_${planType.toUpperCase()} in Vercel Production.` },
        { status: 400 }
      )
    }

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
    const stripe = getStripe()
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

    // Create checkout session (subscription; trial can be added in Stripe Dashboard on the price)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        metadata: { userId: user.id, planType: planType },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/signup?canceled=true`,
      metadata: { userId: user.id, planType: planType },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL. Check price ID and Stripe Dashboard.' },
        { status: 500 }
      )
    }
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error: any) {
    const message = error?.message || String(error) || 'Payment processing failed'
    const code = error?.code ?? error?.type ?? ''
    const full = code ? `${message} (${code})` : message
    console.error('Stripe trial error:', full, error)
    return NextResponse.json({ error: full }, { status: 500 })
  }
}
