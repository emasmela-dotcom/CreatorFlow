import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isStrongPassword } from '@/lib/auth'
import bcrypt from 'bcryptjs'

/**
 * Forgot Password API
 * Simple password reset - for production, add email verification with tokens
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action, newPassword } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailNorm = email.trim().toLowerCase()
    if (!emailNorm) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists (case-insensitive)
    const userResult = await db.execute({
      sql: 'SELECT id, email FROM users WHERE LOWER(TRIM(email)) = ?',
      args: [emailNorm]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      })
    }
    const row = userResult.rows[0] as Record<string, unknown>
    const userId = (row?.id ?? row?.ID) as string
    if (!userId) {
      return NextResponse.json({ error: 'User record invalid' }, { status: 500 })
    }

    if (action === 'request') {
      // In production, send email with reset token
      // For now, just allow direct reset
      return NextResponse.json({ 
        message: 'You can now reset your password. Enter your new password below.',
        canReset: true
      })
    }

    if (action === 'reset') {
      const newPasswordTrimmed = typeof newPassword === 'string' ? newPassword.trim() : ''
      if (!newPasswordTrimmed) {
        return NextResponse.json({ error: 'New password is required' }, { status: 400 })
      }

      if (!isStrongPassword(newPasswordTrimmed)) {
        return NextResponse.json({ 
          error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
        }, { status: 400 })
      }

      // Hash new password (trimmed so signin trim matches)
      const hashedPassword = await bcrypt.hash(newPasswordTrimmed, 10)

      // Update password by user id (reliable regardless of email casing in DB)
      await db.execute({
        sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
        args: [hashedPassword, userId]
      })

      return NextResponse.json({ 
        message: 'Password reset successfully!' 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process password reset' 
    }, { status: 500 })
  }
}

