import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Documents | CreatorFlow365'
const description =
  'One draft, many exports. Save your original once in CreatorFlow365 Documents and format for any platform when you need it.'

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
