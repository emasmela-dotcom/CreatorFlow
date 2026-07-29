'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, Mic, RefreshCw, DollarSign, 
  Bell, TestTube, List, Hash, Handshake,
  Sparkles, CheckCircle, XCircle, AlertCircle, ArrowLeftRight, CheckSquare
} from 'lucide-react'

interface GameChangerFeaturesProps {
  token: string
}

export const GAME_CHANGER_FEATURES = [
  { id: 'performance-predictor', name: 'Performance Predictor', icon: TrendingUp, color: 'purple' },
  { id: 'brand-voice', name: 'Brand Voice', icon: Mic, color: 'blue' },
  { id: 'cross-platform', name: 'Cross-Platform Sync', icon: ArrowLeftRight, color: 'green' },
  { id: 'content-recycling', name: 'Content Recycling', icon: RefreshCw, color: 'orange' },
  { id: 'revenue-tracker', name: 'Revenue Tracker', icon: DollarSign, color: 'yellow' },
  { id: 'trend-alerts', name: 'Trend Alerts', icon: Bell, color: 'red' },
  { id: 'ab-testing', name: 'A/B Testing', icon: TestTube, color: 'pink' },
  { id: 'content-series', name: 'Content Series', icon: List, color: 'indigo' },
  { id: 'hashtag-optimizer', name: 'Hashtag Optimizer', icon: Hash, color: 'teal' },
  { id: 'marketplace', name: 'Collaboration Marketplace', icon: Handshake, color: 'cyan' },
  { id: 'follow-thru-crm', name: 'Follow Thru CRM', icon: CheckSquare, color: 'purple' }
] as const

function getFeatureHelp(id: string): { when: string; why: string; how: string } {
  switch (id) {
    case 'performance-predictor':
      return {
        when: 'Before you publish, to check if a post is ready.',
        why: 'Avoid low-engagement posts and know exactly what to tweak.',
        how: 'Paste your content, pick a platform, and get a predicted score.'
      }
    case 'brand-voice':
      return {
        when: 'When you want to check if content sounds like you.',
        why: 'Keep consistency across every platform and post.',
        how: 'Paste your content and compare it against your saved voice profile.'
      }
    case 'cross-platform':
      return {
        when: 'After you write content, before scheduling.',
        why: 'One piece of content, automatically formatted for every platform.',
        how: 'Paste in what you wrote, select platforms, and CreatorFlow adjusts length, hashtags, and format for each.'
      }
    case 'content-recycling':
      return {
        when: 'When you want to repurpose old top-performing posts.',
        why: 'Save time by reusing content that already worked.',
        how: 'The system surfaces your best posts and suggests the best time to repost them.'
      }
    case 'revenue-tracker':
      return {
        when: 'When you want to see all income sources in one place.',
        why: 'Understand which deals and platforms earn the most.',
        how: 'Add income sources manually; the dashboard shows totals and breakdowns.'
      }
    case 'trend-alerts':
      return {
        when: 'When you want to catch rising topics early.',
        why: 'Ride trends before they peak for more reach.',
        how: 'Set keywords; get notified when they start trending on your platforms.'
      }
    case 'ab-testing':
      return {
        when: 'When you want to test two versions of a post.',
        why: 'Learn what wording or format gets better engagement.',
        how: 'Full panel coming soon — backend is ready.'
      }
    case 'content-series':
      return {
        when: 'When you want to plan a multi-part story or campaign.',
        why: 'Keep audiences coming back with connected content.',
        how: 'Full panel coming soon — backend is ready.'
      }
    case 'hashtag-optimizer':
      return {
        when: 'Before publishing on hashtag-driven platforms.',
        why: 'Better discoverability without spamming irrelevant tags.',
        how: 'Paste your content, pick a platform, and get tailored hashtag suggestions.'
      }
    case 'marketplace':
      return {
        when: 'When you want to find brand deals or collaborations.',
        why: 'Monetize your audience with matched opportunities.',
        how: 'Browse available deals and express interest directly.'
      }
    case 'follow-thru-crm':
      return {
        when: 'When you need to track who owes you what and when.',
        why: 'Never lose a brand deal or follow-up in DMs again.',
        how: 'Log promises, set due dates, and see overdue items at a glance.'
      }
    default:
      return { when: '', why: '', how: '' }
  }
}

