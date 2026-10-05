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
    'Caption coach',
    'Best times',
    'Engagement Inbox',
  ],
  growth: [
    'Everything in Starter',
    'Performance Analytics Dashboard',
  ],
  pro: [
    'Everything in Essential',
    'Trend scout',
    'Content Recycling System',
  ],
  business: [
    'Everything in Creator',
    'Revenue Tracker & Income Dashboard',
  ],
  agency: [
    'Everything in Professional',
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
