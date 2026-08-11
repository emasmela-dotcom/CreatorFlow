import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Pricing | CreatorFlow365'
const description =
  'CreatorFlow365 plans: Starter $9, Essential $19, Creator $49, Professional $79, Business $149 per month. Free while we build.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: `${origin}/pricing` },
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