function FeatureHelpBlock({ featureId }: { featureId: string }) {
  const help = getFeatureHelp(featureId)
  return (
    <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-700/50 mb-4">
      <div className="text-xs text-gray-300 space-y-1">
        <p><span className="text-white font-medium">When:</span> {help.when}</p>
        <p><span className="text-white font-medium">Why:</span> {help.why}</p>
        <p><span className="text-white font-medium">How:</span> {help.how}</p>
      </div>
    </div>
  )
}

export function GameChangerFeatureDetail({ featureId, token, onClose }: { featureId: string; token: string; onClose: () => void }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      {renderFeatureUI(featureId, token, onClose)}
    </div>
  )
}

export default function GameChangerFeatures({ token }: GameChangerFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const features = GAME_CHANGER_FEATURES

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-2 border-purple-500 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Game-Changer Features</h2>
        </div>
        <p className="text-gray-300 mb-4">
          Tools that help you check, format, and manage content you already have—before and after you post.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const help = getFeatureHelp(feature.id)
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeFeature === feature.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                <h3 className="font-semibold text-white">{feature.name}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {getFeatureDescription(feature.id)}
              </p>
              <div className="mt-2 text-xs text-gray-300 space-y-0.5">
                <p><span className="text-gray-200">When:</span> {help.when}</p>
                <p><span className="text-gray-200">Why:</span> {help.why}</p>
              </div>
            </button>
          )
        })}
      </div>

      {activeFeature && (
        <div className="mt-6 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          {renderFeatureUI(activeFeature, token, () => setActiveFeature(null))}
        </div>
      )}
    </div>
  )
}

function getFeatureDescription(id: string): string {
  const descriptions: Record<string, string> = {
    'performance-predictor': 'Predict engagement before posting',
    'brand-voice': 'Maintain consistent brand voice',
    'cross-platform': 'Post once, sync to all platforms',
    'content-recycling': 'Resurface top-performing content',
    'revenue-tracker': 'Track all income sources',
    'trend-alerts': 'Get notified of trending topics',
    'ab-testing': 'Test content variations',
    'content-series': 'Generate multi-part series',
    'hashtag-optimizer': 'AI-optimized hashtags',
    'marketplace': 'Connect with brand opportunities',
    'follow-thru-crm': 'Track what you\'re waiting on and who you\'re waiting on it from'
  }
  return descriptions[id] || 'Advanced feature'
}

function renderFeatureUI(featureId: string, token: string, onClose: () => void) {
  switch (featureId) {
    case 'performance-predictor':
      return <PerformancePredictorUI token={token} />
    case 'brand-voice':
      return <BrandVoiceUI token={token} />
    case 'cross-platform':
      return <CrossPlatformSyncUI token={token} />
    case 'content-recycling':
      return <ContentRecyclingUI token={token} />
    case 'revenue-tracker':
      return <RevenueTrackerUI token={token} />
    case 'trend-alerts':
      return <TrendAlertsUI token={token} />
    case 'ab-testing':
      return <ABTestingUI token={token} />
    case 'content-series':
      return <ContentSeriesUI token={token} />
    case 'hashtag-optimizer':
      return <HashtagOptimizerUI token={token} />
    case 'marketplace':
      return <CollaborationMarketplaceUI token={token} />
    case 'follow-thru-crm':
      return (
        <div className="space-y-4">
          <FeatureHelpBlock featureId="follow-thru-crm" />
          <p className="text-gray-300">Track promises, people, and follow-ups. They owe you / You owe them / Overdue / Upcoming.</p>
          <Link href="/follow-thru" className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500">Open Follow Thru CRM →</Link>
        </div>
      )
    default:
      return <div>Feature UI coming soon</div>
  }
}

