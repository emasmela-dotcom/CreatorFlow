import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trial started | CreatorFlow365',
  description: 'Your free trial is active.',
  robots: { index: false, follow: true },
}

export default function TrialSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
