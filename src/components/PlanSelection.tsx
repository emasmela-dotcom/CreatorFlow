'use client'

import { useState } from 'react'
import { Star, Check } from 'lucide-react'

export type PlanType = 'free' | 'starter' | 'growth' | 'pro' | 'business' | 'agency'

// Creator-themed images (Unsplash) to fill space when columns are equal height
const PLAN_IMAGES: Record<PlanType, string> = {
  free: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=240&fit=crop',
  starter: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=240&fit=crop',
  growth: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=240&fit=crop',
  pro: 'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=400&h=240&fit=crop',
  business: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=240&fit=crop',
  agency: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=240&fit=crop',
}

export interface Plan {
  id: PlanType
  name: string
  price: number
  features: string[]
  popular?: boolean
  description: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    description: 'Remove limits - unlock full potential',
    features: [
      '3 social accounts',
      'Unlimited documents',
      'Unlimited hashtag sets',
      'Unlimited templates',
      '500 AI bot calls per month',
      'Enhanced AI features',
      'Email support (48hr response)'
    ]
  },
  {
    id: 'growth',
    name: 'Essential',
    price: 19,
    description: 'For creators building their workflow',
    features: [
      '5 social accounts',
      'Unlimited everything',
      '1,000 AI bot calls per month',
      'Advanced AI features',
      'Content analytics',
      'Priority support (24hr response)'
    ]
  },
  {
    id: 'pro',
    name: 'Creator',
    price: 49,
    description: 'For serious creators who want everything',
    popular: true,
    features: [
      '10 social accounts',
      'Unlimited AI bot calls',
      'Premium AI features',
      'Analytics with clear insights',
      'Team collaboration (up to 3)',
      'API access & priority support'
    ]
  },
  {
    id: 'business',
    name: 'Professional',
    price: 79,
    description: 'Complete toolkit for professional creators',
    features: [
      'Unlimited social accounts',
      'Fastest AI performance',
      'Advanced analytics & reporting',
      'Team collaboration (up to 10)',
      'White-label options',
      'Priority support (6hr response)'
    ]
  },
  {
    id: 'agency',
    name: 'Business',
    price: 149,
    description: 'For teams and agencies',
    features: [
      'Unlimited everything',
      'Maximum AI performance',
      'Enterprise analytics & custom reports',
      'Full white-label',
      'Unlimited team members',
      'Custom integrations & API access',
      'Dedicated account manager',
      'Priority support (2hr response)'
    ]
  }
]

interface PlanSelectionProps {
  selectedPlan?: PlanType
  onSelectPlan: (plan: PlanType) => void
  disabled?: boolean
}

export default function PlanSelection({ selectedPlan, onSelectPlan, disabled }: PlanSelectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {plans.map((plan) => {
        const isSelected = selectedPlan === plan.id
        const isPopular = plan.popular

        return (
          <div
            key={plan.id}
            onClick={() => !disabled && onSelectPlan(plan.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all cursor-pointer min-w-0 overflow-hidden flex flex-col
              ${isSelected 
                ? 'border-white bg-white/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isPopular && !isSelected ? 'ring-2 ring-gray-500/20' : ''}
            `}
          >
            {isPopular && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-max max-w-[calc(100%-1rem)] bg-white text-black px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-center shadow-md">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between gap-2 mb-4 min-w-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold mb-1 break-words">{plan.name}</h3>
                <p className="text-sm text-gray-400 break-words">{plan.description}</p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </div>

            <div className="mb-6 min-w-0">
              <div className="flex items-baseline flex-wrap gap-x-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-base text-gray-400">/month</span>
              </div>
              {plan.price === 0 ? (
                <p className="text-sm text-green-400 mt-1 font-semibold">Forever free</p>
              ) : (
                <p className="text-sm text-gray-300 mt-1 break-words">14-day free trial</p>
              )}
            </div>

            <ul className="space-y-3 min-w-0">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 min-w-0">
                  <Star className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300 break-words">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Creator imagery fills empty space when columns are equal height */}
            <div className="flex-1 min-h-[140px] mt-4 rounded-lg overflow-hidden bg-gray-700/50 flex items-center justify-center">
              <img
                src={PLAN_IMAGES[plan.id]}
                alt="Content creator"
                className="w-full h-full object-cover min-h-[140px]"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) onSelectPlan(plan.id)
              }}
              disabled={disabled}
              className={`
                w-full mt-6 py-3 rounded-lg font-semibold transition-all
                ${isSelected
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-gray-700 hover:bg-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSelected ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export { plans }

