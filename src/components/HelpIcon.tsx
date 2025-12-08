'use client'

import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface HelpIconProps {
  content: string
  title?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function HelpIcon({ content, title, position = 'top', className = '' }: HelpIconProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="text-gray-400 hover:text-purple-400 transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      {showTooltip && (
        <div className={`absolute z-50 ${positionClasses[position]} w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl`}>
          {title && (
            <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
          )}
          <p className="text-xs text-gray-300 leading-relaxed">{content}</p>
          <div className={`absolute ${position === 'top' ? 'top-full' : position === 'bottom' ? 'bottom-full' : position === 'left' ? 'left-full' : 'right-full'} ${position === 'top' || position === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2'} w-0 h-0 border-4 border-transparent ${position === 'top' ? 'border-t-gray-700' : position === 'bottom' ? 'border-b-gray-700' : position === 'left' ? 'border-l-gray-700' : 'border-r-gray-700'}`} />
        </div>
      )}
    </div>
  )
}

