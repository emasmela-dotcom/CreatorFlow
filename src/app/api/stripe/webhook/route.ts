import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { getPostLimit } from '@/lib/planLimits'

// Lazy initialize Stripe to avoid build-time errors
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const type = session.metadata?.type

        // One-time payment: additional posts or credit bundle
        if (session.mode === 'payment' && userId && type) {
          if (type === 'additional_posts') {
            const quantity = parseInt(session.metadata?.quantity || '0', 10)
            if (quantity > 0) {
              await db.execute({
                sql: `UPDATE users SET additional_posts_purchased = COALESCE(additional_posts_purchased, 0) + ? WHERE id = ?`,
                args: [quantity, userId]
              })
              console.log(`✅ Added ${quantity} posts for user ${userId}`)
            }
          } else if (type === 'credit_bundle') {
            const credits = parseInt(session.metadata?.credits || '0', 10)
            if (credits > 0) {
              await db.execute({
                sql: `UPDATE users SET credits_balance = COALESCE(credits_balance, 0) + ? WHERE id = ?`,
                args: [credits, userId]
              })
              console.log(`✅ Added ${credits} credits for user ${userId}`)
            }
          }
          break
        }

        // Subscription checkout
        const planType = session.metadata?.planType
        if (!userId || !planType) {
          console.error('Missing userId or planType in checkout session metadata')
          break
        }

        const stripe = getStripe()
        const subscriptionId = session.subscription as string | null
        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
        const postLimit = getPostLimit(planType as any)

        await db.execute({
          sql: `
            UPDATE users 
            SET 
              subscription_tier = ?,
              stripe_customer_id = ?,
              monthly_post_limit = ?,
              trial_started_at = CURRENT_TIMESTAMP,
              trial_end_at = ?,
              trial_plan = ?
            WHERE id = ?
          `,
          args: [planType, session.customer, postLimit, trialEnd?.toISOString() || null, planType, userId]
        })

        console.log(`✅ Subscription activated for user ${userId}, plan: ${planType}`)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const userResult = await db.execute({
          sql: 'SELECT id FROM users WHERE stripe_customer_id = ?',
          args: [customerId]
        })

        if (userResult.rows.length === 0) {
          console.error(`User not found for customer ${customerId}`)
          break
        }

        const userId = (userResult.rows[0] as any).id
        const planType = subscription.metadata?.planType || 'starter'

        // Update subscription status
        if (subscription.status === 'active') {
          const postLimit = getPostLimit(planType as any)
          await db.execute({
            sql: 'UPDATE users SET subscription_tier = ?, monthly_post_limit = ? WHERE id = ?',
            args: [planType, postLimit, userId]
          })
          console.log(`✅ Subscription ${subscription.status} for user ${userId}`)
        } else if (subscription.status === 'canceled') {
          await db.execute({
            sql: 'UPDATE users SET subscription_tier = NULL, monthly_post_limit = NULL WHERE id = ?',
            args: [userId]
          })
          console.log(`⚠️ Subscription canceled for user ${userId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user and notify (log for now)
        const userResult = await db.execute({
          sql: 'SELECT id, email FROM users WHERE stripe_customer_id = ?',
          args: [customerId]
        })

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0] as any
          console.error(`💳 Payment failed for user ${user.id} (${user.email})`)
          // TODO: Send email notification to user
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Disable body parsing for webhook route
export const runtime = 'nodejs'
