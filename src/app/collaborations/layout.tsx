import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Collaborations | CreatorFlow365'
const description =
  'Manage brand deals & partnerships inside CreatorFlow365—UI preview; sign in for live workspace data.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${origin}/collaborations` },
  openGraph: {
    title,
    description,
    url: `${origin}/collaborations`,
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

export default function CollaborationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
