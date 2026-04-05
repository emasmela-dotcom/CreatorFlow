import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/analytics'
import HomeButton from '@/components/HomeButton'

export const metadata: Metadata = {
  title: 'CreatorFlow365 – The Creator Workspace for Planning, AI Drafting & Publishing',
  description: 'Plan, draft with AI, and ship content—solo or with your team. Documents, templates, a content calendar, hashtag sets, scheduling, and analytics in one flow. 14-day free trial, no credit card required.',
  keywords: 'creator OS, content creator workspace, AI captions, content calendar, social media scheduling, templates, hashtag sets, batch content, multi-platform publishing, repurpose content, creator tools',
  authors: [{ name: 'CreatorFlow365' }],
  creator: 'CreatorFlow365',
  publisher: 'CreatorFlow365',
  manifest: '/manifest.json',
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
    title: 'CreatorFlow365 – The Creator Workspace for Planning, AI Drafting & Publishing',
    description: 'Plan, draft with AI, and ship content—solo or with your team. Documents, templates, scheduling, and analytics in one flow.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com',
    siteName: 'CreatorFlow365',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorFlow365 – The Creator Workspace for Planning, AI Drafting & Publishing',
    description: 'Plan, draft with AI, and ship content—solo or with your team. Documents, templates, scheduling, and analytics in one flow.',
    creator: '@creatorflow365',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CreatorFlow365',
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CreatorFlow365" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
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
      <body>
        {children}
        <HomeButton />
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('Service Worker registered:', registration.scope)
                  })
                  .catch((error) => {
                    console.log('Service Worker registration failed:', error)
                  })
              })
            }
          `}
        </Script>
      </body>
    </html>
  )
}