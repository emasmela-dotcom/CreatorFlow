'use client'

import Link from 'next/link'
import { Star, Quote, ArrowLeft } from 'lucide-react'

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: 'Preview example',
      role: 'Documents workflow',
      platform: 'Instagram',
      followers: 'Illustrative',
      rating: 5,
      text: 'I saved my draft once in Documents, picked Instagram, and copied the formatted caption. Clear and fast for what is live today.',
      preview: true,
      date: 'Preview'
    },
    {
      id: 2,
      name: 'Preview example',
      role: 'Documents workflow',
      platform: 'YouTube',
      followers: 'Illustrative',
      rating: 5,
      text: 'The platform-format panel helped me reshape a description without saving a pile of copies. One original, many exports.',
      preview: true,
      date: 'Preview'
    },
    {
      id: 3,
      name: 'Preview example',
      role: 'Documents workflow',
      platform: 'TikTok',
      followers: 'Illustrative',
      rating: 5,
      text: 'I pasted my script, saved it, and copied a TikTok-ready version. Good starting point while more tools are still being built.',
      preview: true,
      date: 'Preview'
    },
    {
      id: 4,
      name: 'Preview example',
      role: 'Documents workflow',
      platform: 'LinkedIn',
      followers: 'Illustrative',
      rating: 5,
      text: 'Documents kept my original in one place. I formatted for LinkedIn when I needed that version—nothing extra stored.',
      preview: true,
      date: 'Preview'
    },
    {
      id: 5,
      name: 'Preview example',
      role: 'Documents workflow',
      platform: 'Multi-platform',
      followers: 'Illustrative',
      rating: 5,
      text: 'The honest pitch matches the product: save once, format when you need it. Scheduling and analytics are not the focus yet.',
      preview: true,
      date: 'Preview'
    },
    {
      id: 6,
      name: 'Preview example',
      role: 'Documents workflow',
      platform: 'X / Twitter',
      followers: 'Illustrative',
      rating: 5,
      text: 'Copy formatted worked for a short post. I knew formatted text was preview-only and would not clutter my library.',
      preview: true,
      date: 'Preview'
    },
  ]

  return (
    <div className="min-h-screen bg-optimist-950 text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold bg-gradient-to-r from-optimist-400 to-optimist-400 bg-clip-text text-transparent hover:from-optimist-300 hover:to-optimist-300 transition-colors flex items-center gap-2 shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-optimist-400 shrink-0" aria-hidden />
            <span className="hidden sm:inline">CreatorFlow365</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/signin"
              className="px-3 sm:px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-optimist-500 to-optimist-500 rounded-lg font-semibold hover:from-optimist-600 hover:to-optimist-600 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-optimist-500/20 to-optimist-500/20 border border-optimist-500/30 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-optimist-300">Preview examples</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-optimist-400 to-optimist-400 bg-clip-text text-transparent">
            Preview Examples — Not Real Reviews Yet
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            These cards show the kind of Documents workflow we want creators to try. Real reviews will come after launch.
          </p>
          <p className="text-sm text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nothing here is a verified customer quote, rating aggregate, or performance claim.
          </p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-optimist-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      {review.preview && (
                        <span className="text-xs bg-optimist-500/20 text-optimist-300 px-2 py-0.5 rounded-full border border-optimist-500/30">
                          Preview
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{review.role}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {review.platform} • {review.followers} followers
                    </p>
                  </div>
                  <Quote className="w-8 h-8 text-optimist-500/30 flex-shrink-0" />
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{review.text}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-300">{review.date}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-300">{review.rating}.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links — hub + guides */}
      <section className="py-12 px-4 sm:px-6 border-t border-gray-800 bg-black/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">See how the product maps to searches</h2>
          <p className="text-gray-300 text-center mb-6 text-sm">
            Jump back into structured guides when one workflow matters most.
          </p>
          <ul className="space-y-2 text-gray-300 text-center sm:text-left sm:list-disc sm:pl-8 leading-relaxed">
            <li>
              <a href="/creator-tools" className="text-optimist-400 hover:underline">
                Creator tools hub—calendar, hashtags, CRM, analytics overview
              </a>
            </li>
            <li>
              <a href="/ai-caption-writer-instagram-tiktok" className="text-optimist-400 hover:underline">
                AI captions for Instagram and TikTok
              </a>
            </li>
            <li>
              <a href="/social-media-scheduler-for-creators" className="text-optimist-400 hover:underline">
                Social media scheduler for creators
              </a>
            </li>
            <li>
              <a href="/content-creator-analytics-platform" className="text-optimist-400 hover:underline">
                Creator analytics next to drafts
              </a>
            </li>
            <li>
              <a href="/signup" className="text-optimist-400 hover:underline">
                Create a free account
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-white">Ready to try CreatorFlow365 yourself?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Create a free account — free while we build. Paid plans with live AI later.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-optimist-500 to-optimist-500 rounded-lg font-semibold hover:from-optimist-600 hover:to-optimist-600 transition-all text-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      </main>
    </div>
  )
}

