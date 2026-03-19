'use client'

import { useState } from 'react'
import { Lightbulb, X } from 'lucide-react'

type SuggestionType = 'add_on' | 'change' | 'concern'

interface SuggestionsButtonProps {
  token: string
}

export default function SuggestionsButton({ token }: SuggestionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 z-50 bg-amber-500 hover:bg-amber-400 text-black rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
        title="Suggest an add-on / change"
      >
        <Lightbulb className="w-5 h-5" />
        <span className="hidden sm:inline-block font-semibold">Suggestions</span>
      </button>

      {isOpen && (
        <SuggestionsModal token={token} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}

function SuggestionsModal({
  token,
  onClose,
}: {
  token: string
  onClose: () => void
}) {
  const [suggestionType, setSuggestionType] = useState<SuggestionType>('add_on')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = message.trim()
    if (!trimmed) {
      setError('Please write your suggestion message')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          suggestionType,
          message: trimmed,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit suggestion')
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setSuggestionType('add_on')
        setMessage('')
        onClose()
      }, 2500)
    } catch (err: any) {
      setError(err.message || 'Failed to submit suggestion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Thanks!</h3>
            <p className="text-gray-300 mb-1">
              Your suggestion was sent to the CreatorFlow365 team.
            </p>
            <p className="text-sm text-gray-400">This window will close automatically...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-300" />
            Suggest an add-on / change
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              What is this? <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'add_on' as const, label: 'Add-on' },
                { value: 'change' as const, label: 'Change' },
                { value: 'concern' as const, label: 'Concern' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSuggestionType(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    suggestionType === opt.value
                      ? 'bg-amber-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Your message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the add-on, change, or concern. Include any context so we can act on it."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[140px] resize-y"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Be as specific as possible.</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

