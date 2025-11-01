import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * GET - Get user's locked social accounts
 * POST - Lock in social accounts (can only be done once during trial/signup)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const result = await db.execute({
      sql: 'SELECT social_accounts FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const socialAccounts = result.rows[0].social_accounts 
      ? JSON.parse(result.rows[0].social_accounts as string)
      : []

    return NextResponse.json({ socialAccounts })
  } catch (error: any) {
    console.error('Get social accounts error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get social accounts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { socialAccounts } = await request.json()

    if (!Array.isArray(socialAccounts) || socialAccounts.length === 0) {
      return NextResponse.json({ error: 'Social accounts array is required' }, { status: 400 })
    }

    // Valid platforms
    const validPlatforms = ['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'snapchat']
    const invalidPlatforms = socialAccounts.filter((acc: string) => !validPlatforms.includes(acc.toLowerCase()))
    
    if (invalidPlatforms.length > 0) {
      return NextResponse.json({ 
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}. Valid platforms: ${validPlatforms.join(', ')}` 
      }, { status: 400 })
    }

    // Check if user already has locked accounts
    const userResult = await db.execute({
      sql: 'SELECT social_accounts FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingAccounts = userResult.rows[0].social_accounts
      ? JSON.parse(userResult.rows[0].social_accounts as string)
      : []

    // If accounts are already locked, don't allow changes (unless admin override)
    if (existingAccounts.length > 0) {
      return NextResponse.json({ 
        error: 'Social accounts are already locked in. They cannot be changed.',
        lockedAccounts: existingAccounts
      }, { status: 400 })
    }

    // Lock in the social accounts
    await db.execute({
      sql: 'UPDATE users SET social_accounts = ?, updated_at = datetime("now") WHERE id = ?',
      args: [JSON.stringify(socialAccounts.map((acc: string) => acc.toLowerCase())), decoded.userId]
    })

    return NextResponse.json({ 
      message: 'Social accounts locked in successfully',
      socialAccounts: socialAccounts.map((acc: string) => acc.toLowerCase())
    })
  } catch (error: any) {
    console.error('Lock social accounts error:', error)
    return NextResponse.json({ error: error.message || 'Failed to lock social accounts' }, { status: 500 })
  }
}

