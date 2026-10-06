'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClaudeWriteProps {
  token: string
  onDraft: (text: string) => void
}

export default function ClaudeWrite({ token, onDraft }: ClaudeWriteProps) {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWrite = async () => {
    if (!token) {
      router.push('/signin?next=/create')
      return
    }
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/claude-write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json()
      if (!res.ok || !data.content) {
        throw new Error(data.error || 'Claude could not write.')
      }
      onDraft(data.content)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Claude could not write.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-yellow-400 bg-gray-900 p-4">
      <p className="mb-2 text-sm font-semibold text-white">Claude</p>
      <p className="mb-3 text-sm text-gray-200">10 writes per day. Add-on.</p>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="What should Claude write about?"
        rows={3}
        className="w-full resize-none rounded-md border border-gray-600 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="button"
          onClick={handleWrite}
          disabled={loading || !topic.trim()}
          className="rounded-md bg-yellow-300 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Writing…' : 'Write with Claude'}
        </button>
      </div>
    </div>
  )
}
