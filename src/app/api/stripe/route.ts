import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-static'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { priceId, customerId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    // Create or retrieve customer
    let customer
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId)
    } else {
      customer = await stripe.customers.create({
        email: 'customer@example.com', // This would come from auth
      })
    }

    // Create checkout session
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retrieve subscription details
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to retrieve subscriptions' }, { status: 500 })
  }
}
