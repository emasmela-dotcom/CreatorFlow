'use client'

import Link from 'next/link'
import { plans } from '@/components/PlanSelection'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <Link href="/" className="text-optimist-400 hover:text-optimist-300 text-sm">
            ← Back to home
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold">Pricing</h1>
          <p className="mt-2 text-gray-300">
            Free while we build. Paid plans with live AI launch later — here are the planned prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border-2 p-4 sm:p-6 bg-gray-800/50 flex flex-col min-w-0 ${
                plan.popular ? 'border-optimist-500 ring-2 ring-optimist-500/20' : 'border-gray-700'
              }`}
            >
              {plan.popular && (
                <p className="text-xs font-semibold text-optimist-300 mb-2">Most Popular</p>
              )}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-sm text-gray-300 mt-1 mb-4">{plan.description}</p>
              <p className="text-3xl font-bold text-white mb-1">
                ${plan.price}
                <span className="text-base font-normal text-gray-400">/month</span>
              </p>
              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-300">
                    • {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${plan.id}`}
                className="mt-6 block w-full text-center py-3 rounded-lg font-semibold bg-optimist-600 hover:bg-optimist-500 text-white transition-colors"
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
