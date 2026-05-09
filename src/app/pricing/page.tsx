'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/#pricing')
  }, [router])
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
      <main id="main-content">
        <p>Redirecting to pricing...</p>
      </main>
    </div>
  )
}
