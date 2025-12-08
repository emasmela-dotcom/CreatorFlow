'use client'

import { X, Search, HelpCircle, BookOpen, Video, MessageCircle, Lightbulb } from 'lucide-react'
import { useState } from 'react'

interface HelpCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first post?',
          a: 'Go to the Create Post page, select your platform, type your content, and use the AI Content Assistant to optimize it before posting.'
        },
        {
          q: 'What are AI bots and how do I use them?',
          a: 'AI bots are free assistants that help you create better content. Click on any bot in the Dashboard → AI Bots tab to see what it does and how to use it.'
        },
        {
          q: 'How do I save content for later?',
          a: 'Use the Documents feature to save drafts, ideas, and notes. You can also use Content Templates to save reusable post formats.'
        }
      ]
    },
    {
      category: 'AI Bots',
      questions: [
        {
          q: 'Are AI bots really free?',
          a: 'Yes! All AI bots are included in every plan. Performance improves with higher plan tiers, but all bots are available to everyone.'
        },
        {
          q: 'What does "AI call limit" mean?',
          a: 'Each time you use an AI bot (like Content Assistant or Scheduling Bot), it counts as one AI call. Free plan gets 50 calls/month, Starter gets 500, and Pro+ gets unlimited.'
        },
        {
          q: 'Can bots post to social media for me?',
          a: 'No, bots provide suggestions only. You review and approve all suggestions, then post manually to comply with platform Terms of Service.'
        },
        {
          q: 'Which bot should I use first?',
          a: 'Start with Content Assistant (analyzes your posts) and Scheduling Assistant (finds best posting times). These are the most commonly used.'
        }
      ]
    },
    {
      category: 'Content Tools',
      questions: [
        {
          q: 'What\'s the difference between Documents and Templates?',
          a: 'Documents are for saving drafts, notes, and ideas. Templates are reusable post formats with placeholders (like {product} or {date}) that you can quickly fill in.'
        },
        {
          q: 'How do I find the best hashtags?',
          a: 'Use the Hashtag Research tool - select your platform, paste your content, and get personalized hashtag recommendations based on your niche.'
        },
        {
          q: 'What is the Engagement Inbox?',
          a: 'A centralized place to manage all comments, messages, and mentions from all your social platforms in one place. (Note: Currently requires manual entry, full integration coming soon)'
        }
      ]
    },
    {
      category: 'Pricing & Limits',
      questions: [
        {
          q: 'What happens when I reach my document limit?',
          a: 'You\'ll need to delete old documents or upgrade your plan. Free plan: 10 documents, Starter+: Unlimited.'
        },
        {
          q: 'Do I lose my content if I cancel?',
          a: 'No! Your content is yours immediately after paying. You can export everything before canceling.'
        },
        {
          q: 'Can I change plans later?',
          a: 'Yes! You can upgrade or downgrade anytime. Upgrades take effect immediately, downgrades at the end of your billing cycle.'
        },
        {
          q: 'What\'s included in the free plan?',
          a: 'Free plan includes all core tools and AI bots, but with limits: 1 social account, 10 documents, 5 hashtag sets, 3 templates, 50 AI calls/month.'
        }
      ]
    },
    {
      category: 'Direct Posting',
      questions: [
        {
          q: 'How do I connect my social media accounts?',
          a: 'Go to Dashboard → Platform Connections, click "Connect [Platform]", authorize CreatorFlow, and you\'re done! Your account is now connected and ready for direct posting.'
        },
        {
          q: 'Can CreatorFlow post directly to Instagram/Twitter/LinkedIn?',
          a: 'Yes! Once you connect your account via OAuth, CreatorFlow can post directly. Connect your account in Platform Connections, then create posts and click "Post Now" or schedule them.'
        },
        {
          q: 'What if my scheduled post didn\'t post?',
          a: 'Check if your platform connection is still active. If the token expired, reconnect the platform. Also verify the cron job is running. Failed posts will show in your Calendar with "failed" status.'
        },
        {
          q: 'Is it safe to connect my accounts?',
          a: 'Yes! CreatorFlow uses OAuth (industry-standard security). You can disconnect anytime, and CreatorFlow can only create posts - it cannot delete posts or access your messages without permission.'
        },
        {
          q: 'Why can\'t I connect Instagram?',
          a: 'Instagram requires a Business or Creator account (not personal), and it must be connected to a Facebook Page. Convert your account and connect it to a Facebook Page, then try again.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          q: 'Why isn\'t my content posting automatically?',
          a: 'If you\'ve connected your platform account, posts should post automatically when you click "Post Now" or when scheduled time arrives. If not working, check your platform connection status and ensure tokens haven\'t expired.'
        },
        {
          q: 'The AI bot isn\'t giving suggestions. What\'s wrong?',
          a: 'Make sure you\'ve entered content and selected a platform. Some bots need specific information to work. Check the bot\'s documentation for requirements.'
        },
        {
          q: 'I can\'t find a feature. Where is it?',
          a: 'Use the search bar in the dashboard header to search across all your content. Most features are in Dashboard → Content tab or Dashboard → AI Bots tab.'
        },
        {
          q: 'How do I contact support?',
          a: 'Email support is available based on your plan tier. Free: Community support, Starter: 48hr response, Pro+: Priority support with faster responses.'
        }
      ]
    }
  ]

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    category.questions.length > 0 && 
    (!selectedCategory || category.category === selectedCategory)
  )

  const categories = faqs.map(f => f.category)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-purple-400" />
              Help Center
            </h2>
            <p className="text-sm text-gray-400 mt-1">Find answers to common questions</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-700 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, qIdx) => (
                      <details
                        key={qIdx}
                        className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                      >
                        <summary className="cursor-pointer text-white font-medium flex items-center justify-between">
                          <span>{faq.q}</span>
                          <span className="text-gray-500 text-sm">Click to expand</span>
                        </summary>
                        <p className="mt-3 text-gray-300 text-sm leading-relaxed pl-4 border-l-2 border-purple-500/30">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Tip: Click the help icon (?) next to any feature for quick info</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <MessageCircle className="w-4 h-4" />
                <span>Have feedback? Use the Feedback button in the bottom-right corner!</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

