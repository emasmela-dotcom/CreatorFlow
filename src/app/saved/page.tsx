'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type SavedDoc = {
  id: number | string
  title?: string
  content?: string
  video_url?: string | null
  video_filename?: string | null
  video_size_bytes?: number | null
  updated_at?: string
}

function isImage(doc: SavedDoc): boolean {
  return /\.(jpe?g|png|gif|webp|heic|heif)(\?|$)/i.test(doc.video_filename || doc.video_url || '')
}

export default function SavedPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [docs, setDocs] = useState<SavedDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<SavedDoc | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [playUrl, setPlayUrl] = useState<string | null>(null)
  const [playError, setPlayError] = useState(false)
  const [playReady, setPlayReady] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('token') || ''
    if (!t) {
      router.replace('/signup?next=/saved')
      return
    }
    setToken(t)
    fetch('/api/documents', {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error || 'Could not load saved work')
        setDocs(data.documents || [])
      })
      .catch((err) => setError(err.message || 'Could not load saved work'))
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (!editing?.video_url || !token || isImage(editing)) {
      setPlayUrl(isImage(editing) ? editing?.video_url || null : null)
      setPlayError(false)
      setPlayReady(false)
      return
    }

    let objectUrl = ''
    let cancelled = false
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 15000)
    setPlayUrl(null)
    setPlayError(false)
    setPlayReady(false)

    fetch(`/api/documents/media?id=${encodeURIComponent(String(editing.id))}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        const type = res.headers.get('content-type') || ''
        if (!res.ok || type.includes('application/json') || type.includes('text/html')) {
          throw new Error('Could not load video')
        }
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        const type = blob.type || ''
        if (!blob.size || type.includes('json') || type.includes('html')) {
          throw new Error('empty')
        }
        objectUrl = URL.createObjectURL(blob)
        setPlayUrl(objectUrl)
      })
      .catch(() => {
        if (!cancelled) setPlayError(true)
      })
      .finally(() => window.clearTimeout(timer))

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timer)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [editing, token])

  useEffect(() => {
    if (!playUrl || playReady || playError || isImage(editing || {})) return
    const id = window.setTimeout(() => setPlayError(true), 8000)
    return () => window.clearTimeout(id)
  }, [playUrl, playReady, playError, editing])

  const openDoc = (doc: SavedDoc) => {
    setEditing(doc)
    setTitle(doc.title || '')
    setContent(doc.content || '')
    setError(null)
  }

  const saveEdit = async () => {
    if (!editing || !token) return
    const trimmedTitle = title.trim() || 'Draft'
    if (!content.trim() && !editing.video_url) {
      setError('Add some text before saving.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editing.id,
          title: trimmedTitle,
          content,
          video_url: editing.video_url,
          video_filename: editing.video_filename,
          video_size_bytes: editing.video_size_bytes,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed')
      setDocs((prev) =>
        prev.map((d) => (String(d.id) === String(editing.id) ? { ...d, title: trimmedTitle, content } : d))
      )
      setEditing(null)
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-optimist-950 text-white overflow-x-hidden pb-24">
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => (editing ? setEditing(null) : router.push('/create'))}
              className="p-2 hover:bg-gray-700 rounded-lg shrink-0"
              aria-label={editing ? 'Back to list' : 'Back to Create'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold truncate">{editing ? 'Change saved work' : 'Saved'}</h1>
          </div>
          {editing ? (
            <button
              type="button"
              onClick={saveEdit}
              disabled={saving}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/create')}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm"
            >
              Create
            </button>
          )}
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        {loading && <p className="text-sm text-gray-300">Loading…</p>}

        {!loading && !editing && docs.length === 0 && (
          <p className="text-gray-300">Nothing saved yet. Create something, then tap Save Draft.</p>
        )}

        {!loading && !editing && (
          <ul className="space-y-3">
            {docs.map((doc) => (
              <li key={String(doc.id)}>
                <button
                  type="button"
                  onClick={() => openDoc(doc)}
                  className="w-full text-left rounded-lg border border-gray-700 bg-gray-800 p-4"
                >
                  <p className="font-semibold text-white">{doc.title || 'Draft'}</p>
                  <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                    {(doc.content || '').trim() || (doc.video_url ? 'Video saved' : 'No text yet')}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}

        {editing && (
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder:text-gray-400"
            />
            {editing.video_url && (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-lg border border-gray-600 bg-black">
                  {isImage(editing) ? (
                    <img
                      src={playUrl || editing.video_url}
                      alt={editing.video_filename || title || 'Saved photo'}
                      className="w-full max-h-80 object-contain bg-black"
                    />
                  ) : playError ? null : playUrl ? (
                    <video
                      src={playUrl}
                      controls
                      playsInline
                      preload="auto"
                      className="w-full max-h-80 bg-black"
                      onLoadedData={() => setPlayReady(true)}
                      onError={() => setPlayError(true)}
                    />
                  ) : null}
                </div>
                <p className="text-sm text-white">
                  {isImage(editing)
                    ? ''
                    : playError
                      ? 'This video cannot play on this phone.'
                      : playReady
                        ? 'Tap play.'
                        : 'Loading video…'}
                </p>
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Change your content here."
              className="w-full min-h-[220px] bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder:text-gray-400"
            />
          </div>
        )}
      </main>
    </div>
  )
}
