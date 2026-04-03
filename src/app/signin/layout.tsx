import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In – CreatorFlow365',
  description: 'Sign in to CreatorFlow365. Your creator workspace for planning, AI drafting, scheduling, and analytics in one flow.',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
