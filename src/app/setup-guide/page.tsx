import Link from 'next/link'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'
const pagePath = '/setup-guide'

const title = 'Auto-post setup guide | CreatorFlow365'
const description =
  'Connect and publish on Bluesky, Telegram, Mastodon, Discord, Tumblr, and WordPress. Copy/paste still works if auto-post fails.'

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

const platforms: {
  name: string
  steps: string[]
  note?: string
}[] = [
  {
    name: 'Bluesky',
    steps: [
      'In Bluesky: Settings → App passwords → create one.',
      'CreatorFlow → Connections → Bluesky → enter your handle + app password.',
      'Create → select Bluesky only → type a test → Publish.',
      'Check the post on bsky.app.',
    ],
  },
  {
    name: 'Telegram',
    steps: [
      'Add your bot to the channel or group as admin (can post).',
      'Connections → Telegram → enter chat ID.',
      'Create → Telegram only → test message → Publish.',
      'Check the message in that chat.',
    ],
  },
  {
    name: 'Mastodon',
    steps: [
      'Connections → Connect Mastodon → approve.',
      'Create → Mastodon only → test post → Publish.',
      'Check your profile on that instance.',
    ],
  },
  {
    name: 'Discord',
    note: 'Uses the webhook path (proven). Bot-token posting often fails with Missing Access.',
    steps: [
      'Connections → Connect Discord (optional when the site uses a webhook).',
      'Create → Discord only → test text → Publish.',
      'Check the webhook channel (for example #general) for the message.',
    ],
  },
  {
    name: 'Tumblr',
    steps: [
      'Connections → Connect Tumblr → approve.',
      'Create → Tumblr only → text (for example “test 1”) → Publish.',
      'Check your blog on tumblr.com.',
    ],
  },
  {
    name: 'WordPress',
    note: 'WordPress.com OAuth. Self-hosted needs extra setup.',
    steps: [
      'Connections → Connect WordPress → approve.',
      'Create → WordPress only → test post → Publish.',
      'Check WordPress → Posts for the new post.',
    ],
  },
]

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-2xl">
          <nav className="mb-8 flex flex-wrap gap-4 text-sm">
            <Link href="/dashboard" className="text-optimist-400 hover:underline">
              Back to app
            </Link>
            <Link href="/support" className="text-gray-300 hover:text-white hover:underline">
              Contact support
            </Link>
          </nav>

          <header className="border-b border-gray-800 pb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-optimist-400">
              Help
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">Auto-post setup guide</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Only networks proven live so far. Use{' '}
              <strong className="text-white">Dashboard → Connections</strong> to connect, then{' '}
              <strong className="text-white">Create → Publish</strong> to test.
            </p>
            <p className="mt-2 text-sm text-gray-300">
              Copy/paste still works if auto-post fails. Free while we build.
            </p>
          </header>

          <div className="mt-8 space-y-8">
            {platforms.map((platform) => (
              <section
                key={platform.name}
                className="rounded-lg border border-gray-800 bg-gray-900/60 p-5"
              >
                <h2 className="text-xl font-semibold text-white">
                  {platform.name}{' '}
                  <span className="text-sm font-normal text-optimist-400">proven</span>
                </h2>
                {platform.note ? (
                  <p className="mt-2 text-sm text-gray-300">{platform.note}</p>
                ) : null}
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-100">
                  {platform.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="text-lg font-semibold text-white">Not in this guide yet</h2>
            <p className="mt-2 text-sm text-gray-300">
              Snapchat (waiting on Snap), Instagram / Facebook / Threads (Meta locked), Reddit,
              WhatsApp. Use copy/paste for those until they are proven.
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-400">
            Need help?{' '}
            <Link href="/support" className="text-optimist-400 hover:underline">
              Contact support
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
