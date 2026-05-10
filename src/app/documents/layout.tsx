import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Documents | CreatorFlow365'
const description =
  'CreatorFlow365 documents library—available after sign-in. Save scripts, briefs & notes next to your posting workflow.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${origin}/documents` },
  openGraph: {
    title,
    description,
    url: `${origin}/documents`,
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

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
