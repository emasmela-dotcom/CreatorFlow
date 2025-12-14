'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Reply, Heart, ThumbsUp, Lightbulb, HelpCircle, Pin } from 'lucide-react'
import UserTooltip from './UserTooltip'

interface MessageBoardProps {
  token: string
}

interface Category {
  id: number
  name: string
  description?: string
  icon?: string
}

interface Post {
  id: number
  categoryId?: number
  userId: string
  title: string
  content: string
  isPinned: boolean
  viewCount: number
  replyCount: number
  createdAt: string
  user?: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
  category?: {
    name: string
    icon?: string
  }
}

interface Reply {
  id: number
  postId: number
  userId: string
  content: string
  createdAt: string
  user?: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
  reactions?: {
    like: number
    love: number
    helpful: number
    insightful: number
  }
}

export default function MessageBoard({ token }: MessageBoardProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newReply, setNewReply] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  useEffect(() => {
    if (selectedPost) {
      loadReplies()
    }
  }, [selectedPost])

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/message-board/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadPosts = async () => {
    try {
      const url = selectedCategory
        ? `/api/message-board/posts?categoryId=${selectedCategory}`
        : '/api/message-board/posts'
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  const loadReplies = async () => {
    if (!selectedPost) return

    try {
      const res = await fetch(`/api/message-board/replies?postId=${selectedPost.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setReplies(data.replies || [])
      }
    } catch (error) {
      console.error('Error loading replies:', error)
    }
  }

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostTitle.trim() || !newPostContent.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/message-board/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          categoryId: selectedCategory
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewPostTitle('')
        setNewPostContent('')
        setShowNewPost(false)
        loadPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const createReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReply.trim() || !selectedPost) return

    setLoading(true)
    try {
      const res = await fetch('/api/message-board/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: selectedPost.id,
          content: newReply
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewReply('')
        loadReplies()
        loadPosts() // Update reply count
      }
    } catch (error) {
      console.error('Error creating reply:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (selectedPost) {
    const displayName = selectedPost.user?.fullName || selectedPost.user?.email?.split('@')[0] || 'Creator'
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700">
        {/* Post Header */}
        <div className="p-6 border-b border-gray-700">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-gray-400 hover:text-white mb-4 text-sm"
          >
            ← Back to Posts
          </button>
          <div className="flex items-start gap-3">
            {selectedPost.user?.avatarUrl ? (
              <img
                src={selectedPost.user.avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {selectedPost.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                <UserTooltip userId={selectedPost.userId} token={token}>
                  <h2 className="text-2xl font-bold text-white hover:text-purple-400 cursor-pointer">
                    {selectedPost.title}
                  </h2>
                </UserTooltip>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <UserTooltip userId={selectedPost.userId} token={token}>
                  <span className="hover:text-purple-400 cursor-pointer">{displayName}</span>
                </UserTooltip>
                <span>{formatDate(selectedPost.createdAt)}</span>
                <span>{selectedPost.viewCount} views</span>
                <span>{selectedPost.replyCount} replies</span>
              </div>
              <div className="text-gray-300 whitespace-pre-wrap">{selectedPost.content}</div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Replies ({replies.length})
          </h3>
          {replies.map((reply) => {
            const replyDisplayName = reply.user?.fullName || reply.user?.email?.split('@')[0] || 'Creator'
            return (
              <div key={reply.id} className="flex gap-3 pb-4 border-b border-gray-700 last:border-0">
                {reply.user?.avatarUrl ? (
                  <img
                    src={reply.user.avatarUrl}
                    alt={replyDisplayName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {replyDisplayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <UserTooltip userId={reply.userId} token={token}>
                      <span className="font-semibold text-white hover:text-purple-400 cursor-pointer">
                        {replyDisplayName}
                      </span>
                    </UserTooltip>
                    <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                  </div>
                  <div className="text-gray-300 mb-2 whitespace-pre-wrap">{reply.content}</div>
                  {reply.reactions && (
                    <div className="flex gap-2">
                      {reply.reactions.like > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {reply.reactions.like}
                        </span>
                      )}
                      {reply.reactions.helpful > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> {reply.reactions.helpful}
                        </span>
                      )}
                      {reply.reactions.insightful > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> {reply.reactions.insightful}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Reply Form */}
          <form onSubmit={createReply} className="mt-6">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 min-h-[100px] resize-y"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newReply.trim()}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Reply className="w-4 h-4" />
              {loading ? 'Posting...' : 'Post Reply'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Message Board
          </h3>
          <p className="text-gray-400 mt-1">Share ideas, ask questions, and connect with creators</p>
        </div>
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="p-6 border-b border-gray-700 bg-gray-900/50">
          <form onSubmit={createPost} className="space-y-3">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 min-h-[120px] resize-y"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewPost(false)
                  setNewPostTitle('')
                  setNewPostContent('')
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories & Posts */}
      <div className="flex">
        {/* Categories Sidebar */}
        <div className="w-64 border-r border-gray-700 p-4">
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {category.icon && <span>{category.icon}</span>}
                  <span>{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="flex-1 p-6">
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const displayName = post.user?.fullName || post.user?.email?.split('@')[0] || 'Creator'
                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                          <h4 className="text-lg font-semibold text-white">{post.title}</h4>
                          {post.category && (
                            <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                              {post.category.icon} {post.category.name}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-300 line-clamp-2 mb-3">{post.content}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <UserTooltip userId={post.userId} token={token}>
                            <span className="hover:text-purple-400 cursor-pointer">{displayName}</span>
                          </UserTooltip>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>{post.viewCount} views</span>
                          <span className="flex items-center gap-1">
                            <Reply className="w-3 h-3" /> {post.replyCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
