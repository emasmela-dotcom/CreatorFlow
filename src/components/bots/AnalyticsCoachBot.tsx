'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, Lightbulb, BarChart3, Loader2, Sparkles } from 'lucide-react'

interface GrowthInsight {
  metric: string
  value: number | string
  trend: 'up' | 'down' | 'stable'
  explanation: string
  action: string
}

interface StrategyRecommendation {
  area: string
  current: string
  target: string
  strategy: string
  timeframe: string
}

interface CoachAnalysis {
  insights: GrowthInsight[]
  strategies: StrategyRecommendation[]
  predictions: string[]
  recommendations: string[]
  growthScore: number
}

interface AnalyticsCoachBotProps {
  platform: string
  token: string
}

export default function AnalyticsCoachBot({ platform, token }: AnalyticsCoachBotProps) {
  const [analysis, setAnalysis] = useState<CoachAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (platform && token) {
      coachAnalytics()
    }
  }, [platform, token])

  const coachAnalytics = async () => {
    setLoading(true)
    setError('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/bots/analytics-coach', {
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
        throw new Error(errorData.error || 'Failed to analyze analytics')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setError('')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out')
      } else {
        setError(err.message || 'Failed to load analytics coaching')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Analyzing your growth...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg p-4 border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Analytics Coach</h4>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400 mb-2">⚠️ Using default insights</p>
          <p className="text-xs text-gray-400 mb-3">Start posting to get personalized growth coaching</p>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-3 text-center">
            <div className="text-xs text-gray-400 mb-2">Growth Score</div>
            <div className="text-4xl font-bold text-gray-500">-</div>
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div>💡 Post consistently (3x/week) for best results</div>
            <div>💡 Use relevant hashtags to increase reach</div>
            <div>💡 Engage with your audience regularly</div>
          </div>
        </div>
      </div>
    )
  }

  // Always show something
  if (!analysis) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg p-4 border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Analytics Coach</h4>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 mb-2">Analyzing your growth metrics...</p>
          <p className="text-xs text-gray-500">Start posting to get personalized insights</p>
        </div>
      </div>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg p-4 border border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-white">Analytics Coach</h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? 'Show Less' : 'Show Details'}
        </button>
      </div>

      {/* Growth Score */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-center">
        <div className="text-xs text-gray-400 mb-2">Growth Score</div>
        <div className={`text-4xl font-bold ${getScoreColor(analysis.growthScore)} mb-2`}>
          {analysis.growthScore}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              analysis.growthScore >= 70 ? 'bg-green-500' :
              analysis.growthScore >= 50 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${analysis.growthScore}%` }}
          />
        </div>
      </div>

      {/* Key Insights */}
      {analysis.insights.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">Key Insights</span>
          </div>
          <div className="space-y-2">
            {analysis.insights.slice(0, 2).map((insight, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(insight.trend)}
                    <span className="text-sm font-semibold text-white">{insight.metric}</span>
                  </div>
                  <span className="text-sm text-blue-400 font-bold">{insight.value}</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">{insight.explanation}</div>
                <div className="text-xs text-blue-300">💡 {insight.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t border-blue-500/30">
          {/* All Insights */}
          {analysis.insights.length > 2 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">All Metrics</span>
              </div>
              <div className="space-y-2">
                {analysis.insights.map((insight, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(insight.trend)}
                        <span className="text-sm font-semibold text-white">{insight.metric}</span>
                      </div>
                      <span className="text-sm text-blue-400 font-bold">{insight.value}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{insight.explanation}</div>
                    <div className="text-xs text-blue-300">💡 {insight.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Strategies */}
          {analysis.strategies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Growth Strategies</span>
              </div>
              <div className="space-y-3">
                {analysis.strategies.map((strategy, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm font-semibold text-white mb-2">{strategy.area}</div>
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="text-gray-400">Current:</span>
                      <span className="text-red-300">{strategy.current}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-green-300">{strategy.target}</span>
                    </div>
                    <div className="text-xs text-gray-300 mb-2">{strategy.strategy}</div>
                    <div className="text-xs text-purple-300">⏱️ {strategy.timeframe}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictions */}
          {analysis.predictions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Growth Predictions</span>
              </div>
              <ul className="space-y-1">
                {analysis.predictions.map((prediction, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400">📈</span>
                    <span>{prediction}</span>
                  </li>
                ))}
              </ul>
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

