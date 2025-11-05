/**
 * Rate Limiting for API endpoints
 * Simple in-memory rate limiter (for serverless - use Redis for production scale)
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (will reset on cold starts in serverless)
// For production scale, use Redis or Upstash
const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  maxRequests: number
  windowMs: number
  identifier?: string // Optional custom identifier (defaults to IP)
}

/**
 * Check if request should be rate limited
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const { maxRequests, windowMs } = options
  const now = Date.now()
  const key = `${identifier}:${options.identifier || 'default'}`

  // Get or create rate limit entry
  let entry = store[key]

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + windowMs
    }
    store[key] = entry
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: entry.resetTime
    }
  }

  // Increment count
  entry.count++

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetTime
    }
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetTime
  }
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwarded) return forwarded.split(',')[0].trim()

  // Fallback to a default (shouldn't happen in production)
  return 'unknown'
}


/**
 * Rate limit middleware helper
 */
export function rateLimitMiddleware(
  request: NextRequest,
  options: RateLimitOptions
): { allowed: boolean; response?: NextResponse; remaining: number; resetAt: number } {
  const identifier = getClientIdentifier(request)
  const result = checkRateLimit(identifier, options)

  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': options.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString()
        }
      }
    )
    return { allowed: false, response, remaining: result.remaining, resetAt: result.resetAt }
  }

  return { allowed: true, remaining: result.remaining, resetAt: result.resetAt }
}

