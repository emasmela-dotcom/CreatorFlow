import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken || typeof refreshToken !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { 
        userId: string
        email: string
        type: string
      }

      // Verify it's a refresh token
      if (decoded.type !== 'refresh') {
        return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
      }

      // Verify user still exists
      const userResult = await db.execute({
        sql: 'SELECT id, email FROM users WHERE id = ?',
        args: [decoded.userId]
      })

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
      }

      const user = userResult.rows[0]

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'access' },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      return NextResponse.json({
        accessToken
      })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

