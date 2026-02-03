/**
 * Abuse Prevention for Free Trials
 * Prevents users from creating multiple accounts to abuse free trials
 */

import { NextRequest } from 'next/server'
import { db } from './db'
import { getClientIdentifier, checkRateLimit } from './rateLimit'

// Re-export for convenience
export { getClientIdentifier }

// Disposable email domains (common ones - expand this list)
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'mohmal.com',
  'fakeinbox.com', 'yopmail.com', 'sharklasers.com', 'trashmail.com'
]

/**
 * Check if email is from a disposable email service
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return true
  
  return DISPOSABLE_EMAIL_DOMAINS.some(disposable => domain.includes(disposable))
}

/**
 * Get device fingerprint from request headers
 */
export function getDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || ''
  const acceptLanguage = request.headers.get('accept-language') || ''
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  
  // Create a simple fingerprint (in production, use a proper fingerprinting library)
  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}`
  
  // Simple hash (for production, use crypto.createHash)
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 32)
}

/**
 * Check if IP address has too many accounts
 */
export async function checkIPAccountLimit(ipAddress: string, maxAccounts: number = 3): Promise<{ allowed: boolean; count: number }> {
  try {
    // First ensure signup logs table exists
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS user_signup_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          ip_address VARCHAR(45) NOT NULL,
          device_fingerprint VARCHAR(255),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
    })
    
    // Count accounts created from this IP in last 30 days
    const result = await db.execute({
      sql: `
        SELECT COUNT(DISTINCT user_id) as count 
        FROM user_signup_logs 
        WHERE ip_address = ? 
        AND created_at > NOW() - INTERVAL '30 days'
      `,
      args: [ipAddress]
    })
    
    const count = parseInt(result.rows[0]?.count || 0)
    return {
      allowed: count < maxAccounts,
      count
    }
  } catch (error) {
    // If error, allow (will be logged)
    console.error('Error checking IP limit:', error)
    return { allowed: true, count: 0 }
  }
}

/**
 * Check if email domain has too many accounts
 */
export async function checkEmailDomainLimit(email: string, maxAccounts: number = 2): Promise<{ allowed: boolean; count: number }> {
  try {
    const domain = email.split('@')[1]
    if (!domain) return { allowed: false, count: 0 }
    
    // Count accounts with same domain in last 7 days
    const result = await db.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE email LIKE ? 
        AND created_at > NOW() - INTERVAL '7 days'
      `,
      args: [`%@${domain}`]
    })
    
    const count = parseInt(result.rows[0]?.count || 0)
    return {
      allowed: count < maxAccounts,
      count
    }
  } catch (error) {
    return { allowed: true, count: 0 }
  }
}

/**
 * Check if device fingerprint has too many accounts
 */
