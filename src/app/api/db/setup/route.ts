import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Complete Database Setup
 * Initializes all tables, indexes, and verifies setup
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting complete database setup...')

    // Step 1: Initialize database schema
    console.log('📋 Step 1: Creating tables...')
    await initDatabase()
    console.log('✅ Tables created')

    // Step 2: Verify critical tables exist
    console.log('🔍 Step 2: Verifying tables...')
    const criticalTables = ['users', 'content_posts', 'analytics', 'project_backups']
    const verification: Record<string, boolean> = {}

    for (const table of criticalTables) {
      try {
        await db.execute({ sql: `SELECT COUNT(*) FROM ${table}` })
        verification[table] = true
      } catch (error: any) {
        verification[table] = false
        console.error(`❌ Table ${table} verification failed:`, error.message)
      }
    }

    const allVerified = Object.values(verification).every(v => v === true)

    // Step 3: Check indexes
    console.log('📊 Step 3: Checking indexes...')
    const indexCheck = await db.execute({
      sql: `
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'content_posts', 'analytics')
        LIMIT 10
      `
    })

    return NextResponse.json({
      success: allVerified,
      message: allVerified 
        ? 'Database setup completed successfully!' 
        : 'Database setup completed with warnings - some tables may be missing',
      tables: verification,
      indexesFound: indexCheck.rows.length,
      nextSteps: allVerified 
        ? ['Database is ready to use', 'You can now create user accounts', 'All features are available']
        : ['Run /api/init-db again to retry', 'Check database connection string', 'Verify Neon database is active']
    })
  } catch (error: any) {
    console.error('❌ Database setup error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to set up database',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      troubleshooting: [
        'Check DATABASE_URL or NEON_DATABASE_URL environment variable',
        'Verify Neon database is active and accessible',
        'Check network connectivity to Neon',
        'Review error details above'
      ]
    }, { status: 500 })
  }
}

