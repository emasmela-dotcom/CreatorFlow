'use client'

import { Play, Star } from 'lucide-react'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { useAnalytics } from '@/components/AnalyticsProvider'
import { HOMEPAGE_FAQ_PAIRS } from '@/lib/seo/homepageFaq'
import { faqPageJsonLd } from '@/lib/seo/faqJsonLd'

export default function HomePage() {
  const { trackEvent, trackConversionEvent } = useAnalytics()

  const handlePricingClick = async (plan: 'starter' | 'growth' | 'pro' | 'business' | 'agency') => {
    trackEvent('pricing_click', 'conversion', plan)
    trackConversionEvent('pricing_click', plan === 'starter' ? 9 : plan === 'growth' ? 19 : plan === 'pro' ? 49 : plan === 'business' ? 79 : 149)
    window.location.href = `/signup?plan=${plan}`
  }

  return (
    <>
      <AnalyticsProvider />
      <div className="min-h-screen bg-optimist-950 text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 bg-optimist-950 border-b border-optimist-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors shrink-0">
              CreatorFlow365
            </a>
            <div className="flex items-center gap-4">
              <a href="#pricing" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Compare plans</a>
              <a href="#tools" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Tools</a>
              <button onClick={() => window.location.href = '/creator-tools'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Creator tools</button>
              <button onClick={() => window.location.href = '/dashboard'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Browse app</button>
              <button onClick={() => window.location.href = '/reviews'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Reviews</button>
              <button onClick={() => window.location.href = '/signin'} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Sign In</button>
              <button onClick={() => window.location.href = '/signup'} className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all">Sign up</button>
            </div>
          </div>
        </header>

        <main id="main-content">
          {/* Hero */}
          <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
            <div className="absolute inset-0 bg-optimist-900/20" />
            <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">CreatorFlow365</h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-300">Stop juggling apps. Start growing.</p>
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                You already have the content. You pick the platforms. CreatorFlow adjusts it to each one&apos;s format.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-8 py-4 bg-optimist-600 text-white rounded-lg font-semibold hover:bg-optimist-500 border border-optimist-400/40 transition-all"
                >
                  Browse app
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-6">14-day free trial • No credit card required</p>
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
                  <h3 className="font-semibold mb-1">Publish formatted</h3>
                  <p className="text-sm text-gray-400">CreatorFlow adapts length, hashtags, and format for each platform. Post directly or copy to publish.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Platforms / What you get */}
          <section id="tools" className="py-20 px-6 scroll-mt-24">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">One workspace. Every platform.</h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto">Plan, draft, and schedule content for all major platforms without switching apps.</p>

              <div className="flex flex-wrap justify-center gap-2 mb-16">
                {['Instagram', 'TikTok', 'X / Twitter', 'LinkedIn', 'YouTube', 'Facebook', 'Threads', 'Pinterest', 'Bluesky', 'Reddit', 'Snapchat', 'Mastodon', 'Discord', 'Telegram', 'Tumblr', 'WordPress'].map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-optimist-900 border border-optimist-800 text-optimist-300/80 text-sm">{p}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-5 rounded-xl bg-optimist-900/50 border border-optimist-800">
                  <h3 className="font-semibold text-white mb-2">AI Drafting</h3>
                  <p className="text-sm text-optimist-300/70">Captions, scripts, and content ideas tuned to your brand voice and platform limits.</p>
                </div>
                <div className="p-5 rounded-xl bg-optimist-900/50 border border-optimist-800">
                  <h3 className="font-semibold text-white mb-2">Smart Scheduling</h3>
                  <p className="text-sm text-optimist-300/70">Calendar view, bulk uploads, and best-time suggestions across all connected accounts.</p>
                </div>
                <div className="p-5 rounded-xl bg-optimist-900/50 border border-optimist-800">
                  <h3 className="font-semibold text-white mb-2">Analytics & CRM</h3>
                  <p className="text-sm text-optimist-300/70">Track performance and manage brand relationships—Follow Thru included in every plan.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="py-20 px-6 bg-optimist-900/30 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Simple, transparent pricing</h2>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <p className="text-xs text-gray-300 mb-4">Remove limits</p>
                  <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-300">/month</span></div>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>3 social accounts</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Unlimited documents</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Unlimited hashtag sets</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Unlimited templates</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>500 AI calls/month</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Starter analytics included</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Enhanced AI features</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-white mt-0.5 flex-shrink-0" /> <span>Email support (48hr)</span></li>
                  </ul>
                  <button onClick={() => handlePricingClick('starter')} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Get Started</button>
                  <a href="/select-plan?plan=starter" className="block text-center text-sm text-gray-300 hover:text-white mt-2">Tools offered</a>
                </div>

                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
                  <h3 className="text-2xl font-bold mb-2">Essential</h3>
                  <p className="text-xs text-gray-300 mb-4">For creators building their workflow</p>
                  <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-300">/month</span></div>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>5 social accounts</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited everything</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>1,000 AI calls/month</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Advanced AI features</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Content analytics</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Email support (24hr)</span></li>
                  </ul>
                  <button onClick={() => handlePricingClick('growth')} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Get Started</button>
                  <a href="/select-plan?plan=growth" className="block text-center text-sm text-gray-300 hover:text-white mt-2">Tools offered</a>
                </div>

                <div className="bg-gray-800/50 p-8 rounded-xl border-2 border-white relative flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                  <h3 className="text-2xl font-bold mb-2">Creator</h3>
                  <p className="text-xs text-gray-300 mb-4">For serious creators who want everything</p>
                  <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-300">/month</span></div>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>10 social accounts</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited AI calls</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Premium AI features</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Advanced analytics</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Team collaboration (3 members)</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>API access</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Priority support (12hr)</span></li>
                  </ul>
                  <button onClick={() => handlePricingClick('pro')} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-all">Get Started</button>
                  <a href="/select-plan?plan=pro" className="block text-center text-sm text-gray-300 hover:text-white mt-2">Tools offered</a>
                </div>

                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
                  <h3 className="text-2xl font-bold mb-2">Professional</h3>
                  <p className="text-xs text-gray-300 mb-4">Complete toolkit for professional creators</p>
                  <div className="text-4xl font-bold mb-6">$79<span className="text-lg text-gray-300">/month</span></div>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited accounts</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Maximum AI performance</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Premium analytics + predictions</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Team collaboration (10 members)</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>White-label options</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Advanced API access</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Priority support (6hr)</span></li>
                  </ul>
                  <button onClick={() => handlePricingClick('business')} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Get Started</button>
                  <a href="/select-plan?plan=business" className="block text-center text-sm text-gray-300 hover:text-white mt-2">Tools offered</a>
                </div>

                <div className="bg-gray-800/50 p-8 rounded-xl border-2 border-white relative flex-shrink-0" style={{ minWidth: '280px', maxWidth: '320px' }}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">Teams &amp; agencies</div>
                  <h3 className="text-2xl font-bold mb-2">Business</h3>
                  <p className="text-xs text-gray-300 mb-4">For teams and agencies</p>
                  <div className="text-4xl font-bold mb-6">$149<span className="text-lg text-gray-300">/month</span></div>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited everything</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Maximum AI performance</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Enterprise analytics & reporting</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Full white-label</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Unlimited team members</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Custom integrations & API</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Dedicated account manager</span></li>
                    <li className="flex items-start gap-2"><Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> <span>Priority support (2hr)</span></li>
                  </ul>
                  <button onClick={() => handlePricingClick('agency')} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-all font-semibold">Get Started</button>
                  <a href="/select-plan?plan=agency" className="block text-center text-sm text-gray-300 hover:text-white mt-2">Tools offered</a>
                </div>
              </div>
            </div>
          </section>

          {/* Trust + FAQ */}
          <section className="py-16 px-6 bg-optimist-900/20">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">Built for creators</h3>
                  <p className="text-sm text-gray-400">Independent creators, teams, and agencies managing content end-to-end.</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">14-day free trial</h3>
                  <p className="text-sm text-gray-400">No credit card required. Full access to planning, scheduling, and analytics.</p>
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
              <p className="text-gray-400 mb-8">Start your 14-day free trial. No credit card required.</p>
              <button
                onClick={() => window.location.href = '/signup'}
                className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto"
              >
                Start Free Trial
                <Play className="w-5 h-5" />
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
