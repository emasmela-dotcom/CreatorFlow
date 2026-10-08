'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlanSelection, { PlanType } from '@/components/PlanSelection'
import { FEATURED_PAID_TOOLS } from '@/lib/toolsByPlan'

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
        <p className="mt-4 text-base text-white text-center max-w-2xl mx-auto leading-relaxed">
          <span className="font-semibold">People</span> = how many humans can log into CreatorFlow.
          {' '}
          <span className="font-semibold">Pages</span> = how many social pages you can hook up (Instagram, TikTok, and so on).
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
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center">Tools on paid plans</h2>
          <p className="mt-3 text-gray-300 text-center max-w-2xl mx-auto">
            You can see these tools in the app. Use starts when paid plans go live.
          </p>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {FEATURED_PAID_TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="rounded-xl border border-optimist-800 bg-optimist-900/40 px-4 py-3"
              >
                <p className="font-semibold text-white">
                  {tool.name}{' '}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-optimist-400">Paid</span>
                </p>
                <p className="mt-1 text-sm text-gray-300">{tool.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
