# 🚀 Pre-Launch Tasks - CreatorFlow

**Current Status:** ~88% Complete - Almost ready for launch!

## What's Already Done ✅

- ✅ All 6 AI bots built and integrated
- ✅ Complete authentication system (JWT + bcrypt)
- ✅ 5-tier subscription plans implemented
- ✅ Stripe integration (test mode)
- ✅ Dashboard with all features
- ✅ Post creation and scheduling
- ✅ Backup/restore system
- ✅ Trial period logic
- ✅ All UI components

## What's Left Before Launch (6 Tasks)

### 1. **Stripe Production Setup** 🔴 Critical
**Time:** 15-20 minutes

**Steps:**
1. Go to Stripe Dashboard → Switch to "Live mode"
2. Create 5 products (if not already created):
   - Starter ($19/month)
   - Growth ($29/month)
   - Pro ($39/month)
   - Business ($49/month)
   - Agency ($99/month)
3. For each product, create a recurring price (monthly)
4. Copy the Price IDs (starts with `price_`)
5. Copy your Live Secret Key (`sk_live_...`)
6. Create a webhook endpoint: `https://creatorflow.ai/api/stripe/webhook`
7. Copy the Webhook Secret (`whsec_...`)

**Save these in:** `STRIPE_SETUP_VALUES.md` (already in .gitignore)

---

### 2. **Database Setup** 🔴 Critical
**Time:** 10 minutes

**Steps:**
1. Go to Neon Console (https://neon.tech)
2. Create a new database (or use existing)
3. Click "Connect" → Copy the connection string
4. It should look like: `postgresql://user:pass@host/dbname?sslmode=require`

**Note:** You're already using Neon in your code, just need production connection string.

---

### 3. **Vercel Environment Variables** 🔴 Critical
**Time:** 10 minutes

**Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

**Add these 11 variables:**
```env
# Application
NEXT_PUBLIC_APP_URL=https://creatorflow.ai

# Database
DATABASE_URL=postgresql://... (or NEON_DATABASE_URL)
# OR
NEON_DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secure-random-32-char-string

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
STRIPE_PRICE_AGENCY=price_...
```

**Important:** 
- Set environment to **"Production"**
- After adding, trigger a redeploy

**Generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

---

### 4. **DNS Configuration** 🟡 Important
**Time:** 15 minutes (plus propagation time)

**Steps:**
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `creatorflow.ai`
3. Vercel will show you DNS records to add:
   - Usually a CNAME record pointing to `cname.vercel-dns.com`
4. Go to your domain registrar (where you bought creatorflow.ai)
5. Add the DNS record Vercel provided
6. Wait for DNS propagation (5-60 minutes, usually 15-30)

**Check propagation:** https://dnschecker.org/#A/creatorflow.ai

---

### 5. **End-to-End Testing** 🟡 Important
**Time:** 30 minutes

**Test Checklist:**
- [ ] Homepage loads correctly
- [ ] Can sign up for account
- [ ] Can select a plan during signup
- [ ] Stripe checkout works (use test card: 4242 4242 4242 4242)
- [ ] Trial activates correctly
- [ ] Can access dashboard
- [ ] Can create a post
- [ ] All 6 bots load and work
- [ ] Can schedule a post
- [ ] Can purchase additional posts (if needed)
- [ ] Webhook receives Stripe events (check Stripe Dashboard → Events)

---

### 6. **Verify All Bots Work** 🟡 Important
**Time:** 15 minutes

**Test in Dashboard → "AI Bots" tab:**
- [ ] Content Assistant Bot - loads, analyzes content
- [ ] Scheduling Assistant Bot - shows posting times
- [ ] Engagement Analyzer Bot - displays analytics
- [ ] Trend Scout Bot - shows trending topics
- [ ] Content Curation Bot - suggests content
- [ ] Analytics Coach Bot - provides insights

**If any bot fails:**
- Check browser console for errors
- Check Vercel logs for API errors
- Verify authentication token is being passed correctly

---

## Quick Launch Checklist

**Before you go live:**
- [ ] All 11 environment variables set in Vercel
- [ ] Stripe products created and Price IDs saved
- [ ] Stripe webhook configured
- [ ] Database connection string added
- [ ] DNS configured (or using Vercel URL temporarily)
- [ ] Test signup flow works end-to-end
- [ ] All bots load correctly
- [ ] Site accessible at https://creatorflow.ai (or Vercel URL)

---

## Estimated Time to Launch

**Total:** ~1.5-2 hours (if you have all credentials ready)

**Breakdown:**
- Stripe setup: 15-20 min
- Database: 10 min
- Vercel env vars: 10 min
- DNS: 15 min (setup) + wait time
- Testing: 30-45 min

---

## If You Get Stuck

**Common Issues:**
1. **"Stripe webhook not receiving events"**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check Stripe Dashboard → Events for errors

2. **"Database connection failed"**
   - Verify connection string is correct
   - Check if database allows connections from Vercel IPs
   - Check Vercel logs for specific error

3. **"Bots showing 'Unauthorized'"**
   - Check JWT_SECRET is set
   - Verify token is being passed in requests
   - Check auth middleware is working

4. **"DNS not working"**
   - Use Vercel URL temporarily (e.g., `your-project.vercel.app`)
   - DNS can take up to 48 hours (usually 15-30 min)

---

## Ready to Launch?

Once you've completed all 6 tasks above, you're ready to go live! 🎉

**Next Steps After Launch:**
- Monitor Vercel logs for errors
- Check Stripe Dashboard for successful payments
- Monitor user signups
- Gather feedback on bots

---

**Questions?** Let me know what you need help with!

