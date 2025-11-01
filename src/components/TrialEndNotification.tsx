'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface TrialEndNotificationProps {
  daysRemaining: number | null
  onContinue: () => void
  onCancel: () => void
}

export default function TrialEndNotification({ daysRemaining, onContinue, onCancel }: TrialEndNotificationProps) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Show modal if trial ending soon (within 3 days) or expired
    if (daysRemaining !== null && daysRemaining <= 3) {
      setShowModal(true)
    }
  }, [daysRemaining])

  const handleContinue = async () => {
    setLoading(true)
    try {
      await onContinue()
      setShowModal(false)
    } catch (error) {
      console.error('Continue subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setLoading(true)
    try {
      await onCancel()
      setShowModal(false)
    } catch (error) {
      console.error('Cancel subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (daysRemaining === null || daysRemaining > 3) {
    // Show banner instead of modal if trial not ending soon
    if (daysRemaining !== null && daysRemaining > 0) {
      return (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-400">Trial Active</p>
              <p className="text-xs text-gray-300">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in your free trial
              </p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {daysRemaining <= 0 ? (
              <XCircle className="w-8 h-8 text-red-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            )}
            <h2 className="text-2xl font-bold">
              {daysRemaining <= 0 ? 'Trial Ended' : 'Trial Ending Soon'}
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            {daysRemaining <= 0 ? (
              <p className="text-gray-300">
                Your free trial has ended. To continue using CreatorFlow and keep all your changes, please subscribe.
              </p>
            ) : (
              <p className="text-gray-300">
                Your free trial ends in <strong>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</strong>.
                Choose an option below:
              </p>
            )}

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-400 mb-1">Continue Subscription</h3>
                  <p className="text-sm text-gray-300">
                    Keep all your changes and continue with full access. Your subscription will start automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Cancel & Restore</h3>
                  <p className="text-sm text-gray-300">
                    Cancel your subscription. All changes made during the trial will be reverted and your project will be restored to its original state.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleContinue}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Continue Subscription'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Cancel & Restore'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

