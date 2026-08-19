import Link from 'next/link'

export default function SeoSiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`py-10 px-6 border-t border-optimist-800 text-center ${className}`}>
      <p className="text-sm text-gray-400">© {new Date().getFullYear()} CreatorFlow365</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <img src="/logo-c.png" alt="CreatorFlow365" className="w-5 h-5 opacity-80" />
        <Link
          href="/setup-guide"
          className="inline-block text-sm text-optimist-300 hover:text-optimist-200 transition-colors"
        >
          Setup guide
        </Link>
        <span className="text-gray-600" aria-hidden="true">
          ·
        </span>
        <Link
          href="/support"
          className="inline-block text-sm text-optimist-300 hover:text-optimist-200 transition-colors"
        >
          Contact support
        </Link>
      </div>
    </footer>
  )
}
