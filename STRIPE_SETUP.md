# Stripe Setup Guide

## Required Setup Steps

### 1. Create Stripe Products & Prices

In your Stripe Dashboard, create products and prices for each plan:

- **Starter Plan** - $19/month
- **Growth Plan** - $29/month  
- **Pro Plan** - $39/month
- **Business Plan** - $49/month
- **Agency Plan** - $99/month

For each product:
1. Go to Products in Stripe Dashboard
2. Click "Add product"
3. Set name (e.g., "CreatorFlow Starter")
4. Set pricing to recurring monthly
5. Set price amount
6. Copy the Price ID (starts with `price_...`)

### 2. Set Environment Variables

Add these to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_... (from webhook endpoint)
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_GROWTH=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_BUSINESS=price_xxxxx
STRIPE_PRICE_AGENCY=price_xxxxx
```

### 3. Configure Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL to: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret

### 4. Test the Integration

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

## How Trial System Works

1. **Trial Start**: User enters payment info via Stripe Checkout
   - Subscription created with 15-day trial period
   - Webhook `checkout.session.completed` fires
   - Backup of user's project is created
   - Trial dates stored in database

2. **During Trial**: 
   - User has full access to selected plan
   - Trial status banner shows days remaining
   - No charges to credit card

3. **Trial End - User Continues**:
   - Stripe automatically charges subscription
   - Webhook `customer.subscription.updated` fires
   - Status changes to `active`
   - User keeps all changes made during trial

4. **Trial End - User Cancels**:
   - User cancels before trial ends OR doesn't continue
   - Webhook `customer.subscription.deleted` or `canceled` fires
   - Restore process triggered
   - All trial changes reverted
   - Project restored to original backup state

## Important Notes

- Trial period is set to 15 days (half month)
- Payment method is collected but not charged during trial
- Backup is created automatically when trial starts
- Restore happens automatically when subscription is canceled

