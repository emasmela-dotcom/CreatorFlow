'use client'

import { Star, Quote, ArrowLeft } from 'lucide-react'

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Content Creator',
      platform: 'Instagram',
      followers: '125K',
      rating: 5,
      text: 'CreatorFlow has completely transformed how I manage my content. The analytics are incredibly detailed and the scheduling feature saves me hours every week. Best investment I\'ve made for my creator business!',
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
      text: 'The brand collaboration management tool is a game-changer. I\'ve secured 3 new partnerships since using CreatorFlow. The ROI is incredible - paid for itself in the first month.',
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
      text: 'I love how easy it is to schedule across all platforms. The hashtag research feature helps me find trending tags that actually work. My engagement has increased by 40% since switching to CreatorFlow.',
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
      text: 'As someone who manages multiple client accounts, CreatorFlow\'s unified dashboard is a lifesaver. The performance insights help me make data-driven decisions for my clients. Highly recommend!',
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
      text: 'CreatorFlow\'s analytics dashboard gives me insights I never had before. I can see exactly which content performs best and optimize accordingly. My follower growth has accelerated significantly.',
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
      text: 'I\'ve tried many creator tools, but CreatorFlow is by far the best. The combination of scheduling, analytics, and collaboration management in one platform is exactly what I needed. My productivity has doubled!',
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
      text: 'The ROI tracking for brand partnerships is a game-changer. I can now show brands exactly what value I\'m delivering, which has helped me negotiate better rates. CreatorFlow pays for itself.',
      verified: true,
      date: '3 weeks ago'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/'}
            className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-indigo-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 text-purple-400" />
            CreatorFlow
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/signin'}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.href = '/signup'}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-purple-300">Trusted by 10,000+ Creators</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            What Creators Are Saying
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are growing their business with CreatorFlow
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">5.0</span>
            <span className="text-gray-400">/ 5.0</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{reviews.length}+ Reviews</span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 px-6 pb-20">
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
                    <p className="text-sm text-gray-400">{review.role}</p>
                    <p className="text-xs text-gray-500 mt-1">
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
                  <span className="text-xs text-gray-500">{review.date}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-400">{review.rating}.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to join thousands of happy creators?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Start your 14-day free trial today. No credit card required during trial.
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all text-lg"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">CreatorFlow</h3>
          <p className="text-gray-400 mb-6">The ultimate platform for content creators</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:support@creatorflow365.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

