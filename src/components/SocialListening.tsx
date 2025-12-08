'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, X, TrendingUp, MessageSquare, Hash, Users, Filter, Loader2 } from 'lucide-react'

interface ListeningRule {
  id: number
  name: string
  platform: string
  type: 'username' | 'hashtag' | 'keyword' | 'competitor'
  query: string
  is_active: boolean
  created_at: string
}

interface Mention {
  id: number
  platform: string
  mention_type: string
  query: string
  content: string
  author_name: string | null
  author_handle: string | null
  post_url: string | null
  sentiment: 'positive' | 'neutral' | 'negative' | null
  engagement_count: number
  created_at: string
}

interface SocialListeningProps {
  token: string
}

const PLATFORMS = ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']
const MENTION_TYPES = [
  { id: 'username', label: 'Username', icon: Users },
  { id: 'hashtag', label: 'Hashtag', icon: Hash },
  { id: 'keyword', label: 'Keyword', icon: Search },
  { id: 'competitor', label: 'Competitor', icon: TrendingUp }
]

export default function SocialListening({ token }: SocialListeningProps) {
  const [rules, setRules] = useState<ListeningRule[]>([])
  const [mentions, setMentions] = useState<Mention[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddRule, setShowAddRule] = useState(false)
  const [filter, setFilter] = useState({ platform: 'all', type: 'all', sentiment: 'all' })

  const [newRule, setNewRule] = useState({
    name: '',
    platform: 'instagram',
    type: 'username' as 'username' | 'hashtag' | 'keyword' | 'competitor',
    query: ''
  })

  useEffect(() => {
    loadData()
  }, [token, filter])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load rules
      const rulesRes = await fetch('/api/social-listening?type=rules', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const rulesData = await rulesRes.json()
      if (rulesData.success) {
        setRules(rulesData.rules || [])
      }

      // Load mentions
      const params = new URLSearchParams()
      if (filter.platform !== 'all') params.append('platform', filter.platform)
      if (filter.type !== 'all') params.append('mentionType', filter.type)
      if (filter.sentiment !== 'all') params.append('sentiment', filter.sentiment)
      
      const mentionsRes = await fetch(`/api/social-listening?type=mentions&${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const mentionsData = await mentionsRes.json()
      if (mentionsData.success) {
        setMentions(mentionsData.mentions || [])
      }

      // Load stats
      const statsRes = await fetch('/api/social-listening?type=stats&days=30', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/social-listening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add-rule',
          ...newRule
        })
      })
      const data = await response.json()
      if (data.success) {
        setShowAddRule(false)
        setNewRule({ name: '', platform: 'instagram', type: 'username', query: '' })
        loadData()
      }
    } catch (err) {
      console.error('Failed to add rule:', err)
    }
  }

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm('Delete this listening rule?')) return
    
    try {
      const response = await fetch(`/api/social-listening?ruleId=${ruleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        loadData()
      }
    } catch (err) {
      console.error('Failed to delete rule:', err)
    }
  }

  const getSentimentColor = (sentiment: string | null) => {
    if (sentiment === 'positive') return 'text-green-400'
    if (sentiment === 'negative') return 'text-red-400'
    return 'text-gray-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Social Listening</h2>
          <p className="text-gray-400">
            Track mentions, hashtags, keywords, and competitors across platforms
          </p>
        </div>
        <button
          onClick={() => setShowAddRule(!showAddRule)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {showAddRule && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add Listening Rule</h3>
          <form onSubmit={handleAddRule} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="e.g., My Brand Mentions"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Platform</label>
                <select
                  value={newRule.platform}
                  onChange={(e) => setNewRule({ ...newRule, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  {PLATFORMS.map(p => (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Type</label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  {MENTION_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Query</label>
              <input
                type="text"
                value={newRule.query}
                onChange={(e) => setNewRule({ ...newRule, query: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="e.g., @yourusername, #hashtag, keyword"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Add Rule
              </button>
              <button
                type="button"
                onClick={() => setShowAddRule(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Mentions</div>
            <div className="text-2xl font-bold text-white">{stats.totalMentions || 0}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Positive</div>
            <div className="text-2xl font-bold text-green-400">{stats.bySentiment?.positive || 0}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Neutral</div>
            <div className="text-2xl font-bold text-gray-400">{stats.bySentiment?.neutral || 0}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Negative</div>
            <div className="text-2xl font-bold text-red-400">{stats.bySentiment?.negative || 0}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Listening Rules</h3>
          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>No listening rules yet</p>
              <p className="text-sm">Add a rule to start tracking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => {
                const TypeIcon = MENTION_TYPES.find(t => t.id === rule.type)?.icon || Search
                return (
                  <div key={rule.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">{rule.name}</div>
                        <div className="text-sm text-gray-400">
                          {rule.type} • {rule.platform} • {rule.query}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Mentions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Mentions</h3>
            <div className="flex gap-2">
              <select
                value={filter.platform}
                onChange={(e) => setFilter({ ...filter, platform: e.target.value })}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">All Platforms</option>
                {PLATFORMS.map(p => (
                  <option key={p} value={p} className="capitalize">{p}</option>
                ))}
              </select>
              <select
                value={filter.sentiment}
                onChange={(e) => setFilter({ ...filter, sentiment: e.target.value })}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>
          {mentions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>No mentions found</p>
              <p className="text-sm">Mentions will appear here when found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mentions.map(mention => (
                <div key={mention.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-white font-medium capitalize">{mention.platform}</div>
                      {mention.author_handle && (
                        <div className="text-sm text-gray-400">@{mention.author_handle}</div>
                      )}
                    </div>
                    {mention.sentiment && (
                      <span className={`text-sm font-medium ${getSentimentColor(mention.sentiment)}`}>
                        {mention.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{mention.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Query: {mention.query}</span>
                    {mention.engagement_count > 0 && (
                      <span>{mention.engagement_count} engagements</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

