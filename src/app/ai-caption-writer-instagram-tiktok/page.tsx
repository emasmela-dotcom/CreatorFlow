import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Caption Writer for Instagram and TikTok | CreatorFlow365',
  description:
    'Write better Instagram and TikTok captions faster with CreatorFlow365. Plan, draft, and organize content in one workflow with a 14-day free trial.',
}

export default function AICaptionWriterPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            AI Caption Writer for Instagram and TikTok
          </h1>
          <p className="text-lg text-gray-300">
            CreatorFlow365 helps you draft Instagram and TikTok captions quickly with AI, then
            save everything in one organized content library.
          </p>
          <p className="text-gray-400">
            If you post consistently and want faster first drafts without losing your voice, this
            workflow keeps writing, editing, and scheduling in one place.
          </p>
          <p className="text-gray-400 border-l-2 border-purple-500/50 pl-4">
            Plans start at $9/month with a 14-day free trial and no credit card required. Starter includes analytics
            support; compare tiers on the homepage pricing section before you commit.
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
            <li>AI-assisted caption drafting and rewrites.</li>
            <li>Saved hashtag sets and reusable templates.</li>
            <li>Starter analytics support and higher-tier analytics options.</li>
            <li>14-day free trial with no credit card required.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-white">Can I use this for both Instagram and TikTok?</strong>{' '}
              Yes. You can draft, edit, and save versions for each platform in one workflow.
            </p>
            <p>
              <strong className="text-white">Do I need a credit card to start?</strong> No. You can
              start with a 14-day free trial without adding a card.
            </p>
            <p>
              <strong className="text-white">Can I keep my drafts organized?</strong> Yes. Captions,
              templates, and hashtag sets live in your content library for reuse.
            </p>
            <p>
              <strong className="text-white">Which plan should I start with?</strong> Most creators
              start on Starter and upgrade as posting volume and team needs grow.
            </p>
          </div>
        </section>

        <section className="pt-4 flex flex-wrap gap-3">
          <Link href="/signup" className="px-5 py-3 bg-white text-black rounded-lg font-semibold">
            Start Free Trial
          </Link>
          <Link href="/#pricing" className="px-5 py-3 bg-gray-800 rounded-lg border border-gray-700">
            Compare Plans
          </Link>
          <Link
            href="/select-plan?plan=starter"
            className="px-5 py-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            Starter Plan Details
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

