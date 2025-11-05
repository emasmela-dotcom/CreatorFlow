'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, TrendingUp, Sparkles, Loader2, CheckCircle } from 'lucide-react'

interface SchedulingRecommendation {
  optimalTimes: Array<{
    day: string
    time: string
    score: number
    reason: string
  }>
  weeklySchedule: Array<{
    day: string
    recommendedTimes: string[]
    bestTime: string
  }>
  insights: string[]
  nextBestTime: {
    date: string
    time: string
    score: number
  }
}

interface SchedulingAssistantBotProps {
  platform: string
  token: string
  onTimeSelect?: (time: string) => void
}

export default function SchedulingAssistantBot({ platform, token, onTimeSelect }: SchedulingAssistantBotProps) {
  const [recommendations, setRecommendations] = useState<SchedulingRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!platform) {
      setRecommendations(null)
      return
    }

    fetchRecommendations()
  }, [platform])

  const fetchRecommendations = async () => {
    if (!platform) return

    setLoading(true)
    setError('')

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch('/api/bots/scheduling-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ platform }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations')
      }

      setRecommendations(data.recommendations)
      setError('') // Clear any previous errors
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Showing default recommendations.')
      } else {
        setError(err.message || 'Failed to load recommendations')
      }
      setRecommendations(null) // Show fallback UI
    } finally {
      setLoading(false)
    }
  }

  if (!platform) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-semibold text-white">Scheduling Assistant</h4>
        </div>
        {recommendations && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            {expanded ? 'Show Less' : 'Show All Times'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          <span className="text-sm text-gray-400">Analyzing best times...</span>
        </div>
      ) : error ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400 mb-2">⚠️ Using default recommendations</p>
          <p className="text-xs text-gray-400">Industry best times for {platform}</p>
          {/* Show fallback data */}
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-300">
              <strong>Best times:</strong> 6-9 PM (evenings perform best)
            </div>
            <div className="text-xs text-gray-300">
              <strong>Best days:</strong> Tuesday, Thursday, Friday
            </div>
          </div>
        </div>
      ) : recommendations ? (
        <div className="space-y-3">
          {/* Next Best Time - Prominent */}
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Next Best Time to Post</p>
                <p className="text-lg font-bold text-white mb-1">
                  {recommendations.nextBestTime.date} at {recommendations.nextBestTime.time}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">
                      {recommendations.nextBestTime.score}% Match
                    </span>
                  </div>
                </div>
                {onTimeSelect && (
                  <button
                    onClick={() => onTimeSelect(recommendations.nextBestTime.time)}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg text-xs font-semibold text-white transition-all"
                  >
                    Use This Time
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Top 3 Best Times */}
          {!expanded && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-medium">Top Times This Week:</p>
              {recommendations.optimalTimes
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-white">
                          {time.day} at {time.time}
                        </p>
                        <p className="text-xs text-gray-400">{time.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">{time.score}%</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Expanded View - Full Weekly Schedule */}
          {expanded && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium">Weekly Schedule:</p>
              <div className="space-y-2">
                {recommendations.weeklySchedule.map((day, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">{day.day}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">Best: {day.bestTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {day.recommendedTimes.map((time, timeIndex) => (
                        <button
                          key={timeIndex}
                          onClick={() => onTimeSelect?.(time)}
                          className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {recommendations.insights.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-400 mb-2">Insights:</p>
              <ul className="space-y-1">
                {recommendations.insights.map((insight, index) => (
                  <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

