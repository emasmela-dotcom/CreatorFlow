'use client'

import { Play } from 'lucide-react'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { useAnalytics } from '@/components/AnalyticsProvider'
import { HOMEPAGE_FAQ_PAIRS } from '@/lib/seo/homepageFaq'
import { faqPageJsonLd } from '@/lib/seo/faqJsonLd'

export default function HomePage() {
  useAnalytics()

  return (
    <>
      <AnalyticsProvider />
      <div className="min-h-screen bg-optimist-950 text-white">
        {/* Header */}
        <header className="relative md:absolute top-0 left-0 right-0 z-20 bg-optimist-950 border-b border-optimist-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-y-2">
            <a href="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors shrink-0">
              CreatorFlow365
            </a>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#tools" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Tools</a>
              <button onClick={() => window.location.href = '/creator-tools'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Creator tools</button>
              <button onClick={() => window.location.href = '/documents'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Documents</button>
              <button onClick={() => window.location.href = '/dashboard'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Browse app</button>
              <button onClick={() => window.location.href = '/reviews'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Reviews</button>
              <button onClick={() => window.location.href = '/signin'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Sign In</button>
              <button onClick={() => window.location.href = '/signup'} className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all">Create free account</button>
            </div>
          </div>
        </header>

        <main id="main-content">
          {/* Hero */}
          <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-8 md:pt-24 pb-16">
            <div className="absolute inset-0 bg-optimist-900/20" />
            <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 text-white">CreatorFlow365</h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-300">Stop juggling apps. Start growing.</p>
              <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                You already have the content. You pick the platforms. CreatorFlow adjusts it to each one&apos;s format.
              </p>
              <div className="mb-10 max-w-2xl mx-auto rounded-2xl border border-sage-500/20 bg-sage-900/20 px-6 py-5">
                <p className="text-lg font-semibold text-sage-300">One draft, many platforms.</p>
                <p className="mt-1 text-sm text-gray-300 leading-relaxed">
                  Save your original. Format it for every platform we support. Copy and post.
                </p>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  AI Coach (Groq) helps with captions and quick tips. Monthly plans — no per-word fees.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Create free account
                </button>
              </div>
              <p className="mt-4 text-sm text-optimist-400">
                Already have an account?{' '}
                <a href="/signin" className="font-medium text-sage-400 hover:text-sage-300 underline">
                  Sign in
                </a>
              </p>
              <p className="text-sm text-optimist-200 mt-6">Free while we build: creatorflow365.com</p>
              <p className="text-sm text-gray-400 mt-2">Create a free account — no credit card required.</p>
            </div>
          </section>

          {/* How it works */}
          <section className="py-16 px-6 bg-optimist-900/20 border-y border-optimist-800">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold mx-auto mb-4">1</div>
                  <h3 className="font-semibold mb-1">Bring your content</h3>
                  <p className="text-sm text-gray-400">Paste or drop in what you already wrote.</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold mx-auto mb-4">2</div>
                  <h3 className="font-semibold mb-1">Select platforms</h3>
                  <p className="text-sm text-gray-400">Choose where it goes—one post or many.</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold mx-auto mb-4">3</div>
                  <h3 className="font-semibold mb-1">Copy formatted</h3>
                  <p className="text-sm text-gray-400">CreatorFlow adapts length and layout for each platform. Copy formatted text to publish—nothing extra gets saved.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Platforms / What you get */}
          <section id="tools" className="py-20 px-6 scroll-mt-24">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">One workspace. Every platform.</h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto">Save once in Documents. Format for any major platform when you need it—without switching apps.</p>

              <div className="flex flex-wrap justify-center gap-2 mb-16">
                {['Instagram', 'TikTok', 'X / Twitter', 'LinkedIn', 'YouTube', 'Facebook', 'Threads', 'Pinterest', 'Bluesky', 'Reddit', 'Snapchat', 'Mastodon', 'Discord', 'Telegram', 'Tumblr', 'WordPress'].map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-optimist-900 border border-optimist-800 text-optimist-300/80 text-sm">{p}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-5 rounded-xl bg-optimist-900/50 border border-optimist-800">
                  <h3 className="font-semibold text-white mb-2">Documents workspace</h3>
                  <p className="text-sm text-optimist-300/70">Save your original once—text or video. One draft, many exports.</p>
                </div>
                <div className="p-5 rounded-xl bg-optimist-900/50 border border-optimist-800">
                  <h3 className="font-semibold text-white mb-2">Platform formatting</h3>
                  <p className="text-sm text-optimist-300/70">Pick a platform, preview formatted copy, and copy it. Formatted output is not saved to your library.</p>
                </div>
                <div className="p-5 rounded-xl bg-optimist-900/50 border border-optimist-800">
                  <h3 className="font-semibold text-white mb-2">More in progress</h3>
                  <p className="text-sm text-optimist-300/70">Dashboard tools, scheduling, analytics, and live AI are being built. Free while we build.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing hidden until launch — see EarlyAccessBanner */}

          {/* Trust + FAQ */}
          <section className="py-16 px-6 bg-optimist-900/20">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">Built for creators</h3>
                  <p className="text-sm text-gray-400">Independent creators, teams, and agencies managing content end-to-end.</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">Free while we build</h3>
                  <p className="text-sm text-gray-400">Use the formatter and workspace now. Paid plans with live AI launch later.</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">Clear updates</h3>
                  <p className="text-sm text-gray-400">We document what is live, avoid hype, and keep plan details current.</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-12">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(HOMEPAGE_FAQ_PAIRS)) }} />
                <dl className="space-y-5 text-gray-300 text-sm max-w-2xl mx-auto">
                  {HOMEPAGE_FAQ_PAIRS.map((item) => (
                    <div key={item.question}>
                      <dt className="font-semibold text-white">{item.question}</dt>
                      <dd className="mt-1 text-gray-400">{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to simplify your workflow?</h2>
              <p className="text-gray-400 mb-8">Create a free account and format your content for every platform.</p>
              <button
                onClick={() => window.location.href = '/signup'}
                className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto"
              >
                Create free account
                <Play className="w-5 h-5" />
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
