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

function errMsg(e: any): string {
  const m = e?.message || String(e)
  const c = e?.code ?? e?.type ?? ''
  return c ? `${m} [${c}]` : m
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let rawPlanType: unknown
    try {
      const body = await request.json()
      rawPlanType = body && typeof body === 'object' && 'planType' in body ? (body as { planType?: unknown }).planType : undefined
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const planType = typeof rawPlanType === 'string' ? rawPlanType.toLowerCase().trim() : ''
    if (!planType) {
      return NextResponse.json({ error: 'Plan type is required' }, { status: 400 })
    }

    if (planType === 'free') {
      try {
        const { db } = await import('@/lib/db')
        await db.execute({ sql: 'UPDATE users SET subscription_tier = ? WHERE id = ?', args: ['free', authUser.userId] })
        return NextResponse.json({ success: true, message: 'Free plan activated', redirect: '/dashboard' })
      } catch (e: any) {
        return NextResponse.json({ error: `DB free plan: ${errMsg(e)}` }, { status: 500 })
      }
    }

    const PRICE_IDS = getPriceIds()
    const priceId = PRICE_IDS[planType]
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not set for "${planType}". Set STRIPE_PRICE_${planType.toUpperCase()} in Vercel.` },
        { status: 400 }
      )
    }

    let db: any
    try {
      const mod = await import('@/lib/db')
      db = mod.db
    } catch (e: any) {
      return NextResponse.json({ error: `DB import: ${errMsg(e)}` }, { status: 500 })
    }

    let userResult: { rows: any[] }
    try {
      userResult = await db.execute({
        sql: 'SELECT id, email, stripe_customer_id FROM users WHERE id = ?',
        args: [authUser.userId]
      })
    } catch (e: any) {
      return NextResponse.json({ error: `DB select user: ${errMsg(e)}` }, { status: 500 })
    }

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0] as { id: string; email: string; stripe_customer_id: string | null }

    let stripe: Stripe
    try {
      stripe = getStripe()
    } catch (e: any) {
      return NextResponse.json({ error: `Stripe init: ${errMsg(e)}` }, { status: 500 })
    }

    let customerId = user.stripe_customer_id
    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id.toString() },
        })
        customerId = customer.id
        await db.execute({ sql: 'UPDATE users SET stripe_customer_id = ? WHERE id = ?', args: [customerId, user.id] })
      } catch (e: any) {
        return NextResponse.json({ error: `Stripe customer create: ${errMsg(e)}` }, { status: 500 })
      }
    }

    let session: Stripe.Checkout.Session
    try {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        subscription_data: { metadata: { userId: user.id, planType } },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/signup?canceled=true`,
        metadata: { userId: user.id, planType },
      })
    } catch (e: any) {
      return NextResponse.json({ error: `Stripe checkout create: ${errMsg(e)}` }, { status: 500 })
    }

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe returned no checkout URL' }, { status: 500 })
    }
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    const full = errMsg(error)
    console.error('Stripe trial error:', full, error?.stack || error)
    return NextResponse.json({ error: `Unexpected: ${full}` }, { status: 500 })
  }
}
