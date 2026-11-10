import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey)
}

export async function POST() {
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 100,
            product_data: {
              name: 'CreatorFlow365 payment test',
              description: 'One-time $1 charge to prove the Stripe account works.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/pay-once?paid=1`,
      cancel_url: `${APP_URL}/pay-once?canceled=1`,
      metadata: { type: 'pay_once_test' },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a payment link.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment link failed'
    console.error('Pay-once Stripe error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
