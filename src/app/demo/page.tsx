'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'

export default function DemoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Auto-login as demo user - NO INPUT REQUIRED
    const activateDemo = async () => {
      try {
        // No body needed - completely automatic
        const response = await fetch('/api/demo/activate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // NO BODY - nothing required from user
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to activate demo')
        }

        // Store demo token automatically
        if (data.token) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('isDemo', 'true')
        }

        // Auto-redirect to dashboard - no clicks needed
        setTimeout(() => {
          router.push('/dashboard?demo=true')
        }, 500) // Small delay to show loading
      } catch (err: any) {
        setError(err.message || 'Failed to load demo')
        setLoading(false)
      }
    }

    // Auto-run immediately - no user interaction
    activateDemo()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-pulse" />
        <h1 className="text-3xl font-bold mb-2">Loading Demo Account</h1>
        <p className="text-gray-400 mb-6">Setting up your demo experience...</p>
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-400" />
      </div>
    </div>
  )
}

