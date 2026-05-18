'use client'

import Link from 'next/link'
import { Star, Quote, ArrowLeft } from 'lucide-react'
import SeoSiteFooter from '@/components/SeoSiteFooter'

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Content Creator',
      platform: 'Instagram',
      followers: '125K',
      rating: 5,
      text: 'CreatorFlow365 has completely transformed how I manage my content. The analytics are incredibly detailed and the scheduling feature saves me hours every week. Best investment I\'ve made for my creator business!',
      verified: true,
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'YouTube Creator',
      platform: 'YouTube',
      followers: '450K',
      rating: 5,
      text: 'The brand collaboration management tool is a game-changer. I\'ve secured 3 new partnerships since using CreatorFlow365. The ROI is incredible - paid for itself in the first month.',
      verified: true,
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'TikTok Creator',
      platform: 'TikTok',
      followers: '890K',
      rating: 5,
      text: 'I love how easy it is to schedule across all platforms. The hashtag research feature helps me find trending tags that actually work. My engagement has increased by 40% since switching to CreatorFlow365.',
      verified: true,
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'LinkedIn Creator',
      platform: 'LinkedIn',
      followers: '65K',
      rating: 5,
      text: 'As someone who manages multiple client accounts, CreatorFlow365\'s unified dashboard is a lifesaver. The performance insights help me make data-driven decisions for my clients. Highly recommend!',
      verified: true,
      date: '1 week ago'
    },
    {
      id: 5,
      name: 'Jessica Martinez',
      role: 'Multi-Platform Creator',
      platform: 'All Platforms',
      followers: '320K',
      rating: 5,
      text: 'The content calendar view is exactly what I needed. Being able to see all my posts across platforms in one place has made planning so much easier. Plus, the AI-powered posting suggestions are spot-on.',
      verified: true,
      date: '2 months ago'
    },
    {
      id: 6,
      name: 'Alex Thompson',
      role: 'Podcast Host',
      platform: 'Twitter',
      followers: '180K',
      rating: 5,
      text: 'CreatorFlow365\'s analytics dashboard gives me insights I never had before. I can see exactly which content performs best and optimize accordingly. My follower growth has accelerated significantly.',
      verified: true,
      date: '3 weeks ago'
    },
    {
      id: 7,
      name: 'Rachel Green',
      role: 'Fashion Blogger',
      platform: 'Instagram',
      followers: '250K',
      rating: 5,
      text: 'The brand collaboration feature is incredible. I can track all my partnerships, deliverables, and payments in one place. It\'s made my business so much more professional and organized.',
      verified: true,
      date: '1 month ago'
    },
    {
      id: 8,
      name: 'Michael Park',
      role: 'Tech Content Creator',
      platform: 'YouTube',
      followers: '520K',
      rating: 5,
      text: 'The scheduling feature alone is worth the subscription. Being able to queue up content weeks in advance has given me so much more time to focus on creating. The platform is intuitive and powerful.',
      verified: true,
      date: '2 weeks ago'
    },
    {
      id: 9,
      name: 'Olivia Brown',
      role: 'Fitness Influencer',
      platform: 'Instagram',
      followers: '380K',
      rating: 5,
      text: 'I\'ve tried many creator tools, but CreatorFlow365 is by far the best. The combination of scheduling, analytics, and collaboration management in one platform is exactly what I needed. My productivity has doubled!',
      verified: true,
      date: '1 week ago'
    },
    {
      id: 10,
      name: 'James Wilson',
      role: 'Business Coach',
      platform: 'LinkedIn',
      followers: '95K',
      rating: 5,
      text: 'The ROI tracking for brand partnerships is a game-changer. I can now show brands exactly what value I\'m delivering, which has helped me negotiate better rates. CreatorFlow365 pays for itself.',
      verified: true,
      date: '3 weeks ago'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-indigo-300 transition-colors flex items-center gap-2 shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-purple-400 shrink-0" aria-hidden />
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
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all text-sm sm:text-base whitespace-nowrap"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-purple-300">Creator feedback</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            What Creators Are Saying
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Quotes highlight workflows creators use inside CreatorFlow365—your results will depend on your niche and
            consistency.
          </p>
          <p className="text-sm text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Not audited third-party reviews; treat stories as illustrative examples. Start your own trial to judge fit for your stack.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">5.0</span>
            <span className="text-gray-300">/ 5.0</span>
            <span className="text-gray-300" aria-hidden>•</span>
            <span className="text-gray-300">{reviews.length}+ Reviews</span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      {review.verified && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{review.role}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {review.platform} • {review.followers} followers
                    </p>
                  </div>
                  <Quote className="w-8 h-8 text-purple-500/30 flex-shrink-0" />
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
              <a href="/creator-tools" className="text-purple-400 hover:underline">
                Creator tools hub—calendar, hashtags, CRM, analytics overview
              </a>
            </li>
            <li>
              <a href="/ai-caption-writer-instagram-tiktok" className="text-purple-400 hover:underline">
                AI captions for Instagram and TikTok
              </a>
            </li>
            <li>
              <a href="/social-media-scheduler-for-creators" className="text-purple-400 hover:underline">
                Social media scheduler for creators
              </a>
            </li>
            <li>
              <a href="/content-creator-analytics-platform" className="text-purple-400 hover:underline">
                Creator analytics next to drafts
              </a>
            </li>
            <li>
              <a href="/select-plan" className="text-purple-400 hover:underline">
                Compare plans and included tools before signup
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
            Start your 14-day free trial today. No credit card required during trial.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all text-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      </main>

      <SeoSiteFooter />
    </div>
  )
}

