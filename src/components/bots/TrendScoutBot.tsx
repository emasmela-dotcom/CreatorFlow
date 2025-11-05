'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Hash, Lightbulb, Target, Clock, Loader2, Sparkles } from 'lucide-react'

interface TrendOpportunity {
  topic: string
  hashtag: string
  reason: string
  engagement: string
  relevance: number
}

interface TrendAnalysis {
  trendingTopics: TrendOpportunity[]
  opportunities: string[]
  recommendations: string[]
  bestTimeToPost: string
}

interface TrendScoutBotProps {
  platform: string
  token: string
}

export default function TrendScoutBot({ platform, token }: TrendScoutBotProps) {
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (platform && token) {
      scoutTrends()
    }
  }, [platform, token])

  const scoutTrends = async () => {
    setLoading(true)
    setError('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/bots/trend-scout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ platform }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to scout trends')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setError('')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out')
      } else {
        setError(err.message || 'Failed to load trends')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Scouting trending topics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-white">Trend Scout</h4>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400 mb-2">⚠️ Showing general trends</p>
          <p className="text-xs text-gray-400 mb-3">Post more content to get personalized trend recommendations</p>
          <div className="space-y-2">
            <div className="text-xs text-gray-300">
              <strong>Popular:</strong> #MotivationMonday, #Lifestyle, #WeekendVibes
            </div>
            <div className="text-xs text-gray-300">
              <strong>Best time:</strong> 9 AM - 11 AM or 7 PM - 9 PM
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Always show something
  if (!analysis) {
    return (
      <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-white">Trend Scout</h4>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 mb-2">Loading trending topics...</p>
          <p className="text-xs text-gray-500">Analyzing your niche for opportunities</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h4 className="font-semibold text-white">Trend Scout</h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? 'Show Less' : 'Show All Trends'}
        </button>
      </div>

      {/* Top Trending Topic */}
      {analysis.trendingTopics.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-white">Hot Right Now</span>
          </div>
          <div className="text-lg font-bold text-orange-400 mb-1">
            {analysis.trendingTopics[0].topic}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-3 h-3 text-orange-300" />
            <span className="text-sm text-orange-300">{analysis.trendingTopics[0].hashtag}</span>
          </div>
          <div className="text-xs text-gray-400">
            {analysis.trendingTopics[0].reason} • {analysis.trendingTopics[0].engagement}
          </div>
        </div>
      )}

      {/* Quick Opportunities */}
      {analysis.opportunities.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">Opportunities</span>
          </div>
          <ul className="space-y-1">
            {analysis.opportunities.slice(0, 2).map((opp, idx) => (
              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-yellow-400">💡</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t border-orange-500/30">
          {/* All Trending Topics */}
          {analysis.trendingTopics.length > 1 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">All Trending Topics</span>
              </div>
              <div className="space-y-3">
                {analysis.trendingTopics.map((trend, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-white">{trend.topic}</div>
                      <div className="text-xs text-orange-400">
                        {(trend.relevance * 100).toFixed(0)}% match
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-3 h-3 text-orange-300" />
                      <span className="text-sm text-orange-300">{trend.hashtag}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{trend.reason}</div>
                    <div className="text-xs text-gray-500">{trend.engagement}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Time to Post */}
          {analysis.bestTimeToPost && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Best Time to Post</span>
              </div>
              <div className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">
                {analysis.bestTimeToPost}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Recommendations</span>
              </div>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

