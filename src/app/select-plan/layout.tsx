import type { Metadata } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const origin = baseUrl.replace(/\/$/, '')

const title = 'Plans | CreatorFlow365'
const description =
  'Starter $9, Creator $49, Business $149. Free while we build. You will not be charged until paid plans go live.'

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
