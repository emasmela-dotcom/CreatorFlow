'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Mail, Calendar, DollarSign, Star, CheckCircle, Clock, X } from 'lucide-react'

export default function CollaborationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewCollaboration, setShowNewCollaboration] = useState(false)

  const collaborations = [
    {
      id: 1,
      brand: 'TechStart Inc.',
      type: 'Sponsored Post',
      platform: 'Instagram',
      status: 'active',
      value: 2500,
      deadline: '2024-02-15',
      description: 'Promote our new AI-powered productivity app',
      requirements: '1 Instagram post, 3 stories, mention in bio for 1 week',
      deliverables: ['Post content', 'Stories', 'Bio update'],
      completed: 1,
      total: 3
    },
    {
      id: 2,
      brand: 'Fashion Forward',
      type: 'Product Review',
      platform: 'YouTube',
      status: 'pending',
      value: 1500,
      deadline: '2024-02-20',
      description: 'Review our new sustainable clothing line',
      requirements: '1 YouTube video (5-8 minutes), 2 Instagram posts',
      deliverables: ['Video content', 'Instagram posts'],
      completed: 0,
      total: 2
    },
    {
      id: 3,
      brand: 'HealthPlus',
      type: 'Brand Ambassador',
      platform: 'All Platforms',
      status: 'completed',
      value: 5000,
      deadline: '2024-01-30',
      description: '3-month brand ambassador program',
      requirements: 'Monthly posts across all platforms, attend 2 events',
      deliverables: ['Monthly content', 'Event attendance'],
      completed: 3,
      total: 3
    }
  ]

  const statusColors = {
    active: 'bg-green-500',
    pending: 'bg-yellow-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500'
  }

  const statusLabels = {
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }

  const filteredCollaborations = collaborations.filter(collab => {
    const matchesSearch = collab.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collab.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || collab.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Brand Collaborations</h1>
            <div className="text-sm text-gray-400">
              {filteredCollaborations.length} collaboration{filteredCollaborations.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search collaborations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setShowNewCollaboration(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Collaboration
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold">$9,000</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-sm text-green-400 mt-2">+25% this month</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Deals</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm text-gray-400 mt-2">In progress</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-sm text-gray-400 mt-2">This month</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Deal Size</p>
                <p className="text-2xl font-bold">$3,000</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Per collaboration</p>
          </div>
        </div>

        {/* Collaborations List */}
        <div className="space-y-4">
          {filteredCollaborations.map((collab) => (
            <div key={collab.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{collab.brand[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{collab.brand}</h3>
                    <p className="text-gray-400">{collab.type} • {collab.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[collab.status as keyof typeof statusColors]} text-white`}>
                    {statusLabels[collab.status as keyof typeof statusLabels]}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">${collab.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Total value</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{collab.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Requirements</p>
                  <p className="text-sm">{collab.requirements}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Deadline</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{new Date(collab.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(collab.completed / collab.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{collab.completed}/{collab.total}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {collab.deliverables.map((deliverable, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-sm rounded-full">
                      {deliverable}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCollaborations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No collaborations found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setShowNewCollaboration(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Create Your First Collaboration
            </button>
          </div>
        )}
      </div>

      {/* New Collaboration Modal */}
      {showNewCollaboration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">New Collaboration</h2>
              <button
                onClick={() => setShowNewCollaboration(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Collaboration Type</label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Sponsored Post</option>
                    <option>Product Review</option>
                    <option>Brand Ambassador</option>
                    <option>Event Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe the collaboration details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Instagram</option>
                    <option>Twitter</option>
                    <option>LinkedIn</option>
                    <option>YouTube</option>
                    <option>All Platforms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Value ($)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewCollaboration(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                  Create Collaboration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
