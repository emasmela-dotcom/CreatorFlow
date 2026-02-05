'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FileText, Plus, Search, Tag, Pin, PinOff, Edit, Trash2, Folder, X, Save } from 'lucide-react'

export default function DocumentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingDoc, setEditingDoc] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || ''
      setToken(storedToken)
      
      if (!storedToken) {
        router.push('/signin')
      } else {
        loadDocuments()
      }
    }
  }, [router])

  const loadDocuments = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)

      const response = await fetch(`/api/documents?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadDocuments()
    }
  }, [searchTerm, selectedCategory, token])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingDoc?.id,
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || null,
          tags: tags.trim() || null,
          is_pinned: isPinned
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save')

      setShowEditor(false)
      setEditingDoc(null)
      setTitle('')
      setContent('')
      setCategory('')
      setTags('')
      setIsPinned(false)
      loadDocuments()
    } catch (error: any) {
      alert('Failed to save: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (doc: any) => {
    setEditingDoc(doc)
    setTitle(doc.title)
    setContent(doc.content)
    setCategory(doc.category || '')
    setTags(doc.tags || '')
    setIsPinned(doc.is_pinned || false)
    setShowEditor(true)
  }

  const handleNew = () => {
    setEditingDoc(null)
    setTitle('')
    setContent('')
    setCategory('')
    setTags('')
    setIsPinned(false)
    setShowEditor(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this document?')) return

    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete')
      loadDocuments()
    } catch (error: any) {
      alert('Failed to delete: ' + error.message)
    }
  }

  const handleTogglePin = async (doc: any) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          category: doc.category,
          tags: doc.tags,
          is_pinned: !doc.is_pinned
        })
      })
      const data = await response.json()
      if (data.success) loadDocuments()
    } catch (error) {
      console.error('Failed to toggle pin:', error)
    }
  }

  const handleCopyToPost = (doc: any) => {
    // Copy content to clipboard for pasting into posts
    navigator.clipboard.writeText(doc.content)
    alert('✅ Content copied! Paste it into your post editor.')
  }

  const categories = Array.from(new Set(documents.map(d => d.category).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              My Documents
            </h1>
            <span className="text-sm text-gray-400">
              {documents.length} document{documents.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingDoc ? 'Edit Document' : 'New Document'}
                </h2>
                <button
                  onClick={() => setShowEditor(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Document title..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category (optional)</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Blog Posts, Ideas, Notes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (optional)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-96 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                    placeholder="Write your content here... You can paste from Google Docs, Notion, Word, etc."
                  />
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                    <span>{content.trim().split(/\s+/).filter(w => w.length > 0).length} words</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                      />
                      <span>Pin to top</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim() || !content.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-gray-400 mb-6">Create your first document to get started!</p>
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
            >
              Create Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  doc.is_pinned ? 'border-yellow-500/50' : 'border-gray-700'
                } hover:border-gray-600 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {doc.is_pinned && <Pin className="w-4 h-4 text-yellow-400" />}
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                    </div>
                    {doc.category && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <Folder className="w-3 h-3" />
                        {doc.category}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTogglePin(doc)}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                      title={doc.is_pinned ? 'Unpin' : 'Pin'}
                    >
                      {doc.is_pinned ? (
                        <Pin className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <PinOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                  {doc.content.substring(0, 150)}
                  {doc.content.length > 150 ? '...' : ''}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{doc.word_count || 0} words</span>
                  <span>{new Date(doc.updated_at).toLocaleDateString()}</span>
                </div>

                {doc.tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doc.tags.split(',').slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCopyToPost(doc)}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                  >
                    Copy to Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

