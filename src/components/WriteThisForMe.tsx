"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface WriteThisForMeProps {
  token: string
  onDraft: (text: string) => void
}

export default function WriteThisForMe({ token, onDraft }: WriteThisForMeProps) {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWrite = async () => {
    if (!token) {
      router.push("/signin?next=/create")
      return
    }
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/bots/content-writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          type: "social-post",
          tone: "casual",
        }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = await res.json()
      onDraft(data.content.content)
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="What should we write about?"
        rows={3}
        className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="button"
          onClick={handleWrite}
          disabled={loading || !topic.trim()}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Writing..." : "Write this for me"}
        </button>
      </div>
    </div>
  )
}
