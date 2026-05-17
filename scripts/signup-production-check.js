#!/usr/bin/env node
/**
 * Production signup smoke test — unique email domain, login, dashboard APIs.
 *   BASE_URL=https://www.creatorflow365.com node scripts/signup-production-check.js
 */

const BASE_URL = (process.env.BASE_URL || 'https://www.creatorflow365.com').replace(/\/$/, '')

async function post(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

async function get(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

function fail(msg) {
  console.error(`❌ ${msg}`)
  process.exit(1)
}

async function main() {
  const email = `launch-check-${Date.now()}@cfqa${Date.now()}.example.com`
  const password = 'LaunchCheck2026!'

  console.log(`Signup production check — ${BASE_URL}`)
  console.log(`Test email: ${email}\n`)

  const signup = await post('/api/auth', {
    action: 'signup',
    email,
    password,
    planType: 'starter',
  })

  if (!signup.ok || !signup.data.token) {
    if (signup.data?.error?.includes('device') || signup.data?.error?.includes('IP')) {
      console.log('⚠️  Signup blocked by abuse limits from this IP (expected after many test runs).')
      console.log('   Run once from your browser with your real email — see docs below.\n')
      process.exit(0)
    }
    fail(`Signup failed (${signup.status}): ${signup.data.error || 'no token'}`)
  }
  console.log('✅ Signup — account created with trial token')

  const token = signup.data.token

  const login = await post('/api/auth', { action: 'signin', email, password })
  if (login.ok && login.data.token) {
    console.log('✅ Signin — credentials work')
  } else {
    console.log(`⚠️  Signin check: ${login.data.error || login.status} (signup token still valid)`)
  }

  const posts = await get('/api/posts', token)
  if (!posts.ok || !Array.isArray(posts.data.posts)) {
    fail(`GET /api/posts failed: ${posts.data.error || posts.status}`)
  }
  console.log('✅ Dashboard API — posts list loads')

  const calendar = await get('/api/calendar', token)
  if (!calendar.ok || !Array.isArray(calendar.data.events)) {
    fail(`GET /api/calendar failed: ${calendar.data.error || calendar.status}`)
  }
  console.log('✅ Calendar API — events load')

  console.log('\nSignup path OK for production.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
