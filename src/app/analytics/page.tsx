'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Calendar, Filter } from 'lucide-react'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const periods = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ]

  const platforms = [
    { id: 'all', label: 'All Platforms' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'youtube', label: 'YouTube' }
  ]

  const metrics = {
    totalFollowers: 125000,
    engagementRate: 4.2,
    totalReach: 45000,
    totalImpressions: 180000,
    totalLikes: 7500,
    totalComments: 1200,
    totalShares: 800,
    avgEngagement: 3.8
  }

  const topPosts = [
    {
      id: 1,
      platform: 'Instagram',
      content: 'Sunset photography from my latest trip 🌅',
      date: '2024-01-15',
      likes: 2400,
      comments: 180,
      shares: 45,
      reach: 12000,
      engagement: 4.2
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'Just launched my new course! Excited to share this journey 🚀',
      date: '2024-01-14',
      likes: 1800,
      comments: 95,
      shares: 120,
      reach: 8500,
      engagement: 5.1
    },
    {
      id: 3,
      platform: 'LinkedIn',
      content: '5 lessons I learned from building my first SaaS product',
      date: '2024-01-13',
      likes: 3200,
      comments: 45,
      shares: 200,
      reach: 15000,
      engagement: 3.8
    }
  ]

  const platformStats = [
    { platform: 'Instagram', followers: 45000, engagement: 4.5, posts: 12 },
    { platform: 'Twitter', followers: 35000, engagement: 3.8, posts: 8 },
    { platform: 'LinkedIn', followers: 25000, engagement: 4.1, posts: 6 },
    { platform: 'YouTube', followers: 20000, engagement: 2.9, posts: 3 }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Last updated: 2 minutes ago</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>{platform.label}</option>
              ))}
            </select>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Followers</p>
                <p className="text-3xl font-bold">{metrics.totalFollowers.toLocaleString()}</p>
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
                <p className="text-3xl font-bold">{metrics.engagementRate}%</p>
              </div>
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
            <div className="flex items-center mt-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.8% this month
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Reach</p>
                <p className="text-3xl font-bold">{metrics.totalReach.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
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
                <p className="text-3xl font-bold">{metrics.totalImpressions.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex items-center mt-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +25% this month
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Chart */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p>Engagement chart will be displayed here</p>
                <p className="text-sm">Real-time data integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
            <div className="space-y-4">
              {platformStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{stat.platform[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{stat.platform}</p>
                      <p className="text-sm text-gray-400">{stat.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{stat.engagement}%</p>
                    <p className="text-sm text-gray-400">{stat.posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                      {post.platform}
                    </span>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <p className="text-gray-300 mb-2">{post.content}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="w-4 h-4" />
                      {post.shares}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.reach.toLocaleString()} reach
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-400">{post.engagement}%</p>
                  <p className="text-sm text-gray-400">engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="font-semibold mb-4">Likes</h4>
            <div className="text-3xl font-bold text-pink-400 mb-2">{metrics.totalLikes.toLocaleString()}</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% from last month
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="font-semibold mb-4">Comments</h4>
            <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.totalComments.toLocaleString()}</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from last month
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="font-semibold mb-4">Shares</h4>
            <div className="text-3xl font-bold text-green-400 mb-2">{metrics.totalShares.toLocaleString()}</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +22% from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
