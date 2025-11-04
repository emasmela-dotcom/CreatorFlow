'use client'

import { Lock, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LockedContentBadgeProps {
  message?: string
  showUpgradeButton?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function LockedContentBadge({ 
  message, 
  showUpgradeButton = true,
  size = 'md'
}: LockedContentBadgeProps) {
  const router = useRouter()

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className={`bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/50 rounded-lg p-3 ${sizeClasses[size]}`}>
      <div className="flex items-start gap-2">
        <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-blue-300 font-medium mb-1">
            {message || 'This content is locked'}
          </p>
          <p className="text-sm text-gray-300">
            Content created during your trial is saved forever, but requires an active subscription to edit or export.
          </p>
          {showUpgradeButton && (
            <button
              onClick={() => router.push('/dashboard?tab=subscription')}
              className="mt-2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to Unlock
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function LockedContentIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-400/50 rounded text-blue-300 text-xs font-medium ${className}`}>
      <Lock className="w-3 h-3" />
      <span>Locked</span>
    </div>
  )
}
