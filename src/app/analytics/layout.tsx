import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Analytics Dashboard | CreatorFlow365'
const description =
  'In-app analytics view for logged-in creators. For SEO-focused overview of analytics + drafting, see our creator analytics guide.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${origin}/analytics` },
  openGraph: {
    title,
    description,
    url: `${origin}/analytics`,
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

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children
}
