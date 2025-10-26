'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Users, TrendingUp, Plus, Settings, Bell, Search } from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [posts, setPosts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      content: 'Check out this amazing sunset! 🌅 #photography #nature',
      scheduledAt: '2024-01-15T18:00:00Z',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'Just launched my new course! Excited to share this journey with you all 🚀',
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg">
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
                    <BarChart3 className="w-8 h-8 text-pink-400" />
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
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2">
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
        </main>
      </div>
    </div>
  )
}
