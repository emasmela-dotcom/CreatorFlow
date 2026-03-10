import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In – CreatorFlow365',
  description: 'Sign in to CreatorFlow365. Manage, schedule, and monetize your content with 53+ tools in one place.',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
