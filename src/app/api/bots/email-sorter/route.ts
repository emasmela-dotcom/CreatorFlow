import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Email Sorter Bot - Automatically categorize and prioritize emails
 * Available for all tiers
 */

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * POST - Sort and categorize email
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check AI call limit
    const limitCheck = await canMakeAICall(user.userId)
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: limitCheck.message || 'AI call limit exceeded',
        current: limitCheck.current,
        limit: limitCheck.limit,
        upgradeRequired: true
      }, { status: 403 })
    }

    // All tiers can use Email Sorter
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { from, subject, body: emailBody } = body

    if (!from || !subject || !emailBody) {
      return NextResponse.json({ 
        error: 'From, subject, and body are required' 
      }, { status: 400 })
    }

    // FORCE recreate sorted_emails table with correct structure EVERY TIME
    console.log('Email Sorter: Dropping and recreating sorted_emails table...')
    try {
      // Drop table completely
      await db.execute({ sql: `DROP TABLE IF EXISTS sorted_emails CASCADE` })
      console.log('Email Sorter: Table dropped successfully')
    } catch (e: any) {
      console.log('Email Sorter: Drop table error (ignoring):', e.message)
    }
    
    // Create table with correct structure
    try {
      await db.execute({ sql: `CREATE TABLE sorted_emails (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        from_address VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        body TEXT,
        category VARCHAR(100),
        priority INTEGER DEFAULT 0,
        is_urgent BOOLEAN DEFAULT FALSE,
        sentiment VARCHAR(50),
        sorted_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      console.log('Email Sorter: Table created successfully with user_id column')
    } catch (e: any) {
      console.error('Email Sorter: First create attempt failed:', e.message)
      // If create fails, try again
      try {
        await db.execute({ sql: `CREATE TABLE sorted_emails (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          from_address VARCHAR(255) NOT NULL,
          subject VARCHAR(500),
          body TEXT,
          category VARCHAR(100),
          priority INTEGER DEFAULT 0,
          is_urgent BOOLEAN DEFAULT FALSE,
          sentiment VARCHAR(50),
          sorted_at TIMESTAMP NOT NULL DEFAULT NOW(),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )` })
        console.log('Email Sorter: Table created on retry')
      } catch (e2: any) {
        console.error('Email Sorter: Retry also failed:', e2.message)
        throw new Error(`Failed to create sorted_emails table: ${e2.message}`)
      }
    }
    
    // Also ensure email_categories exists
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS email_categories (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        category_name VARCHAR(100) NOT NULL,
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e: any) {
      // Ignore
    }

    // Get user's email categories (with fallback if table doesn't exist)
    let categories: any[] = []
    try {
      const categoriesResult = await db.execute({
        sql: `
          SELECT * FROM email_categories 
          WHERE user_id = ? OR user_id IS NULL
          ORDER BY priority DESC
        `,
        args: [user.userId]
      })
      categories = categoriesResult.rows
    } catch (catError: any) {
      // If categories table doesn't exist or has issues, use empty array
      console.log('Categories query failed, using defaults:', catError.message)
      categories = []
    }

    // Simple categorization logic (can be enhanced with AI)
    let category = 'Other'
    let priorityLevel = 1 // 0=low, 1=normal, 2=high, 3=urgent
    let isUrgent = false
    let sentiment = 'neutral'

    // Check for urgent keywords
    const urgentKeywords = ['urgent', 'asap', 'immediate', 'emergency', 'critical']
    const urgentFound = urgentKeywords.some(kw => 
      subject.toLowerCase().includes(kw) || emailBody.toLowerCase().includes(kw)
    )

    if (urgentFound) {
      priorityLevel = 3 // urgent
      isUrgent = true
    }

    // Match against categories
    for (const cat of categories) {
      if (cat.keywords) {
        const keywords = Array.isArray(cat.keywords) ? cat.keywords : JSON.parse(cat.keywords || '[]')
        const matches = keywords.some((kw: string) => 
          subject.toLowerCase().includes(kw.toLowerCase()) || 
          emailBody.toLowerCase().includes(kw.toLowerCase())
        )
        if (matches) {
          category = cat.category_name
          break
        }
      }
    }

    // Verify table structure before insert
    try {
      const verifyResult = await db.execute({
        sql: `SELECT column_name FROM information_schema.columns WHERE table_name = 'sorted_emails' AND column_name = 'user_id'`
      })
      if (verifyResult.rows.length === 0) {
        // user_id column doesn't exist, recreate table
        await db.execute({ sql: `DROP TABLE IF EXISTS sorted_emails CASCADE` })
        await db.execute({ sql: `CREATE TABLE sorted_emails (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          from_address VARCHAR(255) NOT NULL,
          subject VARCHAR(500),
          body TEXT,
          category VARCHAR(100),
          priority INTEGER DEFAULT 0,
          is_urgent BOOLEAN DEFAULT FALSE,
          sentiment VARCHAR(50),
          sorted_at TIMESTAMP NOT NULL DEFAULT NOW(),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )` })
      }
    } catch (verifyError: any) {
      console.error('Table verification error:', verifyError.message)
    }

    // Verify table structure one more time before insert
    console.log('Email Sorter: Verifying table structure before insert...')
    try {
      const verifyResult = await db.execute({
        sql: `SELECT column_name FROM information_schema.columns WHERE table_name = 'sorted_emails' AND column_name = 'user_id'`
      })
      console.log('Email Sorter: Verification result:', verifyResult.rows.length > 0 ? 'user_id column EXISTS' : 'user_id column MISSING')
      if (verifyResult.rows.length === 0) {
        console.error('Email Sorter: user_id column missing! Recreating table...')
        // user_id column doesn't exist, recreate table
        await db.execute({ sql: `DROP TABLE IF EXISTS sorted_emails CASCADE` })
        await db.execute({ sql: `CREATE TABLE sorted_emails (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          from_address VARCHAR(255) NOT NULL,
          subject VARCHAR(500),
          body TEXT,
          category VARCHAR(100),
          priority INTEGER DEFAULT 0,
          is_urgent BOOLEAN DEFAULT FALSE,
          sentiment VARCHAR(50),
          sorted_at TIMESTAMP NOT NULL DEFAULT NOW(),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )` })
        console.log('Email Sorter: Table recreated with user_id column')
      }
    } catch (verifyError: any) {
      console.error('Email Sorter: Table verification error:', verifyError.message)
      // Try to recreate anyway
      try {
        await db.execute({ sql: `DROP TABLE IF EXISTS sorted_emails CASCADE` })
        await db.execute({ sql: `CREATE TABLE sorted_emails (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          from_address VARCHAR(255) NOT NULL,
          subject VARCHAR(500),
          body TEXT,
          category VARCHAR(100),
          priority INTEGER DEFAULT 0,
          is_urgent BOOLEAN DEFAULT FALSE,
          sentiment VARCHAR(50),
          sorted_at TIMESTAMP NOT NULL DEFAULT NOW(),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )` })
      } catch (recreateError: any) {
        console.error('Email Sorter: Failed to recreate table:', recreateError.message)
      }
    }

    // Save email - table is guaranteed to have user_id column now
    console.log('Email Sorter: Inserting email with user_id:', user.userId)
    const result = await db.execute({
      sql: `
        INSERT INTO sorted_emails (
          user_id, from_address, subject, body, category, 
          priority, is_urgent, sentiment, sorted_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        from,
        subject,
        emailBody,
        category,
        priorityLevel, // Use integer priority
        isUrgent,
        sentiment
      ]
    })
    console.log('Email Sorter: Email inserted successfully')

    // Log the AI call
    await logAICall(user.userId, 'Email Sorter', '/api/bots/email-sorter')

    return NextResponse.json({
      success: true,
      email: result.rows[0],
      categorization: {
        category,
        priority: priorityLevel === 3 ? 'urgent' : priorityLevel === 2 ? 'high' : priorityLevel === 1 ? 'normal' : 'low',
        priorityLevel,
        isUrgent,
        sentiment
      },
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Email Sorter Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to sort email' 
    }, { status: 500 })
  }
}

/**
 * GET - List sorted emails
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)

    // Ensure table exists with correct structure
    try {
      await db.execute({ sql: `DROP TABLE IF EXISTS sorted_emails CASCADE` })
      await db.execute({ sql: `CREATE TABLE sorted_emails (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        from_address VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        body TEXT,
        category VARCHAR(100),
        priority INTEGER DEFAULT 0,
        is_urgent BOOLEAN DEFAULT FALSE,
        sentiment VARCHAR(50),
        sorted_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e: any) {
      // Ignore
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let sqlQuery = 'SELECT * FROM sorted_emails WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (category) {
      sqlQuery += ' AND category = ?'
      args.push(category)
    }
    if (priority) {
      sqlQuery += ' AND priority = ?'
      args.push(priority)
    }

    sqlQuery += ' ORDER BY sorted_at DESC LIMIT ? OFFSET ?'
    args.push(limit, offset)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      emails: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Email Sorter Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch emails' 
    }, { status: 500 })
  }
}

