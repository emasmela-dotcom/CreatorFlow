import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Sign In | CreatorFlow365'
const description =
  'Open your creator workspace—library, scheduling, analytics & plan settings in one dashboard after login.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: `${origin}/signin` },
  openGraph: {
    title,
    description,
    url: `${origin}/signin`,
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

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
