'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import SeoSiteFooter from '@/components/SeoSiteFooter'

export default function DemoPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const activateDemo = async () => {
      try {
        const response = await fetch('/api/demo/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to activate demo')
        }

        if (data.token) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('isDemo', 'true')
        }

        setTimeout(() => {
          router.push('/dashboard?demo=true')
        }, 500)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load demo')
      }
    }

    activateDemo()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            >
              Go to Home
            </button>
          </div>
        </div>
        <SeoSiteFooter />
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
