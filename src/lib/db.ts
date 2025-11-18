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
  preferred_platforms: string | null // JSON array of preferred platforms for content creation ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']
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
        preferred_platforms TEXT,
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
      { name: 'preferred_platforms', sql: `ALTER TABLE users ADD COLUMN preferred_platforms TEXT` },
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

    // Create user_signup_logs table for abuse prevention
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS user_signup_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        device_fingerprint VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // ===== BOT TABLES =====
    console.log('Creating bot tables...')
    
    // Expense Tracker Bot tables
    console.log('Creating expenses table...')
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        expense_date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        category_id INTEGER,
        payment_method VARCHAR(50),
        merchant VARCHAR(255),
        receipt_url TEXT,
        receipt_text TEXT,
        tags TEXT,
        currency VARCHAR(10) DEFAULT 'USD',
        is_recurring BOOLEAN DEFAULT FALSE,
        recurring_frequency VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS expense_categories (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        category_name VARCHAR(100) NOT NULL,
        color VARCHAR(20),
        icon VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Invoice Generator Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        client_id INTEGER,
        invoice_date DATE NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_rate DECIMAL(5, 2) DEFAULT 0,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        notes TEXT,
        terms TEXT,
        payment_terms VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS invoice_clients (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255),
        company_name VARCHAR(255),
        address TEXT,
        phone VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS invoice_payments (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        payment_amount DECIMAL(10, 2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS invoice_company_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        company_name VARCHAR(255),
        invoice_prefix VARCHAR(20) DEFAULT 'INV',
        next_invoice_number INTEGER DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Customer Service Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS customer_conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        conversation_id VARCHAR(255) UNIQUE NOT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS customer_messages (
        id SERIAL PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS customer_knowledge_base (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        keywords TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Meeting Scheduler Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS scheduled_meetings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        attendees TEXT,
        location VARCHAR(255),
        meeting_type VARCHAR(50) DEFAULT 'standard',
        status VARCHAR(50) DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Social Media Manager Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS social_media_posts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        media_urls TEXT,
        scheduled_at TIMESTAMP,
        hashtags TEXT,
        status VARCHAR(50) DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'failed')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Content Repurposing Bot tables
    console.log('Creating repurposed_content table...')
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS repurposed_content (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        original_content TEXT NOT NULL,
        original_type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        repurposed_content TEXT NOT NULL,
        format_type VARCHAR(50),
        character_count INTEGER,
        hashtags TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Content Gap Analyzer Bot tables
    console.log('Creating content_gap_analysis table...')
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS content_gap_analysis (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        niche VARCHAR(255),
        target_audience TEXT,
        competitor_topics TEXT,
        your_topics TEXT,
        gap_topics TEXT,
        recommended_formats TEXT,
        priority_score INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    console.log('Creating content_gap_suggestions table...')
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS content_gap_suggestions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        analysis_id INTEGER,
        topic VARCHAR(255) NOT NULL,
        format_type VARCHAR(50),
        angle TEXT,
        priority_score INTEGER,
        reason TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Sales Lead Qualifier Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS sales_leads (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        website VARCHAR(255),
        industry VARCHAR(100),
        company_size VARCHAR(50),
        job_title VARCHAR(100),
        qualification_score INTEGER,
        qualification_status VARCHAR(50),
        lead_source VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Website Chat Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS website_chat_conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        visitor_name VARCHAR(255),
        visitor_email VARCHAR(255),
        visitor_phone VARCHAR(50),
        page_url TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS website_chat_messages (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Content Writer Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS generated_content (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        topic TEXT NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        tone VARCHAR(50),
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Product Recommendation Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        image_url TEXT,
        tags TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        customer_id VARCHAR(255),
        product_id INTEGER,
        category VARCHAR(100),
        preferences TEXT,
        recommendation_score DECIMAL(5, 2),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Email Sorter Bot tables
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS email_accounts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        email_address VARCHAR(255) NOT NULL,
        provider VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })
    
    await db.execute({
      sql: `
      CREATE TABLE IF NOT EXISTS email_categories (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        category_name VARCHAR(100) NOT NULL,
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    })

    // Create indexes for performance
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_content_posts_user_id ON content_posts(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_project_backups_user_id ON project_backups(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_project_backups_restored ON project_backups(is_restored)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_user_signup_logs_ip ON user_signup_logs(ip_address)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_user_signup_logs_email ON user_signup_logs(email)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_user_signup_logs_created ON user_signup_logs(created_at)` })
    
    // Bot table indexes
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_customer_conversations_user_id ON customer_conversations(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_customer_messages_conversation_id ON customer_messages(conversation_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_scheduled_meetings_user_id ON scheduled_meetings(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_social_media_posts_user_id ON social_media_posts(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_repurposed_content_user_id ON repurposed_content(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_content_gap_analysis_user_id ON content_gap_analysis(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_content_gap_suggestions_user_id ON content_gap_suggestions(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_content_gap_suggestions_analysis_id ON content_gap_suggestions(analysis_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_sales_leads_user_id ON sales_leads(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_website_chat_conversations_user_id ON website_chat_conversations(user_id)` })
    await db.execute({ sql: `CREATE INDEX IF NOT EXISTS idx_website_chat_messages_session_id ON website_chat_messages(session_id)` })

    console.log('✅ Database initialized successfully - all tables created')
  } catch (error: any) {
    console.error('❌ Error initializing database:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    throw error
  }
}

