import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Compare Plans & Included Tools | CreatorFlow365'
const description =
  'Pick a tier, see tools included, then checkout—from $9/mo. 14-day trial, no credit card required. Honest limits.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${origin}/select-plan` },
  openGraph: {
    title,
    description,
    url: `${origin}/select-plan`,
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

export default function SelectPlanLayout({ children }: { children: React.ReactNode }) {
  return children
}
