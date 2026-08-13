'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-optimist-500 to-pink-500' },
  { id: 'facebook', name: 'Facebook', color: 'bg-gradient-to-r from-blue-600 to-blue-800' },
  { id: 'threads', name: 'Threads', color: 'bg-gradient-to-r from-gray-700 to-black' },
  { id: 'twitter', name: 'Twitter/X', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-gradient-to-r from-blue-600 to-blue-800' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-gradient-to-r from-black to-gray-800' },
  { id: 'youtube', name: 'YouTube', color: 'bg-gradient-to-r from-red-500 to-red-700' },
  { id: 'twitch', name: 'Twitch', color: 'bg-gradient-to-r from-purple-600 to-purple-800' },
  { id: 'pinterest', name: 'Pinterest', color: 'bg-gradient-to-r from-red-600 to-rose-700' },
  { id: 'snapchat', name: 'Snapchat', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  { id: 'reddit', name: 'Reddit', color: 'bg-gradient-to-r from-orange-500 to-red-600' },
  { id: 'bluesky', name: 'Bluesky', color: 'bg-gradient-to-r from-sky-500 to-blue-600' },
  { id: 'mastodon', name: 'Mastodon', color: 'bg-gradient-to-r from-optimist-600 to-optimist-700' },
  { id: 'discord', name: 'Discord', color: 'bg-gradient-to-r from-optimist-500 to-optimist-700' },
  { id: 'telegram', name: 'Telegram', color: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  { id: 'tumblr', name: 'Tumblr', color: 'bg-gradient-to-r from-blue-900 to-slate-800' },
  { id: 'wordpress', name: 'WordPress', color: 'bg-gradient-to-r from-slate-600 to-gray-700' }
]

const PLATFORM_USER_MESSAGE: Record<string, string> = {
  twitter: "Connect your Twitter/X account to post and schedule directly from CreatorFlow. If not connected, create your post here and use Copy to paste into Twitter.",
  linkedin: "Connect your LinkedIn account to post and schedule directly from CreatorFlow. If not connected, create your post here and use Copy to paste into LinkedIn.",
  instagram: "Direct posting works when your Instagram account is Business/Creator, connected to a Facebook Page, and app scopes are approved. Otherwise use Copy/paste fallback.",
  facebook: "Connect Facebook Page access to publish directly where supported. If not connected, use Copy and paste into Facebook.",
  threads: "Connect Threads to publish directly where supported. If not connected, use Copy and paste into Threads.",
  tiktok: "Connect TikTok to publish videos directly from CreatorFlow. TikTok direct publishing requires approved API access and media URLs.",
  youtube: "YouTube direct posting works when your Google OAuth app is configured and you include a public video URL. If not, use copy/export fallback.",
  twitch: "Connect Twitch to link your channel. Direct features need Twitch app keys and approval. If not connected, use Copy/export fallback.",
  pinterest: "Connect Pinterest for publishing where supported. If not connected, use Copy and paste into Pinterest.",
  snapchat: "Snapchat direct posting works when your Snapchat publish endpoint is configured and you include media. If not, use copy/export fallback.",
  reddit: "Connect Reddit for account-level access. Publishing may still require subreddit selection per post.",
  bluesky: "Bluesky direct posting is available after you connect with your Bluesky handle and app password.",
  mastodon: "Mastodon direct posting is available after OAuth connection and valid instance configuration.",
  discord: "Discord direct posting uses a bot token and target channel. Connect your Discord app, then set default channel ID.",
  telegram: "Telegram direct posting uses your bot token and a target chat ID. Connect by saving your chat ID in dashboard.",
  tumblr: "Tumblr direct posting works when OAuth is connected and your primary blog is available.",
  wordpress: "WordPress direct posting works for WordPress.com OAuth or self-hosted site credentials."
}

const DIRECT_POST_STATUS: Record<string, 'direct' | 'fallback'> = {
  instagram: 'direct',
  twitter: 'direct',
  linkedin: 'direct',
  tiktok: 'direct',
  facebook: 'direct',
  threads: 'direct',
  pinterest: 'direct',
  reddit: 'direct',
  youtube: 'direct',
  twitch: 'direct',
  snapchat: 'direct',
  bluesky: 'direct',
  mastodon: 'direct',
  discord: 'direct',
  telegram: 'direct',
  tumblr: 'direct',
  wordpress: 'direct'
}

export default function PlatformConnections({ token }: PlatformConnectionsProps) {
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [manualLoading, setManualLoading] = useState<string | null>(null)
  const [blueskyIdentifier, setBlueskyIdentifier] = useState('')
  const [blueskyAppPassword, setBlueskyAppPassword] = useState('')
  const [blueskyMessage, setBlueskyMessage] = useState<{ type: 'error' | 'ok'; text: string } | null>(null)
  const [telegramChatId, setTelegramChatId] = useState('')
  const blueskyCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const notConfigured = searchParams.get('error') === 'platform_not_configured'
    const platform = searchParams.get('platform') || ''
    const unauth = searchParams.get('error') === 'connect_unauthorized'
    if (notConfigured && platform && PLATFORM_USER_MESSAGE[platform]) {
      setError(PLATFORM_USER_MESSAGE[platform])
    } else if (unauth) {
      setError('Please use the Connect button below to connect. Sign in first if needed.')
    }
  }, [searchParams])

  useEffect(() => {
    loadConnections()
  }, [token])

  const loadConnections = async (opts?: { quiet?: boolean }) => {
    try {
      if (!opts?.quiet) setLoading(true)
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
      if (!opts?.quiet) setLoading(false)
    }
  }

  const handleConnect = (platform: string) => {
    if (!token) {
      setError('Please sign in to connect an account')
      return
    }
    setConnecting(platform)
    setError('')
    // If redirect doesn't happen (e.g. blocked or failed), clear "Connecting..." after 5s
    setTimeout(() => setConnecting(null), 5000)
    window.location.href = `/api/auth/connect/${platform}?token=${encodeURIComponent(token)}`
  }

  const keepBlueskyInView = () => {
    requestAnimationFrame(() => {
      blueskyCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const handleConnectBluesky = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const authToken =
      (typeof window !== 'undefined' ? localStorage.getItem('token') : null) || token
    if (!authToken) {
      setBlueskyMessage({
        type: 'error',
        text: 'Please sign in again, then connect Bluesky.'
      })
      keepBlueskyInView()
      return
    }
    if (!blueskyIdentifier.trim() || !blueskyAppPassword.trim()) {
      setBlueskyMessage({ type: 'error', text: 'Enter your Bluesky handle and app password to connect.' })
      keepBlueskyInView()
      return
    }
    setError('')
    setBlueskyMessage(null)
    setManualLoading('bluesky')
    try {
      const response = await fetch('/api/auth/connect/bluesky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          identifier: blueskyIdentifier.trim(),
          appPassword: blueskyAppPassword.trim()
        })
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        throw new Error('Your sign-in expired. Sign out, sign in again, then Connect Bluesky.')
      }
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to connect Bluesky')
      }
      setBlueskyAppPassword('')
      setBlueskyMessage({
        type: 'ok',
        text: `Connected as @${data?.handle || blueskyIdentifier.trim()}`
      })
      await loadConnections({ quiet: true })
      keepBlueskyInView()
    } catch (err: any) {
      setBlueskyMessage({ type: 'error', text: err.message || 'Failed to connect Bluesky' })
      keepBlueskyInView()
    } finally {
      setManualLoading(null)
    }
  }

  const handleConnectTelegram = async () => {
    if (!token) {
      setError('Please sign in to connect an account')
      return
    }
    if (!telegramChatId.trim()) {
      setError('Enter your Telegram chat ID to connect.')
      return
    }
    setError('')
    setManualLoading('telegram')
    try {
      const response = await fetch('/api/auth/connect/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ chatId: telegramChatId.trim() })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to connect Telegram')
      }
      await loadConnections()
    } catch (err: any) {
      setError(err.message || 'Failed to connect Telegram')
    } finally {
      setManualLoading(null)
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
        <Loader2 className="w-6 h-6 animate-spin text-optimist-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Platform Connections</h2>
        <p className="text-gray-300">
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
              ref={platform.id === 'bluesky' ? blueskyCardRef : undefined}
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
                  <XCircle className="w-6 h-6 text-gray-300" />
                )}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                {platform.name}
              </h3>
              <p className={`text-xs mb-2 ${DIRECT_POST_STATUS[platform.id] === 'direct' ? 'text-green-400' : 'text-amber-400'}`}>
                {DIRECT_POST_STATUS[platform.id] === 'direct' ? 'Direct posting available' : 'Copy/export fallback'}
              </p>

              {connected && connection ? (
                <div className="space-y-2 mb-4">
                  {connection.platform_username && (
                    <p className="text-sm text-gray-300">
                      @{connection.platform_username}
                    </p>
                  )}
                  {connection.platform_account_name && (
                    <p className="text-sm text-gray-300">
                      {connection.platform_account_name}
                    </p>
                  )}
                  {connection.last_used_at && (
                    <p className="text-xs text-gray-300">
                      Last used: {new Date(connection.last_used_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-300 mb-4">
                  Not connected
                </p>
              )}

              {connected ? (
                <button
                  type="button"
                  onClick={() => handleDisconnect(platform.id)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Disconnect
                </button>
              ) : (
                <>
                  {platform.id === 'bluesky' && (
                    <form
                      className="space-y-2 mb-3"
                      onSubmit={handleConnectBluesky}
                    >
                      <input
                        type="text"
                        value={blueskyIdentifier}
                        onChange={(e) => setBlueskyIdentifier(e.target.value)}
                        placeholder="Bluesky handle (you.bsky.social)"
                        autoComplete="username"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white"
                      />
                      <input
                        type="password"
                        value={blueskyAppPassword}
                        onChange={(e) => setBlueskyAppPassword(e.target.value)}
                        placeholder="Bluesky app password"
                        autoComplete="current-password"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white"
                      />
                      {blueskyMessage && (
                        <p
                          className={`text-xs ${
                            blueskyMessage.type === 'ok' ? 'text-green-300' : 'text-red-300'
                          }`}
                        >
                          {blueskyMessage.text}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={manualLoading === 'bluesky' || !token}
                        className="w-full px-4 py-2 bg-optimist-600 hover:bg-optimist-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {manualLoading === 'bluesky' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Link2 className="w-4 h-4" />
                            Connect Bluesky
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {platform.id === 'telegram' && (
                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="Telegram chat ID"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={handleConnectTelegram}
                        disabled={manualLoading === 'telegram' || !token}
                        className="w-full px-4 py-2 bg-optimist-600 hover:bg-optimist-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {manualLoading === 'telegram' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Link2 className="w-4 h-4" />
                            Connect Telegram
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {platform.id !== 'bluesky' && platform.id !== 'telegram' && (
                    <button
                      type="button"
                      onClick={() => handleConnect(platform.id)}
                      disabled={connecting === platform.id || !token}
                      className="w-full px-4 py-2 bg-optimist-600 hover:bg-optimist-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      title={!token ? 'Sign in to connect' : undefined}
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
                </>
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
          <li>• Direct-post platforms publish from CreatorFlow once connected</li>
          <li>• Fallback platforms still work via copy/export in Create Post</li>
        </ul>
      </div>

      <div className="bg-optimist-900/20 border border-optimist-500 rounded-lg p-4">
        <h3 className="text-optimist-300 font-semibold mb-2">Instagram Direct Post Requirements</h3>
        <ul className="text-sm text-optimist-200 space-y-1">
          <li>• Instagram account must be Business or Creator (not Personal)</li>
          <li>• Instagram must be connected to a Facebook Page</li>
          <li>• Meta app permissions must be approved (including content publish scope)</li>
          <li>• Post must include at least one public image or video URL</li>
        </ul>
        <p className="text-xs text-optimist-200 mt-3">
          If all requirements are met, CreatorFlow publishes directly to Instagram. If not, you can still use copy/export fallback.
        </p>
      </div>

      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
        <h3 className="text-red-300 font-semibold mb-2">YouTube Direct Post Requirements</h3>
        <ul className="text-sm text-red-200 space-y-1">
          <li>• YouTube account must be connected in Platform Connections</li>
          <li>• Google OAuth app must include YouTube upload scope and valid client keys</li>
          <li>• Post must include at least one public video URL CreatorFlow can download</li>
        </ul>
        <p className="text-xs text-red-200 mt-3">
          If all requirements are met, CreatorFlow uploads directly to YouTube. If not, use copy/export fallback.
        </p>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
        <h3 className="text-yellow-300 font-semibold mb-2">Snapchat Direct Post Requirements</h3>
        <ul className="text-sm text-yellow-200 space-y-1">
          <li>• Snapchat account must be connected in Platform Connections</li>
          <li>• Snapchat publish endpoint must be configured (SNAPCHAT_PUBLISH_ENDPOINT)</li>
          <li>• Post must include at least one uploaded image or video</li>
        </ul>
        <p className="text-xs text-yellow-200 mt-3">
          If all requirements are met, CreatorFlow publishes directly to Snapchat. If not, use copy/export fallback.
        </p>
      </div>

      <div className="bg-sky-900/20 border border-sky-500 rounded-lg p-4">
        <h3 className="text-sky-300 font-semibold mb-2">Bluesky Direct Post Requirements</h3>
        <ul className="text-sm text-sky-200 space-y-1">
          <li>• Enter your Bluesky handle and app password in this page</li>
          <li>• Bluesky app password must be active in account settings</li>
          <li>• Include text or media in your post</li>
        </ul>
      </div>

      <div className="bg-optimist-900/20 border border-optimist-500 rounded-lg p-4">
        <h3 className="text-optimist-300 font-semibold mb-2">Mastodon Direct Post Requirements</h3>
        <ul className="text-sm text-optimist-200 space-y-1">
          <li>• Mastodon app credentials must be configured</li>
          <li>• MASTODON_INSTANCE_URL must point to your instance</li>
          <li>• OAuth scopes must allow write:statuses</li>
        </ul>
      </div>

      <div className="bg-optimist-900/20 border border-optimist-500 rounded-lg p-4">
        <h3 className="text-optimist-300 font-semibold mb-2">Discord Direct Post Requirements</h3>
        <ul className="text-sm text-optimist-200 space-y-1">
          <li>• Discord bot token must be configured</li>
          <li>• Bot must have Send Messages permission in target channel</li>
          <li>• Set DISCORD_DEFAULT_CHANNEL_ID in environment</li>
        </ul>
      </div>

      <div className="bg-cyan-900/20 border border-cyan-500 rounded-lg p-4">
        <h3 className="text-cyan-300 font-semibold mb-2">Telegram Direct Post Requirements</h3>
        <ul className="text-sm text-cyan-200 space-y-1">
          <li>• TELEGRAM_BOT_TOKEN must be configured</li>
          <li>• Enter your Telegram chat ID in this page</li>
          <li>• Add the bot to your channel/group and grant post permission</li>
        </ul>
      </div>

      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-300 font-semibold mb-2">Tumblr Direct Post Requirements</h3>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Tumblr OAuth app credentials must be configured</li>
          <li>• Connect Tumblr and ensure a primary blog is available</li>
          <li>• Content must follow Tumblr API and blog posting rules</li>
        </ul>
      </div>

      <div className="bg-slate-900/20 border border-slate-500 rounded-lg p-4">
        <h3 className="text-slate-300 font-semibold mb-2">WordPress Direct Post Requirements</h3>
        <ul className="text-sm text-slate-200 space-y-1">
          <li>• WordPress.com OAuth credentials or self-hosted credentials must be configured</li>
          <li>• Connect WordPress account and ensure site access permissions</li>
          <li>• For self-hosted WordPress, configure app password and site URL env vars</li>
        </ul>
      </div>
    </div>
  )
}

