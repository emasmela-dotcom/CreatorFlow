/**
 * Demo library seeding — sample topics and DB helpers for demo@creatorflow365.com
 */

export const DEMO_EMAIL = 'demo@creatorflow365.com'

export const CONTENT_WRITER_JOBS = [
  {
    topic: '5 morning habits that boost creator productivity',
    type: 'instagram',
    tone: 'friendly',
    platform: 'instagram',
  },
  {
    topic: 'Behind the scenes of building a personal brand',
    type: 'tiktok-caption',
    tone: 'energetic',
    platform: 'tiktok',
  },
  {
    topic: 'Why batching content saves you 10 hours a week',
    type: 'twitter',
    tone: 'witty',
    platform: 'twitter',
  },
  {
    topic: 'Lessons from my first 1,000 followers',
    type: 'linkedin',
    tone: 'professional',
    platform: 'linkedin',
  },
  {
    topic: 'Full tutorial: repurpose one video into 7 posts',
    type: 'youtube-description',
    tone: 'helpful',
    platform: 'youtube',
  },
  {
    topic: 'CreatorFlow365 workflow for solo creators',
    type: 'blog-post',
    tone: 'professional',
    length: 600,
  },
  {
    topic: 'Weekly newsletter: what worked on social this week',
    type: 'email',
    tone: 'warm',
    length: 400,
  },
  {
    topic: 'Launch week announcement for a new digital product',
    type: 'social-media',
    tone: 'excited',
    platform: 'instagram',
  },
] as const

export const REPURPOSING_JOBS = [
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
] as const

export const HASHTAG_SAVE_JOBS = [
  {
    name: 'Creator growth — Instagram',
    platform: 'instagram',
    hashtags: JSON.stringify([
      '#contentcreator',
      '#creatoreconomy',
      '#socialmediatips',
      '#growyourbrand',
      '#creatorflow',
    ]),
    description: 'Demo set for creator education posts',
  },
  {
    name: 'Productivity — TikTok',
    platform: 'tiktok',
    hashtags: JSON.stringify([
      '#productivity',
      '#creatortips',
      '#worksmarternotharder',
      '#dayinthelife',
    ]),
    description: 'Demo set for short-form tips',
  },
  {
    name: 'B2B — LinkedIn',
    platform: 'linkedin',
    hashtags: JSON.stringify([
      '#personalbranding',
      '#linkedin',
      '#marketing',
      '#entrepreneur',
    ]),
    description: 'Demo set for professional posts',
  },
] as const

export const TEMPLATE_JOBS = [
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
    content:
      'I tested {topic} for 30 days. Here are 5 takeaways (thread):',
    variables: ['topic'],
    category: 'thread',
  },
  {
    name: 'LinkedIn story post',
    platform: 'linkedin',
    content:
      'Last month I {win}. Here is what changed and one thing I would do differently.',
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
] as const

export const POST_JOBS = [
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
] as const

export const ASSISTANT_JOBS = [
  {
    content:
      'New creators: batch your content on Sundays, schedule Mon–Wed, leave Thu–Fri for engagement. #creatortips #workflow',
    platform: 'instagram',
  },
] as const

/** Second wave — more demo library + usage on seed/burn runs */
export const CONTENT_WRITER_JOBS_WAVE2 = [
  {
    topic: 'How I plan 30 days of content in one afternoon',
    type: 'blog-post',
    tone: 'helpful',
    length: 550,
  },
  {
    topic: 'Carousel: 5 hooks that stop the scroll',
    type: 'instagram',
    tone: 'bold',
    platform: 'instagram',
  },
  {
    topic: 'YouTube Shorts script: day in the life as a creator',
    type: 'youtube-description',
    tone: 'casual',
    platform: 'youtube',
  },
  {
    topic: 'Thread: tools I replaced with one workspace',
    type: 'twitter',
    tone: 'witty',
    platform: 'twitter',
  },
  {
    topic: 'Brand deal outreach DM template',
    type: 'linkedin',
    tone: 'professional',
    platform: 'linkedin',
  },
  {
    topic: 'TikTok hook + CTA for a free lead magnet',
    type: 'tiktok-caption',
    tone: 'energetic',
    platform: 'tiktok',
  },
] as const

