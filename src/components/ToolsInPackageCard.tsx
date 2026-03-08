'use client'

import Link from 'next/link'

export default function ToolsInPackageCard() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full flex flex-col min-h-[280px]">
      <h3 className="text-lg font-semibold mb-4 text-white">Tools in your package</h3>
      <p className="text-gray-300 text-sm mb-4 flex-1">
        Full functionality requires a little one-time setup (e.g. free Neon DB and free standard APIs). Creators who complete that setup get the full experience. For even more power, some tools support optional paid APIs—upgrading gives greater functionality.
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href="/crm" className="text-purple-400 hover:underline">Follow Thru CRM</Link>
          <span className="text-gray-400"> — Track what you’re waiting on. Setup: Neon (free), optional Resend. Paid APIs: optional for higher limits.</span>
        </li>
      </ul>
      <p className="text-gray-500 text-xs mt-4">Free setup → full functionality. Paid APIs → greater functionality when you need it.</p>
    </div>
  )
}
