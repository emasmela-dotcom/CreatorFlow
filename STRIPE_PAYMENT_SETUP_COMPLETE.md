# Stripe Payment Setup - Complete Guide for All 6 Plans

## Current Pricing Structure

- **Free:** $0/month (no payment needed)
- **Starter:** $5/month
- **Growth:** $19/month
- **Pro:** $29/month
- **Business:** $39/month
- **Agency:** $89/month

---

## Step 1: Create Stripe Products (5 Products - Free doesn't need one)

### Go to Stripe Dashboard
1. Visit: https://dashboard.stripe.com/
2. **Switch to Live Mode** (toggle in top-right)
3. Go to **Products** → Click **"+ Add product"**

### Create Each Product:

#### Product 1: Starter Plan
- **Name:** `Starter Plan`
- **Description:** `Perfect for individual creators - Remove limits and unlock full potential`
- **Pricing:**
  - **Price:** `$5.00`
  - **Currency:** `USD`
  - **Billing:** `Recurring` → `Monthly`
- Click **"Save product"**
- **COPY Price ID** (starts with `price_...`)
- **Save as:** `STRIPE_PRICE_STARTER`

#### Product 2: Growth Plan
- **Name:** `Growth Plan`
- **Description:** `Actually helpful - AI assistance included`
- **Pricing:**
  - **Price:** `$19.00`
  - **Currency:** `USD`
  - **Billing:** `Recurring` → `Monthly`
- Click **"Save product"**
- **COPY Price ID**
- **Save as:** `STRIPE_PRICE_GROWTH`

#### Product 3: Pro Plan
- **Name:** `Pro Plan`
- **Description:** `Time saver - full AI bot suite`
- **Pricing:**
  - **Price:** `$29.00`
  - **Currency:** `USD`
  - **Billing:** `Recurring` → `Monthly`
- Click **"Save product"**
- **COPY Price ID**
- **Save as:** `STRIPE_PRICE_PRO`

#### Product 4: Business Plan
- **Name:** `Business Plan`
- **Description:** `Professional - enhanced AI & team features`
- **Pricing:**
  - **Price:** `$39.00`
  - **Currency:** `USD`
  - **Billing:** `Recurring` → `Monthly`
- Click **"Save product"**
- **COPY Price ID**
- **Save as:** `STRIPE_PRICE_BUSINESS`

#### Product 5: Agency Plan
- **Name:** `Agency Plan`
- **Description:** `Enterprise power - unlimited scale`
- **Pricing:**
  - **Price:** `$89.00`
  - **Currency:** `USD`
  - **Billing:** `Recurring` → `Monthly`
- Click **"Save product"**
- **COPY Price ID**
- **Save as:** `STRIPE_PRICE_AGENCY`

---

## Step 2: Get Stripe API Keys

1. Go to **Developers** → **API keys**
2. **COPY Secret Key** (starts with `sk_live_...`)
   - **Save as:** `STRIPE_SECRET_KEY`
3. Keep this page open for webhook setup

---

## Step 3: Set Up Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **"+ Add endpoint"**
3. **Endpoint URL:** `https://creatorflow.ai/api/stripe/webhook`
   - (Or your domain: `https://your-domain.com/api/stripe/webhook`)
4. **Description:** `CreatorFlow Subscription Webhooks`
5. Click **"Select events"** and choose:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
6. Click **"Add endpoint"**
7. **COPY Signing Secret** (starts with `whsec_...`)
   - **Save as:** `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Add Environment Variables

### Add to `.env.local` (for local development):

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Stripe Price IDs (5 plans)
STRIPE_PRICE_STARTER=price_YOUR_STARTER_PRICE_ID
STRIPE_PRICE_GROWTH=price_YOUR_GROWTH_PRICE_ID
STRIPE_PRICE_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_PRICE_BUSINESS=price_YOUR_BUSINESS_PRICE_ID
STRIPE_PRICE_AGENCY=price_YOUR_AGENCY_PRICE_ID
```

