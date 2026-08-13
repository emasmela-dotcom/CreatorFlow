/**
 * AI usage policy for the free build phase.
 * All AI allowances are controlled from this one file.
 */

/** While true, every user gets the same daily allowance regardless of plan. */
export const FREE_BUILD_PHASE = true

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
