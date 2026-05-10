import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Try CreatorFlow365 Demo—No Signup | CreatorFlow365'
const description =
  'Click through scheduling & creator workflows without creating an account. Then start a 14-day trial if it fits.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${origin}/demo` },
  openGraph: {
    title,
    description,
    url: `${origin}/demo`,
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

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
