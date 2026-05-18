'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/#pricing')
  }, [router])
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <main id="main-content" aria-live="polite">
        <p className="text-gray-300">Redirecting to pricing…</p>
      </main>
    </div>
  )
}
