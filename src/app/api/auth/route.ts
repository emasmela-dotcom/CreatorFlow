import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    if (action === 'signup') {
      // Check if user already exists
      const existingUser = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      })

      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // Generate a server-side password if one was not provided by the client
      const generatedPassword = (!password || typeof password !== 'string' || password.length < 8)
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
        : password

      // Hash password
      const hashedPassword = await bcrypt.hash(generatedPassword, 10)

      // Create user
      const userId = randomUUID()
      const now = new Date().toISOString()

      await db.execute({
        sql: `INSERT INTO users (id, email, password_hash, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?)`,
        args: [userId, email, hashedPassword, now, now]
      })

      // Create a simple password storage (you might want a separate passwords table)
      // For now, we'll store it in a simple way - you may want to add a passwords table
      
      // Generate JWT token
      const token = jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      // Send welcome email (optional)
      try {
        console.log('Signup → email:', email)
      } catch (emailError) {
        console.log('Email sending failed, but signup succeeded:', emailError)
      }

      return NextResponse.json({ 
        message: 'Account created successfully',
        user: { id: userId, email },
        token,
        password: generatedPassword // Include the generated password for first-time users
      })
    }

    if (action === 'signin') {
      // Find user
      const userResult = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      })

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
      }

      const user = userResult.rows[0]
      const storedHash = user.password_hash as string

      if (!storedHash || !password) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, storedHash)

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      return NextResponse.json({ 
        message: 'Signed in successfully',
        user: { id: user.id, email: user.email },
        token
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
      
      const userResult = await db.execute({
        sql: 'SELECT id, email, full_name, avatar_url, subscription_tier, created_at FROM users WHERE id = ?',
        args: [decoded.userId]
      })

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const user = userResult.rows[0]
      return NextResponse.json({ 
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          subscription_tier: user.subscription_tier
        }
      })
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
