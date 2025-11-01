# 🚀 Quick Launch Guide - CreatorFlow.ai

## Pre-Launch Checklist (Do These in Order)

### ✅ Step 1: Set Up Stripe (15 minutes)

1. **Go to Stripe Dashboard** → https://dashboard.stripe.com/
2. **Switch to Live Mode** (toggle in top right)
3. **Create 5 Products:**
   - Product 1: "Starter Plan" - $19/month recurring
   - Product 2: "Growth Plan" - $29/month recurring
   - Product 3: "Pro Plan" - $39/month recurring
   - Product 4: "Business Plan" - $49/month recurring
   - Product 5: "Agency Plan" - $99/month recurring
4. **Copy Price IDs** from each product (format: `price_xxxxx`)
5. **Set up Webhook:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://creatorflow.ai/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `invoice.payment_failed`
   - Copy webhook signing secret (starts with `whsec_`)

---

### ✅ Step 2: Set Up Turso Database (10 minutes)

1. **Go to Turso Dashboard** → https://turso.tech/
2. **Create Production Database:**
   - Name: `creatorflow-production`
   - Choose location closest to your users
3. **Get Connection Details:**
   - Database URL (format: `libsql://xxx.turso.io`)
   - Auth Token (generate new token)
4. **Initialize Database:**
   - The `initDatabase()` function will run automatically on first API call
   - Or run manually via API endpoint: `/api/test` (if you create one)

---

### ✅ Step 3: Configure Vercel Environment Variables (10 minutes)

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add All Variables:**

```
NEXT_PUBLIC_APP_URL=https://creatorflow.ai

TURSO_DATABASE_URL=libsql://your-db-url.turso.io
TURSO_AUTH_TOKEN=your-turso-token

JWT_SECRET=your-strong-random-secret-32-chars-minimum

STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

STRIPE_PRICE_STARTER=price_starter_live_id
STRIPE_PRICE_GROWTH=price_growth_live_id
STRIPE_PRICE_PRO=price_pro_live_id
STRIPE_PRICE_BUSINESS=price_business_live_id
STRIPE_PRICE_AGENCY=price_agency_live_id
```

3. **Set for Production Environment** (not Preview/Development)
4. **Redeploy** after adding variables

---

### ✅ Step 4: Configure DNS (5 minutes)

1. **Go to Your Domain Registrar** (where you bought creatorflow.ai)
2. **Add DNS Record:**
   - Type: **CNAME** (recommended) or **A record**
   - Name: `@` (or leave blank for root domain)
   - Value: `cname.vercel-dns.com` (for CNAME)
   - OR get IP from Vercel Dashboard → Your Project → Settings → Domains
3. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Add domain: `creatorflow.ai`
   - Follow Vercel's instructions
4. **Wait for DNS Propagation** (5 minutes to 48 hours, usually < 1 hour)
5. **SSL Certificate** will auto-generate (may take a few minutes)

---

### ✅ Step 5: Final Testing (20 minutes)

1. **Test Signup Flow:**
   - [ ] Visit https://creatorflow.ai (or Vercel URL)
   - [ ] Click "Start Free Trial"
   - [ ] Select a plan
   - [ ] Create account
   - [ ] Complete Stripe checkout (use test card: 4242 4242 4242 4242)
   - [ ] Verify trial starts

2. **Test Database:**
   - [ ] Check if user was created in Turso
   - [ ] Verify backup was created
   - [ ] Check subscription tier set correctly

3. **Test Webhook:**
   - [ ] Check Stripe Dashboard → Events for webhook delivery
   - [ ] Verify no errors

4. **Test All Plans:**
   - [ ] Test each plan checkout
   - [ ] Verify correct post limits set
   - [ ] Check social account locking works

---

## 🎯 Launch Day

1. **Monitor First Hour:**
   - Watch Stripe Dashboard for real payments
   - Monitor Vercel logs for errors
   - Check Turso database connections

2. **Test Real Payment:**
   - Make one real test purchase (can refund)
   - Verify entire flow works end-to-end

3. **Monitor Metrics:**
   - Check Vercel Analytics
   - Monitor Stripe Dashboard
   - Watch for any error emails

---

## 🔧 Troubleshooting

### Issue: Webhook not receiving events
- **Fix**: Check webhook URL in Stripe matches exactly
- **Fix**: Verify webhook secret is correct
- **Fix**: Check Vercel logs for webhook errors

### Issue: Database connection fails
- **Fix**: Verify TURSO_DATABASE_URL is correct
- **Fix**: Check TURSO_AUTH_TOKEN is valid
- **Fix**: Ensure database exists in Turso

### Issue: Domain not resolving
- **Fix**: Wait for DNS propagation (can take up to 48h)
- **Fix**: Check DNS records are correct
- **Fix**: Verify domain in Vercel is configured

### Issue: Environment variables not working
- **Fix**: Ensure variables are set for "Production" environment
- **Fix**: Redeploy after adding variables
- **Fix**: Check variable names match exactly (case-sensitive)

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Turso Docs**: https://docs.turso.tech
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Post-Launch Checklist

- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up email notifications for errors
- [ ] Create help/support documentation
- [ ] Set up monitoring alerts
- [ ] Plan first feature update

---

**You're ready to launch! 🚀**

