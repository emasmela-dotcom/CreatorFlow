import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account ready | CreatorFlow365',
  description: 'Free while we build. Paid plans with live AI later.',
  robots: { index: false, follow: true },
}

export default function TrialSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
