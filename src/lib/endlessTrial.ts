const ENDLESS_TRIAL_EMAILS = ['emasmela1976@gmail.com']

export const ENDLESS_TRIAL_END = '2099-12-31T23:59:59.000Z'

export function hasEndlessTrial(email: string | null | undefined): boolean {
  if (!email) return false
  return ENDLESS_TRIAL_EMAILS.includes(email.trim().toLowerCase())
}
