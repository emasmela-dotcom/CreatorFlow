'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Star, Loader2 } from 'lucide-react'

interface FeedbackButtonProps {
  initialToken?: string | null
}

export default function FeedbackButton({ initialToken }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<string | null>(initialToken ?? null)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialToken !== undefined) {
      setToken(initialToken)
      return
    }
    const t = localStorage.getItem('token')
    if (t) setToken(t)
  }, [initialToken])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError('')
    try {
      const isPublic = !token
      const url = isPublic ? '/api/feedback/public' : '/api/feedback'
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const body: Record<string, unknown> = { message: message.trim() }
      if (isPublic) {
        body.email = email.trim()
      } else {
        // Existing /api/feedback requires feedbackType
        body.feedbackType = 'general'
      }
      if (rating > 0) body.rating = rating

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to send feedback')

      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setMessage('')
        setRating(0)
        setEmail('')
        setError('')
      }, 1800)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Send feedback"
        aria-label="Send feedback"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-xl bg-optimist-600 px-4 py-2 text-white shadow-lg shadow-optimist-950/30 transition-colors hover:bg-optimist-500 focus:outline-none focus:ring-2 focus:ring-optimist-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-semibold">Feedback</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:items-center sm:justify-center sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            ref={modalRef}
            className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 text-gray-100 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              aria-label="Close feedback"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-1 text-lg font-semibold text-white">Send feedback</h2>
            <p className="mb-4 text-sm text-gray-400">
              {token
                ? 'We will save this to your account.'
                : 'You are not signed in. We will email this to the team.'}
            </p>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <Send className="h-6 w-6" />
                </div>
                <p className="text-lg font-medium text-white">Thanks for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!token && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-optimist-500 focus:ring-1 focus:ring-optimist-500"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like to share?"
                    className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-optimist-500 focus:ring-1 focus:ring-optimist-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Rating (optional)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="rounded p-0.5 transition-colors"
                        aria-label={`${star} star${star === 1 ? '' : 's'}`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoverRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-red-300" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading || !message.trim() || (!token && !email.trim())}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-optimist-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-optimist-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
