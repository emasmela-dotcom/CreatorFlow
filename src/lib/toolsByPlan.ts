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
