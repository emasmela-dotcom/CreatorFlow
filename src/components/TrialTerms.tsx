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

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" />
              If You Don't Continue:
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• Your subscription will not be charged</li>
              <li>• Access to paid features will stop</li>
              <li>• <strong className="text-blue-400">All your content remains yours - nothing is deleted</strong></li>
              <li>• You keep all posts, content, and analytics you created during the trial</li>
              <li>• Your original snapshot is saved if you ever want to revert (optional)</li>
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
                  All changes made to your social media accounts during the trial period will be kept. 
                  This includes all posts, content modifications, scheduled content, and analytics data created during your trial.
                  <strong className="text-indigo-300"> All content is immediately yours.</strong>
                </p>
              </div>
              <div className="bg-blue-500/10 rounded p-3 border border-blue-500/30">
                <p className="text-sm font-semibold text-blue-300 mb-2">✓ If you cancel after trial:</p>
                <p className="text-sm text-gray-200">
                  <strong className="text-blue-300">All your content stays with you forever.</strong> Everything you created 
                  during the trial period remains yours and is permanently saved. However, to edit, export, or use this content 
                  after canceling, you'll need an active subscription. Content created during trial becomes <strong className="text-blue-400">read-only</strong> 
                  (you can view it but cannot modify it) until you upgrade to a paid plan. We save a snapshot of your original 
                  state before the trial, which you can use to revert at any time if you choose, but this is completely optional.
                </p>
              </div>
              <div className="bg-indigo-600/20 rounded p-3 border border-indigo-400">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wide mb-1">Our Commitment</p>
                <p className="text-sm text-white">
                  CreatorFlow believes in creator-first ownership. <strong className="text-indigo-300">All content you create 
                  through our platform is immediately and permanently yours, whether you stay or go.</strong> We compete on quality, 
                  not lock-in. Your content is never deleted. If you cancel, your trial content becomes read-only until you upgrade 
                  - you can view it anytime, but editing requires an active subscription. Before you start, we'll take a snapshot 
                  of your original state so you can revert if you ever want to, but this is completely optional.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            By proceeding, you agree that CreatorFlow will create a snapshot of your current project state before the trial begins. 
            This snapshot will be saved so you can optionally revert to your original state at any time if you choose. 
            <strong className="text-white"> All content you create during the trial remains yours forever, whether you continue or not.</strong>
          </p>
          <p className="text-xs text-indigo-300/80 leading-relaxed mb-2">
            <strong>Content Ownership Commitment:</strong> CreatorFlow commits to creator-first ownership. <strong className="text-indigo-200">All content you create 
            through our platform is immediately and permanently yours - no exceptions.</strong> Whether you continue with a paid plan or cancel after the trial, 
            everything you created (posts, content modifications, scheduled content, analytics) stays with you forever. If you cancel, trial content becomes 
            read-only (view-only, no editing or exporting) until you upgrade to unlock it. We compete on quality, not lock-in. The original snapshot is available 
            if you want to revert, but this is completely optional.
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

