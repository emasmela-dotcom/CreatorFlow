import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Database Health Check
 * Verifies database connection and returns status
 */
export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const testResult = await db.execute({
      sql: 'SELECT NOW() as current_time, version() as postgres_version'
    })

    if (!testResult.rows || testResult.rows.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed - no response',
        connected: false
      }, { status: 500 })
    }

    // Check if core tables exist
    const tablesToCheck = [
      'users',
      'content_posts',
      'analytics',
      'project_backups',
      'user_signup_logs'
    ]

    const tableStatus: Record<string, boolean> = {}
    const tableErrors: Record<string, string> = {}
    for (const table of tablesToCheck) {
      try {
        await db.execute({ sql: `SELECT 1 FROM ${table} LIMIT 1` })
        tableStatus[table] = true
      } catch (error: any) {
        tableStatus[table] = false
        tableErrors[table] = error.message || 'Unknown error'
      }
    }

    const allTablesExist = Object.values(tableStatus).every(exists => exists)

    // Which DB is the app using? (host only, for verification)
    let dbHostRedacted: string | null = null
    try {
      const u = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || ''
      const match = u.match(/@([^/]+)\//)
      if (match) dbHostRedacted = match[1] // e.g. ep-dry-waterfall-ahwpqcaw-pooler.c-3.us-east-1.aws.neon.tech
    } catch (_) {}

    // Does users table have subscription_tier? (required for signup)
    let usersHasSubscriptionTier = false
    if (tableStatus['users']) {
      try {
        await db.execute({ sql: 'SELECT subscription_tier FROM users LIMIT 1' })
        usersHasSubscriptionTier = true
      } catch (_) {
        // column missing
      }
    }

    return NextResponse.json({
      status: 'healthy',
      connected: true,
      database: {
        currentTime: testResult.rows[0]?.current_time,
        postgresVersion: testResult.rows[0]?.postgres_version?.substring(0, 50),
        dbHostRedacted: dbHostRedacted || undefined
      },
      tables: tableStatus,
      usersHasSubscriptionTier,
      tableErrors: Object.keys(tableErrors).length > 0 ? tableErrors : undefined,
      allTablesExist,
      message: allTablesExist 
        ? 'Database is healthy and all tables exist' 
        : 'Database connected but some tables are missing. Run /api/init-db to initialize.'
    })
  } catch (error: any) {
    console.error('Database health check error:', error)
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: error.message || 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

