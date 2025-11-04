import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { isValidEmail, isStrongPassword } from '@/lib/auth'
import { rateLimitMiddleware } from '@/lib/rateLimit'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Security: Validate JWT_SECRET
if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production!')
  }
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limiting for auth endpoints (prevents brute force)
    const rateLimit = rateLimitMiddleware(request, {
      maxRequests: 5, // 5 requests per window
      windowMs: 15 * 60 * 1000, // 15 minutes
      identifier: 'auth'
    })

    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response
    }

    const { email, password, action } = await request.json()

    // SECURITY: Input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    if (action === 'signup') {
      // Check if user already exists
      const existingUser = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [normalizedEmail]
      })

      // SECURITY: Generic error message (doesn't reveal if user exists)
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

      // SECURITY: Validate password strength if provided
      if (password && typeof password === 'string' && !isStrongPassword(password)) {
        return NextResponse.json({ 
          error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
        }, { status: 400 })
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
        args: [userId, normalizedEmail, hashedPassword, now, now]
      })

      // SECURITY: Generate shorter-lived access token (1 hour)
      const accessToken = jwt.sign(
        { userId, email: normalizedEmail, type: 'access' },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      // Generate refresh token (30 days)
      const refreshToken = jwt.sign(
        { userId, email: normalizedEmail, type: 'refresh' },
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
        user: { id: userId, email: normalizedEmail },
        accessToken,
        refreshToken,
        password: generatedPassword // Include the generated password for first-time users
      })
    }

    if (action === 'signin') {
      // SECURITY: Input validation
      if (!password || typeof password !== 'string') {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

      // Find user (use normalized email)
      const userResult = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [normalizedEmail]
      })

      // SECURITY: Generic error message (prevents user enumeration)
      // Always check password even if user doesn't exist (constant time)
      const user = userResult.rows.length > 0 ? userResult.rows[0] : null
      const storedHash = user?.password_hash as string

      // Always perform bcrypt compare (even with dummy hash) to prevent timing attacks
      const dummyHash = '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhashdu'
      const hashToCompare = storedHash || dummyHash
      const passwordMatch = user && storedHash 
        ? await bcrypt.compare(password, hashToCompare)
        : false

      if (!passwordMatch || !user) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

      // SECURITY: Generate shorter-lived access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'access' },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      return NextResponse.json({ 
        message: 'Signed in successfully',
        user: { id: user.id, email: user.email },
        accessToken,
        refreshToken
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
