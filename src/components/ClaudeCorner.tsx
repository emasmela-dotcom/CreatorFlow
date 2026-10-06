'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import ClaudeWrite from './ClaudeWrite'

interface ClaudeCornerProps {
  token: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ClaudeCorner({ token, open, onOpenChange }: ClaudeCornerProps) {
  const [mounted, setMounted] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!open || !mounted || !token) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-20">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close Claude"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Claude"
        className="relative z-10 my-4 w-full max-w-sm rounded-2xl bg-gray-800 ring-1 ring-yellow-400 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
          <span className="text-sm font-semibold text-white">Claude</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close Claude"
            className="rounded-md p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <ClaudeWrite token={token} onDraft={setDraft} />
          {draft ? (
            <textarea
              readOnly
              value={draft}
              className="w-full min-h-[8rem] rounded-md border border-gray-600 bg-gray-950 p-3 text-sm text-white"
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  )
}
