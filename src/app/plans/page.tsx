'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Star } from 'lucide-react'
import { plans, PlanType } from '@/components/PlanSelection'

export default function PlansPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId)
    router.push(`/signup?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Scale your content creation business with the right plan for you. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id
            const isPopular = plan.popular

            return (
              <div
                key={plan.id}
                className={`
                  relative p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${isSelected 
                    ? 'border-white bg-white/10' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }
                  ${isPopular ? 'ring-2 ring-purple-500/30' : ''}
                `}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-lg text-gray-400 ml-2">/month</span>
                  </div>
                  {plan.price === 0 ? (
                    <p className="text-sm text-green-400 mt-1 font-semibold">Forever free</p>
                  ) : (
                    <p className="text-sm text-gray-300 mt-1">14-day free trial</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectPlan(plan.id)
                  }}
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                    ${isSelected
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }
                  `}
                >
                  {plan.price === 0 ? 'Get Started' : 'Start Free Trial'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">All Plans Include</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">All Core Tools</h3>
                <p className="text-sm text-gray-400">Hashtag Research, Content Templates, Engagement Inbox, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Features</h3>
                <p className="text-sm text-gray-400">Access to all 22 AI bots and tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Community Access</h3>
                <p className="text-sm text-gray-400">Who's On, Creator Chat, and Message Board</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

