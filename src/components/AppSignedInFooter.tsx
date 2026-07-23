'use client'

import Link from 'next/link'

/**
 * Signed-in app footer (ReadAI-style): copyright + Contact support.
 * Support opens an in-app form that emails support@creatorflow365.com.
 */
export default function AppSignedInFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-700 bg-gray-900 px-5 py-8 text-center md:px-8">
      <p className="text-xs tracking-wide text-gray-400">
        © {year} CreatorFlow365
      </p>
      <p className="mt-3 text-xs text-gray-300">
        <Link
          href="/support"
          className="text-purple-400 hover:text-purple-300 hover:underline"
        >
          Contact support
        </Link>
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Or email{' '}
        <a
          href="mailto:support@creatorflow365.com"
          className="text-gray-400 hover:text-gray-200 hover:underline"
        >
          support@creatorflow365.com
        </a>
      </p>
    </footer>
  )
}
