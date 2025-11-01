import { createClient } from '@libsql/client/web'

// Turso database connection
// Get connection from environment variables
const url = process.env.TURSO_DATABASE_URL || ''
const authToken = process.env.TURSO_AUTH_TOKEN || ''

if (!url || !authToken) {
  console.warn('Turso database credentials not found. Using in-memory database for development.')
}

// Create Turso client
export const db = createClient({
  url: url || 'file:local.db', // Use local file for development if no credentials
  authToken: authToken
})

// Database schema types
export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: 'starter' | 'growth' | 'pro' | 'business' | 'agency' | null
  stripe_customer_id: string | null
  trial_started_at: string | null
  trial_end_at: string | null
  trial_plan: 'starter' | 'growth' | 'pro' | 'business' | 'agency' | null
  social_accounts: string | null // JSON array of locked social accounts ['instagram', 'twitter', 'facebook']
  monthly_post_limit: number | null
  additional_posts_purchased: number | null
  created_at: string
  updated_at: string
}

export interface ContentPost {
  id: string
  user_id: string
  platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  content: string
  media_urls: string
  scheduled_at: string | null
  published_at: string | null
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement_metrics: string | null
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  user_id: string
  platform: string
  metric_type: 'followers' | 'engagement' | 'reach' | 'impressions' | 'clicks'
  value: number
  date: string
  created_at: string
}

export interface ProjectBackup {
  id: string
  user_id: string
  trial_started_at: string
  backup_data: string // JSON string
  is_restored: number // SQLite uses 0/1 for boolean
  created_at: string
  restored_at: string | null
}

// Initialize database schema (run this once)
export async function initDatabase() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        full_name TEXT,
        avatar_url TEXT,
        subscription_tier TEXT CHECK(subscription_tier IN ('starter', 'growth', 'pro', 'business', 'agency')),
        stripe_customer_id TEXT,
        trial_started_at TEXT,
        trial_end_at TEXT,
        trial_plan TEXT CHECK(trial_plan IN ('starter', 'growth', 'pro', 'business', 'agency')),
        social_accounts TEXT,
        monthly_post_limit INTEGER,
        additional_posts_purchased INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    
    // Add new columns to existing table if they don't exist (migration)
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN social_accounts TEXT`)
    } catch (e: any) {
      // Column already exists, ignore
      if (!e.message?.includes('duplicate column')) {
        console.warn('Could not add social_accounts column:', e.message)
      }
    }
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN monthly_post_limit INTEGER`)
    } catch (e: any) {
      if (!e.message?.includes('duplicate column')) {
        console.warn('Could not add monthly_post_limit column:', e.message)
      }
    }
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN additional_posts_purchased INTEGER DEFAULT 0`)
    } catch (e: any) {
      if (!e.message?.includes('duplicate column')) {
        console.warn('Could not add additional_posts_purchased column:', e.message)
      }
    }

    // Create content_posts table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        platform TEXT NOT NULL CHECK(platform IN ('instagram', 'twitter', 'linkedin', 'tiktok', 'youtube')),
        content TEXT NOT NULL,
        media_urls TEXT DEFAULT '[]',
        scheduled_at TEXT,
        published_at TEXT,
        status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'failed')),
        engagement_metrics TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create analytics table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        platform TEXT NOT NULL,
        metric_type TEXT NOT NULL CHECK(metric_type IN ('followers', 'engagement', 'reach', 'impressions', 'clicks')),
        value REAL NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create project_backups table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS project_backups (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        trial_started_at TEXT NOT NULL,
        backup_data TEXT NOT NULL,
        is_restored INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        restored_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create indexes for performance
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_posts_user_id ON content_posts(user_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_project_backups_user_id ON project_backups(user_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_project_backups_restored ON project_backups(is_restored)`)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

