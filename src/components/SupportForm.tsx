'use client'

import { type FormEvent, useState } from 'react'

export default function SupportForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      })
      const data = (await response.json()) as {
        ok?: boolean
        confirmationSent?: boolean
        error?: string
      }

      if (!response.ok || data.ok !== true) {
        setError(data.error ?? 'Something went wrong. Your message was not delivered.')
        return
      }

      setConfirmationSent(Boolean(data.confirmationSent))
      setSent(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-lg border border-purple-500/40 bg-gray-800 p-6">
        <p className="text-sm text-gray-100">
          {confirmationSent ? (
            <>
              Your message was sent. Check {email} for a confirmation — we will reply there too.
            </>
          ) : (
            <>
              Your message was sent to support@creatorflow365.com. We could not email a confirmation
              to {email} yet — we will still reply to that address.
            </>
          )}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="support-email" className="text-xs font-semibold uppercase tracking-wide text-purple-300">
          Your email
        </label>
        <input
          id="support-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="support-message" className="text-xs font-semibold uppercase tracking-wide text-purple-300">
          Message
        </label>
        <textarea
          id="support-message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2 w-full resize-y rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="What do you need help with?"
        />
      </div>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-300">Message not delivered</p>
          <p className="mt-2 text-sm text-red-200">{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
