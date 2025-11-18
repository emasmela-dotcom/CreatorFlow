'use client'

import { useState } from 'react'
import { Star, Check } from 'lucide-react'

export type PlanType = 'starter' | 'growth' | 'pro' | 'business' | 'agency'

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
    price: 19,
    description: 'Perfect for individual creators getting started',
    features: [
      '2 social accounts',
      '8 posts per month (shared across all accounts)',
      'Basic analytics',
      'Content calendar',
      'Email support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 29,
    description: 'For creators ready to scale',
    features: [
      '3 social accounts',
      '10 posts per month (shared across all accounts)',
      'Enhanced analytics',
      'Content calendar',
      'Basic brand collaborations',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    description: 'Best for growing creators',
    popular: true,
    features: [
      '4 social accounts',
      '12 posts per month (shared across all accounts)',
      'Advanced analytics',
      'Brand collaborations',
      'Hashtag research',
      'Priority support'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    description: 'For serious creators and small teams',
    features: [
      '5 social accounts',
      '15 posts per month (shared across all accounts)',
      'Premium analytics',
      'Advanced brand collaborations',
      'Hashtag research',
      'Content scheduling AI',
      'Priority support',
      'Team collaboration (up to 3 members)'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 99,
    description: 'The ultimate tool for agencies',
    features: [
      'Unlimited accounts',
      '18 posts per month',
      'White-label options',
      'Full team collaboration',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'Advanced reporting',
      'Multi-brand management'
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
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
      {plans.map((plan) => {
        const isSelected = selectedPlan === plan.id
        const isPopular = plan.popular

        return (
          <div
            key={plan.id}
            onClick={() => !disabled && onSelectPlan(plan.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all cursor-pointer
              ${isSelected 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isPopular && !isSelected ? 'ring-2 ring-blue-500/20' : ''}
            `}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-lg text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-sm text-green-400 mt-1">14-day free trial</p>
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) onSelectPlan(plan.id)
              }}
              disabled={disabled}
              className={`
                w-full mt-6 py-3 rounded-lg font-semibold transition-all
                ${isSelected
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
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

