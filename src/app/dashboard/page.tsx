'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BarChart3, Calendar, Users, TrendingUp, Plus, Settings, Bell, Search, FileText, FileSearch, Activity, Radio, Tag, Layers, Handshake, LogOut, Clock, TrendingDown, Eye, Heart, MessageCircle, Share2, HelpCircle, Link2, Sparkles, Wrench, DollarSign, Menu, X } from 'lucide-react'
import TrialStatusBanner from './components/TrialStatusBanner'
import HelpCenter from '@/components/HelpCenter'
import HelpIcon from '@/components/HelpIcon'
import PlatformConnections from '@/components/PlatformConnections'
import SocialListening from '@/components/SocialListening'
import TeamCollaboration from '@/components/TeamCollaboration'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import GameChangerFeatures, { CollaborationMarketplaceUI } from '@/components/GameChangerFeatures'
import WhosOn from '@/components/WhosOn'
import CreatorChat from '@/components/CreatorChat'
import MessageBoard from '@/components/MessageBoard'
import ContentTypesSettings from '@/components/ContentTypesSettings'
import MoreAiToolsRow from '@/components/MoreAiToolsRow'
import AiCoachCorner from '@/components/AiCoachCorner'
import ClaudeCorner from '@/components/ClaudeCorner'
import LockedContentBadge, { LockedContentIcon } from '@/components/LockedContentBadge'

