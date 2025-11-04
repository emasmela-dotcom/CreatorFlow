import { NextRequest, NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

/**
 * Initialize database schema - creates all tables
 * Run this once after setting up your Neon database connection
 * 
 * Usage: GET /api/init-db
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Add a simple check to prevent accidental multiple runs
    // You can remove this or add authentication if needed
    const { searchParams } = new URL(request.url)
    const confirm = searchParams.get('confirm')
    
    if (confirm !== 'true') {
      return NextResponse.json({ 
        message: 'This will create all database tables. Add ?confirm=true to proceed.',
        instructions: 'Call GET /api/init-db?confirm=true to initialize the database'
      })
    }

    console.log('Initializing database schema...')
    await initDatabase()
    
    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully! All tables have been created.',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to initialize database',
      details: error.stack
    }, { status: 500 })
  }
}

