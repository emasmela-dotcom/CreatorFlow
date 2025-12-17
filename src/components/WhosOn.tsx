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
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Who's On</h3>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
            {activeUsers.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleVisibility}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title={isVisible ? 'Hide yourself' : 'Show yourself'}
          >
            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={loadActiveUsers}
            disabled={loading}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeUsers.length === 0 ? (
        <div className="text-center text-gray-400 py-4">
          <Users className="w-8 h-8 mx-auto mb-1 text-gray-600" />
          <p className="text-xs">No one online</p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {activeUsers.map((user) => {
            const displayName = user.fullName || user.email?.split('@')[0] || 'Creator'
            return (
              <UserTooltip key={user.userId} userId={user.userId} token={token}>
                <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{displayName}</div>
                    <div className="text-xs text-gray-400">{getTimeAgo(user.lastActiveAt)}</div>
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
