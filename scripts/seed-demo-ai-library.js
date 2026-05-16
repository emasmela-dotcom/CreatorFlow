#!/usr/bin/env node
/**
 * Step 4 — Fill demo account with generated library content via in-app AI bots.
 *
 * Usage:
 *   BASE_URL=https://www.creatorflow365.com node scripts/seed-demo-ai-library.js
 *
 * Requires deploy of /api/demo/seed-library and demo trial fix on activate.
 */

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')

async function post(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    data = { error: 'Invalid JSON' }
  }
  return { ok: res.ok, status: res.status, data }
}

async function main() {
  console.log(`Demo library seed — ${BASE_URL}\n`)

  const activate = await post('/api/demo/activate', {})
  if (!activate.ok || !activate.data.token) {
    console.error('Demo activate failed:', activate.data.error || activate.status)
    process.exit(1)
  }

  const token = activate.data.token
  console.log(`Demo user: ${activate.data.user?.email} (new=${activate.data.isNewUser})\n`)

  const seed = await post('/api/demo/seed-library', {}, token)
  if (!seed.data.summary) {
    console.error('Seed-library failed:', seed.data.error || seed.status)
    process.exit(1)
  }

  const { summary, results } = seed.data
  console.log(`Results: ${summary.passed}/${summary.total} passed\n`)

  for (const r of results || []) {
    console.log(`${r.ok ? '✅' : '❌'} ${r.label}${r.error ? ` — ${r.error}` : ''}`)
  }

  if (summary.failed > 0) {
    process.exit(1)
  }

  console.log('\nDone. Sign in as demo@creatorflow365.com to review library content.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
