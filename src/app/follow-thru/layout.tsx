import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Follow Thru CRM | CreatorFlow365',
  description:
    'Track brands, collaborators & follow-ups beside your calendar—included in CreatorFlow365 plans. Open from your dashboard.',
}

export default function FollowThruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
