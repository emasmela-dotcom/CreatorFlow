# Database Setup - Complete Guide

## Current Status

✅ **Database Type:** Neon PostgreSQL (serverless)  
✅ **Connection:** Configured via `DATABASE_URL` or `NEON_DATABASE_URL`  
✅ **Schema:** Auto-initializes on first use  
✅ **Tables:** All core tables created automatically  

## What You Need

### 1. Neon Database URL

You need your Neon PostgreSQL connection string. It should look like:
```
postgresql://user:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

### 2. Environment Variables

Add to your `.env.local` (local) and Vercel environment variables (production):

```env
DATABASE_URL=postgresql://user:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
# OR
NEON_DATABASE_URL=postgresql://user:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/dbname?sslmode=require

JWT_SECRET=your-random-secret-key-here
```

## Setup Steps

### Step 1: Verify Database Connection

Visit: `https://your-domain.com/api/db/health`

This will tell you:
- ✅ Database is connected
- ✅ Which tables exist
- ✅ If setup is needed

### Step 2: Initialize Database (if needed)

If tables are missing, visit: `https://your-domain.com/api/db/setup` (POST request)

Or call the init endpoint: `https://your-domain.com/api/init-db` (GET request)

### Step 3: Verify Setup

Check the health endpoint again to confirm all tables exist.

## Database Tables Created

### Core Tables:
- ✅ `users` - User accounts, subscriptions, trial info
- ✅ `content_posts` - Social media posts
- ✅ `analytics` - Analytics metrics
- ✅ `project_backups` - Backup snapshots for trial system
- ✅ `user_signup_logs` - Abuse prevention tracking

### Bot Tables:
- ✅ `expenses` - Expense tracking
- ✅ `expense_categories` - Expense categories
- ✅ `invoices` - Invoice generation
- ✅ `invoice_items` - Invoice line items
- ✅ `invoice_clients` - Client database
- ✅ `invoice_payments` - Payment tracking
- ✅ `customer_conversations` - Customer service
- ✅ `customer_messages` - Conversation messages
- ✅ `scheduled_meetings` - Meeting scheduler
- ✅ `social_media_posts` - Social media manager
- ✅ `repurposed_content` - Content repurposing
- ✅ `content_gap_analysis` - Content gap analysis
- ✅ `content_gap_suggestions` - Gap suggestions
- ✅ `sales_leads` - Sales lead qualification
- ✅ `website_chat_conversations` - Website chat
- ✅ `website_chat_messages` - Chat messages
- ✅ `email_accounts` - Email sorter
- ✅ `email_categories` - Email categories
- ✅ `products` - Product recommendations
- ✅ `recommendations` - Recommendation engine

## Indexes Created

All tables have proper indexes for performance:
- User ID indexes on all user-related tables
- Date indexes for time-based queries
- Foreign key indexes for relationships

## Database Features

### ✅ Automatic Migrations
- New columns are added automatically if missing
- Safe to run `initDatabase()` multiple times
- Won't duplicate existing columns

### ✅ Data Persistence
- All data stored in Neon PostgreSQL
- Available 24/7, no downtime
- Automatic backups (Neon handles this)

### ✅ Multi-tenant
- Single database for all users
- User data isolated by `user_id` column
- Efficient and scalable

## Troubleshooting

### "Database not configured"
- Check `DATABASE_URL` or `NEON_DATABASE_URL` is set
- Verify the connection string is correct
- Make sure it starts with `postgresql://`

### "Table doesn't exist"
- Run `/api/init-db` to create tables
- Check database connection is working
- Verify you have permissions to create tables

### "Connection timeout"
- Check Neon database is active (not paused)
- Verify network connectivity
- Check firewall settings

## Monitoring

### Health Check
Regularly check: `/api/db/health`

Returns:
- Connection status
- Table existence
- Database version
- Overall health

### Setup Status
Check: `/api/db/setup` (POST)

Returns:
- Setup completion status
- Table verification
- Index count
- Next steps

## Production Setup

### Quick Setup Script

Run this to set up production database:

```bash
# Set your production URL
export BASE_URL=https://creatorflow-live.vercel.app

# Run setup script
node scripts/setup-production-db.js
```

Or manually:

1. **Check Health:**
   ```bash
   curl https://creatorflow-live.vercel.app/api/db/health
   ```

2. **Initialize Tables:**
   ```bash
   curl https://creatorflow-live.vercel.app/api/init-db
   ```

3. **Verify Setup:**
   ```bash
   curl https://creatorflow-live.vercel.app/api/db/health
   ```

### Production Checklist

- [x] `DATABASE_URL` set in Vercel environment variables (✅ Found in config)
- [ ] `JWT_SECRET` set in Vercel environment variables
- [ ] Database health check passes in production
- [ ] All core tables exist in production
- [ ] Indexes created in production
- [ ] Test user creation works
- [ ] Test post creation works

## Notes

- Database is **always available** - no need to "launch" it
- Neon handles backups automatically
- Storage scales automatically
- No manual maintenance needed
- Safe for production use

