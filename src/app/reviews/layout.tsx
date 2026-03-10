import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews – CreatorFlow365',
  description: 'What creators say about CreatorFlow365. Real reviews from content creators who manage, schedule, and grow with our tools.',
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
