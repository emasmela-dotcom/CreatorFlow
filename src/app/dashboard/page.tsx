'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Users, TrendingUp, Plus, Settings, Bell, Search, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, Brain } from 'lucide-react'
import TrialStatusBanner from './components/TrialStatusBanner'

export default function Dashboard() {
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
  const [posts, setPosts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      content: 'Photography showcase #photography #nature',
      scheduledAt: '2024-01-15T18:00:00Z',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'New course launch announcement',
      scheduledAt: '2024-01-16T12:00:00Z',
      status: 'draft',
      engagement: { likes: 0, comments: 0, shares: 0 }
    }
  ])

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
                <button className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
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
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            post.status === 'scheduled' ? 'bg-yellow-400' : 
                            post.status === 'published' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium">{post.platform}</p>
                            <p className="text-sm text-gray-400 truncate max-w-xs">{post.content}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {new Date(post.scheduledAt).toLocaleDateString()}
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
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Post
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        {post.platform}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        post.status === 'scheduled' ? 'bg-yellow-500 text-black' : 
                        post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{new Date(post.scheduledAt).toLocaleDateString()}</span>
                      <div className="flex gap-4">
                        <span>{post.engagement.likes} likes</span>
                        <span>{post.engagement.comments} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

          {/* 8 Unique AI Tools - Only for Agency Plan */}
          {subscriptionTier === 'agency' && (
            <div className="space-y-6 mt-8">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-2 border-purple-500 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">Your Exclusive AI Tools</h2>
                  <span className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    AGENCY EXCLUSIVE
                  </span>
                </div>
                <p className="text-gray-300 mb-6">Unlock the full power of these 8 unique AI tools available only to Agency plan members</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">01</div>
                        <h3 className="text-lg font-semibold text-white">AI Brand Voice Analyzer</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">Analyzes and maintains your unique brand voice across all content automatically. Ensures consistency in tone, style, and messaging.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">02</div>
                        <h3 className="text-lg font-semibold text-white">Content Gap Analyzer</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">Identifies content opportunities your competitors are missing. Shows you exactly what to create next for maximum impact.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">03</div>
                        <h3 className="text-lg font-semibold text-white">Engagement Predictor</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">AI predicts how your posts will perform before you publish them. Get engagement forecasts and optimization suggestions.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">04</div>
                        <h3 className="text-lg font-semibold text-white">Viral Moment Detector</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">Identifies trending topics and optimal posting moments in real-time. Never miss a viral opportunity.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">05</div>
                        <h3 className="text-lg font-semibold text-white">Smart Hashtag Optimizer</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">Context-aware hashtag suggestions that maximize reach and engagement. Uses AI to identify optimal hashtags for your content.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">06</div>
                        <h3 className="text-lg font-semibold text-white">Multi-Platform Reformatter</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">Automatically adapts one post for all platforms with optimal formatting. Write once, publish across all platforms.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">07</div>
                        <h3 className="text-lg font-semibold text-white">Collaboration Matchmaker</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">AI-powered brand-creator matching for strategic partnerships. Find brands that align with your audience and values.</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">08</div>
                        <h3 className="text-lg font-semibold text-white">Sentiment Analysis Engine</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-700 mb-3"></div>
                    <p className="text-sm text-gray-400">Real-time audience mood tracking to guide your content strategy. Understand how your audience feels and respond accordingly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
