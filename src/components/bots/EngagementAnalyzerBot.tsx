'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Clock, Hash, Lightbulb, Target, Loader2, BarChart3 } from 'lucide-react'

interface EngagementAnalysis {
  averageEngagement: number
  bestPerformingPost: {
    id: string
    content: string
    engagement: number
    date: string
  }
  trends: {
    bestDays: string[]
    bestTimes: string[]
    bestHashtags: string[]
    bestContentTypes: string[]
  }
  insights: string[]
  recommendations: string[]
}

interface EngagementAnalyzerBotProps {
  platform: string
  token: string
}

export default function EngagementAnalyzerBot({ platform, token }: EngagementAnalyzerBotProps) {
  const [analysis, setAnalysis] = useState<EngagementAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (platform && token) {
      analyzeEngagement()
    }
  }, [platform, token])

  const analyzeEngagement = async () => {
    setLoading(true)
    setError('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/bots/engagement-analyzer', {
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
        throw new Error(errorData.error || 'Failed to analyze engagement')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setError('') // Clear any previous errors
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out')
      } else {
        setError(err.message || 'Failed to load engagement data')
      }
      // Don't set analysis to null - let it show fallback UI
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Analyzing your engagement...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold text-white">Engagement Analysis</h4>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
          <p className="text-xs text-yellow-400 mb-2">⚠️ Using default insights</p>
          <p className="text-xs text-gray-400">Start posting to see your personalized engagement data</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Average Engagement</div>
            <div className="text-2xl font-bold text-gray-500">-</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Best Post</div>
            <div className="text-lg font-semibold text-gray-500">-</div>
          </div>
        </div>
      </div>
    )
  }

  // Always show something - even if no analysis yet
  if (!analysis) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold text-white">Engagement Analysis</h4>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 mb-2">No published posts found yet</p>
          <p className="text-xs text-gray-500">Start posting to get engagement insights!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-yellow-400" />
          <h4 className="font-semibold text-white">Engagement Analysis</h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? 'Show Less' : 'Show Details'}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Average Engagement</div>
          <div className="text-2xl font-bold text-yellow-400">
            {analysis.averageEngagement}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Best Post</div>
          <div className="text-lg font-semibold text-white">
            {analysis.bestPerformingPost.engagement} points
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {analysis.insights.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">Quick Insights</span>
          </div>
          <ul className="space-y-1">
            {analysis.insights.slice(0, 2).map((insight, idx) => (
              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t border-gray-600">
          {/* Best Times */}
          {analysis.trends.bestDays.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Best Days</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.trends.bestDays.map((day, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Best Times */}
          {analysis.trends.bestTimes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Best Times</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.trends.bestTimes.map((time, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top Hashtags */}
          {analysis.trends.bestHashtags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Top Hashtags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.trends.bestHashtags.map((hashtag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Best Performing Post */}
          {analysis.bestPerformingPost.content && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Best Performing Post</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-300 mb-2">{analysis.bestPerformingPost.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{analysis.bestPerformingPost.engagement} engagement</span>
                  {analysis.bestPerformingPost.date && (
                    <span>{new Date(analysis.bestPerformingPost.date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">Recommendations</span>
              </div>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-orange-400">→</span>
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

