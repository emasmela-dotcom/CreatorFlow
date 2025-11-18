/**
 * Plan Limits Configuration
 * Defines post limits and account limits for each subscription tier
 */

export type PlanType = 'starter' | 'growth' | 'pro' | 'business' | 'agency'

export interface PlanLimits {
  monthlyPostLimit: number
  accountLimit: number
}

/**
 * Get post limit for a subscription tier
 */
export function getPostLimit(planType: PlanType | null): number {
  if (!planType) return 0
  
  const limits: Record<PlanType, number> = {
    starter: 8,
    growth: 10,
    pro: 12,
    business: 15,
    agency: 18
  }
  
  return limits[planType] || 0
}

/**
 * Get account limit for a subscription tier
 */
export function getAccountLimit(planType: PlanType | null): number {
  if (!planType) return 0
  
  const limits: Record<PlanType, number> = {
    starter: 2,
    growth: 3,
    pro: 4,
    business: 5,
    agency: -1 // Unlimited
  }
  
  return limits[planType] || 0
}

/**
 * Get all plan limits
 */
export function getPlanLimits(planType: PlanType): PlanLimits {
  return {
    monthlyPostLimit: getPostLimit(planType),
    accountLimit: getAccountLimit(planType)
  }
}

