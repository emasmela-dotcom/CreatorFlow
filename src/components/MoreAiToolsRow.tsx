'use client'

import { useState } from 'react'
import ContentAssistantBot from '@/components/bots/ContentAssistantBot'
import SchedulingAssistantBot from '@/components/bots/SchedulingAssistantBot'
import TrendScoutBot from '@/components/bots/TrendScoutBot'

type ToolId = 'assistant' | 'schedule' | 'trends'

const PLATFORMS = ['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'] as const

export default function MoreAiToolsRow({ token }: { token: string }) {
  const [active, setActive] = useState<ToolId | null>(null)
  const [platform, setPlatform] = useState<string>('instagram')
  const [draft, setDraft] = useState('')
  const [hashtags, setHashtags] = useState('')

  if (!token) return null

  const tools: { id: ToolId; label: string }[] = [
    { id: 'assistant', label: 'Caption coach' },
    { id: 'schedule', label: 'Best times' },
    { id: 'trends', label: 'Trend scout' },
  ]

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">More AI tools</h3>
        <p className="text-xs text-gray-400 mt-1">Quick access — not the full tools list.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setActive(active === tool.id ? null : tool.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              active === tool.id ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-gray-400">
          Platform
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="ml-2 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      {active === 'assistant' && (
        <div className="space-y-3 border-t border-gray-700 pt-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste a caption draft to review…"
            rows={3}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-400"
          />
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="Optional hashtags"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-400"
          />
          {draft.trim() ? (
            <ContentAssistantBot content={draft} platform={platform} hashtags={hashtags} token={token} />
          ) : (
            <p className="text-xs text-gray-400">Add caption text above to run the coach.</p>
          )}
        </div>
      )}

      {active === 'schedule' && (
        <div className="border-t border-gray-700 pt-4">
          <SchedulingAssistantBot platform={platform} token={token} />
        </div>
      )}

      {active === 'trends' && (
        <div className="border-t border-gray-700 pt-4">
          <TrendScoutBot platform={platform} token={token} />
        </div>
      )}
    </div>
  )
}
