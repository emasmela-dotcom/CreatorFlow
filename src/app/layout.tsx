import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import { GA_TRACKING_ID, META_PIXEL_ID, isValidMetaPixelId } from '@/lib/analytics'
import HomeButton from '@/components/HomeButton'
import SeoSiteFooter from '@/components/SeoSiteFooter'
import FeedbackWrapper from '@/components/FeedbackWrapper'
import AiCoachCornerWrapper from '@/components/AiCoachCornerWrapper'
import { EarlyAccessBanner } from '@/components/EarlyAccessBanner'

const SITE_URL =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'
const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')

const siteDescription =
  'CreatorFlow365 is the creator workspace to plan, draft, schedule, publish, and track content across your social channels with AI tools, analytics, and collaboration workflows.'

const schemaOrgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'CreatorFlow365',
      url: SITE_ORIGIN,
      description: siteDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_ORIGIN}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'CreatorFlow365',
      url: SITE_ORIGIN,
      sameAs: [SITE_ORIGIN],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'CreatorFlow365',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_ORIGIN,
      description: siteDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free while we build — paid plans launch later',
      },
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: 'CreatorFlow365 | Social Media AI Workspace for Creators',
  description: siteDescription,
  keywords: 'creator workspace, social media scheduling, AI content writer, creator analytics, content calendar, multi-platform publishing, creator collaboration, creator CRM, social media management, creator tools',
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
    title: 'CreatorFlow365 | Social Media AI Workspace for Creators',
    description: siteDescription,
    type: 'website',
    url: SITE_ORIGIN,
    siteName: 'CreatorFlow365',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorFlow365 | Social Media AI Workspace for Creators',
    description: siteDescription,
    creator: '@creatorflow365',
  },
  alternates: {
    canonical: SITE_ORIGIN,
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
  const metaPixelId =
    META_PIXEL_ID && isValidMetaPixelId(META_PIXEL_ID) ? META_PIXEL_ID : null

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

        {metaPixelId ? (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
                  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${metaPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          </>
        ) : null}
        
        {/* Vercel Analytics */}
        <Script
          src="https://va.vercel-scripts.com/v1/script.debug.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {metaPixelId ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrgJsonLd),
          }}
        />
        <EarlyAccessBanner />
        {children}
        <SeoSiteFooter />
        <FeedbackWrapper />
        <AiCoachCornerWrapper />
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