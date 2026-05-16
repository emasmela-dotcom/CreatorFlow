#!/usr/bin/env node
/**
 * Fill demo account library via production APIs (no seed-library route required).
 *
 *   BASE_URL=https://www.creatorflow365.com npm run seed:demo
 */

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')

const CONTENT_WRITER_JOBS = [
  { topic: '5 morning habits that boost creator productivity', type: 'instagram', tone: 'friendly', platform: 'instagram' },
  { topic: 'Behind the scenes of building a personal brand', type: 'tiktok-caption', tone: 'energetic', platform: 'tiktok' },
  { topic: 'Why batching content saves you 10 hours a week', type: 'twitter', tone: 'witty', platform: 'twitter' },
  { topic: 'Lessons from my first 1,000 followers', type: 'linkedin', tone: 'professional', platform: 'linkedin' },
  { topic: 'Full tutorial: repurpose one video into 7 posts', type: 'youtube-description', tone: 'helpful', platform: 'youtube' },
  { topic: 'CreatorFlow365 workflow for solo creators', type: 'blog-post', tone: 'professional', length: 600 },
  { topic: 'Weekly newsletter: what worked on social this week', type: 'email', tone: 'warm', length: 400 },
  { topic: 'Launch week announcement for a new digital product', type: 'social-media', tone: 'excited', platform: 'instagram' },
]

const REPURPOSING_JOBS = [
  {
    originalContent:
      'I turned one long-form video into a week of posts using CreatorFlow365 — captions, hashtags, and templates in one place.',
    contentType: 'post',
    targetPlatforms: ['twitter', 'linkedin', 'instagram'],
  },
  {
    originalContent:
      'Three mistakes new creators make: posting without a plan, ignoring analytics, and juggling too many apps.',
    contentType: 'article',
    targetPlatforms: ['twitter', 'tiktok'],
  },
]

const HASHTAG_SAVE_JOBS = [
  {
    name: 'Creator growth — Instagram',
    platform: 'instagram',
    hashtags: JSON.stringify(['#contentcreator', '#creatoreconomy', '#socialmediatips', '#growyourbrand', '#creatorflow']),
    description: 'Demo set for creator education posts',
  },
  {
    name: 'Productivity — TikTok',
    platform: 'tiktok',
    hashtags: JSON.stringify(['#productivity', '#creatortips', '#worksmarternotharder', '#dayinthelife']),
    description: 'Demo set for short-form tips',
  },
  {
    name: 'B2B — LinkedIn',
    platform: 'linkedin',
    hashtags: JSON.stringify(['#personalbranding', '#linkedin', '#marketing', '#entrepreneur']),
    description: 'Demo set for professional posts',
  },
]

const TEMPLATE_JOBS = [
  {
    name: 'Instagram launch post',
    platform: 'instagram',
    content:
      'Big news: {product} is live! 🎉\n\nBuilt for creators who want one workspace for ideas, captions, and scheduling.\n\nLink in bio — tell me what you want to see next.',
    variables: ['product'],
    category: 'launch',
  },
  {
    name: 'Twitter thread hook',
    platform: 'twitter',
    content: 'I tested {topic} for 30 days. Here are 5 takeaways (thread):',
    variables: ['topic'],
    category: 'thread',
  },
  {
    name: 'LinkedIn story post',
    platform: 'linkedin',
    content: 'Last month I {win}. Here is what changed and one thing I would do differently.',
    variables: ['win'],
    category: 'story',
  },
  {
    name: 'TikTok caption CTA',
    platform: 'tiktok',
    content: 'POV: {scenario}. Follow for part 2. Save this for later.',
    variables: ['scenario'],
    category: 'short-form',
  },
]

const POST_JOBS = [
  {
    platform: 'instagram',
    content:
      'One workspace beats five apps. Planning, captions, and hashtags in CreatorFlow365 — who else is simplifying their stack? #creatorflow #contentcreator',
    status: 'published',
  },
  {
    platform: 'twitter',
    content:
      'Shipped my content calendar for the week in under an hour. Templates + caption writer = less context switching.',
    status: 'draft',
  },
  {
    platform: 'linkedin',
    content:
      'Creators do not need more tools — they need one flow. Here is how I batch a week of posts in a single session.',
    status: 'draft',
  },
  {
    platform: 'tiktok',
    content:
      'Stop rewriting the same hook 4 times. Repurpose once, tweak per platform. Demo library is live on CreatorFlow365.',
    status: 'draft',
  },
  {
    platform: 'youtube',
    content:
      'In this video: my full weekly batching routine using CreatorFlow365 (templates, captions, hashtag sets). Chapters in description.',
    status: 'draft',
  },
]

const ASSISTANT_JOBS = [
  {
    content:
      'New creators: batch your content on Sundays, schedule Mon–Wed, leave Thu–Fri for engagement. #creatortips #workflow',
    platform: 'instagram',
  },
]

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
    data = { error: `HTTP ${res.status} (non-JSON response)` }
  }
  return { ok: res.ok, status: res.status, data }
}

const results = []

function record(label, ok, error) {
  results.push({ label, ok, error })
  console.log(`${ok ? '✅' : '❌'} ${label}${error ? ` — ${error}` : ''}`)
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

  // Prefer deployed seed-library when available
  const bundled = await post('/api/demo/seed-library', {}, token)
  if (bundled.ok && bundled.data.summary) {
    for (const r of bundled.data.results || []) {
      record(r.label, r.ok, r.error)
    }
    const { passed, failed, total } = bundled.data.summary
    console.log(`\nResults: ${passed}/${total} passed`)
    process.exit(failed > 0 ? 1 : 0)
  }

  if (bundled.status !== 404) {
    console.log(`(seed-library returned ${bundled.status}, running direct API calls)\n`)
  } else {
    console.log('(seed-library not deployed yet — running direct API calls)\n')
  }

  for (const job of CONTENT_WRITER_JOBS) {
    const res = await post('/api/bots/content-writer', job, token)
    record(`content-writer:${job.type}`, res.ok, res.data.error)
  }

  for (const job of REPURPOSING_JOBS) {
    const res = await post('/api/bots/content-repurposing', job, token)
    record(`repurposing:${job.targetPlatforms.join('+')}`, res.ok, res.data.error)
  }

  for (const job of ASSISTANT_JOBS) {
    const res = await post('/api/bots/content-assistant', job, token)
    record(`content-assistant:${job.platform}`, res.ok, res.data.error)
  }

  for (const job of HASHTAG_SAVE_JOBS) {
    const res = await post('/api/hashtag-research', { action: 'save', ...job }, token)
    record(`hashtag-save:${job.name}`, res.ok, res.data.error)
  }

  for (const job of TEMPLATE_JOBS) {
    const res = await post('/api/content-templates', {
      ...job,
      variables: JSON.stringify(job.variables),
    }, token)
    record(`template:${job.name}`, res.ok, res.data.error)
  }

  for (const job of POST_JOBS) {
    const res = await post('/api/posts', job, token)
    const err = res.data.error
    const skipFree = res.status === 403 && res.data.plan === 'free'
    record(`post:${job.platform}`, res.ok, skipFree ? 'skipped until demo trial deploys' : err)
  }

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  console.log(`\nResults: ${passed}/${results.length} passed`)

  if (failed > 0 && results.every((r) => !r.ok || r.error?.includes('skipped until demo trial'))) {
    console.log('\nPosts need the demo trial fix on production (redeploy main from Vercel).')
  }

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
