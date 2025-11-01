'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle } from 'lucide-react'
import TrialEndNotification from '@/components/TrialEndNotification'

export default function TrialStatusBanner() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  const handleContinue = async () => {
    // Subscription continues automatically via Stripe
    // Just refresh status
    await fetchSubscriptionStatus()
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-400">Free Trial Active</p>
                <p className="text-xs text-gray-300">
                  {subscriptionData.daysRemaining} {subscriptionData.daysRemaining === 1 ? 'day' : 'days'} remaining
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Trial Plan:</p>
              <p className="text-sm font-semibold text-white capitalize">
                {subscriptionData.trialPlan || subscriptionData.plan}
              </p>
            </div>
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

