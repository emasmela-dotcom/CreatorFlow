import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up – 14-Day Free Trial | CreatorFlow365',
  description:
    'Create your account: full workspace trial, no credit card. Plan, draft & schedule across major platforms—upgrade anytime.',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
