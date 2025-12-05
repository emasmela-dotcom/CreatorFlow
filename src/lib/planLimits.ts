/**
 * Plan Limits Configuration
 * Defines post limits and account limits for each subscription tier
 */

export type PlanType = 'free' | 'starter' | 'growth' | 'pro' | 'business' | 'agency'

export interface PlanLimits {
  monthlyPostLimit: number
  accountLimit: number
  documentLimit: number
  hashtagSetLimit: number
  templateLimit: number
  aiCallsPerMonth: number
  storageMB: number
}

/**
 * Get post limit for a subscription tier
 */
export function getPostLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 0
  
  const limits: Record<PlanType, number> = {
    free: 0,
    starter: 0, // Unlimited
    growth: 0, // Unlimited
    pro: 0, // Unlimited
    business: 0, // Unlimited
    agency: 0 // Unlimited
  }
  
  return limits[planType] || 0
}

/**
 * Get account limit for a subscription tier
 */
export function getAccountLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 1
  
  const limits: Record<PlanType, number> = {
    free: 1,
    starter: 3,
    growth: 5,
    pro: 10,
    business: -1, // Unlimited
    agency: -1 // Unlimited
  }
  
  return limits[planType] || 0
}

/**
 * Get document limit for a subscription tier
 */
export function getDocumentLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 10
  
  const limits: Record<PlanType, number> = {
    free: 10,
    starter: -1, // Unlimited
    growth: -1, // Unlimited
    pro: -1, // Unlimited
    business: -1, // Unlimited
    agency: -1 // Unlimited
  }
  
  return limits[planType] || -1
}

/**
 * Get hashtag set limit for a subscription tier
 */
export function getHashtagSetLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 5
  
  const limits: Record<PlanType, number> = {
    free: 5,
    starter: -1, // Unlimited
    growth: -1, // Unlimited
    pro: -1, // Unlimited
    business: -1, // Unlimited
    agency: -1 // Unlimited
  }
  
  return limits[planType] || -1
}

/**
 * Get template limit for a subscription tier
 */
export function getTemplateLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 3
  
  const limits: Record<PlanType, number> = {
    free: 3,
    starter: -1, // Unlimited
    growth: -1, // Unlimited
    pro: -1, // Unlimited
    business: -1, // Unlimited
    agency: -1 // Unlimited
  }
  
  return limits[planType] || -1
}

/**
 * Get AI calls per month limit for a subscription tier
 */
export function getAICallsLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 50
  
  const limits: Record<PlanType, number> = {
    free: 50,
    starter: 500,
    growth: 1000,
    pro: -1, // Unlimited
    business: -1, // Unlimited
    agency: -1 // Unlimited
  }
  
  return limits[planType] || -1
}

/**
 * Get storage limit (MB) for a subscription tier
 */
export function getStorageLimit(planType: PlanType | null): number {
  if (!planType || planType === 'free') return 10
  
  const limits: Record<PlanType, number> = {
    free: 10,
    starter: 100,
    growth: 500,
    pro: 2000,
    business: 10000,
    agency: -1 // Unlimited
  }
  
  return limits[planType] || -1
}

/**
 * Get all plan limits
 */
export function getPlanLimits(planType: PlanType | null): PlanLimits {
  return {
    monthlyPostLimit: getPostLimit(planType),
    accountLimit: getAccountLimit(planType),
    documentLimit: getDocumentLimit(planType),
    hashtagSetLimit: getHashtagSetLimit(planType),
    templateLimit: getTemplateLimit(planType),
    aiCallsPerMonth: getAICallsLimit(planType),
    storageMB: getStorageLimit(planType)
  }
}

