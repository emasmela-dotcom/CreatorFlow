#!/usr/bin/env node
/**
 * Burn AI usage on production demo account — all bots + library wave 2 + tools.
 *   BASE_URL=https://www.creatorflow365.com npm run burn:demo
 *
 * If demo hits AI limit (501/500), reset in Neon SQL Editor then re-run:
 *   DELETE FROM ai_call_logs WHERE user_id = (SELECT id FROM users WHERE email = 'demo@creatorflow365.com');
 */

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')

const WAVE2_WRITERS = [
  { topic: 'How I plan 30 days of content in one afternoon', type: 'blog-post', tone: 'helpful', length: 550 },
  { topic: 'Carousel: 5 hooks that stop the scroll', type: 'instagram', tone: 'bold', platform: 'instagram' },
  { topic: 'YouTube Shorts script: day in the life as a creator', type: 'youtube-description', tone: 'casual', platform: 'youtube' },
  { topic: 'Thread: tools I replaced with one workspace', type: 'twitter', tone: 'witty', platform: 'twitter' },
  { topic: 'Brand deal outreach DM template', type: 'linkedin', tone: 'professional', platform: 'linkedin' },
  { topic: 'TikTok hook + CTA for a free lead magnet', type: 'tiktok-caption', tone: 'energetic', platform: 'tiktok' },
]

const DEMO_BOT_CALLS = [
  { label: 'scheduling-assistant', path: '/api/bots/scheduling-assistant', body: { platform: 'instagram', timezone: 'America/New_York' } },
  { label: 'engagement-analyzer', path: '/api/bots/engagement-analyzer', body: { platform: 'instagram', postId: 'demo-post-1' } },
  { label: 'trend-scout', path: '/api/bots/trend-scout', body: { platform: 'instagram', niche: 'content creation' } },
  { label: 'content-curation', path: '/api/bots/content-curation', body: { platform: 'instagram', niche: 'creator economy' } },
  { label: 'analytics-coach', path: '/api/bots/analytics-coach', body: { platform: 'instagram', timeframe: '30days' } },
  { label: 'content-gap-analyzer', path: '/api/bots/content-gap-analyzer', body: { platform: 'instagram', niche: 'creators', competitorTopics: ['batching', 'monetization', 'short-form video'] } },
  { label: 'expense-tracker', path: '/api/bots/expense-tracker', body: { expenseDate: '2026-05-16', amount: 29, description: 'Creator software subscription', category: 'Software' } },
  { label: 'invoice-generator', path: '/api/bots/invoice-generator', body: { clientId: 1, invoiceDate: '2026-05-16', dueDate: '2026-06-16', items: [{ description: 'Brand collaboration package', quantity: 1, unit_price: 1500 }] } },
  { label: 'email-sorter', path: '/api/bots/email-sorter', body: { from: 'brand@example.com', subject: 'Paid partnership opportunity', body: 'We would love to sponsor your next video series.' } },
  { label: 'customer-service', path: '/api/bots/customer-service', body: { message: 'How does the free trial work?', conversationId: 'demo-cs-1', customerName: 'Demo Visitor' } },
  { label: 'product-recommendation', path: '/api/bots/product-recommendation', body: { customerId: 1, category: 'creator-tools', preferences: ['scheduling', 'analytics'] } },
  { label: 'sales-lead-qualifier', path: '/api/bots/sales-lead-qualifier', body: { leadName: 'Alex Creator', companyName: 'Media Brand Co', email: 'alex@mediabrand.com', budget: 25000, timeline: 'Q2 2026' } },
  { label: 'meeting-scheduler', path: '/api/bots/meeting-scheduler', body: { title: 'Creator strategy call', startTime: '2026-05-20T15:00:00.000Z', endTime: '2026-05-20T16:00:00.000Z', attendees: ['partner@example.com'], location: 'Zoom' } },
  { label: 'social-media-manager', path: '/api/bots/social-media-manager', body: { platform: 'instagram', content: 'Demo: scheduling and captions in one workspace.' } },
  { label: 'website-chat', path: '/api/bots/website-chat', body: { message: 'What plans do you offer?', conversationId: 'demo-chat-1', visitorName: 'Site Visitor' } },
]

const results = []

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
    data = { error: `HTTP ${res.status}` }
  }
  return { ok: res.ok, status: res.status, data }
}

function record(label, ok, error) {
  results.push({ label, ok, error })
  console.log(`${ok ? '✅' : '❌'} ${label}${error ? ` — ${error}` : ''}`)
}

async function main() {
  console.log(`Burn demo usage — ${BASE_URL}\n`)

  const activate = await post('/api/demo/activate', {})
  if (!activate.ok || !activate.data.token) {
    console.error('Demo activate failed:', activate.data.error || activate.status)
    process.exit(1)
  }
  const token = activate.data.token
  console.log(`Demo: ${activate.data.user?.email}\n`)

  // Full library seed if deployed
  for (let pass = 1; pass <= 2; pass++) {
    const bundled = await post('/api/demo/seed-library', {}, token)
    if (bundled.ok && bundled.data.results) {
      console.log(`\n--- seed-library pass ${pass} ---`)
      for (const r of bundled.data.results) {
        record(`seed:${r.label}`, r.ok, r.error)
      }
    } else if (pass === 1) {
      console.log('(seed-library not available — run npm run seed:demo separately)\n')
    }
  }

  console.log('\n--- wave 2 content writer ---')
  for (const job of WAVE2_WRITERS) {
    const res = await post('/api/bots/content-writer', job, token)
    record(`writer2:${job.type}`, res.ok, res.data.error)
  }

  console.log('\n--- all other bots ---')
  for (const { label, path, body } of DEMO_BOT_CALLS) {
    const res = await post(path, body, token)
    record(label, res.ok, res.data.error)
  }

  console.log('\n--- hashtag research (live) ---')
  for (const platform of ['instagram', 'tiktok', 'linkedin']) {
    const res = await post(
      '/api/hashtag-research',
      {
        action: 'research',
        platform,
        niche: 'content creators',
        content: 'Creator workspace for batching and scheduling',
      },
      token
    )
    record(`hashtag-research:${platform}`, res.ok, res.data.error)
  }

  console.log('\n--- documents + calendar ---')
  const doc = await post(
    '/api/documents',
    { title: 'Demo brand brief', content: 'Audience: solo creators. Goal: show batching workflow in CreatorFlow365.' },
    token
  )
  record('documents:create', doc.ok, doc.data.error)

  const cal = await post(
    '/api/calendar',
    {
      platform: 'instagram',
      content: 'Teaser → tutorial → CTA post sequence',
      scheduledAt: '2026-05-22T15:00:00.000Z',
      status: 'scheduled',
    },
    token
  )
  record('calendar:schedule', cal.ok, cal.data.error)

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  console.log(`\nBurn summary: ${passed} ok, ${failed} failed, ${results.length} total`)
  process.exit(failed > 0 && passed === 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
