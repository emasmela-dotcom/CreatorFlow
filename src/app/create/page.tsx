'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Image, Video, Link, Calendar, Hash, Instagram, Twitter, Linkedin, Youtube, Save, Send, AlertCircle, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ContentAssistantBot from '@/components/bots/ContentAssistantBot'
import SchedulingAssistantBot from '@/components/bots/SchedulingAssistantBot'

export default function CreatePost() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [token, setToken] = useState('')
  const analysisRef = useRef<HTMLDivElement | null>(null)
  const [postInfo, setPostInfo] = useState<{
    monthlyLimit: number | null
    purchased: number
    postsThisMonth: number
    totalAvailable: number
    remaining: number
  } | null>(null)

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMediaFiles(prev => [...prev, ...files])
  }

  const [isSaving, setIsSaving] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const createPost = async (status: 'draft' | 'scheduled' | 'published') => {
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

    // Check post limit
    if (postInfo && postInfo.remaining <= 0 && status !== 'draft') {
      alert('You have reached your post limit. Please upgrade your plan or purchase additional posts.')
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
      // Create post for each selected platform
      const platform = selectedPlatforms[0] // API currently supports one platform at a time
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform,
          content: fullContent,
          media_urls: [], // TODO: Handle media uploads
          scheduled_at,
          status
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post')
      }

      // Success!
      if (status === 'draft') {
        alert('Draft saved successfully!')
      } else if (status === 'scheduled') {
        alert(`Post scheduled for ${scheduledDate} at ${scheduledTime}!`)
      } else {
        alert('Post published successfully!')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Create post error:', error)
      alert(error.message || 'Failed to create post. Please try again.')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await createPost('draft')
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
    // Load auth token on client
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '')
    }

    // Fetch post usage info
    const t = localStorage.getItem('token')
    if (t) {
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
            purchased: data.purchasedPosts || 0,
            postsThisMonth: data.postsThisMonth || 0,
            totalAvailable: data.totalAvailable || 0,
            remaining: data.remaining || 0
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
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Create New Post</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || isScheduling || isPublishing}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleSchedule}
              disabled={isSaving || isScheduling || isPublishing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" />
              {isScheduling ? 'Scheduling...' : 'Schedule'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving || isScheduling || isPublishing}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isPublishing ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Post Usage Warning - Low on Posts */}
            {postInfo && postInfo.remaining <= 5 && (
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-2 border-yellow-500 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-400 mb-2">Low on Posts</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      You have <strong className="text-white">{postInfo.remaining} posts remaining</strong> this month.
                      {postInfo.remaining === 0 && (
                        <span className="text-red-400 font-semibold"> You have used all available posts</span>
                      )}
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                      <h5 className="font-semibold text-blue-400 text-xs mb-2">How Post Rollover Works:</h5>
                      <ul className="text-xs text-gray-300 space-y-1 ml-4">
                        <li>• <strong className="text-white">Monthly posts</strong> reset each month (from your plan)</li>
                        <li>• <strong className="text-green-400">Purchased posts</strong> never expire and roll over forever</li>
                        <li>• <strong className="text-white">Monthly posts are used first</strong>, then purchased posts</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-sm transition-all"
                    >
                      Buy Additional Posts →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Post Usage Info - Normal */}
            {postInfo && postInfo.remaining > 5 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">
                    Posts remaining: <strong className="text-blue-400">{postInfo.remaining}</strong>
                    {postInfo.purchased > 0 && (
                      <span className="text-green-400 ml-2">({postInfo.purchased} purchased posts roll over forever)</span>
                    )}
                  </span>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-blue-400 hover:text-blue-300 text-xs underline"
                  >
                    Buy More
                  </button>
                </div>
              </div>
            )}

            {/* Platform Selection */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Select Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-medium">{platform.name}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Content</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Assistant Active
                  </span>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your thoughts with your audience..."
                className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">{content.length}/280 characters</span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <Hash className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <Link className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inline AI status bar */}
              {selectedPlatforms.length > 0 && content.trim().length > 0 && (
                <div className="mt-3 flex items-center justify-between bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI analysis running…</span>
                  </div>
                  <button
                    onClick={() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="text-purple-300 hover:text-purple-200 underline"
                  >
                    Show analysis
                  </button>
                </div>
              )}
              
              {/* Content Assistant Bot - Real-time Feedback */}
              {selectedPlatforms.length > 0 && content.trim() && (
                <div ref={analysisRef} className="mt-4 pt-4 border-t border-gray-700">
                  <ContentAssistantBot
                    content={content}
                    platform={selectedPlatforms[0]}
                    hashtags={hashtags}
                    token={token}
                  />
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Media</h3>
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
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Upload photos or videos</p>
                      <p className="text-sm text-gray-400">Drag and drop or click to browse</p>
                    </div>
                  </div>
                </label>
              </div>
              {mediaFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Hashtags</h3>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#hashtag1 #hashtag2 #hashtag3"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-400 mt-2">
                Separate hashtags with spaces. Use 3-5 hashtags for best engagement.
              </p>
            </div>

            {/* Scheduling */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Schedule</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Assistant Active
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              {/* Scheduling Assistant Bot */}
              {selectedPlatforms.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <SchedulingAssistantBot
                    platform={selectedPlatforms[0]}
                token={token}
                    onTimeSelect={(time) => {
                      // Auto-fill time when user clicks
                      const [hours, minutes] = time.split(':')
                      const hour24 = hours.includes('PM') 
                        ? parseInt(hours) + 12 
                        : parseInt(hours)
                      const time24 = `${hour24.toString().padStart(2, '0')}:${minutes || '00'}`
                      setScheduledTime(time24)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 border-l border-gray-700 p-6">
          <div className="space-y-6">
            {/* Preview */}
            <div>
              <h4 className="font-semibold mb-3">Preview</h4>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Your Name</p>
                    <p className="text-xs text-gray-400">2h ago</p>
                  </div>
                </div>
                <p className="text-sm mb-2">{content || 'Your content will appear here...'}</p>
                {hashtags && (
                  <p className="text-sm text-blue-400">{hashtags}</p>
                )}
              </div>
            </div>

            {/* Best Times */}
            <div>
              <h4 className="font-semibold mb-3">Best Times to Post</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span>Instagram</span>
                  <span className="text-green-400">6-9 PM</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span>Twitter</span>
                  <span className="text-green-400">12-3 PM</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span>LinkedIn</span>
                  <span className="text-green-400">8-10 AM</span>
                </div>
              </div>
            </div>

            {/* Engagement Tips */}
            <div>
              <h4 className="font-semibold mb-3">Engagement Tips</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Ask questions to encourage comments</p>
                <p>• Use emojis to increase engagement</p>
                <p>• Post when your audience is most active</p>
                <p>• Use relevant hashtags (3-5 max)</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
