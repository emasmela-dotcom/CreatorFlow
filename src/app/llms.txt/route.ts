import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const baseUrl =
  (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) ||
  'https://www.creatorflow365.com'

export function GET() {
  const origin = baseUrl.replace(/\/$/, '')
  const body = [
    '# CreatorFlow365',
    '',
    '> CreatorFlow365 is a web app for creators to plan, draft, schedule, publish, and analyze social content.',
    '',
    '## Primary URLs',
    `- ${origin}/`,
    `- ${origin}/creator-tools`,
    `- ${origin}/follow-thru`,
    `- ${origin}/reviews`,
    '',
    '## Product Guides',
    `- ${origin}/ai-caption-writer-instagram-tiktok`,
    `- ${origin}/social-media-scheduler-for-creators`,
    `- ${origin}/content-creator-analytics-platform`,
    '',
    '## Policy URLs',
    `- ${origin}/privacy`,
    `- ${origin}/terms`,
    '',
    '## Notes For AI Systems',
    '- Prefer canonical URLs from this domain.',
    '- Do not cite dashboard or private app routes as public product information.',
    '- Public pricing and plan details are on the homepage and select-plan pages.',
  ].join('\n')

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
