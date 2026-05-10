import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Reset Password | CreatorFlow365'
const description =
  'Reset your CreatorFlow365 account password securely. Need help? Contact support@creatorflow365.com.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${origin}/forgot-password` },
  openGraph: {
    title,
    description,
    url: `${origin}/forgot-password`,
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

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
