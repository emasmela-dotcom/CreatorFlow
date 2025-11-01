import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Test endpoint for verifying system health
 * Useful for testing database connectivity and basic operations
 */
export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const testResult = await db.execute({
      sql: 'SELECT 1 as test',
      args: []
    })

    // Test table existence by querying schema
    const tablesResult = await db.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'content_posts', 'analytics', 'project_backups')`,
      args: []
    })

    const tables = tablesResult.rows.map((row: any) => row.name as string)

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      tables: {
        exists: tables,
        expected: ['users', 'content_posts', 'analytics', 'project_backups'],
        allPresent: ['users', 'content_posts', 'analytics', 'project_backups'].every(t => tables.includes(t))
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

