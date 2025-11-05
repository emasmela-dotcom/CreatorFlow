'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface BotAnalysis {
  score: number
  status: 'good' | 'warning' | 'needs-work'
  suggestions: Array<{
    type: string
    priority: 'high' | 'medium' | 'low'
    message: string
    actionable: string
  }>
  metrics: {
    length: number
    hashtagCount: number
    wordCount: number
    emojiCount: number
  }
}

interface ContentAssistantBotProps {
  content: string
  platform: string
  hashtags: string
  token: string
}

export default function ContentAssistantBot({ content, platform, hashtags, token }: ContentAssistantBotProps) {
  const [analysis, setAnalysis] = useState<BotAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const [error, setError] = useState('')

  const analyzeContent = useCallback(async () => {
    if (!content.trim() || !platform) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/bots/content-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          platform,
          hashtags
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Content Assistant API Error:', data)
        throw new Error(data.error || 'Analysis failed')
      }

      console.log('Content Assistant Analysis:', data.analysis)
      setAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze')
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }, [content, platform, hashtags, token])

  // Debounce analysis - only analyze after user stops typing for 500ms
  useEffect(() => {
    if (!content.trim() || !platform) {
      setAnalysis(null)
      return
    }

    const timeoutId = setTimeout(() => {
      analyzeContent()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [content, platform, hashtags, analyzeContent])

  // Get status icon and color
  const getStatusDisplay = () => {
    if (!analysis) return null

    const statusConfig = {
      good: {
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        label: 'Good'
      },
      warning: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        label: 'Needs Work'
      },
      'needs-work': {
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        label: 'Needs Work'
      }
    }

    const config = statusConfig[analysis.status]
    const Icon = config.icon

    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label} ({analysis.score}/100)
        </span>
      </div>
    )
  }

  // Don't show anything if no content
  if (!content.trim() || !platform) {
    return null
  }

  // Debug logging
  useEffect(() => {
    console.log('ContentAssistantBot props:', { content, platform, token: token ? 'present' : 'missing' })
  }, [content, platform, token])

  return (
    <div className="space-y-3">
      {/* Real-time Status Badge */}
      {loading ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          <span className="text-sm text-gray-400">Analyzing...</span>
        </div>
      ) : analysis ? (
        <div className="space-y-2">
          {/* Status Badge */}
          {getStatusDisplay()}

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{analysis.metrics.length} chars</span>
            <span>{analysis.metrics.wordCount} words</span>
            <span>{analysis.metrics.hashtagCount} hashtags</span>
          </div>

          {/* Quick Suggestions (High Priority Only) */}
          {analysis.suggestions.filter(s => s.priority === 'high').length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-yellow-400 mb-1">Quick Fix Needed:</p>
                  <p className="text-xs text-gray-300">
                    {analysis.suggestions.find(s => s.priority === 'high')?.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Full Analysis Toggle */}
          {analysis.suggestions.length > 0 && (
            <button
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-sm"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  {showFullAnalysis ? 'Hide' : 'Show'} Full Analysis ({analysis.suggestions.length} suggestions)
                </span>
              </span>
              {showFullAnalysis ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}

          {/* Full Analysis Details */}
          {showFullAnalysis && analysis.suggestions.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-white mb-3">Detailed Suggestions:</h4>
              {analysis.suggestions.map((suggestion, index) => {
                const priorityColors = {
                  high: 'text-red-400 border-red-500/30 bg-red-500/10',
                  medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
                  low: 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                }

                const colors = priorityColors[suggestion.priority]

                return (
                  <div key={index} className={`border rounded-lg p-3 ${colors}`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1">{suggestion.message}</p>
                        <p className="text-xs opacity-80">{suggestion.actionable}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-black/20 capitalize">
                        {suggestion.priority}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      ) : null}
    </div>
  )
}

