'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { ArrowLeft, Image, Video, Link, Calendar, Hash, Instagram, Twitter, Linkedin, Youtube, Save, Send, AlertCircle, Sparkles, FileText, Cloud, AtSign, MessageSquare, BookOpen, Newspaper } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import ContentAssistantBot from '@/components/bots/ContentAssistantBot'
import WriteThisForMe from '@/components/WriteThisForMe'
import SchedulingAssistantBot from '@/components/bots/SchedulingAssistantBot'
import { FREE_BUILD_PHASE } from '@/lib/aiUsagePolicy'

function CreatePostInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [token, setToken] = useState('')
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const analysisRef = useRef<HTMLDivElement | null>(null)
  const [postInfo, setPostInfo] = useState<{
    monthlyLimit: number | null
    purchased: number
    postsThisMonth: number
    totalAvailable: number
    remaining: number
  } | null>(null)

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-optimist-500 to-optimist-500' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
    { id: 'facebook', name: 'Facebook', icon: FileText, color: 'bg-blue-700' },
    { id: 'pinterest', name: 'Pinterest', icon: Image, color: 'bg-rose-600' },
    { id: 'threads', name: 'Threads', icon: Link, color: 'bg-gray-700' },
    { id: 'snapchat', name: 'Snapchat', icon: Sparkles, color: 'bg-yellow-500' },
    { id: 'reddit', name: 'Reddit', icon: AlertCircle, color: 'bg-orange-600' },
    { id: 'bluesky', name: 'Bluesky', icon: Cloud, color: 'bg-sky-500' },
    { id: 'mastodon', name: 'Mastodon', icon: AtSign, color: 'bg-optimist-600' },
    { id: 'discord', name: 'Discord', icon: MessageSquare, color: 'bg-optimist-700' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-cyan-600' },
    { id: 'tumblr', name: 'Tumblr', icon: BookOpen, color: 'bg-blue-900' },
    { id: 'wordpress', name: 'WordPress', icon: Newspaper, color: 'bg-slate-700' },
  ]

  const togglePlatform = async (platformId: string) => {
    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId]
    
    setSelectedPlatforms(newPlatforms)

    // Save preferred platforms to user settings
    if (token && newPlatforms.length > 0) {
      try {
        await fetch('/api/user/preferred-platforms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ preferredPlatforms: newPlatforms })
        })
      } catch (error) {
        console.error('Error saving preferred platforms:', error)
        // Don't show error to user, just log it
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMediaFiles(prev => [...prev, ...files])
  }

  const [isSaving, setIsSaving] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [publishResults, setPublishResults] = useState<{
    succeeded: string[]
    failed: string[]
    formattedByPlatform: Record<string, string>
  } | null>(null)

  const getPlatformName = (platformId: string) =>
    platforms.find((pl) => pl.id === platformId)?.name || platformId

  const formatForPlatform = (platformId: string, baseContent: string, baseHashtags: string) => {
    const normalizedHashtags = baseHashtags
      .split(/\s+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))

    switch (platformId) {
      case 'twitter': {
        const maxChars = 280
        const hashtagBlock = normalizedHashtags.slice(0, 3).join(' ')
        const suffix = hashtagBlock ? `\n\n${hashtagBlock}` : ''
        const available = Math.max(0, maxChars - suffix.length)
        const text = baseContent.length > available ? `${baseContent.slice(0, Math.max(0, available - 1))}...` : baseContent
        return `${text}${suffix}`
      }
      case 'linkedin': {
        const hashtagBlock = normalizedHashtags.slice(0, 5).join(' ')
        return hashtagBlock ? `${baseContent}\n\n${hashtagBlock}` : baseContent
      }
      case 'instagram': {
        const hashtagBlock = normalizedHashtags.slice(0, 30).join(' ')
        return hashtagBlock ? `${baseContent}\n\n.\n.\n.\n${hashtagBlock}` : baseContent
      }
      case 'tiktok': {
        const hashtagBlock = normalizedHashtags.slice(0, 8).join(' ')
        return hashtagBlock ? `${baseContent}\n\n${hashtagBlock}` : baseContent
      }
      case 'youtube': {
        const title = baseContent.split('\n')[0].slice(0, 100)
        const descriptionBody = baseContent.slice(0, 5000)
        const hashtagBlock = normalizedHashtags.slice(0, 15).join(' ')
        return `Title: ${title}\n\nDescription:\n${descriptionBody}${hashtagBlock ? `\n\n${hashtagBlock}` : ''}`
      }
      case 'facebook': {
        const hashtagBlock = normalizedHashtags.slice(0, 10).join(' ')
        return hashtagBlock ? `${baseContent}\n\n${hashtagBlock}` : baseContent
      }
      case 'pinterest': {
        const hashtagBlock = normalizedHashtags.slice(0, 8).join(' ')
        const short = baseContent.slice(0, 500)
        return `Pin title: ${short.slice(0, 100)}\n\nPin description:\n${short}${hashtagBlock ? `\n\n${hashtagBlock}` : ''}`
      }
      case 'threads': {
        const hashtagBlock = normalizedHashtags.slice(0, 5).join(' ')
        return hashtagBlock ? `${baseContent}\n\n${hashtagBlock}` : baseContent
      }
      case 'snapchat': {
        const short = baseContent.slice(0, 250)
        const hashtagBlock = normalizedHashtags.slice(0, 4).join(' ')
        return hashtagBlock ? `${short}\n\n${hashtagBlock}` : short
      }
      case 'reddit': {
        const title = baseContent.split('\n')[0].slice(0, 140)
        const body = baseContent.slice(0, 40000)
        return `Reddit title: ${title}\n\nPost body:\n${body}`
      }
      case 'bluesky': {
        const maxChars = 300
        const hashtagBlock = normalizedHashtags.slice(0, 3).join(' ')
        const suffix = hashtagBlock ? `\n\n${hashtagBlock}` : ''
        const available = Math.max(0, maxChars - suffix.length)
        const text = baseContent.length > available ? `${baseContent.slice(0, Math.max(0, available - 1))}...` : baseContent
        return `${text}${suffix}`
      }
      case 'mastodon': {
        const hashtagBlock = normalizedHashtags.slice(0, 5).join(' ')
        const short = baseContent.slice(0, 500)
        return hashtagBlock ? `${short}\n\n${hashtagBlock}` : short
      }
      case 'discord': {
        const hashtagBlock = normalizedHashtags.slice(0, 5).join(' ')
        const short = baseContent.slice(0, 2000)
        return hashtagBlock ? `${short}\n\n${hashtagBlock}` : short
      }
      case 'telegram': {
        const hashtagBlock = normalizedHashtags.slice(0, 5).join(' ')
        const short = baseContent.slice(0, 4096)
        return hashtagBlock ? `${short}\n\n${hashtagBlock}` : short
      }
      case 'tumblr': {
        const hashtagBlock = normalizedHashtags.slice(0, 10).join(' ')
        return hashtagBlock ? `${baseContent}\n\n${hashtagBlock}` : baseContent
      }
      case 'wordpress': {
        const title = baseContent.split('\n')[0].slice(0, 100)
        const body = baseContent.slice(0, 50000)
        return `Title: ${title}\n\nContent:\n${body}`
      }
      default:
        return normalizedHashtags.length > 0 ? `${baseContent}\n\n${normalizedHashtags.join(' ')}` : baseContent
    }
  }

  const createPost = async (status: 'draft' | 'scheduled' | 'published') => {
    // FREE PLAN RESTRICTION (skipped while free-build)
    if (!FREE_BUILD_PHASE && subscriptionTier === 'free') {
      alert('Post creation is not available on the free plan. The free plan is designed for learning and exploring CreatorFlow tools. Upgrade to a paid plan to create and publish posts.')
      router.push('/signup?plan=starter')
      return
    }

    if (!content.trim()) {
      alert('Please enter content for your post')
      return
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    if (!token) {
      alert('You must be logged in to create a post')
      router.push('/signin')
      return
    }

    // Check post limit (skipped while free-build — banner says free while we build)
    if (!FREE_BUILD_PHASE && postInfo && postInfo.remaining <= 0 && status !== 'draft') {
      alert('You have reached your post limit. Please upgrade your plan.')
      router.push('/dashboard')
      return
    }

    // Combine content with hashtags
    const fullContent = hashtags.trim() 
      ? `${content.trim()}\n\n${hashtags.trim()}`
      : content.trim()

    // Create scheduled_at timestamp if scheduling
    let scheduled_at = null
    if (status === 'scheduled' && scheduledDate && scheduledTime) {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`)
      if (!isNaN(dateTime.getTime())) {
        scheduled_at = dateTime.toISOString()
      } else {
        alert('Please select a valid date and time')
        return
      }
    }

    try {
      // Create post for each selected platform.
      // YouTube direct publishing uses the upload endpoint with a real file.
      const platformResults = await Promise.all(
        selectedPlatforms.map(async (platform) => {
          if (platform === 'youtube' && status === 'published') {
            const firstVideo = mediaFiles.find((file) => file.type.startsWith('video/'))
            if (!firstVideo) {
              return {
                platform,
                ok: false,
                result: { success: false, error: 'YouTube direct posting requires a video file upload.' }
              }
            }

            const titleLine = content.trim().split('\n').find((line) => line.trim().length > 0) || 'CreatorFlow Upload'
            const formData = new FormData()
            formData.append('file', firstVideo)
            formData.append('title', titleLine.slice(0, 100))
            formData.append('description', fullContent.slice(0, 5000))
            formData.append('privacyStatus', 'private')

            const response = await fetch('/api/publish/youtube', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: formData
            })
            const result = await response.json()
            return { platform, ok: response.ok, result }
          }

          if (platform === 'snapchat' && status === 'published') {
            const firstMedia = mediaFiles[0]
            if (!firstMedia) {
              return {
                platform,
                ok: false,
                result: { success: false, error: 'Snapchat direct posting requires an image or video file upload.' }
              }
            }

            const formData = new FormData()
            formData.append('file', firstMedia)
            formData.append('caption', fullContent.slice(0, 250))

            const response = await fetch('/api/publish/snapchat', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: formData
            })
            const responseText = await response.text()
            let result: any = null
            try {
              result = responseText ? JSON.parse(responseText) : null
            } catch {
              result = {
                success: false,
                error:
                  responseText?.trim()?.slice(0, 200) ||
                  `Snapchat publish failed (${response.status})`
              }
            }
            if (result && result.success === undefined && result.error) {
              result = { ...result, success: false }
            }
            return { platform, ok: response.ok && !!result?.success, result }
          }

          const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              platform,
              content: fullContent,
              media_urls: [],
              scheduled_at,
              status
            })
          })
          const result = await response.json()
          return { platform, ok: response.ok, result }
        })
      )

      const succeeded: string[] = []
      const failedPlatformIds: string[] = []
      platformResults.forEach(({ platform, ok, result }) => {
        if (result?.success) succeeded.push(getPlatformName(platform))
        else {
          failedPlatformIds.push(platform)
          const errMsg = result?.error
          if (errMsg && !ok) {
            console.error(`Post failed for ${platform}:`, errMsg)
          }
        }
      })

      if (status === 'draft') {
        const platformNames = selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.name || p).join(', ')
        alert(`Draft saved successfully for ${platformNames}!`)
        router.push('/dashboard')
        return
      }
      if (status === 'scheduled') {
        const platformNames = selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.name || p).join(', ')
        alert(`Post scheduled for ${platformNames} on ${scheduledDate} at ${scheduledTime}!`)
        router.push('/dashboard')
        return
      }

      // Published
      if (failedPlatformIds.length > 0) {
        const failed = failedPlatformIds.map((platformId) => getPlatformName(platformId))
        const formattedByPlatform: Record<string, string> = {}
        failedPlatformIds.forEach((platformId) => {
          formattedByPlatform[getPlatformName(platformId)] = formatForPlatform(platformId, content.trim(), hashtags.trim())
        })
        setPublishResults({ succeeded, failed, formattedByPlatform })
        const firstError = platformResults.find((r) => !r.result?.success)?.result?.error
        if (succeeded.length > 0) {
          alert(`Posted to ${succeeded.join(', ')}. For ${failed.join(', ')}—copy below and paste into the app.`)
        } else {
          alert(
            firstError
              ? `Could not post: ${firstError}`
              : 'Post saved as draft. Copy below and paste into each platform to post.'
          )
        }
      } else {
        alert(`Post published successfully to ${succeeded.join(', ')}!`)
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Create post error:', error)
      alert(error.message || 'Failed to create post. Please try again.')
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please enter content to save')
      return
    }
    if (!token) {
      alert('You must be logged in to save')
      router.push('/signin')
      return
    }

    const trimmedTitle = content.trim().slice(0, 60) || 'Draft'

    setIsSaving(true)
    try {
      const originalText = content.trim()

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTitle,
          content: originalText,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save')
      }
      router.push('/saved')
    } catch (error: any) {
      console.error('Save original error:', error)
      alert(error.message || 'Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      alert('Please select a date and time to schedule the post')
      return
    }
    setIsScheduling(true)
    try {
      await createPost('scheduled')
    } finally {
      setIsScheduling(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await createPost('published')
    } finally {
      setIsPublishing(false)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/signup?next=/create")
    }
  }, [router])

  // Prefill from repurpose tool (Create post / Schedule CTAs)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const from = searchParams.get('from')
    if (from !== 'repurpose') return
    const prefillContent = sessionStorage.getItem('creatorflow_repurpose_content')
    const prefillPlatform = sessionStorage.getItem('creatorflow_repurpose_platform')
    const prefillHashtags = sessionStorage.getItem('creatorflow_repurpose_hashtags')
    if (prefillContent) setContent(prefillContent)
    if (prefillPlatform) setSelectedPlatforms([prefillPlatform])
    if (prefillHashtags) setHashtags(prefillHashtags)
    const schedule = searchParams.get('schedule') === '1'
    if (schedule && !scheduledDate) {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      setScheduledDate(d.toISOString().slice(0, 10))
      setScheduledTime('09:00')
    }
    sessionStorage.removeItem('creatorflow_repurpose_content')
    sessionStorage.removeItem('creatorflow_repurpose_platform')
    sessionStorage.removeItem('creatorflow_repurpose_hashtags')
  }, [searchParams])


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '')
    }

    // Fetch post usage info and preferred platforms
    const t = localStorage.getItem('token')
    if (t) {
      // Fetch post usage info (monthly limit / remaining from plan)
      fetch('/api/user/purchase-posts', {
        headers: {
          'Authorization': `Bearer ${t}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPostInfo({
            monthlyLimit: data.monthlyLimit,
            purchased: 0,
            postsThisMonth: data.postsThisMonth || 0,
            totalAvailable: data.totalAvailable ?? (data.monthlyLimit ?? 0),
            remaining: data.remaining ?? 0
          })
        }
      })
      .catch(() => {})

      // Fetch preferred platforms
      fetch('/api/user/preferred-platforms', {
        headers: {
          'Authorization': `Bearer ${t}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (searchParams.get('from') === 'repurpose') return
        if (!data.error && data.preferredPlatforms && data.preferredPlatforms.length > 0) {
          setSelectedPlatforms(data.preferredPlatforms)
        }
      })
      .catch(err => console.error('Error fetching preferred platforms:', err))

      // Fetch subscription tier
      fetch('/api/subscription/manage', {
        headers: {
          'Authorization': `Bearer ${t}`
        }
      })
      .then(res => res.json())
      .then(data => {
        // Set subscription tier - if plan is null/undefined, default to 'free'
        const tier = data.plan || 'free'
        setSubscriptionTier(tier)
        console.log('Subscription tier set to:', tier)
      })
      .catch(err => {
        console.error('Error fetching subscription:', err)
        // On error, default to free plan
        setSubscriptionTier('free')
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-optimist-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold truncate">Create New Post</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => router.push('/saved')}
              className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white"
            >
              Saved
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Save original content to Documents by name"
              aria-label="Save original to Documents"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col overflow-x-hidden pb-24">
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-3">How to create</h2>
              <ol className="space-y-2 text-sm text-gray-200 leading-relaxed">
                <li>1. Type what it&apos;s about, or tap <span className="font-semibold text-white">Write this for me</span>.</li>
                <li>2. Tap <span className="font-semibold text-white">Record or upload</span> if you have a video or photo.</li>
                <li>3. Tap <span className="font-semibold text-white">Save Draft</span> so you can come back and change it.</li>
              </ol>
            </div>

            {/* Content Editor */}
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Write this for me</h3>
              <div className="mb-4">
                <WriteThisForMe token={token} onDraft={setContent} />
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type here, or tap Write this for me above."
                className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-optimist-500 resize-none"
              />
            </div>

            {/* Media Upload */}
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Video and photos</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium">Record or upload a photo or video</p>
                      <p className="text-sm text-gray-300">Tap to use your camera or pick a file</p>
                    </div>
                  </div>
                </label>
              </div>
              {mediaFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-300" />
                      </div>
                      <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function CreatePost() {
  return (
    <Suspense fallback={null}>
      <CreatePostInner />
    </Suspense>
  )
}
