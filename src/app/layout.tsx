import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorFlow - The Ultimate Content Creator Platform',
  description: 'Scale your content creation business with CreatorFlow. Manage all your social media accounts, track analytics, and grow your revenue with our all-in-one platform.',
  keywords: 'content creator, social media management, analytics, brand collaborations, creator tools',
  openGraph: {
    title: 'CreatorFlow - The Ultimate Content Creator Platform',
    description: 'Scale your content creation business with CreatorFlow. Manage all your social media accounts, track analytics, and grow your revenue.',
    type: 'website',
    url: 'https://creatorflow-public-64sayqv0n-erics-projects-b395e20f.vercel.app',
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