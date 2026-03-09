'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, ArrowLeft } from 'lucide-react'

const FOLLOW_THRU_URL = process.env.NEXT_PUBLIC_FOLLOW_THRU_APP_URL || ''

export default function FollowThruPage() {
  const router = useRouter()

  useEffect(() => {
    if (FOLLOW_THRU_URL) {
      window.location.href = FOLLOW_THRU_URL
    }
  }, [])

  if (FOLLOW_THRU_URL) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Redirecting to Follow Thru…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-6">
          <CheckSquare className="w-10 h-10 text-purple-400" />
          <h1 className="text-2xl font-bold">Follow Thru</h1>
        </div>
        <p className="text-gray-300 mb-6">
          Follow Thru is the CRM app for tracking people and promises. It’s part of the CreatorFlow365 suite.
        </p>
        <p className="text-sm text-gray-500">
          To open Follow Thru from here, set <code className="bg-gray-800 px-1 rounded">NEXT_PUBLIC_FOLLOW_THRU_APP_URL</code> in your environment to the Follow Thru app URL. Once set, this page will redirect there automatically.
        </p>
      </div>
    </div>
  )
}
