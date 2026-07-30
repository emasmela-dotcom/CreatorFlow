'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewBotsBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('newBotsBannerDismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('newBotsBannerDismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-optimist-600/20 via-optimist-600/20 to-optimist-600/20 border-2 border-optimist-500/50 rounded-xl p-6 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-optimist-500/5 to-optimist-500/5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-optimist-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-optimist-500 to-optimist-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">New: AI Bots Now Available!</h3>
              <p className="text-sm text-gray-300">Free AI assistants to help you create better content</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Bot Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Content Assistant Bot */}
          <div className="bg-gray-800/50 border border-optimist-500/30 rounded-lg p-4 hover:border-optimist-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">Content Assistant</h4>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Real-time content analysis and optimization suggestions
            </p>
            <div className="flex items-center gap-2 text-xs text-optimist-400">
              <span>Available in Post Editor</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Scheduling Assistant Bot */}
          <div className="bg-gray-800/50 border border-optimist-500/30 rounded-lg p-4 hover:border-optimist-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Scheduling Assistant</h4>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Smart scheduling recommendations based on your data
            </p>
            <div className="flex items-center gap-2 text-xs text-optimist-400">
              <span>Available in Post Editor</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Engagement Analyzer Bot */}
          <div className="bg-gray-800/50 border border-optimist-500/30 rounded-lg p-4 hover:border-optimist-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Engagement Analyzer</h4>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Analyze your post performance and find what works best
            </p>
            <div className="flex items-center gap-2 text-xs text-optimist-400">
              <span>Available in Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-optimist-500/30">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">All bots are FREE</span> and included in your plan
          </div>
          <button
            onClick={() => router.push('/create')}
            className="px-4 py-2 bg-gradient-to-r from-optimist-500 to-optimist-500 hover:from-optimist-600 hover:to-optimist-600 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
          >
            Try Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

