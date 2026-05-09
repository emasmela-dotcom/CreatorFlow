import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews | CreatorFlow365',
  description:
    'Creator feedback on CreatorFlow365—scheduling, analytics, drafting & workspace tools. Start a trial to compare.',
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
