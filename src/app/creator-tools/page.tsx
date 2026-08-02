import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'

export const metadata: Metadata = {
  title: 'Creator Tools & Documents Workspace | CreatorFlow365',
  description:
    'Documents workspace: save your original once, format for Instagram, X, LinkedIn, TikTok, YouTube, and more. Free while we build—more dashboard tools coming later.',
  keywords: [
    'creator tools',
    'content creator software',
    'social media management for creators',
    'content calendar app',
    'schedule Instagram posts',
    'schedule LinkedIn posts',
    'Twitter scheduler for creators',
    'TikTok content planning',
    'YouTube creator workflow',
    'hashtag research tool',
    'content repurposing',
    'creator analytics dashboard',
    'micro saas for creators',
    'creator CRM',
    'brand deal follow up',
    'content library for creators',
  ],
  openGraph: {
    title: 'Creator Tools & Documents Workspace | CreatorFlow365',
    description:
      'Save once in Documents, format for major creator platforms. Free account—paid plans with live AI later.',
    url: `${baseUrl}/creator-tools`,
    siteName: 'CreatorFlow365',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creator Tools & Documents Workspace | CreatorFlow365',
    description:
      'Documents workspace for creators—save once, format for any platform. Free while we build.',
  },
  alternates: {
    canonical: `${baseUrl}/creator-tools`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'CreatorFlow365',
      description:
        'Documents workspace for creators—save your original once and format for major platforms. More tools in progress.',
      publisher: { '@id': `${baseUrl}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'CreatorFlow365',
      url: baseUrl,
      email: 'support@creatorflow365.com',
    },
    {
      '@type': 'WebPage',
      '@id': `${baseUrl}/creator-tools#webpage`,
      url: `${baseUrl}/creator-tools`,
      name: 'Creator Tools & Documents Workspace',
      isPartOf: { '@id': `${baseUrl}/#website` },
      description:
        'How CreatorFlow365 maps creator searches to the Documents workspace and tools in progress.',
    },
  ],
}

