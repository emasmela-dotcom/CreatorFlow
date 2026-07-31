'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  Copy,
  Check,
  Search,
  Trash2,
  Pin,
  PinOff,
  FileText,
  Plus,
  LogIn,
  Hash,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  X,
  Home,
} from 'lucide-react'
import { formatForPlatform } from '@/lib/formatForPlatform'

interface Document {
  id: number
  title: string
  content: string
  category?: string | null
  tags?: string | null
  is_pinned?: boolean
  created_at?: string
  updated_at?: string
}

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: 'bg-pink-600' },
  { id: 'twitter', label: 'X / Twitter', color: 'bg-sky-600' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-rose-600' },
  { id: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { id: 'facebook', label: 'Facebook', color: 'bg-indigo-600' },
  { id: 'pinterest', label: 'Pinterest', color: 'bg-orange-600' },
  { id: 'threads', label: 'Threads', color: 'bg-violet-600' },
]

function tagsToInput(tags: Document['tags']): string {
  if (!tags) return ''
  return tags
}

export default function DocumentsPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [docId, setDocId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isPinned, setIsPinned] = useState(false)

  const [activePlatform, setActivePlatform] = useState('instagram')
  const [hashtags, setHashtags] = useState('')
  const [copied, setCopied] = useState(false)

  const [listOpen, setListOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '')
    }
  }, [])

  const fetchDocs = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load documents')
      setDocs(data.documents || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load documents')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchDocs()
  }, [token, fetchDocs])

  const filteredDocs = useMemo(() => {
    let list = [...docs].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    })
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          (d.tags || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [docs, searchQuery])

  const newDoc = () => {
    setDocId(null)
    setTitle('')
    setContent('')
    setCategory('')
    setTagsInput('')
    setIsPinned(false)
    setActivePlatform('instagram')
    setHashtags('')
  }

  const loadDoc = (doc: Document) => {
    setDocId(doc.id)
    setTitle(doc.title)
    setContent(doc.content || '')
    setCategory(doc.category || '')
    setTagsInput(tagsToInput(doc.tags))
    setIsPinned(doc.is_pinned || false)
  }

  const handleSave = async () => {
    if (!token) return
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setSaving(true)
    setError('')
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || null,
        tags: tagsInput.trim() || null,
        is_pinned: isPinned,
      }
      if (docId) body.id = docId

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed')
      if (data.document?.id) setDocId(data.document.id)
      await fetchDocs()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    if (!confirm('Delete this document?')) return
    try {
      const res = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed')
      if (docId === id) newDoc()
      await fetchDocs()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const togglePin = async (doc: Document) => {
    if (!token) return
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          category: doc.category,
          tags: doc.tags,
          is_pinned: !doc.is_pinned,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed')
      await fetchDocs()
      if (docId === doc.id) setIsPinned(!doc.is_pinned)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const formatted = useMemo(
    () => formatForPlatform(activePlatform, content, hashtags),
    [activePlatform, content, hashtags]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Clipboard access denied')
    }
  }

  const charLimit = useMemo(() => {
    switch (activePlatform) {
      case 'twitter':
        return 280
      case 'threads':
        return 500
      case 'instagram':
        return 2200
      case 'linkedin':
        return 3000
      case 'tiktok':
        return 2200
      case 'youtube':
        return 5000
      case 'facebook':
        return 63206
      case 'pinterest':
        return 500
      default:
        return undefined
    }
  }, [activePlatform])

  const charCount = formatted.length
  const nearLimit = charLimit && charCount > charLimit * 0.9
  const overLimit = charLimit && charCount > charLimit

  if (!token) {
    return (
      <div className="min-h-screen bg-optimist-950 flex items-center justify-center px-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-900/30 ring-1 ring-sage-500/20">
            <FileText className="h-7 w-7 text-sage-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-optimist-50">Documents workspace</h1>
          <p className="mt-3 text-optimist-300 leading-relaxed">
            One draft, many exports. Save your original once and format for any platform when you need it.
          </p>
          <p className="mt-2 text-sm text-optimist-400">Sign in to create, save, and format your content.</p>
          <button
            type="button"
            onClick={() => router.push('/signin')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sage-500 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-optimist-950 text-optimist-100">
      <header className="border-b border-optimist-800/50 bg-optimist-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm font-bold text-optimist-50 hover:text-optimist-200"
            >
              CreatorFlow365
            </button>
            <span className="text-optimist-700">/</span>
            <span className="text-sm font-medium text-optimist-300">Documents</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-optimist-800 px-3 py-1.5 text-xs font-medium text-optimist-200 hover:bg-optimist-700 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={newDoc}
              className="inline-flex items-center gap-1.5 rounded-lg bg-optimist-800 px-3 py-1.5 text-xs font-medium text-optimist-200 hover:bg-optimist-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            <button type="button" onClick={() => setError('')} className="ml-auto" aria-label="Dismiss error">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-optimist-50">One draft, many exports.</h1>
              <p className="mt-1 text-sm text-optimist-300 leading-relaxed">
                Save your original once. Format for any platform when you need it — nothing extra gets saved.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-800/60 ring-1 ring-optimist-800/50">
              <div className="p-5 space-y-4">
                <div>
                  <label htmlFor="doc-title" className="block text-xs font-medium text-optimist-300 uppercase tracking-wider">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="doc-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled document"
                    className="mt-1.5 block w-full rounded-lg border border-optimist-800 bg-optimist-900/40 px-3 py-2 text-optimist-100 placeholder-optimist-500 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="doc-content" className="block text-xs font-medium text-optimist-300 uppercase tracking-wider">
                    Original content
                  </label>
                  <textarea
                    id="doc-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste or write your original content here..."
                    rows={12}
                    className="mt-1.5 block w-full rounded-lg border border-optimist-800 bg-optimist-900/40 px-3 py-2.5 text-optimist-100 placeholder-optimist-500 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 text-sm leading-relaxed resize-y"
                  />
                  <p className="mt-1.5 text-xs text-optimist-400">{content.length} characters</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="doc-category" className="block text-xs font-medium text-optimist-300 uppercase tracking-wider">
                      Category
                    </label>
                    <input
                      id="doc-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Tutorial, Review"
                      className="mt-1.5 block w-full rounded-lg border border-optimist-800 bg-optimist-900/40 px-3 py-2 text-optimist-100 placeholder-optimist-500 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="doc-tags" className="block text-xs font-medium text-optimist-300 uppercase tracking-wider">
                      Tags
                    </label>
                    <input
                      id="doc-tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="comma, separated"
                      className="mt-1.5 block w-full rounded-lg border border-optimist-800 bg-optimist-900/40 px-3 py-2 text-optimist-100 placeholder-optimist-500 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPinned((p) => !p)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isPinned
                        ? 'bg-sage-900/30 text-sage-300 ring-1 ring-sage-500/30'
                        : 'bg-optimist-800 text-optimist-300 hover:bg-optimist-700'
                    }`}
                  >
                    {isPinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
                    {isPinned ? 'Pinned' : 'Pin'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !title.trim() || !content.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sage-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving…' : docId ? 'Update original' : 'Save original'}
                  </button>
                  {docId && <span className="text-xs text-optimist-400">Editing saved document</span>}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-800/40 ring-1 ring-optimist-800/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setListOpen((o) => !o)}
                className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-optimist-900/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-optimist-400" />
                  <span className="text-sm font-semibold text-optimist-200">Your documents</span>
                  <span className="rounded-full bg-optimist-800 px-2 py-0.5 text-xs text-optimist-300">{docs.length}</span>
                </div>
                {listOpen ? <ChevronDown className="h-4 w-4 text-optimist-500" /> : <ChevronRight className="h-4 w-4 text-optimist-500" />}
              </button>
              {listOpen && (
                <div className="border-t border-optimist-800/50 px-5 py-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-4 w-4 text-optimist-500" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search documents…"
                      aria-label="Search documents"
                      className="block w-full rounded-lg border border-optimist-800 bg-optimist-900/30 pl-9 pr-3 py-1.5 text-sm text-optimist-100 placeholder-optimist-500 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                    />
                  </div>
                  {loading ? (
                    <p className="text-sm text-optimist-400 py-4 text-center">Loading…</p>
                  ) : filteredDocs.length === 0 ? (
                    <p className="text-sm text-optimist-400 py-4 text-center">
                      {searchQuery ? 'No matches' : 'No documents yet. Save your first above.'}
                    </p>
                  ) : (
                    <ul className="space-y-1 max-h-80 overflow-y-auto pr-1">
                      {filteredDocs.map((doc) => (
                        <li
                          key={doc.id}
                          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                            docId === doc.id ? 'bg-sage-900/20 ring-1 ring-sage-500/20' : 'hover:bg-optimist-900/30'
                          }`}
                          onClick={() => loadDoc(doc)}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {doc.is_pinned && <Pin className="h-3 w-3 text-sage-400 shrink-0" />}
                              <p className="text-sm font-medium text-optimist-100 truncate">{doc.title}</p>
                            </div>
                            <p className="text-xs text-optimist-400 truncate mt-0.5">
                              {doc.content?.slice(0, 60).replace(/\n/g, ' ') || 'No content'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePin(doc)
                              }}
                              className="rounded p-1 text-optimist-400 hover:text-sage-300 hover:bg-optimist-800/50"
                              title={doc.is_pinned ? 'Unpin' : 'Pin'}
                            >
                              {doc.is_pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(doc.id)
                              }}
                              className="rounded p-1 text-optimist-400 hover:text-red-400 hover:bg-red-900/20"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl bg-gray-800/60 ring-1 ring-optimist-800/50 p-5 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-optimist-200 uppercase tracking-wider">Format for platform</h2>
                <p className="mt-1 text-xs text-optimist-400">Formatted copy is not saved — only your original is stored.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePlatform(p.id)}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      activePlatform === p.id
                        ? `${p.color} text-white shadow-sm`
                        : 'bg-optimist-800 text-optimist-200 hover:bg-optimist-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="fmt-hashtags" className="flex items-center gap-1.5 text-xs font-medium text-optimist-300 uppercase tracking-wider">
                  <Hash className="h-3 w-3" />
                  Optional hashtags
                </label>
                <input
                  id="fmt-hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#creator #brand #content"
                  className="mt-1.5 block w-full rounded-lg border border-optimist-800 bg-optimist-900/40 px-3 py-2 text-optimist-100 placeholder-optimist-500 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 text-sm"
                />
              </div>

              {charLimit && (
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-medium ${
                      overLimit ? 'text-red-400' : nearLimit ? 'text-amber-400' : 'text-optimist-400'
                    }`}
                  >
                    {charCount} / {charLimit}
                  </span>
                  {overLimit && <span className="text-red-400">Over limit</span>}
                </div>
              )}

              <div className="relative">
                <div className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-md bg-optimist-800/80 px-2.5 py-1.5 text-xs font-medium text-optimist-100 hover:bg-optimist-700 backdrop-blur transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy formatted
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-lg border border-optimist-800 bg-optimist-950/50 p-4 pt-10 min-h-[12rem]">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-optimist-100 font-mono">
                    {formatted || 'Paste original content on the left, then pick a platform.'}
                  </pre>
                </div>
              </div>

              <p className="text-xs text-optimist-400">
                Live preview only. Adjust your original on the left and pick a platform to see formatting.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-800/40 ring-1 ring-optimist-800/50 p-5">
              <h3 className="text-xs font-semibold text-optimist-300 uppercase tracking-wider">Media</h3>
              <p className="mt-3 text-sm text-optimist-400">Video attach — coming soon.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
