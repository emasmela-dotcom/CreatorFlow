import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Content Creator Analytics Platform | CreatorFlow365',
  description:
    'Track content performance in CreatorFlow365 with plan-based analytics built for creators, teams, and agencies.',
}

export default function ContentCreatorAnalyticsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
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
            <li>Growth expands analytics depth for multi-platform creators.</li>
            <li>Pro and above adds advanced and enterprise-level analytics options.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-white">Does Starter include analytics?</strong> Yes, Starter
              includes analytics support and higher tiers expand that capability.
            </p>
            <p>
              <strong className="text-white">Can teams view the same performance data?</strong>{' '}
              Yes. Team-enabled plans support shared collaboration and reporting workflows.
            </p>
            <p>
              <strong className="text-white">Can agencies use this for client reporting?</strong>{' '}
              Yes. Higher plans are designed for broader account coverage and agency workflows.
            </p>
            <p>
              <strong className="text-white">Is there a free trial?</strong> Yes. CreatorFlow365
              offers a 14-day trial with no credit card required.
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

