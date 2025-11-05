'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Calendar, Users, TrendingUp, Plus, Settings, Bell, Search, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, Brain, LogOut } from 'lucide-react'
import TrialStatusBanner from './components/TrialStatusBanner'
import NewBotsBanner from '@/components/NewBotsBanner'
import ContentAssistantBot from '@/components/bots/ContentAssistantBot'
import SchedulingAssistantBot from '@/components/bots/SchedulingAssistantBot'
import EngagementAnalyzerBot from '@/components/bots/EngagementAnalyzerBot'
import TrendScoutBot from '@/components/bots/TrendScoutBot'
import ContentCurationBot from '@/components/bots/ContentCurationBot'
import AnalyticsCoachBot from '@/components/bots/AnalyticsCoachBot'
// AI Tool components - commented out until components are created
// import BrandVoiceTool from '@/components/ai/BrandVoiceTool'
// import HashtagOptimizerTool from '@/components/ai/HashtagOptimizerTool'
// import ContentGapTool from '@/components/ai/ContentGapTool'
// import EngagementPredictorTool from '@/components/ai/EngagementPredictorTool'
// import ViralDetectorTool from '@/components/ai/ViralDetectorTool'
// import ReformatterTool from '@/components/ai/ReformatterTool'
// import CollaborationMatchmakerTool from '@/components/ai/CollaborationMatchmakerTool'
// import SentimentTool from '@/components/ai/SentimentTool'
import LockedContentBadge, { LockedContentIcon } from '@/components/LockedContentBadge'

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [postInfo, setPostInfo] = useState<{
    monthlyLimit: number | null
    purchased: number
    postsThisMonth: number
    totalAvailable: number
    remaining: number
    packages: Array<{ quantity: number; price: number; savings: string }>
  } | null>(null)
  const [posts, setPosts] = useState<Array<{
    id: string
    platform: string
    content: string
    scheduled_at: string | null
    status: string
    isLocked?: boolean
    created_at: string
  }>>([])
  const [openAITool, setOpenAITool] = useState<string | null>(null)
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    // Get token from localStorage on client side
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '')
    }
  }, [])

  const analytics = {
    totalFollowers: 125000,
    engagementRate: 4.2,
    reach: 45000,
    impressions: 180000
  }

  useEffect(() => {
    // Fetch user subscription tier and post info
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch subscription
      fetch('/api/subscription/manage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setSubscriptionTier(data.plan || null)
      })
      .catch(err => console.error('Error fetching subscription:', err))

      // Fetch post purchase info
      fetch('/api/user/purchase-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPostInfo({
            monthlyLimit: data.monthlyLimit,
            purchased: data.purchasedPosts || 0,
            postsThisMonth: data.postsThisMonth || 0,
            totalAvailable: data.totalAvailable || 0,
            remaining: data.remaining || 0,
            packages: data.packages || []
          })
        }
      })
      .catch(err => console.error('Error fetching post info:', err))

      // Fetch posts with lock status
      fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPosts(data.posts)
        }
      })
      .catch(err => console.error('Error fetching posts:', err))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              CreatorFlow
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'collaborations' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('collaborations')}
              >
                Collaborations
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'bots' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('bots')}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                AI Bots
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Bell className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/signin')
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Followers</span>
                  <span className="font-semibold">{analytics.totalFollowers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Engagement</span>
                  <span className="font-semibold">{analytics.engagementRate}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
                <button
                  onClick={() => router.push('/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                <button
                  onClick={() => router.push('/analytics')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-700 rounded">
                  <p className="text-gray-300">Post scheduled for Instagram</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-2 bg-gray-700 rounded">
                  <p className="text-gray-300">New collaboration request</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <NewBotsBanner />
          <TrialStatusBanner />
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Followers</p>
                      <p className="text-2xl font-bold">{analytics.totalFollowers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Engagement Rate</p>
                      <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +0.8% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Reach</p>
                      <p className="text-2xl font-bold">{analytics.reach.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +18% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Impressions</p>
                      <p className="text-2xl font-bold">{analytics.impressions.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +25% this month
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className={`flex items-center justify-between p-4 rounded-lg ${
                        post.isLocked ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-700'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            post.status === 'scheduled' ? 'bg-yellow-400' : 
                            post.status === 'published' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{post.platform}</p>
                              {post.isLocked && <LockedContentIcon />}
                            </div>
                            <p className="text-sm text-gray-400 truncate max-w-xs">{post.content}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {post.scheduled_at 
                              ? new Date(post.scheduled_at).toLocaleDateString() 
                              : new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">{post.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sunset Photography</p>
                        <p className="text-sm text-gray-400">Instagram • 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">2.4K likes</p>
                        <p className="text-sm text-green-400">+15% engagement</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Launch</p>
                        <p className="text-sm text-gray-400">Twitter • 1 week ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">1.8K retweets</p>
                        <p className="text-sm text-green-400">+22% engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Content Management</h2>
                <button
                  onClick={() => router.push('/create')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Post
                </button>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No posts yet. Create your first post!</p>
                  <button
                    onClick={() => router.push('/create')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      className={`bg-gray-800 p-6 rounded-lg border ${
                        post.isLocked 
                          ? 'border-blue-500/50 bg-blue-500/5' 
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                            {post.platform}
                          </span>
                          {post.isLocked && <LockedContentIcon />}
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          post.status === 'scheduled' ? 'bg-yellow-500 text-black' : 
                          post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      
                      {post.isLocked && (
                        <LockedContentBadge 
                          message="This content is locked"
                          showUpgradeButton={true}
                          size="sm"
                        />
                      )}
                      
                      <p className="text-gray-300 mb-4 mt-4">{post.content}</p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                        <span>
                          {post.scheduled_at 
                            ? new Date(post.scheduled_at).toLocaleDateString() 
                            : new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (post.isLocked) {
                              alert('This content is locked. Upgrade to edit it.')
                              return
                            }
                            // Handle edit
                            console.log('Edit post', post.id)
                          }}
                          disabled={post.isLocked}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            post.isLocked
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {post.isLocked ? '🔒 Locked' : 'Edit'}
                        </button>
                        <button
                          onClick={() => {
                            if (post.isLocked) {
                              alert('This content is locked. Upgrade to export it.')
                              return
                            }
                            // Handle export
                            console.log('Export post', post.id)
                          }}
                          disabled={post.isLocked}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            post.isLocked
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          {post.isLocked ? '🔒 Locked' : 'Export'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p>Analytics charts will be displayed here</p>
                    <p className="text-sm">Real-time data integration coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Brand Collaborations</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Active Partnerships</h3>
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p>No active collaborations yet</p>
                  <p className="text-sm">Start reaching out to brands to grow your partnerships</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bots' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">AI Bots</h2>
                <p className="text-gray-400">Free AI assistants to help you create better content</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Content Assistant Bot */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1">Content Assistant Bot</h3>
                  <p className="text-xs text-gray-400 mb-2">Real-time content analysis</p>
                  <div className="bg-gray-700/50 rounded-lg p-2 flex-1">
                    {token && (
                      <ContentAssistantBot
                        content="Check out this amazing new product! #innovation #tech"
                        platform="instagram"
                        hashtags="#innovation #tech"
                        token={token}
                      />
                    )}
                  </div>
                </div>

                {/* Scheduling Assistant Bot */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1">Scheduling Assistant Bot</h3>
                  <p className="text-xs text-gray-400 mb-2">AI suggests optimal posting times</p>
                  <div className="bg-gray-700/50 rounded-lg p-2 flex-1">
                    {token && (
                      <SchedulingAssistantBot
                        platform="instagram"
                        token={token}
                        onTimeSelect={(time) => console.log('Selected time:', time)}
                      />
                    )}
                  </div>
                </div>

                {/* Engagement Analyzer Bot */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1">Engagement Analyzer Bot</h3>
                  <p className="text-xs text-gray-400 mb-2">Analyzes your post performance</p>
                  <div className="bg-gray-700/50 rounded-lg p-2 flex-1">
                    {token && (
                      <EngagementAnalyzerBot
                        platform="instagram"
                        token={token}
                      />
                    )}
                  </div>
                </div>

                {/* Trend Scout Bot */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1">Trend Scout Bot</h3>
                  <p className="text-xs text-gray-400 mb-2">Identifies trending topics</p>
                  <div className="bg-gray-700/50 rounded-lg p-2 flex-1">
                    {token && (
                      <TrendScoutBot
                        platform="instagram"
                        token={token}
                      />
                    )}
                  </div>
                </div>

                {/* Content Curation Bot */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1">Content Curation Bot</h3>
                  <p className="text-xs text-gray-400 mb-2">Suggests content ideas</p>
                  <div className="bg-gray-700/50 rounded-lg p-2 flex-1">
                    {token && (
                      <ContentCurationBot
                        platform="instagram"
                        token={token}
                      />
                    )}
                  </div>
                </div>

                {/* Analytics Coach Bot */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1">Analytics Coach Bot</h3>
                  <p className="text-xs text-gray-400 mb-2">Provides growth insights</p>
                  <div className="bg-gray-700/50 rounded-lg p-2 flex-1">
                    {token && (
                      <AnalyticsCoachBot
                        platform="instagram"
                        token={token}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Additional Posts Section */}
          {activeTab === 'overview' && postInfo && (
            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Post Usage</h3>
                    <p className="text-gray-300 text-sm">
                      Monthly limit: <span className="font-semibold">{postInfo.monthlyLimit || 0} posts</span> • 
                      Purchased: <span className="font-semibold text-green-400">{postInfo.purchased} posts</span> • 
                      Used this month: <span className="font-semibold">{postInfo.postsThisMonth}</span>
                    </p>
                    <p className="text-purple-400 text-sm mt-2 font-semibold">
                      Remaining: {postInfo.remaining} posts • Purchased posts roll over forever
                    </p>
                  </div>
                  {postInfo.remaining < 5 && (
                    <div className="bg-yellow-500/20 border border-yellow-500 px-4 py-2 rounded-lg">
                      <p className="text-yellow-400 font-semibold text-sm">Low on posts</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-blue-500/30 pt-4">
                  <h4 className="font-semibold mb-3">Buy Additional Posts</h4>
                  
                  {/* Rollover Logic Explanation */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      How Post Rollover Works
                    </h5>
                    <ul className="text-sm text-gray-300 space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">1.</span>
                        <span><strong className="text-white">Monthly posts</strong> reset each month (from your plan)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">2.</span>
                        <span><strong className="text-green-400">Purchased posts</strong> never expire and roll over forever</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">3.</span>
                        <span><strong className="text-white">Monthly posts are used first</strong>, then purchased posts are used</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span><strong className="text-purple-400">Example:</strong> If you buy 20 posts and use all 15 monthly posts, those 20 purchased posts carry over to next month</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    {postInfo.packages.map((pkg, idx) => (
                      <div 
                        key={idx}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                        onClick={async () => {
                          const token = localStorage.getItem('token')
                          if (!token) return
                          
                          try {
                            const res = await fetch('/api/user/purchase-posts', {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ 
                                quantity: pkg.quantity, 
                                packageIndex: idx 
                              })
                            })
                            const data = await res.json()
                            if (data.url) {
                              window.location.href = data.url
                            }
                          } catch (err) {
                            console.error('Purchase error:', err)
                            alert('Error initiating purchase. Please try again.')
                          }
                        }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400 mb-1">${pkg.price}</div>
                          <div className="text-sm text-gray-300 mb-1">{pkg.quantity} Posts</div>
                          <div className="text-xs text-green-400 mb-2">{pkg.savings} Savings</div>
                          <div className="text-xs text-gray-400">${(pkg.price / pkg.quantity).toFixed(2)}/post</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8 Unique AI Tools - Available to All Paying Subscribers */}
          {subscriptionTier && (
            <div className="space-y-6 mt-8">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-2 border-purple-500 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">Your AI Tools</h2>
                  <span className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    INCLUDED
                  </span>
                </div>
                <p className="text-gray-300 mb-6">Access all AI tools included with your subscription</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setOpenAITool('brand-voice')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
                          <div className="relative w-full h-full border-2 border-blue-400/30 rounded-full flex items-center justify-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-80"></div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">AI Brand Voice Analyzer</h3>
                      <p className="text-sm text-gray-400">Analyzes and maintains your unique brand voice across all content automatically. Ensures consistency in tone, style, and messaging.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('content-gap')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#dashGrad1)" strokeWidth="2" opacity="0.3"/>
                            <circle cx="50" cy="50" r="25" fill="none" stroke="url(#dashGrad2)" strokeWidth="2" opacity="0.5"/>
                            <circle cx="50" cy="50" r="15" fill="url(#dashGrad3)" opacity="0.8"/>
                            <defs>
                              <linearGradient id="dashGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1"/>
                              </linearGradient>
                              <linearGradient id="dashGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="1"/>
                              </linearGradient>
                              <linearGradient id="dashGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Content Gap Analyzer</h3>
                      <p className="text-sm text-gray-400">Identifies content opportunities your competitors are missing. Shows you exactly what to create next for maximum impact.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('engagement-predictor')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 100 60">
                            <path d="M 10 50 L 20 45 L 30 40 L 40 35 L 50 30 L 60 25 L 70 20 L 80 15 L 90 20" 
                                  stroke="url(#predGrad1)" strokeWidth="3" fill="none" opacity="0.8"/>
                            <path d="M 10 50 L 20 48 L 30 42 L 40 38 L 50 28 L 60 22 L 70 18 L 80 18 L 90 22" 
                                  stroke="url(#predGrad2)" strokeWidth="2" fill="none" opacity="0.6"/>
                            <defs>
                              <linearGradient id="predGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1"/>
                              </linearGradient>
                              <linearGradient id="predGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="1"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Engagement Predictor</h3>
                      <p className="text-sm text-gray-400">AI predicts how your posts will perform before you publish them. Get engagement forecasts and optimization suggestions.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('viral-detector')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 border-2 border-purple-400/40 rounded-full"></div>
                            <div className="absolute w-12 h-12 border-2 border-indigo-400/40 rounded-full animate-ping"></div>
                            <div className="absolute w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Viral Moment Detector</h3>
                      <p className="text-sm text-gray-400">Identifies trending topics and optimal posting moments in real-time. Never miss a viral opportunity.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('hashtag-optimizer')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <div className="text-4xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">#</div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Smart Hashtag Optimizer</h3>
                      <p className="text-sm text-gray-400">Context-aware hashtag suggestions that maximize reach and engagement. Uses AI to identify optimal hashtags for your content.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('reformatter')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20 flex gap-1 items-end">
                          <div className="w-4 h-12 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t opacity-80"></div>
                          <div className="w-4 h-16 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t opacity-90"></div>
                          <div className="w-4 h-8 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t opacity-70"></div>
                          <div className="w-4 h-14 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t opacity-85"></div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Multi-Platform Reformatter</h3>
                      <p className="text-sm text-gray-400">Automatically adapts one post for all platforms with optimal formatting. Write once, publish across all platforms.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('collaboration-matchmaker')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <div className="relative">
                            <div className="w-12 h-12 border-2 border-purple-400/40 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 border-2 border-indigo-400/40 rounded-full transform rotate-45"></div>
                            <div className="absolute top-3 left-3 w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Collaboration Matchmaker</h3>
                      <p className="text-sm text-gray-400">AI-powered brand-creator matching for strategic partnerships. Find brands that align with your audience and values.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpenAITool('sentiment')}
                    className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all relative overflow-hidden text-left cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative mb-4">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <path d="M 30 50 Q 50 30, 70 50 Q 50 70, 30 50" fill="url(#sentGrad)" opacity="0.3"/>
                            <path d="M 35 50 Q 50 35, 65 50 Q 50 65, 35 50" fill="url(#sentGrad2)" opacity="0.5"/>
                            <path d="M 40 50 Q 50 40, 60 50 Q 50 60, 40 50" fill="url(#sentGrad3)" opacity="0.7"/>
                            <defs>
                              <linearGradient id="sentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1"/>
                              </linearGradient>
                              <linearGradient id="sentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="1"/>
                              </linearGradient>
                              <linearGradient id="sentGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Sentiment Analysis Engine</h3>
                      <p className="text-sm text-gray-400">Real-time audience mood tracking to guide your content strategy. Understand how your audience feels and respond accordingly.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Tool Panels - Available to All Paying Subscribers */}
          {subscriptionTier && (
            <>
              {/* Brand Voice and Hashtag Optimizer tools will be added here when AIToolPanel is created */}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
