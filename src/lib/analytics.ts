// Google Analytics 4 Integration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track conversions
export const trackConversion = (conversionType: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_TRACKING_ID,
      event_category: 'conversion',
      event_label: conversionType,
      value: value,
    })
  }
}

// Track subscription events
export const trackSubscription = (plan: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: value,
      currency: 'USD',
      items: [{
        item_id: plan,
        item_name: `CreatorFlow ${plan}`,
        category: 'subscription',
        quantity: 1,
        price: value,
      }]
    })
  }
}

// Track user engagement
export const trackEngagement = (action: string, page: string) => {
  event({
    action,
    category: 'engagement',
    label: page,
  })
}

// Track content creation
export const trackContentCreation = (platform: string, action: string) => {
  event({
    action: `content_${action}`,
    category: 'content_creation',
    label: platform,
  })
}

// Track collaboration events
export const trackCollaboration = (action: string, value?: number) => {
  event({
    action: `collaboration_${action}`,
    category: 'collaborations',
    value: value,
  })
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
