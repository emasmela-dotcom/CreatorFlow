'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'
import SeoSiteFooter from '@/components/SeoSiteFooter'

function TrialSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard?trial_started=true')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Trial started</h1>

          <p className="text-gray-300 mb-6">
            Your 14-day free trial is active. You have full access to the plan you chose.
          </p>

          {sessionId && (
            <p className="text-xs text-gray-400 mb-4 break-all">Reference: {sessionId}</p>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-300 font-semibold mb-2">What happens next</p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Trial runs 14 days from today</li>
              <li>• Billing starts after trial if you keep your plan</li>
              <li>• Cancel anytime from dashboard settings</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => router.push('/dashboard?trial_started=true')}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold text-white hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            Go to dashboard
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-gray-400 mt-4">Redirecting in 3 seconds…</p>
        </div>
      </div>
      <SeoSiteFooter />
    </div>
  )
}

export default function TrialSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <p className="text-lg text-gray-300">Loading…</p>
        </div>
      }
    >
      <TrialSuccessContent />
    </Suspense>
  )
}
