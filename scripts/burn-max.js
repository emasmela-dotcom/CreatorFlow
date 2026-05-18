#!/usr/bin/env node
/** Max AI usage on production — new user per run, all bots × repeats */
const BASE = (process.env.BASE_URL || 'https://www.creatorflow365.com').replace(/\/$/, '')
const REPEATS = parseInt(process.env.BURN_REPEATS || '8', 10)
const PASSES = parseInt(process.env.BURN_PASSES || '3', 10)

const BOTS = [
  ['content-writer', { topic: 'creator tips', type: 'twitter', tone: 'friendly', platform: 'twitter' }],
  ['content-assistant', { content: 'Batch your content Sunday #creators', platform: 'instagram' }],
  ['scheduling-assistant', { platform: 'instagram', timezone: 'America/New_York' }],
  ['engagement-analyzer', { platform: 'instagram', postId: 'p1' }],
  ['trend-scout', { platform: 'instagram', niche: 'creators' }],
  ['content-curation', { platform: 'instagram', niche: 'business' }],
  ['analytics-coach', { platform: 'instagram', timeframe: '30days' }],
  ['content-gap-analyzer', { platform: 'instagram', niche: 'fitors', competitorTopics: ['a', 'b', 'c'] }],
  ['content-repurposing', { originalContent: 'One video seven posts', contentType: 'post', targetPlatforms: ['twitter'] }],
  ['expense-tracker', { expenseDate: '2026-05-17', amount: 10, description: 'tools', category: 'Software' }],
  ['invoice-generator', { clientId: 1, invoiceDate: '2026-05-17', dueDate: '2026-06-17', items: [{ description: 'x', quantity: 1, unit_price: 100 }] }],
  ['email-sorter', { from: 'a@b.com', subject: 'deal', body: 'partnership' }],
  ['customer-service', { message: 'trial?', conversationId: 'c1', customerName: 'V' }],
  ['product-recommendation', { customerId: 1, category: 'tools', preferences: ['ai'] }],
  ['sales-lead-qualifier', { leadName: 'A', companyName: 'B', email: 'a@b.com', budget: 1000, timeline: 'Q2' }],
  ['meeting-scheduler', { title: 'Call', startTime: '2026-05-20T15:00:00Z', endTime: '2026-05-20T16:00:00Z', attendees: ['a@b.com'], location: 'Zoom' }],
  ['social-media-manager', { platform: 'instagram', content: 'hello' }],
  ['website-chat', { message: 'plans?', conversationId: 'w1', visitorName: 'V' }],
]

async function post(path, body, token) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  return { ok: r.ok, err: (await r.json().catch(() => ({}))).error }
}

async function onePass(pass) {
  const email = `burn-${Date.now()}-${pass}@q${Date.now()}.invalid`
  const password = 'BurnMax2026!!'
  const su = await post('/api/auth', { action: 'signup', email, password, planType: 'starter' })
  if (!su.ok) {
    console.log(`pass ${pass} signup blocked: ${su.err}`)
    return 0
  }
  const act = await fetch(`${BASE}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'signup', email, password, planType: 'starter' }),
  })
  const data = await act.json()
  const token = data.token
  if (!token) return 0
  let ok = 0
  for (let r = 0; r < REPEATS; r++) {
    for (const [name, body] of BOTS) {
      const res = await post(`/api/bots/${name}`, body, token)
      if (res.ok) ok++
      else if (String(res.err).includes('limit')) {
        console.log(`pass ${pass} hit limit at ${ok} ok`)
        return ok
      }
    }
  }
  return ok
}

async function main() {
  console.log(`burn-max ${BASE} passes=${PASSES} repeats=${REPEATS}\n`)
  let total = 0
  for (let p = 1; p <= PASSES; p++) {
    const n = await onePass(p)
    total += n
    console.log(`pass ${p}: ${n} ok (total ${total})\n`)
    await new Promise((x) => setTimeout(x, 2000))
  }
  console.log(`DONE total ok calls: ${total}`)
}

main()
