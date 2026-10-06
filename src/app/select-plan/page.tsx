'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlanSelection, { PlanType } from '@/components/PlanSelection'

export default function SelectPlanPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<PlanType>('pro')

  return (
    <main className="min-h-screen bg-optimist-950 text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center leading-tight">
          Plans
        </h1>
        <p className="mt-4 text-lg text-gray-300 text-center max-w-2xl mx-auto">
          Free while we build. These prices start when paid plans go live. No charge today.
        </p>
        <div className="mt-12">
          <PlanSelection selectedPlan={selected} onSelectPlan={setSelected} />
        </div>
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => router.push(`/signup?plan=${selected}`)}
            className="inline-block rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-black hover:bg-gray-200"
          >
            Create free account
          </button>
        </div>
      </div>
    </main>
  )
}
