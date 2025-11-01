import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { randomUUID } from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-09-30.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

/**
 * Stripe webhook handler for subscription events
 * Handles trial start, trial end, and subscription status changes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planType = session.metadata?.planType
        const purchaseType = session.metadata?.type

        // Handle additional posts purchase
        if (purchaseType === 'additional_posts' && userId) {
          const quantity = parseInt(session.metadata?.quantity || '0')
          
          if (quantity > 0) {
            // Add purchased posts to user's account
            await db.execute({
              sql: `UPDATE users 
                    SET additional_posts_purchased = COALESCE(additional_posts_purchased, 0) + ?,
                        updated_at = ?
                    WHERE id = ?`,
              args: [quantity, new Date().toISOString(), userId]
            })
            
            console.log(`Added ${quantity} additional posts to user ${userId}`)
            return NextResponse.json({ received: true })
          }
        }

        // Handle trial/subscription checkout
        if (userId && planType) {
          // Plan post limits (null = unlimited, shared across all social accounts)
          const planPostLimits: Record<string, number | null> = {
            starter: 15,
            growth: 25,
            pro: 35,
            business: 50,
            agency: null // Unlimited
          }

          // Update user with Stripe customer ID and start trial
          const customerId = session.customer as string
          const now = new Date()
          const trialEndDate = new Date(now)
          trialEndDate.setDate(trialEndDate.getDate() + 14) // 14-day free trial
          const monthlyPostLimit = planPostLimits[planType] ?? null

          await db.execute({
            sql: `UPDATE users 
                  SET stripe_customer_id = ?,
                      subscription_tier = ?,
                      trial_plan = ?,
                      trial_started_at = ?,
                      trial_end_at = ?,
                      monthly_post_limit = ?,
                      updated_at = ?
                  WHERE id = ?`,
            args: [
              customerId,
              planType,
              planType,
              now.toISOString(),
              trialEndDate.toISOString(),
              monthlyPostLimit,
              now.toISOString(),
              userId
            ]
          })

          // Create backup BEFORE any changes are made
          // Create backup directly in webhook (no auth needed, we have userId from metadata)
          try {
            // Fetch user's current data
            const contentPostsResult = await db.execute({
              sql: 'SELECT * FROM content_posts WHERE user_id = ?',
              args: [userId]
            })

            const analyticsResult = await db.execute({
              sql: 'SELECT * FROM analytics WHERE user_id = ?',
              args: [userId]
            })

            // Prepare backup data
            const contentPosts = contentPostsResult.rows.map((row: any) => ({
              id: row.id as string,
              user_id: row.user_id as string,
              platform: row.platform as string,
              content: row.content as string,
              media_urls: JSON.parse(row.media_urls as string || '[]'),
              scheduled_at: row.scheduled_at as string | null,
              published_at: row.published_at as string | null,
              status: row.status as string,
              engagement_metrics: row.engagement_metrics ? JSON.parse(row.engagement_metrics as string) : null,
              created_at: row.created_at as string,
              updated_at: row.updated_at as string
            }))

            const analytics = analyticsResult.rows.map((row: any) => ({
              id: row.id as string,
              user_id: row.user_id as string,
              platform: row.platform as string,
              metric_type: row.metric_type as string,
              value: row.value as number,
              date: row.date as string,
              created_at: row.created_at as string
            }))

            const userResult = await db.execute({
              sql: 'SELECT subscription_tier, full_name, avatar_url FROM users WHERE id = ?',
              args: [userId]
            })

            const user = userResult.rows[0]
            const backupData = {
              content_posts: contentPosts,
              analytics: analytics,
              user_settings: {
                subscription_tier: user?.subscription_tier as string | null,
                full_name: user?.full_name as string | null,
                avatar_url: user?.avatar_url as string | null,
              }
            }

            // Create backup record
            const backupId = randomUUID()
            await db.execute({
              sql: `INSERT INTO project_backups (id, user_id, trial_started_at, backup_data, is_restored, created_at)
                    VALUES (?, ?, ?, ?, 0, ?)`,
              args: [backupId, userId, now.toISOString(), JSON.stringify(backupData), now.toISOString()]
            })

            console.log(`Backup created for user ${userId}: ${backupId}`)
          } catch (backupError) {
            console.error('Backup creation in webhook failed:', backupError)
            // Continue even if backup fails - this is logged but doesn't block subscription
          }
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        // Trial subscription created - already handled in checkout.session.completed
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Update user subscription status
        if (subscription.status === 'active' && !subscription.trial_end) {
          // Trial ended, subscription is now active (user continued)
          await db.execute({
            sql: `UPDATE users 
                  SET subscription_tier = ?,
                      updated_at = ?
                  WHERE stripe_customer_id = ?`,
            args: [
              subscription.metadata?.planType || null,
              new Date().toISOString(),
              customerId
            ]
          })
        } else if (subscription.status === 'canceled' || subscription.status === 'past_due') {
          // Subscription canceled or past due - trigger restore
          const userResult = await db.execute({
            sql: 'SELECT id FROM users WHERE stripe_customer_id = ?',
            args: [customerId]
          })

          if (userResult.rows.length > 0) {
            const userId = userResult.rows[0].id as string
            // Trigger restore process
            try {
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/restore`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
              })
            } catch (error) {
              console.error('Restore trigger failed:', error)
            }
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        // Payment failed after trial - might want to notify user
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

