'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share2, Loader2, Download } from 'lucide-react'

interface AdvancedAnalyticsProps {
  token: string
}

export default function AdvancedAnalytics({ token }: AdvancedAnalyticsProps) {
  const [performance, setPerformance] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [platform, setPlatform] = useState('all')

  useEffect(() => {
    loadAnalytics()
  }, [token, days, platform])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Load performance analytics
      const params = new URLSearchParams()
      if (platform !== 'all') params.append('platform', platform)
      params.append('days', days.toString())

      const perfRes = await fetch(`/api/analytics/performance?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const perfData = await perfRes.json()
      if (perfData.success) {
        setPerformance(perfData)
      }

      // Load predictions
      const predRes = await fetch(`/api/analytics/advanced?type=predictions&${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const predData = await predRes.json()
      if (predData.success) {
        setPredictions(predData.predictions || [])
      }
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!performance) {
    return (
      <div className="text-center py-12 text-gray-400">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p>No analytics data available</p>
      </div>
    )
  }

  const { overview, byPlatform, topPosts } = performance

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
          <p className="text-gray-400">
            Performance insights, predictions, and detailed metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Posts</span>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{overview?.totalPosts || 0}</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Engagement</span>
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {overview?.totalEngagement?.toLocaleString() || 0}
          </div>
          <div className={`text-sm mt-1 flex items-center gap-1 ${
            (overview?.growthRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {overview?.growthRate >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(overview?.growthRate || 0)}% vs previous period
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Engagement</span>
            <MessageCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {overview?.avgEngagement?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">per post</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Reach</span>
            <Eye className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {overview?.totalReach?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">impressions</div>
        </div>
      </div>

      {/* Platform Breakdown */}
      {byPlatform && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Platform</h3>
          <div className="space-y-4">
            {Object.entries(byPlatform.posts || {}).map(([platform, count]: [string, any]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold capitalize">{platform.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium capitalize">{platform}</div>
                    <div className="text-sm text-gray-400">
                      {count} posts • {byPlatform.engagement?.[platform]?.toLocaleString() || 0} engagement
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {byPlatform.engagement?.[platform] 
                      ? Math.round((byPlatform.engagement[platform] / count) || 0)
                      : 0}
                  </div>
                  <div className="text-xs text-gray-400">avg per post</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Posts */}
      {topPosts && topPosts.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {topPosts.slice(0, 5).map((post: any, idx: number) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">
                      {post.content?.substring(0, 100)}...
                    </div>
                    <div className="text-sm text-gray-400 capitalize">{post.platform}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-white font-semibold">{post.engagement?.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">engagement</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    {post.shares?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions */}
      {predictions.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content Performance Predictions</h3>
          <div className="space-y-3">
            {predictions.slice(0, 5).map((pred: any, idx: number) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">
                      {pred.content?.substring(0, 80)}...
                    </div>
                    <div className="text-sm text-gray-400 capitalize">{pred.platform}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-white font-semibold">
                      {pred.predictedEngagement?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">predicted</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Confidence: {pred.confidence} • Factors: {pred.factors?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

