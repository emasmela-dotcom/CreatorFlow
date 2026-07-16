import type { MetadataRoute } from 'next'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'

export default function robots(): MetadataRoute.Robots {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  const disallowedPaths = [
    '/api/',
    '/dashboard',
    '/create',
    '/documents',
    '/analytics',
    '/collaborations',
    '/forgot-password',
    '/dashboard/trial-success',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: ['Googlebot', 'Google-Extended', 'GPTBot', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    host: normalizedBaseUrl,
    sitemap: `${normalizedBaseUrl}/sitemap.xml`,
  }
}
