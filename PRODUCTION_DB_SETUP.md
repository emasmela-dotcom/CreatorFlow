# Production Database Setup - Complete Guide

## ✅ Current Status

**Local Database:** ✅ Fully configured and tested  
**Production Database:** ⚠️ Needs initialization

## Quick Setup (3 Steps)

### Step 1: Verify Environment Variables in Vercel

Go to: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

**Required Variables:**
- ✅ `DATABASE_URL` - Your Neon PostgreSQL connection string
- ✅ `JWT_SECRET` - Secure random string (32+ characters)
- ✅ `STRIPE_SECRET_KEY` - Stripe live secret key
- ✅ `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- ✅ `STRIPE_PRICE_*` - All 5 plan price IDs
- ✅ `NEXT_PUBLIC_APP_URL` - Your production URL

**Your Neon Database URL (from config):**
```
postgresql://neondb_owner:npg_VlAkJ4ij9nRI@ep-crimson-dew-a4x50rh1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Step 2: Initialize Production Database

**Option A: Using Setup Script (Recommended)**
```bash
cd /Users/ericmasmela/CreatorFlow
BASE_URL=https://creatorflow-live.vercel.app node scripts/setup-production-db.js
```

**Option B: Manual Setup via Browser**
1. Visit: `https://creatorflow-live.vercel.app/api/db/health`
   - Check connection status
   - See which tables exist
   
2. If tables are missing, visit: `https://creatorflow-live.vercel.app/api/init-db`
   - This creates all tables
   
3. Verify again: `https://creatorflow-live.vercel.app/api/db/health`
   - Should show all tables exist

**Option C: Using cURL**
```bash
# Check health
curl https://creatorflow-live.vercel.app/api/db/health

# Initialize
curl https://creatorflow-live.vercel.app/api/init-db

# Verify
curl https://creatorflow-live.vercel.app/api/db/health
```

### Step 3: Verify Everything Works

**Test Endpoints:**
- ✅ Health: `https://creatorflow-live.vercel.app/api/db/health`
- ✅ Setup: `https://creatorflow-live.vercel.app/api/db/setup` (POST)

**Expected Health Response:**
```json
{
  "status": "healthy",
  "connected": true,
  "database": {
    "currentTime": "2025-11-18T...",
    "postgresVersion": "PostgreSQL 17.5..."
  },
  "tables": {
    "users": true,
    "content_posts": true,
    "analytics": true,
    "project_backups": true,
    "user_signup_logs": true
  },
  "allTablesExist": true,
  "message": "Database is healthy and all tables exist"
}
```

## What Gets Created

### Core Tables (5)
1. **users** - User accounts, subscriptions, trials
2. **content_posts** - Social media posts
3. **analytics** - Analytics metrics
4. **project_backups** - Trial backup snapshots
5. **user_signup_logs** - Abuse prevention tracking

### Bot Tables (20+)
- Expense tracking (expenses, expense_categories)
- Invoice system (invoices, invoice_items, invoice_clients, invoice_payments)
- Customer service (customer_conversations, customer_messages)
- Meeting scheduler (scheduled_meetings)
- Social media manager (social_media_posts)
- Content tools (repurposed_content, content_gap_analysis, content_gap_suggestions)
- Sales tools (sales_leads)
- Website chat (website_chat_conversations, website_chat_messages)
- Email tools (email_accounts, email_categories)
- Product recommendations (products, recommendations)

### Indexes (30+)
- User ID indexes on all user-related tables
- Date indexes for time-based queries
- Foreign key indexes for relationships
- Performance indexes for common queries

## Troubleshooting

### "Database not configured"
- ✅ Check Vercel environment variables
- ✅ Verify `DATABASE_URL` is set for Production environment
- ✅ Make sure connection string starts with `postgresql://`

### "Table doesn't exist"
- Run `/api/init-db` endpoint
- Check Vercel function logs for errors
- Verify database permissions

### "Connection timeout"
- Check Neon database is active (not paused)
- Verify network connectivity
- Check Neon dashboard for status

### "Redirecting" when accessing endpoints
- Endpoints might not be deployed yet
- Redeploy your Vercel project
- Check Vercel deployment logs

## Verification Commands

**Local Test:**
```bash
# Start dev server
npm run dev

# In another terminal
curl http://localhost:3000/api/db/health
```

**Production Test:**
```bash
curl https://creatorflow-live.vercel.app/api/db/health
```

## After Setup

Once database is initialized:

1. ✅ Test user signup
2. ✅ Test post creation
3. ✅ Test subscription flow
4. ✅ Verify backups work
5. ✅ Check abuse prevention logs

## Monitoring

**Regular Health Checks:**
- Visit `/api/db/health` weekly
- Monitor Vercel function logs
- Check Neon dashboard for usage

**Alerts to Watch:**
- Connection failures
- Missing tables
- Slow queries
- High database usage

## Support

If you encounter issues:

1. Check Vercel function logs
2. Check Neon dashboard
3. Verify environment variables
4. Test local connection first
5. Review error messages in health endpoint

---

**Status:** Ready for production initialization ✅