// Feature UI Components
function PerformancePredictorUI({ token }: { token: string }) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)

  const predict = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/predict-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, platform })
      })
      const data = await res.json()
      if (data.success) {
        setPrediction(data.prediction)
      }
    } catch (error) {
      console.error('Prediction error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-purple-400" />
        AI Performance Predictor
      </h3>
      <p className="text-gray-300">Predict how your content will perform before posting</p>
      <FeatureHelpBlock featureId="performance-predictor" />

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your post content..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white min-h-[120px]"
            onBlur={predict}
          />
        </div>

        <button
          onClick={predict}
          disabled={loading || !content.trim()}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict Performance'}
        </button>

        {prediction && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-300">Predicted Engagement</div>
                <div className="text-2xl font-bold text-white">{prediction.predictedEngagement}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Predicted Reach</div>
                <div className="text-2xl font-bold text-white">{prediction.predictedReach}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Confidence</div>
                <div className="text-2xl font-bold text-white">{prediction.confidenceScore}%</div>
              </div>
            </div>

            {prediction.improvementSuggestions && prediction.improvementSuggestions.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-gray-300 mb-2">Suggestions:</div>
                <ul className="space-y-1">
                  {prediction.improvementSuggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BrandVoiceUI({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [content, setContent] = useState('')
  const [matchResult, setMatchResult] = useState<any>(null)

  const analyze = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/brand-voice/analyze', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkMatch = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/brand-voice/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })
      const data = await res.json()
      if (data.success) {
        setMatchResult(data)
      }
    } catch (error) {
      console.error('Check error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Mic className="w-6 h-6 text-blue-400" />
        Brand Voice Analyzer
      </h3>
      <FeatureHelpBlock featureId="brand-voice" />

      <button
        onClick={analyze}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze My Brand Voice'}
      </button>

      {profile && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="mb-3">
            <div className="text-sm text-gray-300">Consistency Score</div>
            <div className="text-3xl font-bold text-white">{profile.consistencyScore}%</div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-300">Tone</div>
              <div className="text-white">{profile.tone?.join(', ') || 'Not detected'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-300">Style</div>
              <div className="text-white">{profile.style?.join(', ') || 'Not detected'}</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-300 mb-1">Check Content Match</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content to check..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white min-h-[100px]"
          onBlur={checkMatch}
        />
      </div>

      {matchResult && (
        <div className={`rounded-lg p-4 border-2 ${
          matchResult.matches ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {matchResult.matches ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <span className="font-semibold text-white">
              Match Score: {matchResult.score}%
            </span>
          </div>
          {matchResult.suggestions && (
            <ul className="space-y-1 text-sm text-gray-300">
              {matchResult.suggestions.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function CrossPlatformSyncUI({ token }: { token: string }) {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const platforms = ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'facebook', 'pinterest', 'threads', 'snapchat', 'reddit', 'bluesky', 'mastodon', 'discord', 'telegram', 'tumblr', 'wordpress']

  const sync = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/cross-platform-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          masterPostId: 'temp-' + Date.now(),
          platforms: selectedPlatforms,
          content
        })
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <ArrowLeftRight className="w-6 h-6 text-green-400" />
        Cross-Platform Sync
      </h3>
      <p className="text-gray-300">Post once, automatically adapts to all platforms</p>
      <FeatureHelpBlock featureId="cross-platform" />

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Select Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  setSelectedPlatforms(
                    selectedPlatforms.includes(platform)
                      ? selectedPlatforms.filter(p => p !== platform)
                      : [...selectedPlatforms, platform]
                  )
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPlatforms.includes(platform)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white min-h-[120px]"
          />
        </div>

        <button
          onClick={sync}
          disabled={loading || selectedPlatforms.length === 0}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Syncing...' : `Sync to ${selectedPlatforms.length} Platform(s)`}
        </button>

        {result && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm font-semibold text-gray-300 mb-2">Sync Results:</div>
            {Object.entries(result.results || {}).map(([platform, res]: [string, any]) => (
              <div key={platform} className="flex items-center gap-2 text-sm mb-1">
                {res.success ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-gray-300">{platform}:</span>
                <span className={res.success ? 'text-green-400' : 'text-red-400'}>
                  {res.success ? 'Success' : res.error || 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ContentRecyclingUI({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [recyclable, setRecyclable] = useState<any[]>([])

  const loadRecyclable = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/content-recycling', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setRecyclable(data.recyclable || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecyclable()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-orange-400" />
          Content Recycling
        </h3>
        <button
          onClick={loadRecyclable}
          disabled={loading}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      <FeatureHelpBlock featureId="content-recycling" />

      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : recyclable.length === 0 ? (
        <div className="text-center text-gray-300 py-8">No recyclable content found</div>
      ) : (
        <div className="space-y-3">
          {recyclable.map((item: any) => (
            <div key={item.postId} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-300">{item.platform}</div>
                  <div className="text-white font-semibold">{item.originalEngagement} engagement</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">Suggested Repost</div>
                  <div className="text-white">{new Date(item.suggestedRepostDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-sm text-gray-300 mt-2 line-clamp-2">{item.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RevenueTrackerUI({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<any>(null)
  const [sources, setSources] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [summaryRes, sourcesRes] = await Promise.all([
        fetch('/api/revenue?type=summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/revenue?type=sources', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const summaryData = await summaryRes.json()
      const sourcesData = await sourcesRes.json()

      if (summaryData.success) setSummary(summaryData.summary)
      if (sourcesData.success) setSources(sourcesData.sources || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-yellow-400" />
        Revenue Tracker
      </h3>
      <FeatureHelpBlock featureId="revenue-tracker" />

      {summary && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-300 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-white">${summary.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-300 mt-2">{summary.transactionCount} transactions</div>
        </div>
      )}

      <div>
        <div className="text-sm font-semibold text-gray-300 mb-2">Revenue Sources</div>
        {sources.length === 0 ? (
          <div className="text-sm text-gray-300">No revenue sources added yet</div>
        ) : (
          <div className="space-y-2">
            {sources.map((source: any) => (
              <div key={source.id} className="bg-gray-800/50 rounded p-3">
                <div className="text-white font-semibold">{source.sourceName}</div>
                <div className="text-sm text-gray-300">{source.sourceType}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TrendAlertsUI({ token }: { token: string }) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trend-alerts?type=alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Bell className="w-6 h-6 text-red-400" />
        Trend Alerts
      </h3>
      <FeatureHelpBlock featureId="trend-alerts" />

      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="text-center text-gray-300 py-8">No trend alerts yet</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: any) => (
            <div key={alert.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="font-semibold text-white">#{alert.keyword}</div>
              <div className="text-sm text-gray-300">{alert.platform}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ABTestingUI({ token }: { token: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <TestTube className="w-6 h-6 text-pink-400" />
        A/B Testing
      </h3>
      <p className="text-gray-300">Test content variations and compare performance</p>
      <FeatureHelpBlock featureId="ab-testing" />
      <p className="text-sm text-gray-300">Full panel coming soon — backend is ready.</p>
    </div>
  )
}

function ContentSeriesUI({ token }: { token: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <List className="w-6 h-6 text-indigo-400" />
        Content Series Generator
      </h3>
      <p className="text-gray-300">Create multi-part content series automatically</p>
      <FeatureHelpBlock featureId="content-series" />
      <p className="text-sm text-gray-300">Full panel coming soon — backend is ready.</p>
    </div>
  )
}

function HashtagOptimizerUI({ token }: { token: string }) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const optimize = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/hashtag-optimizer?platform=${platform}&content=${encodeURIComponent(content)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setHashtags(data.hashtags || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Hash className="w-6 h-6 text-teal-400" />
        Hashtag Optimizer
      </h3>
      <FeatureHelpBlock featureId="hashtag-optimizer" />

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white min-h-[100px]"
            onBlur={optimize}
          />
        </div>

        <button
          onClick={optimize}
          disabled={loading || !content.trim()}
          className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Optimizing...' : 'Get Optimized Hashtags'}
        </button>

        {hashtags.length > 0 && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm font-semibold text-gray-300 mb-2">Suggested Hashtags:</div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-teal-600/20 text-teal-300 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CollaborationMarketplaceUI({ token }: { token: string }) {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOpportunities()
  }, [])

  const loadOpportunities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/collaboration-marketplace?type=opportunities', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setOpportunities(data.opportunities || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Handshake className="w-6 h-6 text-cyan-400" />
        Collaboration Marketplace
      </h3>
      <FeatureHelpBlock featureId="marketplace" />

      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : opportunities.length === 0 ? (
        <div className="text-center text-gray-300 py-8">No opportunities available</div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opp: any) => (
            <div key={opp.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="font-semibold text-white mb-1">{opp.opportunityTitle}</div>
              <div className="text-sm text-gray-300 mb-2">{opp.brandName}</div>
              <div className="text-sm text-gray-300 line-clamp-2">{opp.description}</div>
              {opp.compensationAmount && (
                <div className="text-sm text-green-400 mt-2">
                  ${opp.compensationAmount} - {opp.compensationType}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
