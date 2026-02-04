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
      'Free': {
        fullAccounts: 1,
        fullPosts: 0,
        analytics: 'Basic analytics',
        calendar: 'Basic content calendar',
        support: 'Community support'
      },
      'Starter': {
        fullAccounts: 3,
        fullPosts: 0, // Unlimited
        analytics: 'Basic analytics',
        calendar: 'Content calendar with drag-and-drop',
        support: 'Email support (48hr response)',
        hashtag: true,
        ai: true // Enhanced AI features
      },
      'Growth': {
        fullAccounts: 5,
        fullPosts: 0, // Unlimited
        analytics: 'Content analytics',
        calendar: 'Content calendar with drag-and-drop',
        support: 'Email support (24hr response)',
        hashtag: true,
        ai: true // Advanced AI features
      },
      'Pro': {
        fullAccounts: 10,
        fullPosts: 0, // Unlimited
        analytics: 'Advanced analytics with insights',
        calendar: 'Content calendar with drag-and-drop',
        support: 'Priority support (12hr response)',
        collaborations: 'Brand collaboration tracking',
        hashtag: true,
        ai: true // Premium AI features
      },
      'Business': {
        fullAccounts: -1, // Unlimited
        fullPosts: 0, // Unlimited
        analytics: 'Premium analytics with predictions',
        calendar: 'Content calendar with drag-and-drop',
        support: 'Priority support (6hr response)',
        collaborations: 'Advanced brand collaboration management',
        hashtag: true,
        ai: true, // Enhanced AI bots
        team: 'Team collaboration (10 members)'
      },
      'Agency': {
        fullAccounts: -1, // Unlimited
        fullPosts: 0, // Unlimited
        analytics: 'Enterprise analytics & custom reporting',
        calendar: 'Content calendar with drag-and-drop',
        support: 'Priority support (2hr response) + Dedicated account manager',
        collaborations: 'Advanced brand collaboration management',
        hashtag: true,
        ai: true, // Maximum AI bot performance
        team: 'Full team collaboration (unlimited)'
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
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" />
            No Credit Card Required to Start
          </h4>
          <p className="text-sm text-gray-300">
            Start your free trial of the <strong className="text-white">{planName}</strong> plan with full access and no credit card required. 
            You only add a payment method later if you decide to keep your plan after the trial.
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
            After your {trialDays}-day trial, you can keep your plan for <strong>${planPrice}/month</strong>. 
            You can upgrade to a higher plan at any time, but you can't downgrade below the plan you trialed.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-white">After Your Trial Ends:</h4>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" />
              If You Continue With a Paid Plan:
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• You confirm your plan and add a payment method</li>
              <li>• You'll be charged ${planPrice}/month (or more if you upgrade)</li>
              <li>• <strong className="text-green-400">All content and changes made during your trial are kept</strong></li>
              <li>• Ongoing access to at least the plan you trialed (upgrades allowed, downgrades below this plan are not)</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" />
              If You Don't Continue:
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• You won't be charged and no subscription starts</li>
              <li>• Access to trial-only features will stop</li>
              <li>• We keep a snapshot of everything you created during the trial</li>
              <li>• Your account view is restored to how it looked before the trial began</li>
              <li>• If you later subscribe, your trial content is unlocked and kept with your paid account</li>
            </ul>
          </div>

          <div className="bg-indigo-500/20 border-2 border-indigo-400 rounded-lg p-5">
            <h5 className="font-bold text-lg text-indigo-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Content Ownership Policy:
            </h5>
            <div className="space-y-3">
              <div className="bg-white/5 rounded p-3 border border-indigo-500/30">
                <p className="text-sm font-semibold text-indigo-300 mb-2">✓ If you continue with a paid plan:</p>
                <p className="text-sm text-gray-200">
                  All posts, content changes, schedules, and analytics from your trial stay with you. 
                  When you subscribe, we simply keep everything unlocked under your paid plan.
                </p>
              </div>
              <div className="bg-blue-500/10 rounded p-3 border border-blue-500/30">
                <p className="text-sm font-semibold text-blue-300 mb-2">✓ If you don’t continue right away:</p>
                <p className="text-sm text-gray-200">
                  We keep a secure snapshot of everything you created during the trial. Your live workspace goes back to its 
                  pre‑trial view (no lock‑in, no surprises). If you decide to subscribe later, we reconnect that trial content 
                  to your paid account so you can pick up where you left off.
                </p>
              </div>
              <div className="bg-indigo-600/20 rounded p-3 border border-indigo-400">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wide mb-1">Our Commitment</p>
                <p className="text-sm text-white">
                  CreatorFlow is creator‑first. We never use trials to trap you or delete your work. We take a snapshot before 
                  your trial starts, give you full access to the plan you chose, and let you decide later: continue on a paid plan 
                  (and keep everything), or revert to your pre‑trial state and upgrade only if and when it makes sense for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            By proceeding, you agree that CreatorFlow will create a secure snapshot of your current project state before the trial begins. 
            This lets us restore your account to its pre‑trial view if you decide not to continue, while safely keeping anything you created 
            during the trial available to reconnect if you later upgrade.
          </p>
          <p className="text-xs text-indigo-300/80 leading-relaxed mb-2">
            <strong>Content Ownership Commitment:</strong> We compete on quality, not lock‑in. We never silently delete your work or hide it behind fine print. 
            Trial content is preserved, your pre‑trial state is protected, and you choose when (or if) to turn your trial into a paid subscription.
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

