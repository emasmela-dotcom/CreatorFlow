import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Create Post | CreatorFlow365'
const description =
  'Draft and schedule posts in your CreatorFlow365 workspace—available after sign-in.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: `${origin}/create` },
  openGraph: {
    title,
    description,
    url: `${origin}/create`,
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

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
