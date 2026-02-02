import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-09-30.clover',
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Pricing for additional posts
const ADDITIONAL_POST_PACKAGES = [
  { quantity: 5, price: 4.00, savings: '0%', perPost: '$0.80/post' },
  { quantity: 10, price: 8.00, savings: '0%', perPost: '$0.80/post' },
  { quantity: 15, price: 12.00, savings: '0%', perPost: '$0.80/post' },
  { quantity: 20, price: 15.00, savings: '6%', perPost: '$0.75/post' },
  { quantity: 24, price: 18.00, savings: '10%', perPost: '$0.75/post' },
]

/**
 * GET - Get current post usage and available additional post packages
 * POST - Purchase additional posts (creates Stripe checkout session)
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

    // Get user's current post limit and purchased posts
    const userResult = await db.execute({
      sql: 'SELECT monthly_post_limit, additional_posts_purchased FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const monthlyLimit = userResult.rows[0].monthly_post_limit as number | null
    const purchasedPosts = (userResult.rows[0].additional_posts_purchased as number) || 0

    // Get current month's post count
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const postsResult = await db.execute({
      sql: `SELECT COUNT(*)::int as count FROM content_posts 
            WHERE user_id = ? AND TO_CHAR(created_at, 'YYYY-MM') = ?`,
      args: [decoded.userId, currentMonth]
    })

    // PostgreSQL returns count as bigint, convert to number
    const postsThisMonth = postsResult.rows[0] ? Number(postsResult.rows[0].count || 0) : 0
    const totalAvailable = (monthlyLimit || 0) + purchasedPosts
    const remaining = totalAvailable - postsThisMonth

    return NextResponse.json({
      monthlyLimit: monthlyLimit,
      purchasedPosts: purchasedPosts,
      postsThisMonth: postsThisMonth,
      totalAvailable: totalAvailable,
      remaining: remaining,
      packages: ADDITIONAL_POST_PACKAGES
    })
  } catch (error: any) {
    console.error('Get post purchase info error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: error.message || 'Failed to get post purchase info',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

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

    const { quantity, packageIndex } = await request.json()

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 })
    }

    // Calculate price
    let price: number
    let packageInfo = null

    if (packageIndex !== undefined && packageIndex >= 0 && packageIndex < ADDITIONAL_POST_PACKAGES.length) {
      // Use package pricing
      packageInfo = ADDITIONAL_POST_PACKAGES[packageIndex]
      if (quantity !== packageInfo.quantity) {
        return NextResponse.json({ 
          error: `Quantity must match package size: ${packageInfo.quantity}` 
        }, { status: 400 })
      }
      price = packageInfo.price
    } else {
      return NextResponse.json({ 
        error: 'Please select one of the available packages' 
      }, { status: 400 })
    }

    // Get user's Stripe customer ID
    const userResult = await db.execute({
      sql: 'SELECT stripe_customer_id, email FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stripeCustomerId = userResult.rows[0].stripe_customer_id as string | null

    // Create Stripe checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId || undefined,
      customer_email: stripeCustomerId ? undefined : decoded.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Additional Posts - ${quantity} posts`,
              description: packageInfo 
                ? `${quantity} additional posts (${packageInfo.savings} savings)`
                : `${quantity} additional posts`
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/dashboard?purchase=success&posts=${quantity}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'}/dashboard?purchase=canceled`,
      metadata: {
        userId: decoded.userId,
        type: 'additional_posts',
        quantity: quantity.toString(),
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      quantity,
      price
    })
  } catch (error: any) {
    console.error('Purchase posts error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create purchase session' }, { status: 500 })
  }
}

