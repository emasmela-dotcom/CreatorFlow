# Deploy CreatorFlow to Production - Quick Guide

## 🚀 Production Deployment Steps

### Step 1: Login to Vercel
```bash
vercel login
```
(This will open your browser - click "Authorize")

### Step 2: Deploy to Production
```bash
vercel --prod
```

**If this is your first time deploying:**
```bash
vercel
```
Then when it asks:
- "Set up and deploy?" → **Y**
- "Link to existing project?" → **N** (first time) or **Y** (if you have existing project)
- "What's your project's name?" → **creatorflow** (or press Enter)
- "In which directory is your code located?" → Press Enter (./)
- "Want to override the settings?" → **N**

### Step 3: Get Your Production URL
After deployment completes, Vercel will show:
```
✅ Production: https://creatorflow-xxxxx.vercel.app
```

**That's your production URL!**

---

## ⚙️ Environment Variables (Important!)

After first deployment, set these in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Click your project → Settings → Environment Variables
3. Add these variables:

**Required:**
- `DATABASE_URL` - Your Neon/PostgreSQL connection string
- `JWT_SECRET` - Your JWT secret key

**Optional (if using Stripe):**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_BUSINESS`
- `STRIPE_PRICE_AGENCY`

**Then redeploy:**
```bash
vercel --prod
```

---

## 📋 What Gets Deployed

✅ All source code (`src/`)
✅ All components
✅ All API routes
✅ All new features (Game-Changers, Feedback, etc.)
✅ Database migrations (run automatically)

---

## 🎯 After Deployment

Your production URL will be:
- **Main site:** `https://creatorflow-xxxxx.vercel.app`
- **Demo link:** `https://creatorflow-xxxxx.vercel.app/demo`
- **Dashboard:** `https://creatorflow-xxxxx.vercel.app/dashboard`

---

## ✅ Quick Deploy Command

```bash
vercel login && vercel --prod
```

**That's it!** Your production URL will be displayed after deployment completes.

