/**
 * Tools included in each plan (for public "Tools offered" link).
 * Starter = base; each tier adds more. Plan IDs match PlanSelection / pricing.
 */
export type PlanId = 'starter' | 'pro' | 'agency'

export const TOOLS_BY_PLAN: Record<PlanId, string[]> = {
  starter: [
    'Record, save, come back and change it',
    '1 person can log in',
    '3 social pages (Instagram, TikTok, and so on)',
    '10 Claude writes per day for the whole plan',
  ],
  pro: [
    'Everything in Starter',
    '3 people can log in',
    '10 social pages (Instagram, TikTok, and so on)',
    '10 Claude writes per day for the whole plan',
  ],
  agency: [
    'Everything in Creator',
    'As many people as you want can log in',
    'As many social pages as you want',
    '10 Claude writes per day for the whole plan',
  ],
}

/** Paid tools shown on the site. People can see them. Use starts when they pay. */
export const FEATURED_PAID_TOOLS: { name: string; blurb: string }[] = [
  { name: 'Claude', blurb: 'Type what you want. Get a draft you can edit.' },
  { name: 'Performance Predictor', blurb: 'Check a post before you publish.' },
  { name: 'Brand Voice', blurb: 'Check if the post sounds like you.' },
  { name: 'Cross-Platform Sync', blurb: 'Format one post for each app.' },
  { name: 'Content Recycling', blurb: 'Bring back posts that already worked.' },
  { name: 'Revenue Tracker', blurb: 'See income in one place.' },
  { name: 'Trend Alerts', blurb: 'Catch rising topics early.' },
  { name: 'A/B Testing', blurb: 'Test two versions of a post.' },
  { name: 'Content Series', blurb: 'Plan a multi-part story.' },
  { name: 'Hashtag Optimizer', blurb: 'Get hashtags that fit the post.' },
  { name: 'Collaboration Marketplace', blurb: 'Find brand deals and collabs.' },
  { name: 'Calendar', blurb: 'See scheduled posts on a calendar.' },
  { name: 'Analytics', blurb: 'See how posts are doing.' },
  { name: 'Listening', blurb: 'Watch what people say about your work.' },
]
