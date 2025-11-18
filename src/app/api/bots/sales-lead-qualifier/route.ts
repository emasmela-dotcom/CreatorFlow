import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Sales Lead Qualifier Bot - Automatically qualify sales leads
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
 * POST - Qualify a lead
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Sales Lead Qualifier
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const {
      companyName,
      contactName,
      email,
      phone,
      website,
      industry,
      companySize,
      jobTitle,
      initialMessage,
      leadSource
    } = body

    if (!email && !phone) {
      return NextResponse.json({ 
        error: 'Email or phone is required' 
      }, { status: 400 })
    }

    // Ensure tables exist (fallback)
    try {
      // Try to add missing column if table exists
      try {
        await db.execute({ sql: `ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS initial_message TEXT` })
      } catch (e) {}
      
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS sales_leads (
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
        initial_message TEXT,
        qualification_score INTEGER,
        qualification_status VARCHAR(50),
        lead_source VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Calculate qualification score (0-100)
    let score = 50 // Base score

    // Company name adds points
    if (companyName) score += 10

    // Job title indicates decision maker
    const decisionMakerTitles = ['ceo', 'founder', 'director', 'manager', 'vp', 'president']
    if (jobTitle && decisionMakerTitles.some(title => jobTitle.toLowerCase().includes(title))) {
      score += 20
    }

    // Company size indicates budget
    if (companySize) {
      if (companySize.includes('100+') || companySize.includes('500+')) {
        score += 15
      }
    }

    // Website indicates legitimacy
    if (website) score += 5

    // Industry match (if provided)
    if (industry) score += 5

    // Initial message quality
    if (initialMessage && initialMessage.length > 50) {
      score += 10
    }

    score = Math.min(100, Math.max(0, score))

    // Get qualification threshold (default to 60 if no settings table)
    let threshold = 60
    try {
      const settingsResult = await db.execute({
        sql: 'SELECT setting_value FROM sales_lead_settings WHERE user_id = ? AND setting_key = ?',
        args: [user.userId, 'qualification_threshold']
      })
      if (settingsResult.rows.length > 0) {
        threshold = parseInt(settingsResult.rows[0].setting_value) || 60
      }
    } catch (e) {
      // Settings table doesn't exist, use default
    }
    const qualificationStatus = score >= threshold ? 'qualified' : 'unqualified'

    // Save lead
    const result = await db.execute({
      sql: `
        INSERT INTO sales_leads (
          user_id, lead_source, company_name, contact_name, email, phone,
          website, industry, company_size, job_title, initial_message,
          qualification_score, qualification_status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        leadSource || 'unknown',
        companyName || null,
        contactName || null,
        email || null,
        phone || null,
        website || null,
        industry || null,
        companySize || null,
        jobTitle || null,
        initialMessage || null,
        score,
        qualificationStatus
      ]
    })

    return NextResponse.json({
      success: true,
      lead: result.rows[0],
      qualification: {
        score,
        status: qualificationStatus,
        threshold
      },
      tier
    })
  } catch (error: any) {
    console.error('Sales Lead Qualifier Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to qualify lead' 
    }, { status: 500 })
  }
}

/**
 * GET - List qualified leads
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let sqlQuery = 'SELECT * FROM sales_leads WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (status) {
      sqlQuery += ' AND qualification_status = ?'
      args.push(status)
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ?'
    args.push(limit)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      leads: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Sales Lead Qualifier Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch leads' 
    }, { status: 500 })
  }
}

