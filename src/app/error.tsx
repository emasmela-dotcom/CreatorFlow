'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-gray-400 mb-2">
            An unexpected error occurred. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <p className="text-sm text-red-400 mt-4 font-mono bg-gray-800 p-3 rounded">
              {error.message}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

