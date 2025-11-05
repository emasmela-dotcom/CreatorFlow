// Import Neon client - PostgreSQL serverless database
import { neon } from '@neondatabase/serverless'

let sqlClient: any

// Initialize client function
function getClient() {
  if (sqlClient) return sqlClient
  
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || ''
  
  if (!databaseUrl || (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://'))) {
    console.warn('Database URL not configured. Set DATABASE_URL or NEON_DATABASE_URL environment variable.')
    return null
  }

  try {
    sqlClient = neon(databaseUrl)
    return sqlClient
  } catch (error) {
    console.warn('Database client not initialized:', error)
    return null
  }
}

// Wrapper to maintain compatibility with existing code
// Converts db.execute({ sql, args }) to Neon's format
interface DbInterface {
  execute: (query: { sql: string; args?: any[] }) => Promise<{ rows: any[]; rowsAffected: number }>
  batch: (queries: Array<{ sql: string; args?: any[] }>) => Promise<Array<{ rows: any[]; rowsAffected: number }>>
  transaction: (callback: (tx: DbInterface) => Promise<any>) => Promise<any>
}

export const db: DbInterface = {
  execute: async (query: { sql: string; args?: any[] }) => {
    const client = getClient()
    if (!client) {
      return { rows: [], rowsAffected: 0 }
    }
    
    try {
      // Convert SQLite placeholders (?) to PostgreSQL placeholders ($1, $2, etc.)
      let sqlQuery = query.sql
      const args = query.args || []
      
      if (args.length > 0) {
        // Replace ? placeholders with $1, $2, etc.
        let argIndex = 1
        sqlQuery = sqlQuery.replace(/\?/g, () => `$${argIndex++}`)
      }
      
      // Use client as tagged template - build proper template literal
      let result: any
      
      if (args.length === 0) {
        // No parameters - use template literal directly
        const templateArray = Object.assign([sqlQuery], { raw: [sqlQuery] }) as TemplateStringsArray
        result = await client(templateArray)
      } else {
        // Build template parts and values for tagged template
        // Template literals: sql`text${val1}more${val2}end`
        // Becomes: sql(['text', 'more', 'end'], val1, val2)
        const parts: string[] = []
        const values: any[] = []
        let queryText = sqlQuery
        let idx = 1
        
        while (queryText.includes(`$${idx}`)) {
          const placeholder = `$${idx}`
          const pos = queryText.indexOf(placeholder)
          parts.push(queryText.substring(0, pos))
          values.push(args[idx - 1])
          queryText = queryText.substring(pos + placeholder.length)
          idx++
        }
        parts.push(queryText) // final part
        
        // Create proper TemplateStringsArray with raw property
        const templateArray = Object.assign([...parts], { raw: [...parts] }) as TemplateStringsArray
        
        // Call as tagged template function
        result = await client(templateArray, ...values)
      }
      
      // Convert Neon result format to expected format
      // Neon returns an array of rows directly
      return {
        rows: Array.isArray(result) ? result : [],
        rowsAffected: Array.isArray(result) ? result.length : 0
      }
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  },
  
  // Batch operations for Neon
  batch: async (queries: Array<{ sql: string; args?: any[] }>) => {
    const client = getClient()
    if (!client) {
      return []
    }
    
    try {
      const results = await Promise.all(
        queries.map(q => {
          let sqlQuery = q.sql
          const args = q.args || []
          
          if (args.length > 0) {
            let argIndex = 1
            sqlQuery = sqlQuery.replace(/\?/g, () => `$${argIndex++}`)
          }
          
          // Use client as tagged template for batch
          if (!q.args || q.args.length === 0) {
            const templateArray = Object.assign([sqlQuery], { raw: [sqlQuery] }) as TemplateStringsArray
            return client(templateArray)
          }
          
          const parts: string[] = []
          const values: any[] = []
          let text = sqlQuery
          let idx = 1
          while (text.includes(`$${idx}`)) {
            const ph = `$${idx}`
            const pos = text.indexOf(ph)
            parts.push(text.substring(0, pos))
            values.push(q.args[idx - 1])
            text = text.substring(pos + ph.length)
            idx++
          }
          parts.push(text)
          
          const templateArray = Object.assign([...parts], { raw: [...parts] }) as TemplateStringsArray
          return client(templateArray, ...values)
        })
      )
      
      return results.map(result => ({
        rows: Array.isArray(result) ? result : (result as any).rows || [],
        rowsAffected: (result as any).rowCount || 0
      }))
    } catch (error) {
      console.error('Database batch error:', error)
      throw error
    }
  },
  
  // Transaction support (simplified for Neon serverless)
  transaction: async (callback: (tx: DbInterface) => Promise<any>) => {
    return await callback(db)
  }
}

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
  is_restored: boolean // PostgreSQL uses BOOLEAN
  created_at: string
  restored_at: string | null
}

// Initialize database schema (run this once)
export async function initDatabase() {
  try {
    // Create users table
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        full_name VARCHAR(255),
        avatar_url TEXT,
        subscription_tier VARCHAR(50) CHECK(subscription_tier IN ('starter', 'growth', 'pro', 'business', 'agency')),
        stripe_customer_id VARCHAR(255),
        trial_started_at TIMESTAMP,
        trial_end_at TIMESTAMP,
        trial_plan VARCHAR(50) CHECK(trial_plan IN ('starter', 'growth', 'pro', 'business', 'agency')),
        social_accounts TEXT,
        monthly_post_limit INTEGER,
        additional_posts_purchased INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    // Add new columns to existing table if they don't exist (migration)
    // PostgreSQL doesn't support IF NOT EXISTS for ALTER TABLE, so we check first
    const columnsToAdd = [
      { name: 'subscription_tier', sql: `ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) CHECK(subscription_tier IN ('starter', 'growth', 'pro', 'business', 'agency'))` },
      { name: 'stripe_customer_id', sql: `ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255)` },
      { name: 'trial_started_at', sql: `ALTER TABLE users ADD COLUMN trial_started_at TIMESTAMP` },
      { name: 'trial_end_at', sql: `ALTER TABLE users ADD COLUMN trial_end_at TIMESTAMP` },
      { name: 'trial_plan', sql: `ALTER TABLE users ADD COLUMN trial_plan VARCHAR(50) CHECK(trial_plan IN ('starter', 'growth', 'pro', 'business', 'agency'))` },
      { name: 'social_accounts', sql: `ALTER TABLE users ADD COLUMN social_accounts TEXT` },
      { name: 'monthly_post_limit', sql: `ALTER TABLE users ADD COLUMN monthly_post_limit INTEGER` },
      { name: 'additional_posts_purchased', sql: `ALTER TABLE users ADD COLUMN additional_posts_purchased INTEGER DEFAULT 0` },
      { name: 'created_at', sql: `ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW()` },
      { name: 'updated_at', sql: `ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW()` }
    ]
    
    for (const column of columnsToAdd) {
      try {
        // Check if column exists by trying to select it
        await db.execute({ sql: `SELECT ${column.name} FROM users LIMIT 1` })
        // If we get here, column exists, skip
      } catch (e: any) {
        // Column doesn't exist, try to add it
        try {
          await db.execute({ sql: column.sql })
          console.log(`Added column: ${column.name}`)
        } catch (addError: any) {
          if (!addError.message?.includes('duplicate') && !addError.message?.includes('already exists')) {
            console.warn(`Could not add ${column.name} column:`, addError.message)
          }
        }
      }
    }

    // Create content_posts table
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS content_posts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL CHECK(platform IN ('instagram', 'twitter', 'linkedin', 'tiktok', 'youtube')),
        content TEXT NOT NULL,
        media_urls TEXT DEFAULT '[]',
        scheduled_at TIMESTAMP,
        published_at TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'failed')),
        engagement_metrics JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Create analytics table
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS analytics (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        metric_type VARCHAR(50) NOT NULL CHECK(metric_type IN ('followers', 'engagement', 'reach', 'impressions', 'clicks')),
        value DOUBLE PRECISION NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Create project_backups table
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS project_backups (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        trial_started_at TIMESTAMP NOT NULL,
        backup_data JSONB NOT NULL,
        is_restored BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        restored_at TIMESTAMP
      )
    `
    })

    // Create indexes for performance
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_content_posts_user_id ON content_posts(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_project_backups_user_id ON project_backups(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_project_backups_restored ON project_backups(is_restored)` })

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

