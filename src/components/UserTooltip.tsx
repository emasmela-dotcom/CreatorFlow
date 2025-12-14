'use client'

import { useState, useEffect } from 'react'
import { User, Sparkles } from 'lucide-react'

interface UserTooltipProps {
  userId: string
  children: React.ReactNode
  token: string
}

interface UserProfile {
  userId: string
  email: string
  fullName?: string
  avatarUrl?: string
  contentTypes: string[]
  subscriptionTier: string
}

export default function UserTooltip({ userId, children, token }: UserTooltipProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showTooltip && !profile && !loading) {
      loadProfile()
    }
  }, [showTooltip])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/profile/tooltip?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayName = profile?.fullName || profile?.email?.split('@')[0] || 'Creator'

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 border-2 border-purple-500 rounded-lg shadow-xl p-4">
          {loading ? (
            <div className="text-center text-gray-400 py-4">Loading...</div>
          ) : profile ? (
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{displayName}</div>
                  <div className="text-xs text-gray-400 capitalize">{profile.subscriptionTier} Plan</div>
                </div>
              </div>

              {/* Content Types */}
              {profile.contentTypes && profile.contentTypes.length > 0 ? (
                <div>
                  <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Creates:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.contentTypes.map((type, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">
                  No content types set
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">Profile not found</div>
          )}
        </div>
      )}
    </div>
  )
}
