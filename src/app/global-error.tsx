'use client'

import { useEffect } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error)
    }
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 sm:px-6">
        <main id="main-content" className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" aria-hidden />
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">Something went wrong</h1>
          <p className="text-gray-300 mb-8 text-sm sm:text-base">
            A critical error occurred. Try again or return home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              <Home className="w-5 h-5" aria-hidden />
              Go home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
