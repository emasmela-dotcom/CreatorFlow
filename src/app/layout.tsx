import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorFlow - The Ultimate Content Creator Platform',
  description: 'Scale your content creation business with CreatorFlow. Manage all your social media accounts, track analytics, and grow your revenue with our all-in-one platform. 15-day free trial available.',
  keywords: 'content creator, social media management, analytics, brand collaborations, creator tools, Instagram scheduler, Twitter scheduler, LinkedIn scheduler, YouTube scheduler',
  authors: [{ name: 'CreatorFlow' }],
  creator: 'CreatorFlow',
  publisher: 'CreatorFlow',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CreatorFlow - The Ultimate Content Creator Platform',
    description: 'Scale your content creation business with CreatorFlow. Manage all your social media accounts, track analytics, and grow your revenue.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://creatorflow.ai',
    siteName: 'CreatorFlow',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorFlow - The Ultimate Content Creator Platform',
    description: 'Scale your content creation business with CreatorFlow.',
    creator: '@creatorflow',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://creatorflow.ai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        
        {/* Vercel Analytics */}
        <Script
          src="https://va.vercel-scripts.com/v1/script.debug.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}