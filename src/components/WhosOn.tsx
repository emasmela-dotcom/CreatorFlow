'use client'

import { useState, useEffect } from 'react'
import { Users, Eye, EyeOff, RefreshCw } from 'lucide-react'
import UserTooltip from './UserTooltip'

interface WhosOnProps {
  token: string
}

interface ActiveUser {
  userId: string
  email: string
  fullName?: string
  avatarUrl?: string
  lastActiveAt: string
  status: string
  subscriptionTier: string
}

export default function WhosOn({ token }: WhosOnProps) {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadActiveUsers()
    const interval = setInterval(loadActiveUsers, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadActiveUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/active-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setActiveUsers(data.activeUsers || [])
      }
    } catch (error) {
      console.error('Error loading active users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async () => {
    const newVisibility = !isVisible
    try {
      const res = await fetch('/api/active-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: newVisibility })
      })
      const data = await res.json()
      if (data.success) {
        setIsVisible(newVisibility)
      }
    } catch (error) {
      console.error('Error updating visibility:', error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Who's On</h3>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm font-medium">
            {activeUsers.length} online
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVisibility}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors flex items-center gap-2"
            title={isVisible ? 'Hide yourself from Who\'s On' : 'Show yourself on Who\'s On'}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isVisible ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={loadActiveUsers}
            disabled={loading}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeUsers.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-600" />
          <p>No active users right now</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activeUsers.map((user) => {
            const displayName = user.fullName || user.email?.split('@')[0] || 'Creator'
            return (
              <UserTooltip key={user.userId} userId={user.userId} token={token}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{displayName}</div>
                    <div className="text-xs text-gray-400">{getTimeAgo(user.lastActiveAt)}</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded capitalize">
                    {user.subscriptionTier}
                  </div>
                </div>
              </UserTooltip>
            )
          })}
        </div>
      )}
    </div>
  )
}
