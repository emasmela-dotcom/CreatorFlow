'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'

function TrialSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // After 3 seconds, redirect to dashboard
    const timer = setTimeout(() => {
      router.push('/dashboard?trial_started=true')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Trial Started Successfully!</h1>
        
        <p className="text-gray-300 mb-6">
          Your 15-day free trial has begun. You now have access to all features of your selected plan.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-blue-400 font-semibold mb-2">What happens next?</p>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Your trial lasts 15 days (half month)</li>
            <li>• You'll be charged after the trial ends if you continue</li>
            <li>• A backup of your project was created before trial started</li>
            <li>• You can cancel anytime during trial</li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/dashboard?trial_started=true')}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  )
}

export default function TrialSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <TrialSuccessContent />
    </Suspense>
  )
}

