'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, CreditCard } from 'lucide-react'
import TrialEndNotification from '@/components/TrialEndNotification'

export default function TrialStatusBanner() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutDebug, setCheckoutDebug] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionStatus()
    const stored = sessionStorage.getItem('creatorflow_subscribe_error')
    if (stored) {
      setCheckoutError(stored)
      sessionStorage.removeItem('creatorflow_subscribe_error')
    }
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/subscription/manage', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error)
    } finally {
      setLoading(false)
    }
  }

  /** When no Stripe yet: start checkout to subscribe and keep content. When already subscribed: refresh. */
  const handleContinue = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    if (subscriptionData?.subscription) {
      await fetchSubscriptionStatus()
      return
    }
    setCheckoutLoading(true)
    setCheckoutError(null)
    setCheckoutDebug(null)
    try {
      const planType = subscriptionData?.trialPlan || subscriptionData?.plan || 'starter'
      const res = await fetch('/api/stripe/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planType }),
      })
      const text = await res.text()
      let data: { url?: string; redirect?: string; success?: boolean; error?: string } = {}
      try {
        data = JSON.parse(text)
      } catch {
        setCheckoutError('Server returned non-JSON. Check Vercel Production env and logs.')
        setCheckoutDebug(`Status: ${res.status}\nBody: ${text.slice(0, 500)}`)
        setCheckoutLoading(false)
        return
      }
      setCheckoutDebug(`Status: ${res.status}\nResponse: ${JSON.stringify(data)}`)
      if (res.ok && data.url && typeof data.url === 'string' && data.url.startsWith('http')) {
        const opened = window.open(data.url, '_blank', 'noopener,noreferrer')
        if (!opened) window.location.href = data.url
        setCheckoutLoading(false)
        return
      }
      if (res.ok && data.success && data.redirect) {
        window.location.href = data.redirect
        return
      }
      const errMsg = data.error || `Checkout failed (${res.status}). Set STRIPE_SECRET_KEY and STRIPE_PRICE_* in Vercel Production.`
      setCheckoutError(errMsg)
      sessionStorage.setItem('creatorflow_subscribe_error', errMsg)
    } catch (e) {
      console.error('Checkout error:', e)
      const errMsg = 'Network or server error. Check Vercel Production env.'
      setCheckoutError(errMsg)
      setCheckoutDebug(String(e))
      sessionStorage.setItem('creatorflow_subscribe_error', errMsg)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleCancel = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/subscription/manage', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Redirect or show success message
        window.location.href = '/dashboard?canceled=true'
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
    }
  }

  if (loading || !subscriptionData) {
    return null
  }

  return (
    <>
      {subscriptionData.isInTrial && subscriptionData.daysRemaining !== null && (
        <TrialEndNotification
          daysRemaining={subscriptionData.daysRemaining}
          onContinue={handleContinue}
          onCancel={handleCancel}
        />
      )}

      {checkoutError && (
        <div className="mb-4 p-4 rounded-lg bg-red-900/40 border-2 border-red-500 text-red-100">
          <p className="font-semibold">Subscribe button failed</p>
          <p className="text-sm mt-1">{checkoutError}</p>
        </div>
      )}
      {checkoutDebug && (
        <div className="mb-4 p-4 rounded-lg bg-amber-900/40 border-2 border-amber-600 text-amber-100 font-mono text-xs whitespace-pre-wrap break-all">
          <p className="font-semibold">Server response (copy this and send to fix):</p>
          <p className="mt-1">{checkoutDebug}</p>
        </div>
      )}
      {subscriptionData.isInTrial && subscriptionData.daysRemaining !== null && subscriptionData.daysRemaining > 3 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-400">Free Trial Active</p>
                <p className="text-xs text-gray-300">
                  {subscriptionData.daysRemaining} {subscriptionData.daysRemaining === 1 ? 'day' : 'days'} remaining
                  {subscriptionData.trialPlan || subscriptionData.plan ? ` • ${String(subscriptionData.trialPlan || subscriptionData.plan).charAt(0).toUpperCase() + String(subscriptionData.trialPlan || subscriptionData.plan).slice(1)} plan` : ''}
                </p>
              </div>
            </div>
            {!subscriptionData.subscription && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={checkoutLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  {checkoutLoading ? 'Redirecting...' : "Keep what you've built—subscribe to save your work and keep your tools"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!subscriptionData.isInTrial && subscriptionData.subscription?.status === 'active' && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-400">Active Subscription</p>
              <p className="text-xs text-gray-300">
                Plan: {subscriptionData.plan || 'N/A'} • All changes kept
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

