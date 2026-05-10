import type { Metadata } from 'next'
import Link from 'next/link'
import { ANALYTICS_GUIDE_FAQ } from '@/lib/seo/guidePageFaqs'
import { faqPageJsonLd } from '@/lib/seo/faqJsonLd'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'
const pagePath = '/content-creator-analytics-platform'

const title = 'Creator Analytics Platform | CreatorFlow365'
const description =
  'Analytics next to drafts & schedules—plan-based reporting for creators & teams. 14-day trial, no card.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${baseUrl}${pagePath}`,
    siteName: 'CreatorFlow365',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: `${baseUrl}${pagePath}`,
  },
}

export default function ContentCreatorAnalyticsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Content Creator Analytics Platform</h1>
          <p className="text-lg text-gray-300">
            CreatorFlow365 gives creators one place to review content performance and plan what to
            post next without bouncing between disconnected analytics tools.
          </p>
          <p className="text-gray-400">
            Use analytics in the same workflow where you write, organize, and schedule content so
            your strategy decisions happen faster.
          </p>
          <p className="text-gray-400 border-l-2 border-purple-500/50 pl-4">
            Starter includes analytics support; Essential and higher tiers expand reporting depth. Every plan includes a
            14-day free trial with no credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Browse every mapped topic in one place:{' '}
            <Link href="/creator-tools" className="text-purple-400 hover:underline">
              creator tools &amp; workspace overview
            </Link>
            .
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Why integrated analytics matters</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>See performance context next to the content that produced it.</li>
            <li>Identify themes and formats worth repeating.</li>
            <li>Reduce guesswork when planning upcoming posts.</li>
            <li>Share clear summaries with collaborators and clients.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">What creators can track</h2>
          <p className="text-gray-300">
            Plan-based analytics helps you compare post outcomes, surface useful patterns, and make
            practical adjustments to your schedule and content mix.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Plan fit</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Starter includes analytics support for foundational reporting.</li>
            <li>Essential expands analytics depth for multi-platform creators (Growth tier on select-plan).</li>
            <li>Creator and above adds advanced and enterprise-level analytics options.</li>
          </ul>
        </section>

        <section className="space-y-3 border border-gray-800 rounded-xl p-6 bg-gray-950/40">
          <h2 className="text-2xl font-semibold">Why you can trust this page</h2>
          <p className="text-gray-300">
            Analytics depth differs by plan—everything here matches the homepage tier list and{' '}
            <Link href="/select-plan" className="text-purple-400 hover:underline">select-plan</Link>. CreatorFlow365 operates{' '}
            <Link href="/" className="text-purple-400 hover:underline">creatorflow365.com</Link>; legal entity details are in{' '}
            <Link href="/privacy" className="text-purple-400 hover:underline">Privacy</Link>{' '}
            and{' '}
            <Link href="/terms" className="text-purple-400 hover:underline">Terms</Link>.
          </p>
          <p className="text-gray-400 text-sm">
            We label analytics as plan-based support or expanded reporting—not guaranteed rankings or viral outcomes. Questions:{' '}
            <a href="mailto:support@creatorflow365.com" className="text-purple-400 hover:underline">support@creatorflow365.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqPageJsonLd(ANALYTICS_GUIDE_FAQ)),
            }}
          />
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3 text-gray-300">
            {ANALYTICS_GUIDE_FAQ.map((item) => (
              <p key={item.question}>
                <strong className="text-white">{item.question}</strong> {item.answer}
              </p>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Related workflows on CreatorFlow365</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              <Link href="/ai-caption-writer-instagram-tiktok" className="text-purple-400 hover:underline">
                AI caption workflow guide
              </Link>{' '}
              for drafts that feed analytics later.
            </li>
            <li>
              <Link href="/social-media-scheduler-for-creators" className="text-purple-400 hover:underline">
                Social media scheduler for creators
              </Link>{' '}
              to align posting cadence with metrics.
            </li>
            <li>
              <Link href="/creator-tools" className="text-purple-400 hover:underline">
                Creator tools directory
              </Link>.
            </li>
            <li>
              <Link href="/follow-thru" className="text-purple-400 hover:underline">
                Follow Thru CRM for collaborators and deals
              </Link>.
            </li>
            <li>
              <Link href="/reviews" className="text-purple-400 hover:underline">
                CreatorFlow365 reviews
              </Link>.
            </li>
          </ul>
        </section>

        <section className="pt-4 flex flex-wrap gap-3">
          <Link href="/signup" className="px-5 py-3 bg-white text-black rounded-lg font-semibold">
            Start Free Trial
          </Link>
          <Link href="/#pricing" className="px-5 py-3 bg-gray-800 rounded-lg border border-gray-700">
            Compare Plans
          </Link>
          <Link
            href="/select-plan?plan=pro"
            className="px-5 py-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            Pro Plan Details
          </Link>
        </section>

        <footer className="pt-6 text-sm text-gray-500 flex flex-wrap gap-4">
          <Link href="/">Home</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </footer>
      </div>
    </main>
  )
}

