import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isContentLocked } from '@/lib/contentLock'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Check if content is locked for editing/exporting
 * Returns lock status for content items
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { contentIds } = await request.json()

    if (!Array.isArray(contentIds)) {
      return NextResponse.json({ error: 'contentIds must be an array' }, { status: 400 })
    }

    // Get user info
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0] as any

    // Get content items
    if (contentIds.length === 0) {
      return NextResponse.json({ locked: {} })
    }

    const placeholders = contentIds.map(() => '?').join(',')
    const contentResult = await db.execute({
      sql: `SELECT * FROM content_posts WHERE id IN (${placeholders}) AND user_id = ?`,
      args: [...contentIds, userId]
    })

    const lockStatus: Record<string, boolean> = {}
    
    for (const content of contentResult.rows) {
      const isLocked = isContentLocked(content as any, user)
      lockStatus[content.id as string] = isLocked
    }

    return NextResponse.json({ locked: lockStatus })
  } catch (error: any) {
    console.error('Check lock error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to check lock status' 
    }, { status: 500 })
  }
}
