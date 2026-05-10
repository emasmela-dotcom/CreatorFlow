'use client'

import { ArrowLeft } from 'lucide-react'

export default function NotFoundBackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors text-white"
    >
      <ArrowLeft className="w-5 h-5" />
      Go Back
    </button>
  )
}
