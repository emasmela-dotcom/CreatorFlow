import type { Metadata } from 'next'
import Link from 'next/link'
import { AI_CAPTION_GUIDE_FAQ } from '@/lib/seo/guidePageFaqs'
import { faqPageJsonLd } from '@/lib/seo/faqJsonLd'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'
const pagePath = '/ai-caption-writer-instagram-tiktok'

const title = 'AI Captions for Instagram & TikTok | CreatorFlow365'
const description =
  'Draft Instagram & TikTok captions faster—Documents workspace live today. Free while we build; paid plans with live AI later.'

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

export default function AICaptionWriterPage() {
  return (
    <main id="main-content" className="min-h-screen bg-optimist-950 text-white px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            AI Caption Writer for Instagram and TikTok
          </h1>
          <p className="text-lg text-gray-300">
            CreatorFlow365 helps you draft Instagram and TikTok captions quickly with AI, then
            save everything in one organized content library.
          </p>
          <p className="text-gray-300">
            If you post Reels, Shorts, Stories, or TikToks and want faster first drafts without losing your voice, this
            workflow keeps writing, editing, and scheduling in one place.
          </p>
          <p className="mt-4 text-sm text-optimist-400">
            Documents is live today — save once, format for any platform. Paid plans with live AI coming later.
          </p>
          <p className="text-gray-300 border-l-2 border-optimist-500/50 pl-4">
            Free while we build. Create a free account — no credit card required. Use Documents to save your original and copy platform-formatted text.
          </p>
          <p className="text-sm text-gray-300">
            Pillar hub for every search intent:{' '}
            <Link href="/creator-tools" className="text-optimist-400 hover:underline">
              creator tools &amp; workspace overview
            </Link>
            .
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How the caption workflow works</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Generate caption ideas from one prompt.</li>
            <li>Rewrite for short-form and long-form variants in seconds.</li>
            <li>Store approved versions in your content library for reuse.</li>
            <li>Move final captions into your posting schedule.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Who this is best for</h2>
          <p className="text-gray-300">
            Solo creators, small teams, and social managers who need to ship content quickly across
            Instagram and TikTok without juggling multiple tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">What you get in CreatorFlow365</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Documents workspace: save once, format for Instagram, TikTok, and more.</li>
            <li>Platform formatting previews — formatted copy is not saved separately.</li>
            <li>More AI caption tools in progress. Free while we build.</li>
            <li>Create a free account — no credit card required.</li>
          </ul>
        </section>

        <section className="space-y-3 border border-gray-800 rounded-xl p-6 bg-gray-950/40">
          <h2 className="text-2xl font-semibold">Why you can trust this page</h2>
          <p className="text-gray-300">
            CreatorFlow365 operates{' '}
            <Link href="/" className="text-optimist-400 hover:underline">creatorflow365.com</Link>{' '}
            and describes plans the same way here as on the homepage and in our{' '}
            <Link href="/privacy" className="text-optimist-400 hover:underline">Privacy Policy</Link>. We do not promise results we cannot measure inside the product.
          </p>
          <p className="text-gray-300 text-sm">
            Proof you can check yourself: free access while we build, product questions via{' '}
            <a href="mailto:support@creatorflow365.com" className="text-optimist-400 hover:underline">support@creatorflow365.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqPageJsonLd(AI_CAPTION_GUIDE_FAQ)),
            }}
          />
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3 text-gray-300">
            {AI_CAPTION_GUIDE_FAQ.map((item) => (
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
              <Link href="/social-media-scheduler-for-creators" className="text-optimist-400 hover:underline">
                Multi-platform scheduling workflow for creators
              </Link>{' '}
              after captions are drafted.
            </li>
            <li>
              <Link href="/content-creator-analytics-platform" className="text-optimist-400 hover:underline">
                Analytics in the same workspace as drafting and scheduling
              </Link>.
            </li>
            <li>
              <Link href="/creator-tools" className="text-optimist-400 hover:underline">
                Full creator tools directory
              </Link>{' '}
              for other surfaces beyond captions.
            </li>
            <li>
              <Link href="/follow-thru" className="text-optimist-400 hover:underline">
                Follow Thru CRM for brands and collaborators
              </Link>{' '}
              next to your calendar.
            </li>
            <li>
              <Link href="/reviews" className="text-optimist-400 hover:underline">
                CreatorFlow365 reviews and feedback
              </Link>.
            </li>
          </ul>
        </section>

        <section className="pt-4 flex flex-wrap gap-3">
          <Link href="/signup" className="px-5 py-3 bg-white text-black rounded-lg font-semibold">
            Create free account
          </Link>
        </section>
      </div>
    </main>
  )
}

