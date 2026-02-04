'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, CreditCard } from 'lucide-react'
import TrialEndNotification from '@/components/TrialEndNotification'

export default function TrialStatusBanner() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
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
    try {
      const planType = subscriptionData?.trialPlan || subscriptionData?.plan || 'starter'
      const res = await fetch('/api/stripe/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planType }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      if (res.ok && data.success && data.redirect) {
        window.location.href = data.redirect
        return
      }
      await fetchSubscriptionStatus()
    } catch (e) {
      console.error('Checkout error:', e)
      await fetchSubscriptionStatus()
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
              <button
                type="button"
                onClick={handleContinue}
                disabled={checkoutLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-4 h-4" />
                {checkoutLoading ? 'Redirecting...' : 'Subscribe to keep the content you’ve created or changed after trial'}
              </button>
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

