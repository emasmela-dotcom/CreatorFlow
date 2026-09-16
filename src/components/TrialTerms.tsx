'use client'

import { AlertCircle, Check, X } from 'lucide-react'

interface TrialTermsProps {
  planName: string
  planPrice: number
}

export default function TrialTerms({ planName, planPrice }: TrialTermsProps) {

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
        support: 'Priority support (target 2hr response) + Dedicated account manager for onboarding, workspace setup guidance, and escalation support',
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
        <h3 className="text-xl font-semibold">Account access</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" />
            No Credit Card Required to Start
          </h4>
          <p className="text-sm text-gray-300">
            Create a free account for the <strong className="text-white">{planName}</strong> workspace. No credit card today.
            Paid plans with live AI later. We will show prices before any charge.
          </p>
        </div>

        <div className="bg-optimist-500/10 border border-optimist-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-optimist-400 mb-2">Free while we build</h4>
          <p className="text-sm text-gray-300 mb-3">
            CreatorFlow365 is <strong className="text-white">free while we build</strong>. Paid plans with live AI later.
          </p>
          {trialFeatures && (
            <div className="mt-3 pt-3 border-t border-optimist-500/20">
              <p className="text-xs text-gray-300 mb-2">Included today:</p>
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
                <li>• <strong className="text-optimist-400">All AI tools available for your selected social accounts</strong></li>
              </ul>
              <p className="text-xs text-optimist-300/80 mt-2 italic">
                ⚠️ Your selected social accounts will be locked in. Features renew monthly.
              </p>
            </div>
          )}
          <p className="text-sm text-gray-300 mt-3">
            Paid plans have not launched. When they do, we will show prices before checkout.
            You can pick a higher plan later. Do not treat this as a timed 14-day cutoff.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-white">When paid plans launch:</h4>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" />
              If You Continue With a Paid Plan:
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• You confirm your plan and add a payment method</li>
              <li>• You&apos;ll be charged when paid plans launch (if you choose to subscribe)</li>
              <li>• <strong className="text-green-400">Your documents and work stay in your account</strong></li>
              <li>• You keep using the workspace while we build</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" />
              If You Don't Continue:
            </h5>
            <ul className="text-sm text-gray-300 space-y-1 ml-7">
              <li>• You won't be charged and no subscription starts</li>
              <li>• Paid plans are not required to keep using the workspace today</li>
              <li>• Your documents stay in your account while we build</li>
            </ul>
          </div>

          <div className="bg-optimist-500/20 border-2 border-optimist-400 rounded-lg p-5">
            <h5 className="font-bold text-lg text-optimist-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Content Ownership Policy:
            </h5>
            <div className="space-y-3">
              <div className="bg-white/5 rounded p-3 border border-optimist-500/30">
                <p className="text-sm font-semibold text-optimist-300 mb-2">✓ If you continue with a paid plan:</p>
                <p className="text-sm text-gray-200">
                  All posts, documents, and changes stay in your account.
                  When paid plans launch, you choose whether to subscribe. We will show prices first.
                </p>
              </div>
              <div className="bg-blue-500/10 rounded p-3 border border-blue-500/30">
                <p className="text-sm font-semibold text-blue-300 mb-2">✓ If you don’t continue right away:</p>
                <p className="text-sm text-gray-200">
                  Your work stays in your account. There is no 14-day cutoff while we build.
                  If you subscribe later, that work stays with you.
                </p>
              </div>
              <div className="bg-optimist-600/20 rounded p-3 border border-optimist-400">
                <p className="text-xs font-bold text-optimist-200 uppercase tracking-wide mb-1">Our Commitment</p>
                <p className="text-sm text-white">
                  CreatorFlow is creator‑first. We do not use a timed trial to trap you or delete your work.
                  Free while we build. Paid plans with live AI later. You choose if and when to pay.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            By proceeding, you create a free account. Free while we build. Paid plans with live AI later.
            We will show prices before any paid checkout.
          </p>
          <p className="text-xs text-optimist-300/80 leading-relaxed mb-2">
            <strong>Content Ownership Commitment:</strong> We compete on quality, not lock‑in. We never silently delete your work or hide it behind fine print.
            Your work stays in your account while we build. You choose when (or if) to subscribe after paid plans launch.
          </p>
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            <strong>Important:</strong> Your selected social accounts (Instagram, X, LinkedIn, TikTok, YouTube, Facebook, Threads, Pinterest, Snapchat, Reddit, Bluesky, Mastodon, Discord, Telegram, Tumblr, WordPress) will be locked in and cannot be changed each month. 
            All features including posts, analytics, support, and AI tools renew monthly for your selected social accounts.
          </p>
        </div>
      </div>
    </div>
  )
}

