import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Follow Thru CRM – CreatorFlow365',
  description: 'Track people and promises in one place. Follow Thru CRM for creators—included in every CreatorFlow365 plan.',
}

export default function FollowThruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
