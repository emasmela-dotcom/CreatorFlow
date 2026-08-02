import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Pricing – Plans Coming Soon | CreatorFlow365'
const description =
  'Free while we build. Create a free account and use Documents today. Paid plans with live AI launch later.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${origin}/#pricing` },
  openGraph: {
    title,
    description,
    url: `${origin}/pricing`,
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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
