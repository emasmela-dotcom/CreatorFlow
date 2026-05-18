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
        <main id="main-content" className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-md">
            <p className="text-red-300 mb-4" role="alert">
              {error}
            </p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium"
            >
              Go to Home
            </button>
          </div>
        </main>
        <SeoSiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-4 sm:px-6"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="text-center max-w-sm" role="status">
          <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 text-purple-400 animate-pulse" aria-hidden />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Loading demo account</h1>
          <p className="text-gray-300 mb-6">Setting up your demo experience…</p>
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-400" aria-hidden />
          <p className="sr-only">Please wait while we sign you into the demo.</p>
        </div>
      </main>
    </div>
  )
}
