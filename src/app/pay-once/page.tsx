'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PayOnceInner() {
  const searchParams = useSearchParams()
  const paid = searchParams.get('paid') === '1'
  const canceled = searchParams.get('canceled') === '1'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const startPayment = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/pay-once', { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start the payment.')
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the payment.')
      setLoading(false)
    }
  }

  return (
    <main id="main-content" className="min-h-screen bg-optimist-950 text-white px-6 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Pay 10 cents once</h1>
        <p className="text-gray-200 mb-6">
          This charges 10 cents one time on the Stripe account connected to CreatorFlow365. It does not start a monthly plan.
        </p>
        {paid && (
          <p className="mb-6 rounded-lg border border-sage-500 bg-sage-900/40 px-4 py-3 text-white">
            Payment went through. Check Stripe for a 10 cent payment named CreatorFlow365 payment test.
          </p>
        )}
        {canceled && (
          <p className="mb-6 rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200">
            Payment was canceled. No charge was made.
          </p>
        )}
        {error && (
          <p className="mb-6 rounded-lg border border-red-400 bg-red-950 px-4 py-3 text-white" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={startPayment}
          disabled={loading}
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-60"
        >
          {loading ? 'Opening payment…' : 'Pay 10 cents now'}
        </button>
      </div>
    </main>
  )
}

export default function PayOncePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-optimist-950 text-white px-6 py-16">Loading…</main>}>
      <PayOnceInner />
    </Suspense>
  )
}