const sections: { id: string; title: string; queries: string[]; body: string[] }[] = [
  {
    id: 'all-in-one-creator-tools',
    title: 'All-in-one creator tools (stop paying for ten subscriptions)',
    queries: [
      'all in one app for content creators',
      'creator toolkit in one place',
      'micro saas for creators',
    ],
    body: [
      'Creators often pay for a scheduler, a hashtag tool, a doc hub, analytics, and a CRM separately. CreatorFlow365 is building toward one workspace. Today the live core is Documents: save your original once and format for platforms when you need it.',
      'Scheduling, analytics, AI tools, and CRM pieces are in progress. Free while we build.',
    ],
  },
  {
    id: 'content-calendar-scheduling',
    title: 'Content calendar & social scheduling',
    queries: [
      'content calendar for creators',
      'schedule posts for Instagram and LinkedIn',
      'social media scheduler for small creators',
    ],
    body: [
      'Scheduling and calendar views are in progress—not the main workspace today.',
      'Use Documents now: save your original, pick a platform, and copy formatted text when you are ready to post.',
    ],
  },
  {
    id: 'multi-platform-workflow',
    title: 'All supported platforms in one workflow',
    queries: [
      'post to multiple platforms from one app',
      'creator workflow Instagram TikTok YouTube',
      'cross platform content planning',
    ],
    body: [
      'You can target the major networks from one compose experience instead of rewriting everything from scratch in five tabs.',
      'Where a network supports a direct connection in your account (for example YouTube when connected), you can publish through the app. For other networks, CreatorFlow365 formats captions and hashtags so you can copy and paste into the official app—still faster than rebuilding each variant by hand.',
    ],
  },
  {
    id: 'youtube-upload',
    title: 'YouTube: connect your channel when you want direct uploads',
    queries: [
      'upload to YouTube from third party app',
      'YouTube OAuth for creators',
      'manage YouTube alongside other platforms',
    ],
    body: [
      'Connect YouTube from your dashboard connections tab when you want the platform to upload on your behalf (subject to your Google account and API settings).',
      'When you are not connected, you still get title and description formatted for YouTube so you can paste them in quickly.',
    ],
  },
  {
    id: 'copy-ready-captions',
    title: 'Platform-ready captions & hashtag blocks (manual post where APIs are limited)',
    queries: [
      'Instagram caption formatter',
      'TikTok caption ideas structure',
      'LinkedIn post formatting tool',
    ],
    body: [
      'Some networks restrict or gate third-party posting. Instead of pretending those limits do not exist, CreatorFlow365 outputs text that respects typical length and layout conventions per platform.',
      'That means less editing in the native app and fewer accidental cut-offs on short-form networks.',
    ],
  },
  {
    id: 'hashtags-seo-captions',
    title: 'Hashtag research, captions & AI-assisted writing',
    queries: [
      'hashtag generator for Instagram',
      'hashtag research for creators',
      'AI writing tools for social posts',
    ],
    body: [
      'Your dashboard includes formatting helpers and other tools—some are previews or coming soon. Documents is live today: save once, format for a platform, copy to publish.',
      'Use what is live now; more assistants and optimizers will roll out as we build.',
    ],
  },
  {
    id: 'content-repurposing',
    title: 'Repurpose one idea into many posts',
    queries: [
      'repurpose content for multiple platforms',
      'turn one video into social posts',
      'content repurposing tool for creators',
    ],
    body: [
      'Repurposing starts in Documents: save one original, then format it for different platforms when you need each version.',
      'Formatted copies are previews only—they are not saved as separate documents.',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & performance visibility',
    queries: [
      'analytics dashboard for content creators',
      'track social performance simple dashboard',
      'what to post next creator',
    ],
    body: [
      'Analytics dashboards and performance tools are in progress.',
      'Today, focus on Documents: save your original and copy platform-formatted text. We will add deeper analytics later.',
    ],
  },
  {
    id: 'documents-library',
    title: 'Documents & personal content library',
    queries: [
      'content library for creators',
      'store drafts and media for social media',
      'creator document workspace',
    ],
    body: [
      'Keep briefs, scripts, and long-form notes alongside your social pipeline using the documents area in the product.',
      'Central storage reduces the “which Google Doc was that reel script in?” problem as you scale output.',
    ],
  },
  {
    id: 'follow-thru-crm',
    title: 'Follow Thru CRM—track brands, collaborators, and promises',
    queries: [
      'CRM for influencers',
      'track brand deals creators',
      'follow up tool for content creators',
    ],
    body: [
      'Follow Thru is included to help you track people, promises, and next actions without a corporate sales CRM.',
      'It is built for creator workflows: collaborations, sponsors, and high-value relationships—not generic enterprise pipelines.',
    ],
  },
  {
    id: 'collaborations',
    title: 'Collaborations & partnership workflows',
    queries: [
      'creator collaboration tools',
      'manage brand partnerships content creator',
    ],
    body: [
      'When you work with other creators or brands, having collaboration tooling in the same product as content and CRM reduces context switching.',
      'Explore the collaborations area from your account when you are ready to coordinate joint campaigns.',
    ],
  },
  {
    id: 'speed-reliability',
    title: 'Fast, usable experience (SEO and humans care about this)',
    queries: [
      'lightweight creator app',
      'simple social media tool for creators',
    ],
    body: [
      'This page is a lightweight, text-first overview on purpose: it loads quickly, reads clearly on mobile, and uses proper headings so both people and search engines can scan it.',
      'The product itself is built as a modern web app—sign in, try the demo, or create a free account to use Documents.',
    ],
  },
  {
    id: 'trial-pricing',
    title: 'Free while we build',
    queries: [
      'creatorflow365 free trial',
      'creator software no credit card trial',
      'pricing for creator tools platform',
    ],
    body: [
      'Create a free account—no credit card required. Paid plans with live AI launch later.',
      'Use Documents now while we build the rest of the workspace.',
    ],
  },
  {
    id: 'links-mentions',
    title: 'Link to CreatorFlow365 (educators, press, newsletters)',
    queries: [],
    body: [
      'If you cover creator economy tools, productivity stacks, or micro-SaaS, you are welcome to link to this page or the homepage. A short factual description: “CreatorFlow365 is a creator workspace. Documents is live today—save once, format for platforms. More tools are in progress.”',
      'For corrections, interviews, or partnership questions, contact support@creatorflow365.com. We do not buy links; we prefer real mentions from people who try the product.',
    ],
  },
]

export default function CreatorToolsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Home
          </Link>
          <span className="text-gray-500" aria-hidden>|</span>
          <Link href="/signup" className="text-sm text-gray-300 hover:text-white transition-colors ml-auto">
            Create free account
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 pb-24">
        <article>
          <p className="text-sm font-semibold text-optimist-400 uppercase tracking-wide mb-2">CreatorFlow365</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Creator tools &amp; Documents workspace—what is live today
          </h1>
          <div className="space-y-3 mb-6">
            <p className="text-lg text-gray-100 leading-relaxed font-medium">
              CreatorFlow365&apos;s live core is Documents: save your original once, pick a platform, and copy formatted
              text. One draft, many exports.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Scheduling, analytics, AI tools, and CRM features are in progress. This page maps common creator searches
              to what works now and what is coming.
            </p>
            <p className="text-base text-gray-300 leading-relaxed">
              Skim by section, share a heading link, or jump to the three guides at the bottom when one intent is all you
              need.
            </p>
          </div>

          <section
            className="border border-gray-800 rounded-xl p-6 bg-gray-950/40 mb-10"
            aria-labelledby="hub-trust-heading"
          >
            <h2 id="hub-trust-heading" className="text-lg font-semibold text-white mb-2">
              Why you can trust this overview
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Same site and operator as{' '}
              <Link href="/" className="text-optimist-400 hover:underline">
                creatorflow365.com
              </Link>
              . Free-while-we-build messaging matches the homepage; legal terms are in{' '}
              <Link href="/privacy" className="text-optimist-400 hover:underline">
                Privacy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-optimist-400 hover:underline">
                Terms
              </Link>
              . Product questions:{' '}
              <a href="mailto:support@creatorflow365.com" className="text-optimist-400 hover:underline">
                support@creatorflow365.com
              </a>
              .
            </p>
          </section>

          <nav aria-label="On this page" className="mb-12 p-4 rounded-xl bg-gray-900/80 border border-gray-800">
            <p className="text-sm font-semibold text-white mb-3">On this page</p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-optimist-400 hover:text-optimist-300">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">{s.title}</h2>
                {s.queries.length > 0 && (
                  <p className="text-xs text-gray-300 mb-3">
                    <span className="text-gray-300">Example searches this section matches:</span>{' '}
                    {s.queries.join(' · ')}
                  </p>
                )}
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section
            className="mt-16 pt-10 border-t border-gray-800"
            aria-labelledby="pillar-guides-heading"
          >
            <h2 id="pillar-guides-heading" className="text-2xl font-bold text-white mb-4">
              Guides that match how people search
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              This page is the hub. Below are focused guides for three common intents—each links back to scheduling,
              analytics, and other tools so readers stay inside one product story.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 leading-relaxed">
              <li>
                <Link href="/ai-caption-writer-instagram-tiktok" className="text-optimist-400 hover:underline">
                  AI captions for Instagram and TikTok—drafting workflow and library
                </Link>
              </li>
              <li>
                <Link href="/social-media-scheduler-for-creators" className="text-optimist-400 hover:underline">
                  Social media scheduler for creators—one calendar across platforms
                </Link>
              </li>
              <li>
                <Link href="/content-creator-analytics-platform" className="text-optimist-400 hover:underline">
                  Creator analytics—performance next to drafts and schedules
                </Link>
              </li>
              <li>
                <Link href="/follow-thru" className="text-optimist-400 hover:underline">
                  Creator CRM for brand deals and follow-ups (Follow Thru)
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-optimist-400 hover:underline">
                  CreatorFlow365 preview examples
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-optimist-400 hover:underline">
                  Create a free account
                </Link>
              </li>
            </ul>
          </section>

          <nav
            className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300"
            aria-label="Site"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/ai-caption-writer-instagram-tiktok" className="hover:text-white transition-colors">AI captions</Link>
            <Link href="/social-media-scheduler-for-creators" className="hover:text-white transition-colors">Scheduler</Link>
            <Link href="/content-creator-analytics-platform" className="hover:text-white transition-colors">Analytics</Link>
            <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
            <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>

          <div className="mt-16 pt-10 border-t border-gray-800 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">Ready to try the workspace?</p>
              <p className="text-sm text-gray-300 mt-1">Try Documents free, or create a free account.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold border border-gray-700"
              >
                Try demo
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-optimist-600 hover:bg-optimist-500 text-white text-sm font-semibold"
              >
                Sign up
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
