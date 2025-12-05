'use client'

import { useState } from 'react'
import { Star, Check } from 'lucide-react'

export type PlanType = 'free' | 'starter' | 'growth' | 'pro' | 'business' | 'agency'

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
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started - all core tools',
    features: [
      '1 social account',
      'All core tools (Hashtag Research, Templates, Engagement Inbox)',
      '10 documents',
      '5 hashtag sets',
      '3 content templates',
      '50 AI bot calls per month',
      'Basic AI features',
      'Community support'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
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
    name: 'Growth',
    price: 19,
    description: 'Actually helpful - AI assistance included',
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
    name: 'Pro',
    price: 29,
    description: 'Time saver - full AI bot suite',
    popular: true,
    features: [
      '10 social accounts',
      'Unlimited AI bot calls',
      'Premium AI features',
      'Advanced analytics with insights',
      'Team collaboration (3 members)',
      'API access',
      'Priority support (12hr response)'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    description: 'Professional - enhanced AI & team features',
    features: [
      'Unlimited social accounts',
      'Maximum AI performance',
      'Premium analytics with predictions',
      'Team collaboration (10 members)',
      'White-label options',
      'Advanced API access',
      'Priority support (6hr response)'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 99,
    description: 'Enterprise power - unlimited scale',
    features: [
      'Unlimited everything',
      'Maximum AI bot performance',
      'Enterprise analytics & custom reporting',
      'Full white-label',
      'Unlimited team collaboration',
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
                ? 'border-white bg-white/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isPopular && !isSelected ? 'ring-2 ring-gray-500/20' : ''}
            `}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
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

            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
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

