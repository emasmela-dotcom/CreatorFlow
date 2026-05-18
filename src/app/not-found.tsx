import type { Metadata } from 'next'
import Link from 'next/link'
import { Home } from 'lucide-react'
import NotFoundBackButton from '@/components/NotFoundBackButton'

export const metadata: Metadata = {
  title: 'Page not found | CreatorFlow365',
  description:
    'That URL is missing or was moved. Return home or open the creator tools hub at CreatorFlow365.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-7xl sm:text-9xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Page Not Found</h2>
        <p className="text-gray-300 mb-8 text-base sm:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all text-white"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <NotFoundBackButton />
        </div>

        <p className="text-sm text-gray-300 leading-relaxed flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/creator-tools" className="text-purple-300 hover:text-purple-200 underline">Creator tools</Link>
          <Link href="/demo" className="text-purple-300 hover:text-purple-200 underline">Demo</Link>
          <Link href="/signup" className="text-purple-300 hover:text-purple-200 underline">Free trial</Link>
          <Link href="/ai-caption-writer-instagram-tiktok" className="text-purple-300 hover:text-purple-200 underline">AI captions</Link>
          <Link href="/social-media-scheduler-for-creators" className="text-purple-300 hover:text-purple-200 underline">Scheduler</Link>
          <Link href="/content-creator-analytics-platform" className="text-purple-300 hover:text-purple-200 underline">Analytics</Link>
          <Link href="mailto:support@creatorflow365.com" className="text-purple-300 hover:text-purple-200 underline">Support</Link>
        </p>
      </div>
    </main>
  )
}
