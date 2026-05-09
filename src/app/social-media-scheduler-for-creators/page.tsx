import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Social Media Scheduler for Content Creators | CreatorFlow365',
  description:
    'Plan your social media schedule across Instagram, TikTok, LinkedIn, and more with CreatorFlow365. Keep your content workflow in one place.',
}

export default function SocialSchedulerPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Social Media Scheduler for Content Creators</h1>
          <p className="text-lg text-gray-300">
            CreatorFlow365 gives creators a single scheduling workflow for multi-platform posting
            plans, so you can organize content without managing separate tools.
          </p>
          <p className="text-gray-400">
            Use one calendar to plan what goes live next, keep your drafts aligned to campaigns,
            and maintain consistency week after week.
          </p>
          <p className="text-gray-400 border-l-2 border-purple-500/50 pl-4">
            Essential ($19/month) adds five accounts and content analytics on top of Starter scheduling workflows—all with a
            14-day trial and no credit card to start.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Plan your week faster</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Build your content schedule in one dashboard.</li>
            <li>Keep platform-specific draft versions organized.</li>
            <li>Pair scheduling with caption drafting and templates.</li>
            <li>Review what is pending and what is already published.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Built for creators and teams</h2>
          <p className="text-gray-300">
            Whether you post for your own brand or coordinate with an editor or VA, CreatorFlow365
            keeps your planning and execution in one workflow.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">What to expect by plan</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Starter: core scheduling and content workflow for creators starting out.</li>
            <li>Growth: expanded account support and analytics visibility.</li>
            <li>Pro and above: team workflows, deeper analytics, and advanced features.</li>
          </ul>
        </section>

        <section className="space-y-3 border border-gray-800 rounded-xl p-6 bg-gray-950/40">
          <h2 className="text-2xl font-semibold">Why you can trust this page</h2>
          <p className="text-gray-300">
            Scheduling behavior depends on official APIs for each network; features shift when platforms change policies. We summarize supported surfaces on the{' '}
            <Link href="/" className="text-purple-400 hover:underline">CreatorFlow365 homepage</Link>{' '}
            (“How publishing works”) and in dashboard Connections after signup—same operator as our{' '}
            <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>.
          </p>
          <p className="text-gray-400 text-sm">
            For definitions of plans and limits, use homepage pricing and{' '}
            <Link href="/select-plan" className="text-purple-400 hover:underline">select-plan</Link>; reach us at{' '}
            <a href="mailto:support@creatorflow365.com" className="text-purple-400 hover:underline">support@creatorflow365.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-white">Can I schedule content for multiple platforms?</strong>{' '}
              Yes. You can plan your publishing workflow for Instagram, TikTok, LinkedIn, and other
              supported channels from one place.
            </p>
            <p>
              <strong className="text-white">Does this include analytics?</strong> Yes. Analytics
              support starts at Starter and expands in higher tiers.
            </p>
            <p>
              <strong className="text-white">Can my team use the same schedule view?</strong> Yes.
              Team collaboration features are available in higher plans.
            </p>
            <p>
              <strong className="text-white">Is there a trial?</strong> Yes. There is a 14-day free
              trial with no credit card required.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Related workflows on CreatorFlow365</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              <Link href="/ai-caption-writer-instagram-tiktok" className="text-purple-400 hover:underline">
                AI caption drafting for Instagram and TikTok
              </Link>{' '}
              before you queue posts.
            </li>
            <li>
              <Link href="/content-creator-analytics-platform" className="text-purple-400 hover:underline">
                Creator analytics platform overview
              </Link>{' '}
              for performance next to your calendar.
            </li>
            <li>
              <Link href="/creator-tools" className="text-purple-400 hover:underline">
                Creator tools directory
              </Link>.
            </li>
            <li>
              <Link href="/follow-thru" className="text-purple-400 hover:underline">
                Follow Thru CRM for creators
              </Link>.
            </li>
            <li>
              <Link href="/reviews" className="text-purple-400 hover:underline">
                Reviews from creators
              </Link>.
            </li>
          </ul>
        </section>

        <section className="pt-4 flex flex-wrap gap-3">
          <Link href="/signup" className="px-5 py-3 bg-white text-black rounded-lg font-semibold">
            Start Free Trial
          </Link>
          <Link href="/#pricing" className="px-5 py-3 bg-gray-800 rounded-lg border border-gray-700">
            View Pricing
          </Link>
          <Link
            href="/select-plan?plan=growth"
            className="px-5 py-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            Growth Plan Details
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

