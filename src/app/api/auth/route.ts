import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, generateToken } from '@/lib/auth'
import { Resend } from 'resend'
import bcrypt from 'bcryptjs'
import { checkAbusePrevention, logSignupAttempt, getClientIdentifier, getDeviceFingerprint } from '@/lib/abusePrevention'

// Lazy initialize Resend to avoid errors when API key is missing
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  // Ensure we always return JSON, never HTML
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const { email, password, action } = body
    
    if (!email || !password || !action) {
      return NextResponse.json({ error: 'Email, password, and action are required' }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'signup') {
        // Check if user exists
        const existingUser = await db.execute({
          sql: 'SELECT id FROM users WHERE email = ?',
          args: [email]
        })

      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // ABUSE PREVENTION: Check for abuse before allowing signup
      const abuseCheck = await checkAbusePrevention(request, email)
      if (!abuseCheck.allowed) {
        return NextResponse.json({ 
          error: abuseCheck.reason || 'Signup not allowed. Please contact support if you believe this is an error.' 
        }, { status: 403 })
      }

      // Get plan type from request (optional, defaults to 'starter' for backward compatibility)
      const { planType } = body
      const subscriptionTier = planType || 'starter'

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

        // Create user with UUID
        const userId = crypto.randomUUID()
        await db.execute({
          sql: 'INSERT INTO users (id, email, password_hash, subscription_tier, created_at) VALUES (?, ?, ?, ?, ?)',
          args: [userId, email, hashedPassword, subscriptionTier, new Date().toISOString()]
        })

      // Create account snapshot (empty state) for potential restore
      try {
        // Ensure account_snapshots table exists
        await db.execute({
          sql: `
            CREATE TABLE IF NOT EXISTS account_snapshots (
              id SERIAL PRIMARY KEY,
              user_id VARCHAR(255) NOT NULL,
              snapshot_data JSONB NOT NULL,
              created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
          `
        })
        await db.execute({
          sql: `CREATE INDEX IF NOT EXISTS idx_account_snapshots_user_id ON account_snapshots(user_id)`
        })

        // Create initial empty snapshot
        await db.execute({
          sql: `
            INSERT INTO account_snapshots (user_id, snapshot_data, created_at)
            VALUES (?, ?, NOW())
          `,
          args: [userId, JSON.stringify({ 
            empty: true, 
            createdAt: new Date().toISOString(),
            subscriptionTier: subscriptionTier,
            email: email
          })]
        })
      } catch (snapshotError) {
        // Continue even if snapshot creation fails (non-critical)
        console.log('Account snapshot creation skipped:', snapshotError)
      }

      // Log signup attempt for abuse tracking
      const ipAddress = getClientIdentifier(request)
      const deviceFingerprint = getDeviceFingerprint(request)
      await logSignupAttempt(userId, email, ipAddress, deviceFingerprint)

      // Send welcome email (optional)
      try {
        const resend = getResend()
        if (resend) {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Welcome to CreatorFlow!',
            html: '<p>Welcome to CreatorFlow! Your account has been created successfully.</p>'
          });
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

      const token = generateToken(userId, email)

      return NextResponse.json({ 
        message: 'Account created successfully',
        user: { id: userId, email },
        token
      })
    }

    if (action === 'signin') {
      try {
        // Check database connection first
        if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
          return NextResponse.json({ 
            error: 'Database not configured. Please set DATABASE_URL or NEON_DATABASE_URL in your .env.local file.',
            details: 'This is a development setup issue. Check your .env.local file.'
          }, { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        // Find user - wrap in try-catch to handle any database errors
        let userResult
        try {
          userResult = await db.execute({
            sql: 'SELECT id, email, password_hash FROM users WHERE email = ?',
            args: [email]
          })
        } catch (dbQueryError: any) {
          console.error('Database query error:', dbQueryError)
          // Return JSON error, not HTML
          return NextResponse.json({ 
            error: 'Database query failed. Please check your database connection.',
            details: process.env.NODE_ENV === 'development' ? (dbQueryError.message || String(dbQueryError)) : undefined
          }, { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        if (!userResult || userResult.rows.length === 0) {
          return NextResponse.json({ error: 'Invalid email or password' }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        const user = userResult.rows[0] as any

        if (!user || !user.password_hash) {
          return NextResponse.json({ error: 'Invalid email or password' }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash)
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid email or password' }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        const token = generateToken(String(user.id), user.email)

        return NextResponse.json({ 
          message: 'Signed in successfully',
          user: { id: user.id, email: user.email },
          token
        }, {
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (dbError: any) {
        console.error('Database error during signin:', dbError)
        console.error('Error details:', dbError.message, dbError.stack)
        // ALWAYS return JSON, never HTML
        return NextResponse.json({ 
          error: 'Database connection failed. Please check your database configuration.',
          details: process.env.NODE_ENV === 'development' ? (dbError.message || String(dbError)) : undefined
        }, { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Auth error:', error)
    console.error('Error stack:', error.stack)
    // CRITICAL: Always return JSON, never let Next.js return HTML error page
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Export error handler to catch any route-level errors
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
