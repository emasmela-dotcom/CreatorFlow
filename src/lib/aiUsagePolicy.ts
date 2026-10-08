/**
 * AI usage policy for the free build phase.
 * All AI allowances are controlled from this one file.
 */

import { hasEndlessTrial } from './endlessTrial'

/** While true, every user gets the same daily allowance regardless of plan. */
export const FREE_BUILD_PHASE = true

const PAID_PLAN_TIERS = ['starter', 'growth', 'pro', 'business', 'agency']

/**
 * Paid tools are shown to everyone. Use is allowed for paying plans.
 * Owner login can use them so the site can be checked before launch.
 * While the free-build phase is on, nobody else is treated as paying yet.
 */
export function canUsePaidTools(
  email?: string | null,
  plan?: string | null
): boolean {
  if (hasEndlessTrial(email)) return true
  if (FREE_BUILD_PHASE) return false
  if (!plan) return false
  return PAID_PLAN_TIERS.includes(plan)
}

/** @deprecated Use canUsePaidTools */
export const canSeePaidAiModels = canUsePaidTools

/** AI runs each user gets per calendar day during the free build phase. */
export const RUNS_PER_USER_PER_DAY = 15

/** AI runs allowed across all users per calendar day (kept under the Groq free-tier ceiling). */
export const RUNS_SITE_PER_DAY = 400

/**
 * Support overrides. To give one user more runs while we build, add their
 * user id here with the number of daily runs they should get, then redeploy.
 *
 * Example:
 *   '550e8400-e29b-41d4-a716-446655440000': 10,
 */
export const USER_DAILY_OVERRIDES: Record<string, number> = {}

/**
 * Daily AI run limit for a user: their override if one exists, otherwise the default.
 */
export function getUserDailyLimit(userId: string): number {
  return USER_DAILY_OVERRIDES[userId] ?? RUNS_PER_USER_PER_DAY
}

/** Claude writes allowed per plan per calendar day. Raise this number later. */
export const CLAUDE_WRITES_PER_DAY = 10