export async function checkDeviceLimit(deviceFingerprint: string, maxAccounts: number = 2): Promise<{ allowed: boolean; count: number }> {
  try {
    const result = await db.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM user_signup_logs 
        WHERE device_fingerprint = ? 
        AND created_at > NOW() - INTERVAL '7 days'
      `,
      args: [deviceFingerprint]
    })
    
    const count = parseInt(result.rows[0]?.count || 0)
    return {
      allowed: count < maxAccounts,
      count
    }
  } catch (error) {
    return { allowed: true, count: 0 }
  }
}

/**
 * Log signup attempt for abuse tracking
 */
export async function logSignupAttempt(
  userId: string,
  email: string,
  ipAddress: string,
  deviceFingerprint: string
): Promise<void> {
  try {
    // Ensure table exists
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS user_signup_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          ip_address VARCHAR(45) NOT NULL,
          device_fingerprint VARCHAR(255),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
    })
    
    await db.execute({
      sql: `
        INSERT INTO user_signup_logs (user_id, email, ip_address, device_fingerprint)
        VALUES (?, ?, ?, ?)
      `,
      args: [userId, email, ipAddress, deviceFingerprint]
    })
  } catch (error) {
    console.error('Error logging signup attempt:', error)
    // Don't fail signup if logging fails
  }
}

/**
 * Comprehensive abuse check before allowing signup
 */
export async function checkAbusePrevention(
  request: NextRequest,
  email: string
): Promise<{ allowed: boolean; reason?: string }> {
  const ipAddress = getClientIdentifier(request)
  const deviceFingerprint = getDeviceFingerprint(request)
  
  // 1. Check disposable email
  if (isDisposableEmail(email)) {
    return {
      allowed: false,
      reason: 'Disposable email addresses are not allowed. Please use a real email address.'
    }
  }
  
  // 2. Rate limit signups from same IP (max 3 per hour) — skip in Preview/staging for testing
  const isPreview = process.env.VERCEL_ENV === 'preview'
  const skipRateLimit = isPreview || process.env.DISABLE_SIGNUP_RATE_LIMIT === 'true'
  if (!skipRateLimit) {
    const rateLimit = checkRateLimit(ipAddress, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: 'signup'
    })
    if (!rateLimit.allowed) {
      return {
        allowed: false,
        reason: 'Too many signup attempts from this IP. Please try again later.'
      }
    }
  }

  // 3. Check IP account limit — skip in Preview for testing
  const ipCheck = skipRateLimit ? { allowed: true, count: 0 } : await checkIPAccountLimit(ipAddress, 3)
  if (!ipCheck.allowed) {
    return {
      allowed: false,
      reason: `Maximum of 3 accounts per IP address. You've already created ${ipCheck.count} account(s).`
    }
  }
  
  // 4. Check email domain limit — skip in Preview for testing
  if (!skipRateLimit) {
    const domainCheck = await checkEmailDomainLimit(email, 2)
    if (!domainCheck.allowed) {
      return {
        allowed: false,
        reason: `Maximum of 2 accounts per email domain. This domain already has ${domainCheck.count} account(s).`
      }
    }
  }

  // 5. Check device fingerprint limit — skip in Preview for testing
  if (!skipRateLimit) {
    const deviceCheck = await checkDeviceLimit(deviceFingerprint, 2)
    if (!deviceCheck.allowed) {
      return {
        allowed: false,
        reason: 'Maximum of 2 accounts per device. Please use a different device or contact support.'
      }
    }
  }
  
  return { allowed: true }
}

/**
 * Check if user already has an active trial
 */
export async function hasActiveTrial(userId: string): Promise<boolean> {
  try {
    const result = await db.execute({
      sql: `
        SELECT trial_end_at 
        FROM users 
        WHERE id = ?
      `,
      args: [userId]
    })
    
    if (result.rows.length === 0) return false
    
    const trialEnd = result.rows[0]?.trial_end_at
    if (!trialEnd) return false
    
    return new Date(trialEnd) > new Date()
  } catch (error) {
    return false
  }
}

/**
 * Get abuse prevention stats for monitoring
 */
export async function getAbuseStats(): Promise<{
  signupsLast24h: number
  signupsLast7d: number
  suspiciousIPs: Array<{ ip: string; count: number }>
  disposableEmails: number
}> {
  try {
    // Signups in last 24 hours
    const last24h = await db.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at > NOW() - INTERVAL '24 hours'
      `
    })
    
    // Signups in last 7 days
    const last7d = await db.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at > NOW() - INTERVAL '7 days'
      `
    })
    
    // Suspicious IPs (more than 2 signups)
    const suspiciousIPs = await db.execute({
      sql: `
        SELECT ip_address, COUNT(*) as count 
        FROM user_signup_logs 
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY ip_address 
        HAVING COUNT(*) > 2
        ORDER BY count DESC
        LIMIT 10
      `
    })
    
    return {
      signupsLast24h: parseInt(last24h.rows[0]?.count || 0),
      signupsLast7d: parseInt(last7d.rows[0]?.count || 0),
      suspiciousIPs: suspiciousIPs.rows.map((row: any) => ({
        ip: row.ip_address,
        count: parseInt(row.count)
      })),
      disposableEmails: 0 // Would need to track this separately
    }
  } catch (error) {
    return {
      signupsLast24h: 0,
      signupsLast7d: 0,
      suspiciousIPs: [],
      disposableEmails: 0
    }
  }
}

