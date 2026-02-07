'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Link2, ExternalLink, Loader2 } from 'lucide-react'

interface PlatformConnection {
  platform: string
  platform_username: string | null
  platform_account_name: string | null
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

interface PlatformConnectionsProps {
  token: string
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'twitter', name: 'Twitter/X', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-gradient-to-r from-blue-600 to-blue-800' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-gradient-to-r from-black to-gray-800' },
  { id: 'youtube', name: 'YouTube', color: 'bg-gradient-to-r from-red-500 to-red-700' }
]

const PLATFORM_USER_MESSAGE: Record<string, string> = {
  twitter: "Direct posting to Twitter/X isn't available yet. You can still create and schedule posts here—use the calendar to plan and copy to Twitter when you're ready. We'll enable one-click posting soon.",
  linkedin: "Direct posting to LinkedIn isn't available yet. You can still create and schedule posts here—use the calendar to plan and copy to LinkedIn when you're ready. We'll enable one-click posting soon.",
  instagram: "Direct posting to Instagram isn't available yet. You can still create and schedule posts here—use the calendar to plan and copy to Instagram when you're ready. We'll enable one-click posting soon.",
  tiktok: "Direct posting to TikTok isn't available yet. You can still create and schedule posts here. We'll enable one-click posting when possible.",
  youtube: "Direct posting to YouTube isn't available yet. You can still plan content here. We'll enable one-click posting when possible."
}

export default function PlatformConnections({ token }: PlatformConnectionsProps) {
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const notConfigured = searchParams.get('error') === 'platform_not_configured'
    const platform = searchParams.get('platform') || ''
    if (notConfigured && platform && PLATFORM_USER_MESSAGE[platform]) {
      setError(PLATFORM_USER_MESSAGE[platform])
    }
  }, [searchParams])

  useEffect(() => {
    loadConnections()
  }, [token])

  const loadConnections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/platforms/connections', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setConnections(data.connections || [])
      }
    } catch (err) {
      console.error('Failed to load connections:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    try {
      setConnecting(platform)
      setError('')
      
      // Redirect to OAuth connection
      window.location.href = `/api/auth/connect/${platform}`
    } catch (err: any) {
      setError(err.message || 'Failed to connect platform')
      setConnecting(null)
    }
  }

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/platforms/connections?platform=${platform}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        await loadConnections()
      } else {
        setError(data.error || 'Failed to disconnect')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect platform')
    }
  }

  const isConnected = (platform: string) => {
    return connections.some(c => c.platform === platform && c.is_active)
  }

  const getConnection = (platform: string) => {
    return connections.find(c => c.platform === platform && c.is_active)
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
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Platform Connections</h2>
        <p className="text-gray-400">
          Connect your social media accounts to post directly from CreatorFlow
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => {
          const connected = isConnected(platform.id)
          const connection = getConnection(platform.id)

          return (
            <div
              key={platform.id}
              className={`bg-gray-800 border-2 rounded-lg p-6 ${
                connected ? 'border-green-500' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {platform.name.charAt(0)}
                  </span>
                </div>
                {connected ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-500" />
                )}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                {platform.name}
              </h3>

              {connected && connection ? (
                <div className="space-y-2 mb-4">
                  {connection.platform_username && (
                    <p className="text-sm text-gray-300">
                      @{connection.platform_username}
                    </p>
                  )}
                  {connection.platform_account_name && (
                    <p className="text-sm text-gray-400">
                      {connection.platform_account_name}
                    </p>
                  )}
                  {connection.last_used_at && (
                    <p className="text-xs text-gray-500">
                      Last used: {new Date(connection.last_used_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-4">
                  Not connected
                </p>
              )}

              {connected ? (
                <button
                  onClick={() => handleDisconnect(platform.id)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  disabled={connecting === platform.id}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {connecting === platform.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-300 font-semibold mb-2">How It Works</h3>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Click "Connect" to authorize CreatorFlow</li>
          <li>• You'll be redirected to the platform to log in</li>
          <li>• Grant permissions to allow CreatorFlow to post</li>
          <li>• Once connected, you can post directly from CreatorFlow</li>
        </ul>
      </div>
    </div>
  )
}

