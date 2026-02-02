'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import type { PlanType } from '@/components/PlanSelection'

const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  growth: 'Essential',
  essential: 'Essential',
  pro: 'Creator',
  creator: 'Creator',
  business: 'Professional',
  professional: 'Professional',
  agency: 'Business',
}

function planParamToId(plan: string): PlanType {
  const p = plan.toLowerCase()
  if (p === 'essential') return 'growth'
  if (p === 'creator') return 'pro'
  if (p === 'professional') return 'business'
  if (p === 'business') return 'agency'
  if (['free', 'starter', 'growth', 'pro', 'business', 'agency'].includes(p)) return p as PlanType
  return 'pro'
}

function SelectPlanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = (searchParams.get('plan') || 'pro').toLowerCase()
  const planId = planParamToId(planParam)
  const planName = PLAN_NAMES[planId] || PLAN_NAMES[planParam] || 'Creator'

  const [understood, setUnderstood] = useState(false)

  const goToSignup = () => {
    router.push(`/signup?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">CreatorFlow 365</h1>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
            <Link href="/#pricing" className="text-gray-400 hover:text-white">Pricing</Link>
            <Link href="/signin" className="text-gray-400 hover:text-white">Sign In</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Sign Up</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">{planName} plan</h2>

        <div className="space-y-6 mb-8">
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 text-sm">
            <p><strong>Tools marked with a credit badge</strong> and <strong>tools shown as part of higher-tier plans</strong> are not included in this plan.</p>
            <p className="mt-2">You can still use these tools by buying credits or upgrading. They were <strong>never part of this plan.</strong></p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-1 rounded border-gray-500"
            />
            <span className="text-sm text-gray-300">
              I understand which tools are included in the {planName} plan and that other tools require credits or a higher plan. I will not claim these tools were part of my subscription.
            </span>
          </label>

          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-white mb-2">Content created during trial</h3>
            <p>If you subscribe before trial ends: You keep all content created during the trial.</p>
            <p className="mt-2">If you don&apos;t subscribe: Your account is restored to its pre-trial state and content created during the trial will be removed.</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4 text-center">Check the box above to enable Subscribe now. Start free trial is always available.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={goToSignup}
            disabled={!understood}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Subscribe now
          </button>
          <button
            onClick={goToSignup}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500"
          >
            Start free trial
          </button>
          <Link
            href="/"
            className="bg-gray-700/50 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-600/50 text-center"
          >
            Cancel
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function SelectPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    }>
      <SelectPlanContent />
    </Suspense>
  )
}
