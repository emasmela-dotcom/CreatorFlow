/**
 * Authentication & Authorization Utilities
 * Centralized security functions
 */

import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET

// ENFORCE STRONG JWT SECRET
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production!')
  }
  console.warn('⚠️  JWT_SECRET not set - using fallback (NOT SECURE FOR PRODUCTION)')
}

// Validate JWT secret strength
if (JWT_SECRET && (JWT_SECRET === 'your-secret-key-change-in-production' || JWT_SECRET.length < 32)) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be at least 32 characters long and not use the default value!')
  }
  console.warn('⚠️  JWT_SECRET is too weak or using default value')
}

export interface AuthUser {
  userId: string
  email: string
}

// JWT expiration times
const ACCESS_TOKEN_EXPIRY = '1h' // Short-lived access token
const REFRESH_TOKEN_EXPIRY = '30d' // Longer-lived refresh token

/**
 * Verify JWT token and extract user info
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Use fallback secret in development if JWT_SECRET is not set
    const secret = JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'fallback-secret-key-for-development-only' : null)
    
    if (!secret) {
      console.error('JWT_SECRET not properly configured')
      return null
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, secret) as { 
      userId: string
      email: string
      type?: string
    }

    // Only accept access tokens (or legacy tokens without type for backward compatibility)
    if (decoded.type && decoded.type !== 'access') {
      return null // Reject refresh tokens
    }
    
    // Verify user still exists
    const userResult = await db.execute({
      sql: 'SELECT id FROM users WHERE id = ?',
      args: [decoded.userId]
    })

    if (userResult.rows.length === 0) {
      return null
    }

    return {
      userId: decoded.userId,
      email: decoded.email
    }
  } catch (error) {
    return null
  }
}

/**
 * Verify auth AND ensure userId matches (prevents authorization bypass)
 */
export async function verifyAuthAndOwnership(
  request: NextRequest,
  requestedUserId?: string
): Promise<AuthUser | null> {
  const user = await verifyAuth(request)
  
  if (!user) {
    return null
  }

  // If userId is provided in request, verify it matches the JWT
  if (requestedUserId && requestedUserId !== user.userId) {
    return null // User trying to access someone else's data
  }

  return user
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  // At least 8 characters, contains uppercase, lowercase, number
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string, email?: string): string {
  // Use fallback secret in development if JWT_SECRET is not set
  const secret = JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'fallback-secret-key-for-development-only' : 'fallback-secret-key-for-development-only')
  
  return jwt.sign(
    {
      userId,
      email: email || '',
      type: 'access'
    },
    secret,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )
}

/**
 * Sanitize content to prevent XSS
 */
export function sanitizeContent(content: string, maxLength: number = 10000): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // Truncate to max length
  let sanitized = content.slice(0, maxLength)
  
  // Remove script tags and dangerous attributes (basic sanitization)
  // Note: For production, use a library like DOMPurify
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  return sanitized.trim()
}

