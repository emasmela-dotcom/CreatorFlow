import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Test database connection and check if tables exist
 */
export async function GET() {
  try {
    // Test if expenses table exists
    const result = await db.execute({
      sql: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'expenses'
        ) as exists
      `
    })
    
    const expensesExists = result.rows[0]?.exists || false
    
    // List all tables
    const allTables = await db.execute({
      sql: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `
    })
    
    return NextResponse.json({ 
      success: true,
      expenses_table_exists: expensesExists,
      all_tables: allTables.rows.map((r: any) => r.table_name),
      table_count: allTables.rows.length
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to test database',
      details: error.stack
    }, { status: 500 })
  }
}

