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
