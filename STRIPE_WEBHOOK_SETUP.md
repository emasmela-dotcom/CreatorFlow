# 🔧 Stripe Webhook Setup Guide

**Time:** 5 minutes  
**Status:** ⚠️ Required before launch

---

## Step-by-Step Instructions

### Step 1: Open Stripe Dashboard
1. Go to: https://dashboard.stripe.com
2. Make sure you're in **Live Mode** (toggle in top-right)
3. Click **"Developers"** in the left sidebar
4. Click **"Webhooks"** in the submenu

### Step 2: Add New Endpoint
1. Click the **"+ Add endpoint"** button (top-right)
2. You'll see a form to add a new webhook endpoint

### Step 3: Enter Endpoint URL
In the **"Endpoint URL"** field, paste:
```
https://creatorflow-iota.vercel.app/api/stripe/webhook
```

### Step 4: Select Events
Click **"Select events to listen to"** and check these 4 events:

✅ **checkout.session.completed**
- Triggered when a customer completes checkout
- Needed to activate trial subscriptions

✅ **customer.subscription.created**
- Triggered when a subscription is created
- Needed to track subscription status

✅ **customer.subscription.updated**
- Triggered when subscription changes (upgrade, downgrade, cancel)
- Needed to update user subscription tier

✅ **invoice.payment_failed**
- Triggered when payment fails
- Needed to notify users of payment issues

### Step 5: Save Endpoint
1. Click **"Add endpoint"** button
2. Stripe will create the webhook and show you the details

### Step 6: Copy Webhook Secret
1. After the endpoint is created, click on it
2. Scroll to **"Signing secret"** section
3. Click **"Reveal"** next to the signing secret
4. Copy the secret (starts with `whsec_...`)

### Step 7: Update Vercel (If Needed)
If the webhook secret is different from what's in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your **CreatorFlow** project
3. Click **Settings** → **Environment Variables**
4. Find `STRIPE_WEBHOOK_SECRET`
5. Update it with the new secret from Step 6
6. **Redeploy** the project

---

## Verification

After setup, you can test the webhook:

1. Go to your webhook in Stripe Dashboard
2. Click **"Send test webhook"**
3. Select an event (e.g., `checkout.session.completed`)
4. Click **"Send test webhook"**
5. Check the response - should show **200 OK**

---

## Troubleshooting

### Webhook Not Receiving Events?
- ✅ Verify URL is correct: `https://creatorflow-iota.vercel.app/api/stripe/webhook`
- ✅ Check webhook secret matches in Vercel
- ✅ Verify endpoint is in **Live Mode** (not Test Mode)
- ✅ Check Vercel logs for errors

### Getting 401/403 Errors?
- ✅ Verify `STRIPE_WEBHOOK_SECRET` is set in Vercel
- ✅ Check the secret matches exactly (no extra spaces)

### Webhook Returns 500 Error?
- ✅ Check Vercel function logs
- ✅ Verify database connection
- ✅ Check environment variables are set

---

## What Happens After Setup?

When a user completes checkout:
1. ✅ Stripe sends `checkout.session.completed` event
2. ✅ Your webhook receives it and verifies signature
3. ✅ Updates user's subscription in database
4. ✅ Sets trial period (15 days)
5. ✅ User account is activated

---

## ✅ Checklist

- [ ] Webhook endpoint created in Stripe
- [ ] URL set to: `https://creatorflow-iota.vercel.app/api/stripe/webhook`
- [ ] 4 events selected (see Step 4)
- [ ] Webhook secret copied
- [ ] Webhook secret verified in Vercel
- [ ] Test webhook sent successfully
- [ ] Ready to test live checkout!

---

**Once complete, you're ready to test the full payment flow!** 🎉

