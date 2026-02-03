-- CreatorFlow365: SQL to set up users table and credits_balance
-- Run in Neon SQL Editor, psql, or your DB client.

-- ---------------------------------------------------------------------------
-- Fix: Add subscription_tier (and related columns) if missing
-- Run this first if you see "column subscription_tier of relation users does not exist"
-- ---------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50);
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check1;
ALTER TABLE users DROP CONSTRAINT IF EXISTS subscription_tier_check;
ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'starter', 'growth', 'pro', 'business', 'agency'));

-- ---------------------------------------------------------------------------
-- If you already have a users table and only need the new credits column:
-- ---------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0;

-- (If your Postgres version doesn't support ADD COLUMN IF NOT EXISTS, use:)
-- ALTER TABLE users ADD COLUMN credits_balance INTEGER DEFAULT 0;
-- (Ignore error if column already exists.)


-- ---------------------------------------------------------------------------
-- If you need the full users table from scratch:
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier VARCHAR(50) CHECK(subscription_tier IN ('free', 'starter', 'growth', 'pro', 'business', 'agency')),
  stripe_customer_id VARCHAR(255),
  trial_started_at TIMESTAMP,
  trial_end_at TIMESTAMP,
  trial_plan VARCHAR(50) CHECK(trial_plan IN ('starter', 'growth', 'pro', 'business', 'agency')),
  social_accounts TEXT,
  preferred_platforms TEXT,
  monthly_post_limit INTEGER,
  additional_posts_purchased INTEGER DEFAULT 0,
  credits_balance INTEGER DEFAULT 0,
  content_types TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
