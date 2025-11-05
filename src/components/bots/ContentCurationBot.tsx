'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Lightbulb, Target, Hash, Loader2, Sparkles, TrendingUp } from 'lucide-react'

interface ContentIdea {
  title: string
  description: string
  type: string
  reason: string
  hashtags: string[]
  engagement: string
}

interface ContentGap {
  category: string
  description: string
  opportunity: string
  suggestedHashtags: string[]
}

interface CurationAnalysis {
  contentIdeas: ContentIdea[]
  contentGaps: ContentGap[]
  recommendations: string[]
  nextPostSuggestions: string[]
}

interface ContentCurationBotProps {
  platform: string
  token: string
}

export default function ContentCurationBot({ platform, token }: ContentCurationBotProps) {
  const [analysis, setAnalysis] = useState<CurationAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (platform && token) {
      curateContent()
    }
  }, [platform, token])

  const curateContent = async () => {
    setLoading(true)
    setError('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/bots/content-curation', {
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
        throw new Error(errorData.error || 'Failed to curate content')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setError('')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out')
      } else {
        setError(err.message || 'Failed to load content ideas')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Curating content ideas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Content Curation</h4>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400 mb-2">⚠️ Showing general content ideas</p>
          <p className="text-xs text-gray-400 mb-3">Post more content to get personalized suggestions</p>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-purple-400">Content Ideas:</div>
            <ul className="space-y-1 text-xs text-gray-300 ml-4">
              <li>• Daily tips and advice</li>
              <li>• Behind-the-scenes content</li>
              <li>• Educational tutorials</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Always show something
  if (!analysis) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Content Curation</h4>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 mb-2">Generating content ideas...</p>
          <p className="text-xs text-gray-500">Analyzing your content patterns</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h4 className="font-semibold text-white">Content Curation</h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? 'Show Less' : 'Show All Ideas'}
        </button>
      </div>

      {/* Top Content Idea */}
      {analysis.contentIdeas.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white">Top Idea</span>
          </div>
          <div className="text-lg font-bold text-purple-400 mb-1">
            {analysis.contentIdeas[0].title}
          </div>
          <div className="text-sm text-gray-300 mb-2">
            {analysis.contentIdeas[0].description}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400">{analysis.contentIdeas[0].type}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-purple-300">{analysis.contentIdeas[0].engagement}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.contentIdeas[0].hashtags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Recommendations */}
      {analysis.nextPostSuggestions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-white">Next Post Ideas</span>
          </div>
          <ul className="space-y-1">
            {analysis.nextPostSuggestions.slice(0, 2).map((suggestion, idx) => (
              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-green-400">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t border-purple-500/30">
          {/* All Content Ideas */}
          {analysis.contentIdeas.length > 1 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">All Content Ideas</span>
              </div>
              <div className="space-y-3">
                {analysis.contentIdeas.map((idea, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white mb-1">{idea.title}</div>
                        <div className="text-xs text-gray-400 mb-2">{idea.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">{idea.type}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-purple-300">{idea.engagement}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{idea.reason}</div>
                    <div className="flex flex-wrap gap-2">
                      {idea.hashtags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Gaps */}
          {analysis.contentGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">Content Gaps</span>
              </div>
              <div className="space-y-3">
                {analysis.contentGaps.map((gap, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm font-semibold text-white mb-1">{gap.category}</div>
                    <div className="text-xs text-gray-400 mb-2">{gap.description}</div>
                    <div className="text-xs text-orange-300 mb-2">
                      💡 {gap.opportunity}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gap.suggestedHashtags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Recommendations</span>
              </div>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400">→</span>
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

