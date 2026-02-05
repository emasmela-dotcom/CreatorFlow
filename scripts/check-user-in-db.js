#!/usr/bin/env node
/**
 * Check if a user exists in production DB (same DB as signup/signin).
 * Requires: CHECK_USER_SECRET set in Vercel and redeploy, then run:
 *   node scripts/check-user-in-db.js <email> <secret>
 * Example:
 *   node scripts/check-user-in-db.js emasmela1976@gmail.com your-secret
 */
const email = process.argv[2]
const secret = process.argv[3]
const base = process.env.BASE_URL || 'https://www.creatorflow365.com'

if (!email || !secret) {
  console.log('Usage: node scripts/check-user-in-db.js <email> <CHECK_USER_SECRET>')
  console.log('Set CHECK_USER_SECRET in Vercel (Production), redeploy, then run this.')
  process.exit(1)
}

const url = `${base}/api/debug/check-user?email=${encodeURIComponent(email)}&secret=${encodeURIComponent(secret)}`

;(async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (res.status === 404) {
      console.log('Debug endpoint not configured. Set CHECK_USER_SECRET in Vercel and redeploy.')
      process.exit(1)
    }
    if (!res.ok) {
      console.log('Error:', data.error || res.status)
      process.exit(1)
    }
    console.log('User exists:', data.exists)
    if (data.exists && data.id) console.log('  id:', data.id, 'created_at:', data.created_at)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
})()
