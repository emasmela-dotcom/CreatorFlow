import { MetadataRoute } from 'next'

/** Phase 8 — SEO guide URLs to monitor in Search Console (must stay listed here). */
export const SEO_GUIDE_PATHS = [
  '/ai-caption-writer-instagram-tiktok',
  '/social-media-scheduler-for-creators',
  '/content-creator-analytics-platform',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const raw = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'
  const origin = raw.replace(/\/$/, '')

  const guideEntries: MetadataRoute.Sitemap = SEO_GUIDE_PATHS.map((path) => ({
    url: `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }))

  return [
    { url: origin, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/creator-tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    ...guideEntries,
    { url: `${origin}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${origin}/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${origin}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/select-plan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/follow-thru`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    // /analytics, /documents, /collaborations — app UI surfaces (noindex in route layouts); omit from sitemap.
    // /create is disallowed in robots.ts — omit from sitemap to avoid conflicting crawl hints.
    { url: `${origin}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${origin}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${origin}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
