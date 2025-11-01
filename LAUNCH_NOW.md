# 🚀 LAUNCH NOW - Step-by-Step Guide

## Before You Start - Gather These:

### Required Information:
1. **Stripe Account** - Logged into dashboard.stripe.com
2. **Turso Account** - Logged into turso.tech
3. **Vercel Account** - Logged into vercel.com (project already deployed)
4. **Domain Registrar** - Access to DNS settings for creatorflow.ai

---

## ⚡ LAUNCH IN 60 MINUTES - Follow These Steps:

### STEP 1: Stripe Live Mode (15 min)

1. **Go to**: https://dashboard.stripe.com/
2. **Switch to Live Mode** (toggle top-right)
3. **Create Products**:
   - Go to Products → Add Product
   
   **Product 1: Starter**
   - Name: `Starter Plan`
   - Price: `$19.00 USD`
   - Billing: `Recurring` → `Monthly`
   - Click "Save"
   - **COPY the Price ID** (starts with `price_`)

   **Product 2: Growth**
   - Name: `Growth Plan`
   - Price: `$29.00 USD`
   - Billing: `Recurring` → `Monthly`
   - **COPY Price ID**

   **Product 3: Pro**
   - Name: `Pro Plan`
   - Price: `$39.00 USD`
   - Billing: `Recurring` → `Monthly`
   - **COPY Price ID**

   **Product 4: Business**
   - Name: `Business Plan`
   - Price: `$49.00 USD`
   - Billing: `Recurring` → `Monthly`
   - **COPY Price ID**

   **Product 5: Agency**
   - Name: `Agency Plan`
   - Price: `$99.00 USD`
   - Billing: `Recurring` → `Monthly`
   - **COPY Price ID**

4. **Get API Keys**:
   - Go to Developers → API keys
   - **COPY Secret Key** (starts with `sk_live_`)

5. **Set Up Webhook**:
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://creatorflow.ai/api/stripe/webhook`
   - Click "Select events" and choose:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `invoice.payment_failed`
   - Click "Add endpoint"
   - **COPY Signing Secret** (starts with `whsec_`)

**✅ Write Down:**
- STRIPE_SECRET_KEY: `sk_live_xxxxx`
- STRIPE_WEBHOOK_SECRET: `whsec_xxxxx`
- STRIPE_PRICE_STARTER: `price_xxxxx`
- STRIPE_PRICE_GROWTH: `price_xxxxx`
- STRIPE_PRICE_PRO: `price_xxxxx`
- STRIPE_PRICE_BUSINESS: `price_xxxxx`
- STRIPE_PRICE_AGENCY: `price_xxxxx`

---

### STEP 2: Turso Database (10 min)

1. **Go to**: https://turso.tech/
2. **Log in** and go to Dashboard
3. **Create Database**:
   - Click "Create Database"
   - Name: `creatorflow-production`
   - Choose location (closest to users)
   - Click "Create"
4. **Get Connection Details**:
   - Click on your database
   - Go to "Connect" tab
   - **COPY Database URL** (format: `libsql://xxx.turso.io`)
   - Click "Create Token"
   - **COPY Auth Token**

**✅ Write Down:**
- TURSO_DATABASE_URL: `libsql://xxx.turso.io`
- TURSO_AUTH_TOKEN: `xxxxx`

5. **Initialize Database**:
   - Database will auto-initialize on first API call
   - Or test via: Visit your site → Try signup → Database tables will be created

---

### STEP 3: Generate JWT Secret (2 min)

**Generate secure random string:**

```bash
# On Mac/Linux terminal:
openssl rand -hex 32
```

**OR** use online: https://www.lastpass.com/features/password-generator
- Set to 64 characters
- Copy the generated string

**✅ Write Down:**
- JWT_SECRET: `your-64-character-random-string`

---

### STEP 4: Vercel Environment Variables (10 min)

1. **Go to**: https://vercel.com/dashboard
2. **Select your CreatorFlow project**
3. **Go to**: Settings → Environment Variables
4. **Add Each Variable** (click "Add New"):

```
NEXT_PUBLIC_APP_URL
Value: https://creatorflow.ai
Environment: Production (check Production, uncheck others)
```

```
TURSO_DATABASE_URL
Value: [your value from Step 2]
Environment: Production
```

```
TURSO_AUTH_TOKEN
Value: [your value from Step 2]
Environment: Production
```

```
JWT_SECRET
Value: [your value from Step 3]
Environment: Production
```

```
STRIPE_SECRET_KEY
Value: [your value from Step 1]
Environment: Production
```

```
STRIPE_WEBHOOK_SECRET
Value: [your value from Step 1]
Environment: Production
```

```
STRIPE_PRICE_STARTER
Value: [your value from Step 1]
Environment: Production
```

```
STRIPE_PRICE_GROWTH
Value: [your value from Step 1]
Environment: Production
```

```
STRIPE_PRICE_PRO
Value: [your value from Step 1]
Environment: Production
```

```
STRIPE_PRICE_BUSINESS
Value: [your value from Step 1]
Environment: Production
```

```
STRIPE_PRICE_AGENCY
Value: [your value from Step 1]
Environment: Production
```

5. **After Adding All**:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"
   - Or push a new commit to trigger redeploy

---

### STEP 5: DNS Configuration (5 min)

1. **Go to your domain registrar** (where you bought creatorflow.ai)
2. **Find DNS Management** section
3. **Add CNAME Record**:
   - Type: `CNAME`
   - Name/Host: `@` (or leave blank)
   - Value/Target: `cname.vercel-dns.com`
   - TTL: `3600` (or default)
   - Save

4. **In Vercel Dashboard**:
   - Go to Settings → Domains
   - Click "Add"
   - Enter: `creatorflow.ai`
   - Follow instructions to verify

5. **Wait**:
   - DNS propagation: 5 min to 1 hour
   - SSL certificate: 5-10 minutes after DNS
   - Check status: https://dnschecker.org (search: creatorflow.ai)

---

### STEP 6: Final Testing (15 min)

**After DNS is live and SSL is ready:**

1. **Visit**: https://creatorflow.ai
2. **Test Signup**:
   - Click "Start Free Trial"
   - Select any plan
   - Create account
   - Complete checkout (use test card: `4242 4242 4242 4242`)
3. **Verify**:
   - Check Stripe Dashboard → Events (webhook received?)
   - Check Turso Dashboard → Database (user created?)
   - Check Vercel Logs (any errors?)

**If everything works → YOU'RE LIVE! 🎉**

---

## 🆘 Troubleshooting

### Webhook not working?
- Check webhook URL in Stripe matches exactly
- Verify webhook secret is correct
- Check Vercel logs for errors

### Database connection fails?
- Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
- Check Turso dashboard for database status

### Domain not resolving?
- Wait longer (up to 48 hours, usually < 1 hour)
- Check DNS records are correct
- Verify domain in Vercel is added

### Environment variables not working?
- Ensure set for "Production" environment
- Redeploy after adding variables
- Check variable names match exactly

---

## ✅ Launch Complete When:

- [ ] Domain resolves to your site
- [ ] HTTPS working (SSL certificate active)
- [ ] Signup flow works end-to-end
- [ ] Stripe checkout processes
- [ ] Webhooks delivering
- [ ] Database storing data
- [ ] No critical errors in logs

---

**🎉 YOU'RE READY TO LAUNCH! Follow the steps above! 🚀**

