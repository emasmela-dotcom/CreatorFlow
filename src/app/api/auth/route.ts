import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, generateToken } from '@/lib/auth'
import { Resend } from 'resend'
import bcrypt from 'bcryptjs'
import { checkAbusePrevention, logSignupAttempt, getClientIdentifier, getDeviceFingerprint } from '@/lib/abusePrevention'

// Lazy initialize Resend to avoid errors when API key is missing
const DEFAULT_FROM = 'CreatorFlow365 <support@creatorflow365.com>'
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}
function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM
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
    
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password.trim() : ''
    const { action } = body
    const email = rawEmail.toLowerCase()

    if (!email || !password || !action) {
      return NextResponse.json({ error: 'Email, password, and action are required' }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'signup') {
        // Check if user exists (case-insensitive)
        const existingUser = await db.execute({
          sql: 'SELECT id FROM users WHERE LOWER(TRIM(email)) = ?',
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
      const rawTier = (planType || 'starter').toLowerCase()
      const subscriptionTier = rawTier === 'professional' ? 'pro' : rawTier

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Trial without Stripe: 15 days from signup; user adds payment when ready to keep content
      const now = new Date()
      const trialEnd = new Date(now)
      trialEnd.setDate(trialEnd.getDate() + 15)
      const trialStartedAt = now.toISOString()
      const trialEndAt = trialEnd.toISOString()
      const trialPlan = subscriptionTier

        // Create user with UUID and trial (no payment yet)
        const userId = crypto.randomUUID()
        await db.execute({
          sql: `INSERT INTO users (id, email, password_hash, subscription_tier, created_at, trial_started_at, trial_end_at, trial_plan)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [userId, email, hashedPassword, subscriptionTier, now.toISOString(), trialStartedAt, trialEndAt, trialPlan]
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

      // Send welcome email (optional – set RESEND_API_KEY in Vercel)
      try {
        const resend = getResend()
        if (resend) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'
          await resend.emails.send({
            from: getFromEmail(),
            to: email,
            subject: 'Welcome to CreatorFlow365',
            html: `
              <p>Hi,</p>
              <p>Your CreatorFlow365 account is set up. You can sign in and start your free trial here:</p>
              <p><a href="${appUrl}/signin">Sign in to CreatorFlow365</a></p>
              <p>If you didn't create an account, you can ignore this email.</p>
              <p>— CreatorFlow365</p>
            `
          })
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
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
            sql: 'SELECT id, email, password_hash FROM users WHERE LOWER(TRIM(email)) = ?',
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
          return NextResponse.json({ 
            error: 'Invalid email or password',
            code: 'NO_USER'
          }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        const user = userResult.rows[0] as any
        const hash = user?.password_hash ?? user?.password
        if (!user || !hash) {
          return NextResponse.json({ 
            error: 'Invalid email or password',
            code: 'NO_HASH'
          }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        // Verify password
        const isValid = await bcrypt.compare(password, hash)
        if (!isValid) {
          return NextResponse.json({ 
            error: 'Invalid email or password',
            code: 'BAD_PASSWORD'
          }, { 
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
