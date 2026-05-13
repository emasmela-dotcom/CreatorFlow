/**
 * Tools included in each plan (for public "Tools offered" link).
 * Starter = base; each tier adds more. Plan IDs match PlanSelection / pricing.
 */
export type PlanId = 'starter' | 'growth' | 'pro' | 'business' | 'agency'

export const TOOLS_BY_PLAN: Record<PlanId, string[]> = {
  starter: [
    'Documents',
    'Hashtag Research',
    'Content Templates',
    'Content Calendar',
    'Content Library Search',
    'Content Assistant Bot',
    'Scheduling Assistant Bot',
    'Content Writer Bot',
    'Engagement Inbox',
  ],
  growth: [
    'Everything in Starter',
    'Performance Analytics Dashboard',
    'Engagement Analyzer Bot',
    'Analytics Coach Bot',
    'Content Curation Bot',
  ],
  pro: [
    'Everything in Essential',
    'Content Repurposing Bot',
    'Content Gap Analyzer Bot',
    'Trend Scout Bot',
    'Social Media Manager Bot',
    'Content Recycling System',
  ],
  business: [
    'Everything in Creator',
    'Expense Tracker Bot',
    'Invoice Generator Bot',
    'Email Sorter Bot',
    'Revenue Tracker & Income Dashboard',
  ],
  agency: [
    'Everything in Professional',
    'Customer Service Bot',
    'Product Recommendation Bot',
    'Sales Lead Qualifier Bot',
    'Website Chat Bot',
    'Meeting Scheduler Bot',
    'AI Content Performance Predictor',
    'Brand Voice Analyzer & Maintainer',
    'Cross-Platform Content Sync',
    'Real-Time Trend Alerts',
    'Content A/B Testing',
    'Automated Content Series Generator',
    'Automated Hashtag Optimization',
    'Creator Collaboration Marketplace',
  ],
}

/** Public pricing labels — same order as homepage / select-plan tiers */
const PLAN_ORDER: PlanId[] = ['starter', 'growth', 'pro', 'business', 'agency']

const PLAN_DISPLAY_NAME: Record<PlanId, string> = {
  starter: 'Starter',
  growth: 'Essential',
  pro: 'Creator',
  business: 'Professional',
  agency: 'Business',
}

export type ToolCountRolloutRow = {
  tier: string
  /** Named tools added at this tier (excludes “Everything in …” lines) */
  newInTier: number
  /** Distinct tool names through this tier */
  cumulative: number
}

/**
 * Single source for “how many tools” messaging: derived from {@link TOOLS_BY_PLAN}.
 * Agency (Business plan) = 35 unique named tools/features in the public list.
 */
export function getToolCountRollout(): ToolCountRolloutRow[] {
  let cumulative = 0
  return PLAN_ORDER.map((id) => {
    const newInTier = TOOLS_BY_PLAN[id].filter((t) => !t.startsWith('Everything in ')).length
    cumulative += newInTier
    return { tier: PLAN_DISPLAY_NAME[id], newInTier, cumulative }
  })
}

export const TOOL_COUNT_ROLLOUT: ToolCountRolloutRow[] = getToolCountRollout()
