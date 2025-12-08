'use client'

import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

interface FeedbackButtonProps {
  token: string
}

export default function FeedbackButton({ token }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
        title="Send Feedback"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline-block font-semibold">Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <FeedbackModal token={token} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}

interface FeedbackModalProps {
  token: string
  onClose: () => void
}

function FeedbackModal({ token, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState('general')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [canContact, setCanContact] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'General',
    'AI Bots',
    'Content Creation',
    'Analytics',
    'Scheduling',
    'Hashtag Research',
    'Documents',
    'Templates',
    'Game-Changer Features',
    'Performance Predictor',
    'Brand Voice',
    'Cross-Platform Sync',
    'Content Recycling',
    'Revenue Tracker',
    'Trend Alerts',
    'A/B Testing',
    'Content Series',
    'Hashtag Optimizer',
    'Marketplace',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError('Please enter your feedback message')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          feedbackType,
          category: category || null,
          message: message.trim(),
          rating: rating || null,
          userEmail: canContact ? userEmail : null,
          canContact
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setSubmitted(true)
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setSubmitted(false)
        setFeedbackType('general')
        setCategory('')
        setMessage('')
        setRating(null)
        setUserEmail('')
        setCanContact(false)
        onClose()
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-gray-300 mb-4">
              Your feedback has been submitted. We appreciate you helping us improve CreatorFlow!
            </p>
            <p className="text-sm text-gray-400">This window will close automatically...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Send Feedback
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              What type of feedback is this? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { value: 'bug', label: '🐛 Bug' },
                { value: 'feature', label: '💡 Feature' },
                { value: 'general', label: '💬 General' },
                { value: 'praise', label: '⭐ Praise' },
                { value: 'other', label: '📝 Other' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFeedbackType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    feedbackType === type.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Rating (Optional)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? null : star)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    rating && star <= rating ? 'text-yellow-400' : 'text-gray-500'
                  }`}
                >
                  ★
                </button>
              ))}
              {rating && (
                <span className="ml-2 text-gray-400 text-sm">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Okay' : rating === 2 ? 'Poor' : 'Very Poor'}
                </span>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Your Feedback <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think, what you'd like to see, or any issues you've encountered..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[150px] resize-y"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Be as detailed as possible. Your feedback helps us improve!
            </p>
          </div>

          {/* Contact Preference */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={canContact}
                onChange={(e) => setCanContact(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                Can we contact you about this feedback?
              </span>
            </label>
            {canContact && (
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

