import { NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

/**
 * Initialize database tables
 * Call this endpoint once to set up all required tables
 */
export async function GET() {
  try {
    console.log('Starting database initialization...')
    await initDatabase()
    console.log('Database initialization completed')
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
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
