'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function AiCoachCorner({ token, open, onOpenChange }: AiCoachCornerProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [hashtags, setHashtags] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isControlled = open !== undefined
  const isOpen = isControlled ? Boolean(open) : internalOpen

  const setIsOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    if (isControlled) {
      const nextValue = typeof value === 'function' ? value(isOpen) : value
      onOpenChange?.(nextValue)
    } else {
      setInternalOpen(value)
    }
  }

  if (!token) {
    if (isControlled && !isOpen) return null
    return (
      <a
        href="/signin"
        className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-sage-500 transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        Sign in for AI coach
      </a>
    )
  }

  const panel =
    isOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-20">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close AI coach backdrop"
              onClick={() => setIsOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="AI coach"
              className="relative z-10 my-4 w-full max-w-sm rounded-2xl bg-gray-800 ring-1 ring-optimist-700 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-optimist-800/50 px-4 py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sage-400" />
                    <span className="text-sm font-semibold text-white">AI coach</span>
                  </div>
                  <span className="text-[10px] leading-none text-gray-400">Powered by Groq</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close AI coach"
                  className="rounded-md p-1 text-gray-300 transition-colors hover:bg-optimist-800/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-300">
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
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-300">
                    Caption / content
                  </label>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Paste your caption here..."
                    rows={4}
                    className="mt-1.5 block w-full resize-y rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-300">
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
          </div>,
          document.body
        )
      : null

  return (
    <>
      {!isControlled && (
        <div className="relative inline-block align-middle">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close AI coach' : 'Open AI coach'}
            className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-3 py-1.5 text-sm font-semibold text-white shadow transition-colors hover:bg-sage-500"
          >
            <Sparkles className="h-4 w-4" />
            AI coach
          </button>
        </div>
      )}
      {panel}
    </>
  )
}