function HashtagResearchUI({ token, onClose }: { token: string, onClose: () => void }) {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [savedSets, setSavedSets] = useState<any[]>([])
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveHashtags, setSaveHashtags] = useState('')
  const [error, setError] = useState('')

  const loadSavedSets = async () => {
    try {
      const response = await fetch('/api/hashtag-research?action=sets', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setSavedSets(data.hashtagSets || [])
    } catch (err) {
      console.error('Failed to load saved sets:', err)
    }
  }

  React.useEffect(() => {
    if (token) loadSavedSets()
  }, [token])

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'research',
          niche: niche || undefined,
          platform,
          content: content || undefined
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to research hashtags')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!saveName || !saveHashtags) {
      setError('Name and hashtags are required')
      return
    }

    try {
      const response = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'save',
          name: saveName,
          platform,
          hashtags: saveHashtags,
          description: `Saved on ${new Date().toLocaleDateString()}`
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save')
      setShowSaveForm(false)
      setSaveName('')
      setSaveHashtags('')
      loadSavedSets()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleResearch} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="threads">Threads</option>
            <option value="snapchat">Snapchat</option>
            <option value="reddit">Reddit</option>
            <option value="bluesky">Bluesky</option>
            <option value="mastodon">Mastodon</option>
            <option value="discord">Discord</option>
            <option value="telegram">Telegram</option>
            <option value="tumblr">Tumblr</option>
            <option value="wordpress">WordPress</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Niche (Optional)</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="fitness, business, tech, etc."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Content (Optional - for recommendations)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={3}
            placeholder="Paste your content to get hashtag recommendations..."
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50"
        >
          {loading ? 'Researching...' : 'Research Hashtags'}
        </button>
      </form>

      {result && (
        <div className="space-y-4 mt-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
            <h4 className="font-semibold text-green-400 mb-2">Trending Hashtags ({result.niche})</h4>
            <div className="flex flex-wrap gap-2">
              {result.trending?.map((h: any, i: number) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-sm">
                  {h.hashtag} <span className="text-gray-300">({h.reach})</span>
                </span>
              ))}
            </div>
          </div>
          {result.recommended && result.recommended.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Recommended for Your Content</h4>
              <div className="flex flex-wrap gap-2">
                {result.recommended.map((h: any, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {h.hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              const allHashtags = [
                ...(result.trending || []).map((h: any) => h.hashtag),
                ...(result.recommended || []).map((h: any) => h.hashtag)
              ].join(' ')
              setSaveHashtags(allHashtags)
              setShowSaveForm(true)
            }}
            className="w-full px-4 py-2 bg-optimist-600 hover:bg-optimist-700 rounded text-white"
          >
            Save as Hashtag Set
          </button>
        </div>
      )}

      {showSaveForm && (
        <div className="bg-gray-900/50 border border-gray-700 rounded p-4 space-y-3">
          <h4 className="font-semibold">Save Hashtag Set</h4>
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Set name (e.g., Fitness Posts)"
          />
          <textarea
            value={saveHashtags}
            onChange={(e) => setSaveHashtags(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={3}
            placeholder="Hashtags separated by spaces"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveForm(false)
                setSaveName('')
                setSaveHashtags('')
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {savedSets.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Saved Hashtag Sets</h4>
          <div className="space-y-2">
            {savedSets.map((set: any) => (
              <div key={set.id} className="bg-gray-800 p-3 rounded border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{set.name}</div>
                    {set.platform && <div className="text-xs text-gray-300">{set.platform}</div>}
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this hashtag set?')) {
                        await fetch(`/api/hashtag-research?id=${set.id}`, {
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${token}` }
                        })
                        loadSavedSets()
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-300">{set.hashtags}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Content Templates UI
function ContentTemplatesUI({ token, onClose }: { token: string, onClose: () => void }) {
  const [templates, setTemplates] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/content-templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setTemplates(data.templates || [])
    } catch (err) {
      console.error('Failed to load templates:', err)
    }
  }

  React.useEffect(() => {
    if (token) loadTemplates()
  }, [token])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !content) {
      setError('Name and content are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/content-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingTemplate?.id,
          name,
          platform,
          content,
          category: category || null,
          description: description || null
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save template')
      
      setShowForm(false)
      setEditingTemplate(null)
      setName('')
      setContent('')
      setCategory('')
      setDescription('')
      loadTemplates()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (template: any) => {
    setEditingTemplate(template)
    setName(template.name)
    setPlatform(template.platform || 'instagram')
    setContent(template.content)
    setCategory(template.category || '')
    setDescription(template.description || '')
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this template?')) return

    try {
      const response = await fetch(`/api/content-templates?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete')
      loadTemplates()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Content Templates</h3>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingTemplate(null)
            setName('')
            setContent('')
            setCategory('')
            setDescription('')
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
        >
          + New Template
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-gray-900/50 border border-gray-700 rounded p-4 space-y-3">
          <h4 className="font-semibold">{editingTemplate ? 'Edit' : 'New'} Template</h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Template name"
            required
          />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="threads">Threads</option>
            <option value="snapchat">Snapchat</option>
            <option value="reddit">Reddit</option>
            <option value="bluesky">Bluesky</option>
            <option value="mastodon">Mastodon</option>
            <option value="discord">Discord</option>
            <option value="telegram">Telegram</option>
            <option value="tumblr">Tumblr</option>
            <option value="wordpress">WordPress</option>
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={6}
            placeholder="Template content (use {variable} for placeholders)"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Category (optional)"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            rows={2}
            placeholder="Description (optional)"
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingTemplate(null)
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {templates.length === 0 ? (
          <div className="text-center py-8 text-gray-300">
            No templates yet. Create your first template!
          </div>
        ) : (
          templates.map((template: any) => (
            <div key={template.id} className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{template.name}</div>
                  {template.platform && (
                    <div className="text-xs text-gray-300">{template.platform}</div>
                  )}
                  {template.category && (
                    <div className="text-xs text-gray-300">Category: {template.category}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(template.content)
                      alert('Template copied to clipboard!')
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">{template.content}</div>
              {template.description && (
                <div className="text-xs text-gray-300 mt-2">{template.description}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Engagement Inbox UI
function EngagementInboxUI({ token, onClose }: { token: string, onClose: () => void }) {
  const [engagements, setEngagements] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState({ status: 'all', platform: 'all', type: 'all' })
  const [loading, setLoading] = useState(false)
  const [addPlatform, setAddPlatform] = useState('instagram')
  const [addType, setAddType] = useState('comment')
  const [addAuthor, setAddAuthor] = useState('')
  const [addContent, setAddContent] = useState('')
  const [addError, setAddError] = useState('')

  const loadEngagements = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.status !== 'all') params.append('status', filter.status)
      if (filter.platform !== 'all') params.append('platform', filter.platform)
      if (filter.type !== 'all') params.append('type', filter.type)

      const response = await fetch(`/api/engagement-inbox?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEngagements(data.engagements || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Failed to load engagements:', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (token) loadEngagements()
  }, [token, filter])

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch('/api/engagement-inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'update', id, status })
      })
      const data = await response.json()
      if (data.success) loadEngagements()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const addEngagement = async () => {
    if (!addContent.trim()) return
    setAddError('')
    try {
      const response = await fetch('/api/engagement-inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add',
          platform: addPlatform,
          type: addType,
          author_name: addAuthor.trim() || null,
          content: addContent.trim()
        })
      })
      const data = await response.json()
      if (data.success) {
        setAddContent('')
        setAddAuthor('')
        loadEngagements()
      } else {
        setAddError(data.error || 'Could not add')
      }
    } catch (err) {
      console.error('Failed to add engagement:', err)
      setAddError('Could not add')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Engagement Inbox
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 rounded text-sm">
              {unreadCount} unread
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-2">
        <input
          value={addAuthor}
          onChange={(e) => setAddAuthor(e.target.value)}
          placeholder="Author name"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        />
        <select
          value={addPlatform}
          onChange={(e) => setAddPlatform(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="instagram">instagram</option>
          <option value="twitter">twitter</option>
          <option value="tiktok">tiktok</option>
          <option value="youtube">youtube</option>
          <option value="linkedin">linkedin</option>
        </select>
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="comment">comment</option>
          <option value="message">message</option>
          <option value="mention">mention</option>
          <option value="reply">reply</option>
        </select>
        <textarea
          value={addContent}
          onChange={(e) => setAddContent(e.target.value)}
          placeholder="Comment or message"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          rows={2}
        />
        <button
          type="button"
          onClick={addEngagement}
          disabled={!addContent.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm disabled:opacity-50"
        >
          Add
        </button>
        {addError && <p className="text-sm text-red-400">{addError}</p>}
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={filter.platform}
          onChange={(e) => setFilter({ ...filter, platform: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter/X</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="facebook">Facebook</option>
          <option value="pinterest">Pinterest</option>
          <option value="threads">Threads</option>
          <option value="snapchat">Snapchat</option>
          <option value="reddit">Reddit</option>
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        >
          <option value="all">All Types</option>
          <option value="comment">Comments</option>
          <option value="message">Messages</option>
          <option value="mention">Mentions</option>
          <option value="reply">Replies</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-300">Loading...</div>
      ) : engagements.length === 0 ? (
        <div className="text-center py-8 text-gray-300">
          No engagements found. Add engagements manually or integrate with social platforms.
        </div>
      ) : (
        <div className="space-y-2">
          {engagements.map((eng: any) => (
            <div
              key={eng.id}
              className={`bg-gray-800 p-4 rounded border ${
                eng.status === 'unread' ? 'border-yellow-500/50' : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">
                    {eng.author_name || eng.author_handle || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-300">
                    {eng.platform} • {eng.type} • {new Date(eng.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {eng.status === 'unread' && (
                    <button
                      onClick={() => updateStatus(eng.id, 'read')}
                      className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      Mark Read
                    </button>
                  )}
                  <select
                    value={eng.status}
                    onChange={(e) => updateStatus(eng.id, e.target.value)}
                    className="text-xs px-2 py-1 bg-gray-700 rounded text-white"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-300">{eng.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// Content Calendar Component
function CalendarView({ token }: { token: string }) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    loadCalendarEvents()
  }, [currentMonth, token])

  const loadCalendarEvents = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      
      const response = await fetch(`/api/calendar?startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to load calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const getEventsForDate = (day: number | null) => {
    if (!day) return []
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Calendar</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        {loading ? (
          <div className="text-center py-12 text-gray-300">Loading calendar...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-gray-300 py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, idx) => {
              const dayEvents = getEventsForDate(day)
              return (
                <div
                  key={idx}
                  className={`min-h-[80px] p-2 border border-gray-700 rounded ${day ? 'bg-gray-900 hover:bg-gray-800 cursor-pointer' : 'bg-gray-800/50'}`}
                  onClick={() => day && setSelectedDate(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                >
                  {day && (
                    <>
                      <div className="text-sm font-semibold mb-1">{day}</div>
                      {dayEvents.slice(0, 2).map((event: any) => (
                        <div key={event.id} className="text-xs bg-optimist-600/30 text-optimist-300 rounded px-1 mb-1 truncate">
                          {event.platform}: {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-300">+{dayEvents.length - 2} more</div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {selectedDate && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="font-semibold mb-3">Events on {new Date(selectedDate).toLocaleDateString()}</h4>
            <div className="space-y-2">
              {getEventsForDate(parseInt(selectedDate.split('-')[2])).map((event: any) => (
                <div key={event.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-gray-300">{event.platform} • {event.status}</div>
                      {event.scheduledAt && (
                        <div className="text-xs text-gray-300 mt-1">
                          {new Date(event.scheduledAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {getEventsForDate(parseInt(selectedDate.split('-')[2])).length === 0 && (
                <div className="text-gray-300 text-center py-4">No events scheduled</div>
              )}
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Performance Analytics Component
function PerformanceAnalyticsView({ token }: { token: string }) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [days])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/performance?days=${days}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-12 text-gray-300">No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Posts</p>
              <p className="text-2xl font-bold">{analytics.overview.totalPosts}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Engagement</p>
              <p className="text-2xl font-bold">{analytics.overview.totalEngagement.toLocaleString()}</p>
            </div>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Avg Engagement</p>
              <p className="text-2xl font-bold">{analytics.overview.avgEngagement}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Growth Rate</p>
              <p className={`text-2xl font-bold ${analytics.overview.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analytics.overview.growthRate >= 0 ? '+' : ''}{analytics.overview.growthRate}%
              </p>
            </div>
            {analytics.overview.growthRate >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">By Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(analytics.byPlatform.posts).map(([platform, count]: [string, any]) => (
            <div key={platform} className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-300 capitalize">{platform}</div>
              <div className="text-xs text-gray-300">
                {analytics.byPlatform.engagement[platform] || 0} engagement
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Posts */}
      {analytics.topPosts.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {analytics.topPosts.slice(0, 5).map((post: any, idx: number) => (
              <div key={post.id} className="flex items-start justify-between p-4 bg-gray-900 rounded border border-gray-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-optimist-400 font-bold">#{idx + 1}</span>
                    <span className="text-sm text-gray-300 capitalize">{post.platform}</span>
                  </div>
                  <div className="text-sm text-gray-300 truncate">{post.content}</div>
                  <div className="text-xs text-gray-300 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-green-400">{post.engagement.toLocaleString()}</div>
                  <div className="text-xs text-gray-300">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  // Subscription feedback (used by the "Subscribe button failed" UI)
  const [subscribeError, setSubscribeError] = useState<string | null>(null)
  const [subscribeDebug, setSubscribeDebug] = useState<string | null>(null)
  const [dashboardNotice, setDashboardNotice] = useState<string | null>(null)
  const [dashboardNoticeHref, setDashboardNoticeHref] = useState<string | null>(null)
  const [posts, setPosts] = useState<Array<{
    id: string
    platform: string
    content: string
    scheduled_at: string | null
    status: string
    isLocked?: boolean
    created_at: string
  }>>([])
  const [openAITool, setOpenAITool] = useState<string | null>(null)
  const [token, setToken] = useState<string>('')
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [helpCenterOpen, setHelpCenterOpen] = useState(false)
  const [headerSearch, setHeaderSearch] = useState('')
  const headerSearchInputRef = useRef<HTMLInputElement>(null)
  const [userId, setUserId] = useState<string>('')
  const [headerVariant, setHeaderVariant] = useState<'center' | 'full'>('center')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [aiCoachOpen, setAiCoachOpen] = useState(false)
  const [claudeOpen, setClaudeOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    setHeaderVariant(p.get('header') === 'full' ? 'full' : 'center')

    const subErr = p.get('subscribe_error')
    const subDbg = p.get('subscribe_debug')
    if (subErr) setSubscribeError(subErr)
    if (subDbg) setSubscribeDebug(subDbg)

    const connected = p.get('connected')
    if (p.get('error') === 'oauth_cancelled') {
      setDashboardNotice('Platform connection was canceled. Try again under Connections.')
      setDashboardNoticeHref(null)
      setActiveTab('connections')
    } else if (connected) {
      const label = connected.charAt(0).toUpperCase() + connected.slice(1)
      setDashboardNotice(`${label} connected successfully.`)
      setDashboardNoticeHref(null)
      setActiveTab('connections')
    } else if (p.get('trial_started') === 'true') {
      setDashboardNotice('Free while we build. Paid plans with live AI later. Start in Documents — save once, copy formatted per platform.')
      setDashboardNoticeHref('/documents')
      setActiveTab('overview')
    } else if (p.get('new') === '1') {
      setDashboardNotice(
        'Welcome! Start in Documents — save your original once, then copy formatted text for each platform.'
      )
      setDashboardNoticeHref('/documents')
      setActiveTab('overview')
    } else if (p.get('canceled') === 'true') {
      setDashboardNotice(
        'Checkout was canceled. No charge was made.'
      )
    } else if (p.get('purchase') === 'canceled') {
      setDashboardNotice('Post purchase was canceled. No charges were made.')
    } else if (p.get('purchase') === 'success') {
      const posts = p.get('posts')
      setDashboardNotice(
        posts ? `Purchase complete—${posts} post allowance updated.` : 'Purchase complete.'
      )
    } else if (p.get('success') === 'true') {
      setDashboardNotice('Payment setup complete. Your subscription is active—thank you!')
    }

    const stripKeys = [
      'subscribe_error',
      'subscribe_debug',
      'header',
      'success',
      'trial_started',
      'new',
      'canceled',
      'amount',
      'purchase',
      'posts',
      'error',
      'connected',
    ]
    let stripped = false
    for (const key of stripKeys) {
      if (p.has(key)) {
        p.delete(key)
        stripped = true
      }
    }
    if (stripped) {
      const qs = p.toString()
      window.history.replaceState({}, '', qs ? `/dashboard?${qs}` : '/dashboard')
    }
  }, [])

  useEffect(() => {
    // Get token from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || ''
      setToken(storedToken)
      
      // Get user ID
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUserId(userData.id || userData.userId || '')
        } catch (e) {
          console.error('Failed to parse user data:', e)
        }
      }
      
      // Allow browse mode without signup; writing actions still require signin.
      if (!storedToken) {
        setDashboardNotice('Browse mode: explore tools and features freely. Sign in to connect accounts and publish.')
      }
    }
  }, [router])

  const analytics = {
    totalFollowers: 125000,
    engagementRate: 4.2,
    reach: 45000,
    impressions: 180000
  }

  useEffect(() => {
    // Fetch user subscription tier and post info
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch subscription
      fetch('/api/subscription/manage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setSubscriptionTier(data.plan || null)
      })
      .catch(err => console.error('Error fetching subscription:', err))

      // Fetch posts with lock status
      fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPosts(data.posts)
        }
      })
      .catch(err => console.error('Error fetching posts:', err))
    }
  }, [])

  const setTab = (tab: typeof activeTab) => {
    setActiveTab(tab)
    setMobileNavOpen(false)
  }

  const uniquePosts = Array.from(new Map(posts.map((p) => [p.id, p])).values())
  const contentSearch = headerSearch.trim().toLowerCase()
  const visiblePosts = uniquePosts.filter((p) => {
    if (!contentSearch) return true
    return (
      (p.content || '').toLowerCase().includes(contentSearch) ||
      (p.platform || '').toLowerCase().includes(contentSearch) ||
      (p.status || '').toLowerCase().includes(contentSearch)
    )
  })

  const exportPost = (post: (typeof posts)[number]) => {
    const blob = new Blob(
      [`${post.platform}\n${post.status}\n\n${post.content || ''}`],
      { type: 'text/plain' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${post.platform}-${post.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const mobileNavLinks: { label: string; tab?: typeof activeTab; href?: string; action?: string }[] = [
    { label: 'Overview', tab: 'overview' },
    { label: 'AI coach', action: 'ai-coach' },
    { label: 'Claude', action: 'claude' },
    { label: 'Content', tab: 'content' },
    { label: 'Calendar', tab: 'calendar' },
    { label: 'Analytics', tab: 'analytics' },
    { label: 'Collaborations', tab: 'collaborations' },
    { label: 'Connections', tab: 'connections' },
    { label: 'Tools', tab: 'game-changers' },
    { label: 'Listening', tab: 'social-listening' },
    { label: 'Community', tab: 'community' },
    { label: 'Create', href: '/create' },
    { label: 'Documents', href: '/documents' },
  ]

  const navButtons = (
    <div className="inline-flex items-start gap-1.5">
      <div className="inline-flex items-center gap-1.5 shrink-0">
        <button className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button
          type="button"
          onClick={() => {
            setClaudeOpen(false)
            setAiCoachOpen((v) => !v)
          }}
          aria-label={aiCoachOpen ? 'Close AI coach' : 'Open AI coach'}
          className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-sage-500 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          AI coach
        </button>
        <button
          type="button"
          onClick={() => {
            setAiCoachOpen(false)
            setClaudeOpen((v) => !v)
          }}
          aria-label={claudeOpen ? 'Close Claude' : 'Open Claude'}
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-300 px-3 py-1.5 text-sm font-semibold text-black shadow hover:bg-yellow-200 transition-colors"
        >
          Claude
        </button>

      </div>
      <div className="inline-flex flex-col items-start gap-0.5">
        <div className="flex flex-nowrap items-center justify-start gap-1.5 overflow-visible">
          <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/documents')}><FileText className="w-4 h-4 shrink-0 mr-1.5" />Documents</button>
          <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('content')}>Content</button>
          <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'calendar' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('calendar')}><Calendar className="w-4 h-4 shrink-0 mr-1.5" />Calendar</button>
          <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
          <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'collaborations' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('collaborations')}>Collaborations</button>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-1.5">
          <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'connections' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('connections')}><Link2 className="w-3 h-3 inline mr-1 -mt-0.5" />Connections</button>
          <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'game-changers' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('game-changers')}><Wrench className="w-3 h-3 inline mr-1 -mt-0.5" />Tools</button>
          <button className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/create')}><Plus className="w-3 h-3 inline mr-1 -mt-0.5" />Create</button>
          <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'social-listening' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('social-listening')}><Search className="w-3 h-3 inline mr-1 -mt-0.5" />Listening</button>
          <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'game-changers' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('game-changers')}><Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />Game-Changers</button>
          <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'community' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('community')}><Users className="w-3 h-3 inline mr-1 -mt-0.5" />Community</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-optimist-950 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-0.5">
        {headerVariant === 'center' ? (
          /* Option 1: Nav in upper center — one row: [Brand+search] [Nav] [Icons] */
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5 shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-optimist-400 to-optimist-400 bg-clip-text text-transparent whitespace-nowrap leading-tight">CreatorFlow365</h1>
              <form className="relative flex items-center w-40 sm:w-56 min-h-[1.75rem] flex-shrink-0" onSubmit={(e) => { e.preventDefault(); const q = headerSearch.trim(); if (q) router.push(`/documents?search=${encodeURIComponent(q)}`); else router.push('/documents'); }}>
                <Search className="absolute left-3 w-4 h-4 text-gray-300 pointer-events-none shrink-0" aria-hidden />
                <input type="search" placeholder="Search content..." value={headerSearch} onChange={(e) => setHeaderSearch(e.target.value)} className="w-full min-h-[1.75rem] pl-9 pr-2.5 py-0.5 text-sm bg-white border-2 border-gray-700 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-optimist-500 focus:border-optimist-500" aria-label="Search content" />
              </form>
            </div>
            <nav className="hidden lg:flex flex-col gap-0.5 items-center flex-1 min-w-0 justify-center shrink-0">{navButtons}</nav>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileNavOpen((open) => !open)}
                aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileNavOpen}
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button type="button" onClick={() => setHelpCenterOpen(true)} className="p-2 text-gray-300 hover:text-optimist-400 hover:bg-gray-700 rounded-lg transition-colors" title="Help Center" aria-label="Help center"><HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" /></button>
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-white cursor-pointer" aria-hidden />
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-white cursor-pointer" aria-hidden />
              {token ? (
                <button type="button" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/signin?signed_out=1') }} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors whitespace-nowrap" title="Sign out" aria-label="Sign out"><LogOut className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Sign Out</span></button>
              ) : (
                <button type="button" onClick={() => router.push('/signin')} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium bg-optimist-600 hover:bg-optimist-500 text-white rounded-lg transition-colors whitespace-nowrap" title="Sign in" aria-label="Sign in"><LogOut className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Sign In</span></button>
              )}
            </div>
          </div>
        ) : (
          /* Option 2: Full-width nav — two rows; nav uses lower left & right */
          <>
            <div className="flex items-center justify-between gap-4 mb-0.5">
              <div className="flex flex-col gap-0.5 shrink-0">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-optimist-400 to-optimist-400 bg-clip-text text-transparent whitespace-nowrap leading-tight">CreatorFlow365</h1>
                <form className="relative flex items-center w-40 sm:w-56 min-h-[1.75rem] flex-shrink-0" onSubmit={(e) => { e.preventDefault(); const q = headerSearch.trim(); if (q) router.push(`/documents?search=${encodeURIComponent(q)}`); else router.push('/documents'); }}>
                  <Search className="absolute left-3 w-4 h-4 text-gray-300 pointer-events-none shrink-0" aria-hidden />
                  <input ref={headerSearchInputRef} type="search" placeholder="Search within the app..." value={headerSearch} onChange={(e) => setHeaderSearch(e.target.value)} className="w-full min-h-[1.75rem] pl-9 pr-2.5 py-0.5 text-sm bg-white border-2 border-gray-700 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-optimist-500 focus:border-optimist-500" aria-label="Search within the app" />
                </form>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setMobileNavOpen((open) => !open)}
                  aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileNavOpen}
                >
                  {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <button type="button" onClick={() => headerSearchInputRef.current?.focus()} className="p-2 text-gray-300 hover:text-optimist-400 hover:bg-gray-700 rounded-lg transition-colors" title="Assistant – search within the app" aria-label="Focus search"><Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                <button type="button" onClick={() => setHelpCenterOpen(true)} className="p-2 text-gray-300 hover:text-optimist-400 hover:bg-gray-700 rounded-lg transition-colors" title="Help Center" aria-label="Help center"><HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-white cursor-pointer" aria-hidden />
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-white cursor-pointer" aria-hidden />
                {token ? (
                  <button type="button" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/signin?signed_out=1') }} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors whitespace-nowrap" title="Sign out" aria-label="Sign out"><LogOut className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Sign Out</span></button>
                ) : (
                  <button type="button" onClick={() => router.push('/signin')} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium bg-optimist-600 hover:bg-optimist-500 text-white rounded-lg transition-colors whitespace-nowrap" title="Sign in" aria-label="Sign in"><LogOut className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Sign In</span></button>
                )}
              </div>
            </div>
            <div className="hidden lg:block w-full">
              <nav className="inline-flex items-start gap-1.5" aria-label="Dashboard sections">
                <div className="inline-flex items-center gap-1.5 shrink-0">
                  <button className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('overview')}>Overview</button>
                  <button
          type="button"
          onClick={() => {
            setClaudeOpen(false)
            setAiCoachOpen((v) => !v)
          }}
          aria-label={aiCoachOpen ? 'Close AI coach' : 'Open AI coach'}
          className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-sage-500 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          AI coach
        </button>
        <button
          type="button"
          onClick={() => {
            setAiCoachOpen(false)
            setClaudeOpen((v) => !v)
          }}
          aria-label={claudeOpen ? 'Close Claude' : 'Open Claude'}
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-300 px-3 py-1.5 text-sm font-semibold text-black shadow hover:bg-yellow-200 transition-colors"
        >
          Claude
        </button>

                </div>
                <div className="inline-flex flex-col items-start gap-0.5">
                  <div className="flex flex-nowrap items-center justify-start gap-1.5 overflow-visible">
                    <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/documents')}><FileText className="w-4 h-4 shrink-0 mr-1.5" />Documents</button>
                    <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('content')}>Content</button>
                    <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'calendar' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('calendar')}><Calendar className="w-4 h-4 shrink-0 mr-1.5" />Calendar</button>
                    <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'collaborations' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('collaborations')}>Collaborations</button>
                  </div>
                  <div className="flex flex-wrap items-center justify-start gap-1.5">
                    <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'connections' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('connections')}><Link2 className="w-3 h-3 inline mr-1 -mt-0.5" />Connections</button>
                    <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'game-changers' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('game-changers')}><Wrench className="w-3 h-3 inline mr-1 -mt-0.5" />Tools</button>
                    <button className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-700" onClick={() => router.push('/create')}><Plus className="w-3 h-3 inline mr-1 -mt-0.5" />Create</button>
                    <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'social-listening' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('social-listening')}><Search className="w-3 h-3 inline mr-1 -mt-0.5" />Listening</button>
                    <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'game-changers' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('game-changers')}><Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />Game-Changers</button>
                    <button className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'community' ? 'bg-optimist-600' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('community')}><Users className="w-3 h-3 inline mr-1 -mt-0.5" />Community</button>
                  </div>
                </div>
              </nav>
            </div>
          </>
        )}
        {mobileNavOpen && (
          <nav className="lg:hidden border-t border-gray-700 bg-gray-800 px-4 py-3" aria-label="Dashboard navigation">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mobileNavLinks.map((item) => {
                const isActive = item.tab ? activeTab === item.tab : false
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.tab) setTab(item.tab)
                      else if (item.href) {
                        setMobileNavOpen(false)
                        router.push(item.href)
                      } else if (item.action === 'ai-coach') {
                        setMobileNavOpen(false)
                        setClaudeOpen(false)
                        setAiCoachOpen(true)
                      } else if (item.action === 'claude') {
                        setMobileNavOpen(false)
                        setAiCoachOpen(false)
                        setClaudeOpen(true)
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-optimist-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </nav>
        )}
      </header>

      <AiCoachCorner token={token || null} open={aiCoachOpen} onOpenChange={setAiCoachOpen} />
      <ClaudeCorner token={token || null} open={claudeOpen} onOpenChange={setClaudeOpen} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6 shrink-0">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-optimist-600 to-optimist-600 p-4 rounded-lg">
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
                <button
                  onClick={() => router.push('/documents')}
                  className="w-full flex items-center gap-3 p-3 bg-optimist-600 hover:bg-optimist-500 rounded-lg transition-colors text-white font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Open Documents
                </button>
                <button
                  onClick={() => router.push('/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
                <button
                  onClick={() => router.push('/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                <button
                  onClick={() => router.push('/analytics')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
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
                  <p className="text-xs text-gray-300">2 hours ago</p>
                </div>
                <div className="p-2 bg-gray-700 rounded">
                  <p className="text-gray-300">New collaboration request</p>
                  <p className="text-xs text-gray-300">5 hours ago</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/signin?signed_out=1')
              }}
              className="w-full flex items-center justify-center gap-2 p-3 mt-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" aria-hidden />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          {(subscribeError || subscribeDebug) && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/60 border-2 border-red-500 text-red-100">
              <p className="font-bold text-lg text-red-50">Could not open checkout</p>
              {subscribeError && <p className="mt-2 text-sm text-red-100">{decodeURIComponent(subscribeError)}</p>}
              {subscribeDebug && <pre className="mt-2 text-xs font-mono whitespace-pre-wrap break-all bg-black/40 text-amber-100 p-2 rounded">{decodeURIComponent(subscribeDebug)}</pre>}
              <button
                type="button"
                onClick={() => {
                  setSubscribeError(null)
                  setSubscribeDebug(null)
                  router.replace('/dashboard')
                }}
                className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded font-medium"
              >
                Dismiss
              </button>
            </div>
          )}
          {dashboardNotice && (
            <div className="mb-6 p-4 rounded-lg bg-blue-900/40 border border-blue-600/60 text-blue-100" role="status">
              <p className="text-sm sm:text-base">{dashboardNotice}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {dashboardNoticeHref && (
                  <button
                    type="button"
                    onClick={() => router.push(dashboardNoticeHref)}
                    className="rounded-md bg-optimist-600 px-4 py-2 text-sm font-semibold text-white hover:bg-optimist-500 transition-colors"
                  >
                    Open Documents
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDashboardNotice(null)
                    setDashboardNoticeHref(null)
                  }}
                  className="text-sm text-blue-200 hover:text-white underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          <TrialStatusBanner />

          {/* Phone / portrait tablet: Documents first. Hidden on lg+ (laptop / landscape tablet). */}
          <div className="mb-6 lg:hidden rounded-2xl bg-gray-800/60 ring-1 ring-optimist-800/50 p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white">Documents workspace</h3>
            <p className="mt-1 text-sm text-gray-300">
              Save your original once. Pick a platform. Copy formatted.
            </p>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Works on your phone for draft → format → copy. On a tablet or laptop you also get the wider toolkit — same account, more room.
            </p>
            <button
              type="button"
              onClick={() => router.push('/documents')}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-optimist-600 px-4 py-3 text-base font-semibold text-white hover:bg-optimist-500 transition-colors w-full min-h-[44px]"
            >
              Open Documents
            </button>
          </div>
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="mb-6 hidden lg:block rounded-2xl bg-gray-800/60 ring-1 ring-optimist-800/50 p-5 border border-gray-700">
                <h3 className="text-lg font-semibold text-white">Documents workspace</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Save your original once. Pick a platform. Copy formatted text.
                </p>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  Works on your phone for draft → format → copy. On a tablet or laptop you also get the wider toolkit — same account, more room.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/documents')}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-optimist-600 px-4 py-2 text-sm font-semibold text-white hover:bg-optimist-500 transition-colors"
                >
                  Open Documents
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Total Followers</p>
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
                      <p className="text-gray-300 text-sm">Engagement Rate</p>
                      <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-optimist-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +0.8% this month
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Reach</p>
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
                      <p className="text-gray-300 text-sm">Impressions</p>
                      <p className="text-2xl font-bold">{analytics.impressions.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-optimist-400" />
                  </div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +25% this month
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <MoreAiToolsRow token={token} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {uniquePosts.slice(0, 5).map((post) => (
                      <div key={post.id} className={`flex items-center justify-between p-4 rounded-lg ${
                        post.isLocked ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-700'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            post.status === 'scheduled' ? 'bg-yellow-400' : 
                            post.status === 'published' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{post.platform}</p>
                              {post.isLocked && <LockedContentIcon />}
                            </div>
                            <p className="text-sm text-gray-300 truncate max-w-xs">{post.content}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">
                            {post.scheduled_at 
                              ? new Date(post.scheduled_at).toLocaleDateString() 
                              : new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-300">{post.status}</p>
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
                        <p className="text-sm text-gray-300">Instagram • 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">2.4K likes</p>
                        <p className="text-sm text-green-400">+15% engagement</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Launch</p>
                        <p className="text-sm text-gray-300">Twitter • 1 week ago</p>
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
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Content Management</h2>
                  <HelpIcon 
                    content="Manage all your content here: documents, templates, hashtag sets, and engagement. Use the tools below to research hashtags, create templates, and track engagement."
                    title="Content Management"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBot('hashtag-research')}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <Tag className="w-5 h-5" />
                    Hashtag research
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBot('content-templates')}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <Layers className="w-5 h-5" />
                    Templates
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBot('engagement-inbox')}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Engagement inbox
                  </button>
                  <button
                    onClick={() => router.push('/create')}
                    className="px-6 py-3 bg-gradient-to-r from-optimist-500 to-optimist-500 rounded-lg font-semibold hover:from-optimist-600 hover:to-optimist-600 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Post
                  </button>
                </div>
              </div>

              {visiblePosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 mb-4">{uniquePosts.length === 0 ? 'No posts yet. Create your first post!' : 'No posts match that search.'}</p>
                  <button
                    onClick={() => router.push('/create')}
                    className="px-6 py-3 bg-gradient-to-r from-optimist-500 to-optimist-500 rounded-lg font-semibold hover:from-optimist-600 hover:to-optimist-600 transition-all"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visiblePosts.map((post) => (
                    <div 
                      key={post.id} 
                      className={`bg-gray-800 p-6 rounded-lg border ${
                        post.isLocked 
                          ? 'border-blue-500/50 bg-blue-500/5' 
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                            {post.platform}
                          </span>
                          {post.isLocked && <LockedContentIcon />}
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          post.status === 'scheduled' ? 'bg-yellow-500 text-black' : 
                          post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      
                      {post.isLocked && (
                        <LockedContentBadge 
                          message="This content is locked"
                          showUpgradeButton={true}
                          size="sm"
                        />
                      )}
                      
                      <p className="text-gray-300 mb-4 mt-4">{post.content}</p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                        <span>
                          {post.scheduled_at 
                            ? new Date(post.scheduled_at).toLocaleDateString() 
                            : new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (post.isLocked) {
                              alert('This content is locked. Upgrade to edit it.')
                              return
                            }
                            router.push(`/create?edit=${encodeURIComponent(post.id)}`)
                          }}
                          disabled={post.isLocked}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            post.isLocked
                              ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {post.isLocked ? '🔒 Locked' : 'Edit'}
                        </button>
                        <button
                          onClick={() => {
                            if (post.isLocked) {
                              alert('This content is locked. Upgrade to export it.')
                              return
                            }
                            exportPost(post)
                          }}
                          disabled={post.isLocked}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            post.isLocked
                              ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                              : 'bg-optimist-600 hover:bg-optimist-700'
                          }`}
                        >
                          {post.isLocked ? '🔒 Locked' : 'Export'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <CalendarView token={token} />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <AdvancedAnalytics token={token} />
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <PlatformConnections token={token} />
            </div>
          )}

          {activeTab === 'social-listening' && (
            <div className="space-y-6">
              <SocialListening token={token} />
            </div>
          )}

          {activeTab === 'game-changers' && (
            <div className="space-y-6">
              <GameChangerFeatures token={token} />
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <WhosOn token={token} />
                </div>
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <CreatorChat token={token} />
                    <MessageBoard token={token} />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <ContentTypesSettings token={token} />
              </div>
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Brand Collaborations</h2>
              <CollaborationMarketplaceUI token={token} />
            </div>
          )}

          {selectedBot && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedBot === 'hashtag-research' && 'Hashtag Research'}
                    {selectedBot === 'content-templates' && 'Content Templates'}
                    {selectedBot === 'engagement-inbox' && 'Engagement Inbox'}
                  </h2>
                  <button type="button" onClick={() => setSelectedBot(null)} className="text-gray-400 hover:text-white text-2xl" aria-label="Close">×</button>
                </div>
                {selectedBot === 'hashtag-research' && <HashtagResearchUI token={token} onClose={() => setSelectedBot(null)} />}
                {selectedBot === 'content-templates' && <ContentTemplatesUI token={token} onClose={() => setSelectedBot(null)} />}
                {selectedBot === 'engagement-inbox' && <EngagementInboxUI token={token} onClose={() => setSelectedBot(null)} />}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Help Center Modal */}
      <HelpCenter isOpen={helpCenterOpen} onClose={() => setHelpCenterOpen(false)} />
    </div>
  )
}
