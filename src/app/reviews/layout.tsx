import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Creator Reviews & Testimonials | CreatorFlow365'
const description =
  'Preview examples of the Documents workflow. Free while we build. Real creator reviews coming later.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${origin}/reviews` },
  openGraph: {
    title,
    description,
    url: `${origin}/reviews`,
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

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
