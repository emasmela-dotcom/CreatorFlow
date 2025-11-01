'use client'

import { AlertCircle, Check, X } from 'lucide-react'

interface TrialTermsProps {
  planName: string
  planPrice: number
}

export default function TrialTerms({ planName, planPrice }: TrialTermsProps) {
  const trialDays = 14 // Free 14-day trial

  // Trial features based on plan - round up accounts (can't do half), half the posts
  const getTrialFeatures = () => {
    const planFeatures: Record<string, {
      fullAccounts: number
      fullPosts: number
      analytics: string
      calendar: string
      support: string
      collaborations?: string
      hashtag?: boolean
      ai?: boolean
      team?: string
    }> = {
      'Starter': {
        fullAccounts: 3,
        fullPosts: 15,
        analytics: 'Basic analytics',
        calendar: 'Content calendar',
        support: 'Email support'
      },
      'Growth': {
        fullAccounts: 5,
        fullPosts: 25,
        analytics: 'Enhanced analytics',
        calendar: 'Content calendar',
        support: 'Email support',
        collaborations: 'Basic brand collaborations'
      },
      'Pro': {
        fullAccounts: 10,
        fullPosts: 35,
        analytics: 'Advanced analytics',
        calendar: 'Content calendar',
        support: 'Priority support',
        collaborations: 'Brand collaborations',
        hashtag: true
      },
      'Business': {
        fullAccounts: 15,
        fullPosts: 50,
        analytics: 'Premium analytics',
        calendar: 'Content calendar',
        support: 'Priority support',
        collaborations: 'Advanced brand collaborations',
        hashtag: true,
        ai: true,
        team: 'Team collaboration (up to 3 members)'
      },
      'Agency': {
        fullAccounts: -1, // Unlimited
        fullPosts: -1, // Unlimited
        analytics: 'Advanced reporting',
        calendar: 'Content calendar',
        support: 'Priority support + Dedicated account manager',
        collaborations: 'Advanced brand collaborations',
        hashtag: true,
        ai: true,
        team: 'Full team collaboration'
      }
    }

    const plan = planFeatures[planName]
    if (!plan) return null

    // Calculate trial accounts: round up (Math.ceil) - can't do half accounts
    const trialAccounts = plan.fullAccounts === -1 ? -1 : Math.ceil(plan.fullAccounts / 2)
    // Calculate trial posts: exactly half of monthly posts (round up for "high end")
    const trialPosts = plan.fullPosts === -1 ? -1 : Math.ceil(plan.fullPosts / 2)

    return {
      socialAccounts: trialAccounts,
      postsPerMonth: trialPosts,
      analytics: plan.analytics,
      calendar: plan.calendar,
      support: plan.support,
      collaborations: plan.collaborations,
      hashtag: plan.hashtag,
      ai: plan.ai,
      team: plan.team
    }
  }

  const trialFeatures = getTrialFeatures()

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-semibold">Trial Terms & Conditions</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Credit Card Required
          </h4>
          <p className="text-sm text-gray-300">
            A credit card is required to start your free trial. Your card will <strong className="text-white">NOT</strong> be charged during the trial period.
          </p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Free Trial Period</h4>
          <p className="text-sm text-gray-300 mb-3">
            Your <strong className="text-white">FREE {trialDays}-day trial</strong> of the <strong>{planName}</strong> plan.
          </p>
          {trialFeatures && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <p className="text-xs text-gray-400 mb-2">Trial includes:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• {trialFeatures.socialAccounts === -1 ? 'Unlimited' : trialFeatures.socialAccounts} social accounts (locked in monthly)</li>
                <li>• {trialFeatures.postsPerMonth === -1 ? 'Unlimited' : trialFeatures.postsPerMonth} posts per month (shared across all accounts)</li>
                <li>• {trialFeatures.analytics}</li>
                <li>• {trialFeatures.calendar}</li>
                {trialFeatures.collaborations && <li>• {trialFeatures.collaborations}</li>}
                {trialFeatures.hashtag && <li>• Hashtag research</li>}
                {trialFeatures.ai && <li>• Content scheduling AI</li>}
                {trialFeatures.team && <li>• {trialFeatures.team}</li>}
                <li>• {trialFeatures.support}</li>
                <li>• <strong className="text-purple-400">All AI tools available for your selected social accounts</strong></li>
              </ul>
              <p className="text-xs text-purple-300/80 mt-2 italic">
                ⚠️ Your selected social accounts will be locked in. Features renew monthly.
              </p>
            </div>
          )}
          <p className="text-sm text-gray-300 mt-3">
            After trial ends, you'll be charged <strong>${planPrice}/month</strong> if you continue.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-white">After Your Trial Ends:</h4>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" />
              If You Continue (Become Paying Member):
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• Your subscription will automatically continue</li>
              <li>• You'll be charged ${planPrice}/month</li>
              <li>• <strong className="text-green-400">All changes made during trial are kept</strong></li>
              <li>• Full access to your selected plan continues</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <X className="w-5 h-5" />
              If You Don't Continue:
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• Your subscription will not be charged</li>
              <li>• Access to paid features will stop</li>
              <li>• <strong className="text-red-400">All changes made during trial will be reverted</strong></li>
              <li>• Your project will be restored to the original state (before trial)</li>
              <li>• Your original starting image/backup will be restored</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            By proceeding, you agree that CreatorFlow will create a backup of your current project state before the trial begins. 
            If you choose not to continue after the trial, all modifications made during the trial period will be automatically 
            reverted and your project will be restored to its original state.
          </p>
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            <strong>Important:</strong> Your selected social accounts (Facebook, Twitter, Instagram, etc.) will be locked in and cannot be changed each month. 
            All features including posts, analytics, support, and AI tools renew monthly for your selected social accounts.
          </p>
        </div>
      </div>
    </div>
  )
}

