import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | CreatorFlow365',
  description:
    'Access your creator workspace—library, scheduling, analytics & plan settings in one dashboard.',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
