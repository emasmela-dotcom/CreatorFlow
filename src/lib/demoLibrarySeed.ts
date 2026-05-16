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
