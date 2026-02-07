'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, CreditCard } from 'lucide-react'
import TrialEndNotification from '@/components/TrialEndNotification'

export default function TrialStatusBanner() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

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
    try {
      const planType = subscriptionData?.trialPlan || subscriptionData?.plan || 'starter'
      const res = await fetch('/api/stripe/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planType }),
      })
      let data: { url?: string; redirect?: string; success?: boolean; error?: string } = {}
      try {
        data = await res.json()
      } catch {
        setCheckoutError('Server error. Set STRIPE_SECRET_KEY and price IDs for Production in Vercel.')
        setCheckoutLoading(false)
        return
      }
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      if (res.ok && data.success && data.redirect) {
        window.location.href = data.redirect
        return
      }
      const errMsg = data.error || 'Checkout could not start. In Vercel → Production env, set STRIPE_SECRET_KEY and all STRIPE_PRICE_* (price_ IDs).'
      setCheckoutError(errMsg)
      sessionStorage.setItem('creatorflow_subscribe_error', errMsg)
      alert('Subscribe failed: ' + errMsg)
    } catch (e) {
      console.error('Checkout error:', e)
      const errMsg = 'Network or server error. Check Vercel Production env: STRIPE_SECRET_KEY and STRIPE_PRICE_* must be set.'
      setCheckoutError(errMsg)
      sessionStorage.setItem('creatorflow_subscribe_error', errMsg)
      alert('Subscribe failed: ' + errMsg)
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

