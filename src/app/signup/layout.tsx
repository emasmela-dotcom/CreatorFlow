import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up – CreatorFlow365',
  description: 'Start your 14-day free trial. No credit card required. Stop juggling apps. Start growing with CreatorFlow365.',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
