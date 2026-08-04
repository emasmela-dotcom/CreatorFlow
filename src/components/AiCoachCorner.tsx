'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import ContentAssistantBot from './bots/ContentAssistantBot'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
]

interface AiCoachCornerProps {
  token: string | null
}

export default function AiCoachCorner({ token }: AiCoachCornerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [hashtags, setHashtags] = useState('')

  if (!token) {
    return (
      <div className="fixed top-20 right-4 z-[100]">
        <a
          href="/signin"
          className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-sage-500 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Sign in for AI coach
        </a>
      </div>
    )
  }

  return (
    <div className="fixed top-20 right-4 z-[100]">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI coach"
          className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-sage-500 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          AI coach
        </button>
      ) : (
        <div className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-gray-800/95 ring-1 ring-optimist-700 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 border-b border-optimist-800/50">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col items-start gap-0.5">
                <Sparkles className="h-4 w-4 text-sage-400" />
                <span className="text-sm font-semibold text-white">AI coach</span>
              </div>
              <span className="text-[10px] text-gray-400 leading-none">Powered by Groq</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI coach"
              className="rounded-md p-1 text-gray-300 hover:text-white hover:bg-optimist-800/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                Caption / content
              </label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Paste your caption here..."
                rows={4}
                className="mt-1.5 block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                Hashtags (optional)
              </label>
              <input
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#creator #brand"
                className="mt-1.5 block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
              />
            </div>

            {draft.trim() ? (
              <ContentAssistantBot
                content={draft}
                platform={platform}
                hashtags={hashtags}
                token={token}
              />
            ) : (
              <p className="text-xs text-gray-300">Paste caption text above, then click Run coach.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
