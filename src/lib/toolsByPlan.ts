/**
 * Tools included in each plan (for public "Tools offered" link).
 * Starter = base; each tier adds more. Plan IDs match PlanSelection / pricing.
 */
export type PlanId = 'starter' | 'pro' | 'agency'

export const TOOLS_BY_PLAN: Record<PlanId, string[]> = {
  starter: [
    'Record, save, come back and change it',
    '3 social accounts',
    '10 Claude writes per day',
  ],
  pro: [
    'Everything in Starter',
    '10 social accounts',
    '3 people on the team',
    '10 Claude writes per day',
  ],
  agency: [
    'Everything in Creator',
    'Unlimited accounts and team',
    '10 Claude writes per day',
  ],
}