### Add to Vercel (for production):

1. Go to: https://vercel.com/dashboard
2. Select your **CreatorFlow** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_live_...` (your secret key)
   - **Environment:** `Production`
   - Click **"Save"**
5. Repeat for all 6 variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_GROWTH`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_BUSINESS`
   - `STRIPE_PRICE_AGENCY`
6. **Redeploy** your project after adding variables

---

## Step 5: Test the Integration

### Test Cards (Stripe Test Mode):

1. **Switch to Test Mode** in Stripe Dashboard
2. Use test cards:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **Requires Auth:** `4000 0025 0000 3155`
3. Use any future expiry date (e.g., 12/25)
4. Use any 3-digit CVC (e.g., 123)
5. Use any ZIP code (e.g., 12345)

### Test Flow:

1. Go to your signup page
2. Select a plan (Starter, Growth, Pro, Business, or Agency)
3. Click "Proceed to Secure Checkout"
4. You should be redirected to Stripe Checkout
5. Enter test card: `4242 4242 4242 4242`
6. Complete checkout
7. Check Stripe Dashboard → **Customers** → Should see new customer
8. Check Stripe Dashboard → **Subscriptions** → Should see active subscription
9. Check your database → User should have `subscription_tier` updated

---

## How It Works

### Free Plan:
- No Stripe checkout needed
- User gets free plan immediately
- No payment required

### Paid Plans (Starter, Growth, Pro, Business, Agency):
1. User selects plan on signup
2. User clicks "Proceed to Secure Checkout"
3. Redirected to Stripe Checkout
4. Enters payment info
5. **15-day free trial** starts automatically
6. After 15 days, Stripe charges subscription
7. Webhook updates user's subscription in database

### Webhook Events:
- `checkout.session.completed` → Activates subscription, starts trial
- `customer.subscription.created` → Updates subscription status
- `customer.subscription.updated` → Updates subscription changes
- `customer.subscription.deleted` → Cancels subscription
- `invoice.payment_failed` → Handles failed payments

---

## Troubleshooting

### Issue: "Price ID not configured"
**Solution:** Make sure all `STRIPE_PRICE_*` environment variables are set in Vercel

### Issue: "Webhook secret not configured"
**Solution:** Add `STRIPE_WEBHOOK_SECRET` to environment variables

### Issue: Webhook not receiving events
**Solution:** 
1. Check webhook URL is correct
2. Make sure webhook is in Live Mode (not Test Mode)
3. Check webhook endpoint is accessible
4. Verify webhook secret matches

### Issue: Subscription not updating in database
**Solution:**
1. Check webhook logs in Stripe Dashboard
2. Check server logs for errors
3. Verify webhook events are selected correctly

---

## Quick Checklist

- [ ] Created 5 Stripe products (Starter, Growth, Pro, Business, Agency)
- [ ] Copied all 5 Price IDs
- [ ] Copied Stripe Secret Key
- [ ] Created webhook endpoint
- [ ] Selected all 5 webhook events
- [ ] Copied webhook signing secret
- [ ] Added all 7 environment variables to Vercel
- [ ] Redeployed project
- [ ] Tested checkout flow with test card
- [ ] Verified subscription created in Stripe
- [ ] Verified user updated in database

---

## Environment Variables Summary

**Total: 7 Variables**

1. `STRIPE_SECRET_KEY` - Your Stripe secret key
2. `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
3. `STRIPE_PRICE_STARTER` - Starter plan price ID ($5)
4. `STRIPE_PRICE_GROWTH` - Growth plan price ID ($19)
5. `STRIPE_PRICE_PRO` - Pro plan price ID ($29)
6. `STRIPE_PRICE_BUSINESS` - Business plan price ID ($39)
7. `STRIPE_PRICE_AGENCY` - Agency plan price ID ($89)

---

**Last Updated:** January 2025  
**Status:** Complete Setup Guide