export const ASSISTANT_JOBS_WAVE2 = [
  {
    content: 'Q4 content plan: themes, pillars, and a simple weekly rhythm for solo creators.',
    platform: 'linkedin',
  },
  {
    content: 'Save this caption formula: hook → story → lesson → CTA. Works on Reels and TikTok.',
    platform: 'tiktok',
  },
  {
    content: 'Poll: what should I teach next — batching, analytics, or brand deals?',
    platform: 'twitter',
  },
] as const

export const REPURPOSING_JOBS_WAVE2 = [
  {
    originalContent:
      'My 2025 creator stack: one calendar, caption drafts, hashtag sets, and post history — no more tab chaos.',
    contentType: 'post',
    targetPlatforms: ['linkedin', 'youtube', 'instagram'],
  },
] as const

/** All bots not covered by library seed — run on demo burn/seed */
export const DEMO_BOT_CALLS = [
  {
    label: 'scheduling-assistant',
    path: '/api/bots/scheduling-assistant',
    body: { platform: 'instagram', timezone: 'America/New_York' },
  },
  {
    label: 'engagement-analyzer',
    path: '/api/bots/engagement-analyzer',
    body: { platform: 'instagram', postId: 'demo-post-1' },
  },
  {
    label: 'trend-scout',
    path: '/api/bots/trend-scout',
    body: { platform: 'instagram', niche: 'content creation' },
  },
  {
    label: 'content-curation',
    path: '/api/bots/content-curation',
    body: { platform: 'instagram', niche: 'creator economy' },
  },
  {
    label: 'analytics-coach',
    path: '/api/bots/analytics-coach',
    body: { platform: 'instagram', timeframe: '30days' },
  },
  {
    label: 'content-gap-analyzer',
    path: '/api/bots/content-gap-analyzer',
    body: {
      platform: 'instagram',
      niche: 'creators',
      competitorTopics: ['batching', 'monetization', 'short-form video'],
    },
  },
  {
    label: 'expense-tracker',
    path: '/api/bots/expense-tracker',
    body: {
      expenseDate: '2026-05-16',
      amount: 29,
      description: 'Creator software subscription',
      category: 'Software',
    },
  },
  {
    label: 'invoice-generator',
    path: '/api/bots/invoice-generator',
    body: {
      clientId: 1,
      invoiceDate: '2026-05-16',
      dueDate: '2026-06-16',
      items: [{ description: 'Brand collaboration package', quantity: 1, unit_price: 1500 }],
    },
  },
  {
    label: 'email-sorter',
    path: '/api/bots/email-sorter',
    body: {
      from: 'brand@example.com',
      subject: 'Paid partnership opportunity',
      body: 'We would love to sponsor your next video series.',
    },
  },
  {
    label: 'customer-service',
    path: '/api/bots/customer-service',
    body: {
      message: 'How does the free trial work?',
      conversationId: 'demo-cs-1',
      customerName: 'Demo Visitor',
    },
  },
  {
    label: 'product-recommendation',
    path: '/api/bots/product-recommendation',
    body: { customerId: 1, category: 'creator-tools', preferences: ['scheduling', 'analytics'] },
  },
  {
    label: 'sales-lead-qualifier',
    path: '/api/bots/sales-lead-qualifier',
    body: {
      leadName: 'Alex Creator',
      companyName: 'Media Brand Co',
      email: 'alex@mediabrand.com',
      budget: 25000,
      timeline: 'Q2 2026',
    },
  },
  {
    label: 'meeting-scheduler',
    path: '/api/bots/meeting-scheduler',
    body: {
      title: 'Creator strategy call',
      startTime: '2026-05-20T15:00:00.000Z',
      endTime: '2026-05-20T16:00:00.000Z',
      attendees: ['partner@example.com'],
      location: 'Zoom',
    },
  },
  {
    label: 'social-media-manager',
    path: '/api/bots/social-media-manager',
    body: { platform: 'instagram', content: 'Demo: scheduling and captions in one workspace.' },
  },
  {
    label: 'website-chat',
    path: '/api/bots/website-chat',
    body: {
      message: 'What plans do you offer?',
      conversationId: 'demo-chat-1',
      visitorName: 'Site Visitor',
    },
  },
] as const

export const HASHTAG_RESEARCH_JOBS = [
  {
    action: 'research' as const,
    platform: 'instagram',
    niche: 'content creators',
    content: 'Batch your week of posts in one workspace',
  },
  {
    action: 'research' as const,
    platform: 'tiktok',
    niche: 'productivity',
    content: 'Morning routine for creators who post daily',
  },
] as const
