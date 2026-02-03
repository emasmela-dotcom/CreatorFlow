-- CreatorFlow365: Add any missing columns to existing users table
-- Run once in Neon SQL Editor (or psql) to finish DB setup for signup and subscriptions.
-- Safe to run: uses IF NOT EXISTS / IF EXISTS where possible.

-- 1. subscription_tier (required for signup)
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50);
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check1;
ALTER TABLE users DROP CONSTRAINT IF EXISTS subscription_tier_check;
ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'starter', 'growth', 'pro', 'business', 'agency'));

-- 2. Stripe and trial
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_end_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_plan VARCHAR(50);
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_trial_plan_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS trial_plan_check;
ALTER TABLE users ADD CONSTRAINT users_trial_plan_check
  CHECK (trial_plan IS NULL OR trial_plan IN ('free', 'starter', 'growth', 'pro', 'business', 'agency'));

-- 3. Limits and credits
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_accounts TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_platforms TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_post_limit INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS additional_posts_purchased INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS content_types TEXT DEFAULT '[]';

-- 4. Timestamps (if table was created without them)
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 5. Optional: ensure user_signup_logs exists (for abuse prevention)
CREATE TABLE IF NOT EXISTS user_signup_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  device_fingerprint VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
