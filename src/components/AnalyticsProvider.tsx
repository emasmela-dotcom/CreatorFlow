'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview, event, trackConversion, trackSubscription, trackEngagement } from '@/lib/analytics'

function AnalyticsComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  // Track page views and user interactions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Track CTA button clicks
      if (target.matches('button[class*="gradient"], a[class*="gradient"]')) {
        const buttonText = target.textContent || 'unknown'
        trackEngagement('cta_click', pathname)
        event({
          action: 'cta_click',
          category: 'engagement',
          label: buttonText,
        })
      }

      // Track pricing plan clicks
      if (target.textContent?.includes('Get Started') || target.textContent?.includes('Start Free Trial')) {
        trackEngagement('pricing_click', pathname)
        event({
          action: 'pricing_click',
          category: 'conversion',
          label: 'pricing_cta',
        })
      }

      // Track navigation clicks
      if (target.matches('nav a, [role="button"]')) {
        const linkText = target.textContent || 'unknown'
        trackEngagement('navigation_click', pathname)
        event({
          action: 'navigation_click',
          category: 'engagement',
          label: linkText,
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  return null
}

export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsComponent />
    </Suspense>
  )
}

// Hook for tracking custom events
export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    event({ action, category, label, value })
  }

  const trackConversionEvent = (conversionType: string, value?: number) => {
    trackConversion(conversionType, value)
  }

  const trackSubscriptionEvent = (plan: string, value: number) => {
    trackSubscription(plan, value)
  }

  const trackEngagementEvent = (action: string, page: string) => {
    trackEngagement(action, page)
  }

  return {
    trackEvent,
    trackConversionEvent,
    trackSubscriptionEvent,
    trackEngagementEvent,
  }
}
