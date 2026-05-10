import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Follow Thru CRM for Creators | CreatorFlow365'
const description =
  'Track brands, collaborators & follow-ups beside your calendar—included in CreatorFlow365. Open from your dashboard after signup.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${origin}/follow-thru` },
  openGraph: {
    title,
    description,
    url: `${origin}/follow-thru`,
    siteName: 'CreatorFlow365',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function FollowThruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
