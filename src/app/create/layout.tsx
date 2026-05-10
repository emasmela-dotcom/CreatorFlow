import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create post | CreatorFlow365',
  description:
    'Draft and schedule posts in your CreatorFlow365 workspace—available after sign-in.',
  robots: { index: false, follow: false },
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
