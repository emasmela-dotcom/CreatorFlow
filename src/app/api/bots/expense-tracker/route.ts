import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Expense Tracker Bot - Track and manage expenses
 * Available for all tiers
 */

interface Expense {
  id?: number
  expense_date: string
  amount: number
  description: string
  category_id?: number | null
  payment_method?: string
  merchant?: string
  receipt_url?: string
  receipt_text?: string
  tags?: string[]
  currency?: string
  is_recurring?: boolean
  recurring_frequency?: string
  notes?: string
}

/**
 * Get user's plan tier
 */
async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })

    if (userResult.rows.length === 0) {
      return 'starter'
    }

    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * GET - List expenses
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Expense Tracker
    const tier = await getUserPlanTier(user.userId)

    // Ensure expenses table exists (fallback)
    try {
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
    } catch (createError: any) {
      // Table might already exist, continue
      console.log('Expenses table check:', createError.message)
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query based on filters
    let sqlQuery = `
      SELECT e.*, c.category_name, c.color, c.icon
      FROM expenses e
      LEFT JOIN expense_categories c ON e.category_id = c.id
      WHERE e.user_id = ?
    `
    const args: any[] = [user.userId]

    if (startDate) {
      sqlQuery += ' AND e.expense_date >= ?'
      args.push(startDate)
    }
    if (endDate) {
      sqlQuery += ' AND e.expense_date <= ?'
      args.push(endDate)
    }
    if (categoryId) {
      sqlQuery += ' AND e.category_id = ?'
      args.push(parseInt(categoryId))
    }

    sqlQuery += ' ORDER BY e.expense_date DESC LIMIT ? OFFSET ?'
    args.push(limit, offset)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      expenses: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Expense Tracker Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch expenses' 
    }, { status: 500 })
  }
}

/**
 * POST - Create expense
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

    // Check tier
    // All tiers can use Expense Tracker
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const {
      expenseDate,
      amount,
      description,
      categoryId,
      paymentMethod,
      merchant,
      receiptUrl,
      receiptText,
      tags,
      currency = 'USD',
      isRecurring = false,
      recurringFrequency,
      notes
    } = body

    if (!expenseDate || !amount || !description) {
      return NextResponse.json({ 
        error: 'Date, amount, and description are required' 
      }, { status: 400 })
    }

    // Ensure expenses table exists (fallback)
    try {
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
    } catch (createError: any) {
      // Table might already exist, continue
      console.log('Expenses table check:', createError.message)
    }

    // Insert expense
    const result = await db.execute({
      sql: `
        INSERT INTO expenses (
          user_id, expense_date, amount, description, category_id, 
          payment_method, merchant, receipt_url, receipt_text, tags, 
          currency, is_recurring, recurring_frequency, notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `,
      args: [
        user.userId,
        expenseDate,
        parseFloat(amount),
        description,
        categoryId || null,
        paymentMethod || null,
        merchant || null,
        receiptUrl || null,
        receiptText || null,
        JSON.stringify(tags || []),
        currency,
        isRecurring,
        recurringFrequency || null,
        notes || null
      ]
    })

    // Log the AI call
    await logAICall(user.userId, 'Expense Tracker', '/api/bots/expense-tracker')

    return NextResponse.json({
      success: true,
      expense: result.rows[0],
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Expense Tracker Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create expense' 
    }, { status: 500 })
  }
}

