import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'

export const metadata: Metadata = {
  title: 'Creator tools, scheduling & content workspace – CreatorFlow365',
  description:
    'All-in-one creator tools: content calendar, social scheduling, hashtag help, repurposing, analytics, documents, and Follow Thru CRM. 14-day free trial. Built for Instagram, X, LinkedIn, TikTok, and YouTube workflows.',
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
    title: 'Creator tools & workspace for serious creators – CreatorFlow365',
    description:
      'Plan, create, and publish from one workspace—53+ tools, scheduling, analytics, and Follow Thru CRM included.',
    url: `${baseUrl}/creator-tools`,
    siteName: 'CreatorFlow365',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creator tools & workspace – CreatorFlow365',
    description:
      'Content calendar, scheduling, AI-assisted tools, analytics, and creator CRM in one membership.',
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
        'Micro-SaaS marketplace and workspace for content creators—tools, scheduling, analytics, and CRM.',
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
      name: 'Creator tools, scheduling & content workspace',
      isPartOf: { '@id': `${baseUrl}/#website` },
      description:
        'How CreatorFlow365 helps creators plan content, manage platforms, and run their business from one app.',
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
      'Creators often pay for a scheduler, a hashtag tool, a doc hub, analytics, and a CRM separately. CreatorFlow365 bundles 53+ professional tools into one membership so your workflow stays in one workspace.',
      'If you have been searching for a single dashboard to plan, draft, and track performance, that is the problem this platform is built around.',
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
      'Use the create flow to draft for the platforms you care about and save drafts, schedule for later, or publish when you are ready.',
      'Your dashboard is designed around the rhythm creators actually use: batch ideas, align timing, and keep a clear view of what goes out next.',
    ],
  },
  {
    id: 'multi-platform-workflow',
    title: 'Instagram, X (Twitter), LinkedIn, TikTok & YouTube—in one workflow',
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
      'Your dashboard includes AI-powered assistants and optimizers—hashtag help, reformatting, and content support—so you are not jumping into a separate “writing SaaS” for every post.',
      'Use them when you want speed; you stay in control of what actually gets published.',
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
      'Repurposing is how solo creators keep volume up without burning out. CreatorFlow365 includes flows that help you take one core idea and adapt it for different channels.',
      'Pair that with the create page so each variant lands in the right shape for the network you select.',
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
      'See how your content is performing and use built-in tools to stress-test ideas before you ship them.',
      'Analytics lives next to scheduling so you are not exporting CSVs into a spreadsheet every week just to decide what to double down on.',
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
      'The product itself is built as a modern web app—sign in, try the demo, or start a trial to feel responsiveness in the real workflows.',
    ],
  },
  {
    id: 'trial-pricing',
    title: '14-day free trial & transparent pricing',
    queries: [
      'creatorflow365 free trial',
      'creator software no credit card trial',
      'pricing for creator tools platform',
    ],
    body: [
      'Start with a 14-day free trial. As stated on the homepage, no credit card is required for the trial.',
      'Compare plans on the pricing page when you are ready to match features to your stage as a creator.',
    ],
  },
  {
    id: 'links-mentions',
    title: 'Link to CreatorFlow365 (educators, press, newsletters)',
    queries: [],
    body: [
      'If you cover creator economy tools, productivity stacks, or micro-SaaS, you are welcome to link to this page or the homepage. A short factual description: “CreatorFlow365 is an all-in-one creator workspace with scheduling, AI-assisted tools, analytics, documents, and Follow Thru CRM.”',
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
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/signup" className="text-sm text-gray-400 hover:text-white transition-colors ml-auto">
            Start free trial
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 pb-24">
        <article>
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">CreatorFlow365</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Creator tools, scheduling &amp; content workspace—built for how creators actually search
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Below is a structured map of the problems creators type into Google—content calendar apps, schedulers, hashtag
            help, repurposing, analytics, CRM—and how CreatorFlow365 addresses each in one membership. No keyword stuffing:
            just clear sections you can skim, share, or link to.
          </p>

          <nav aria-label="On this page" className="mb-12 p-4 rounded-xl bg-gray-900/80 border border-gray-800">
            <p className="text-sm font-semibold text-white mb-3">On this page</p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-purple-400 hover:text-purple-300">
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
                  <p className="text-xs text-gray-500 mb-3">
                    <span className="text-gray-400">Example searches this section matches:</span>{' '}
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

          <div className="mt-16 pt-10 border-t border-gray-800 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">Ready to try the workspace?</p>
              <p className="text-sm text-gray-400 mt-1">Demo without signup, or start your trial from pricing.</p>
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
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold"
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
