import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Pricing | CreatorFlow365'
const description =
  'Pricing lives on the homepage (#pricing). Compare tiers & trials—Starter through Business—before signup.'

export const metadata: Metadata = {
  title,
  description,
  // Thin redirect to /#pricing — avoid indexing duplicate stub; canonical is homepage.
  robots: { index: false, follow: true },
  alternates: { canonical: `${origin}/` },
  openGraph: {
    title,
    description,
    url: `${origin}/`,
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
