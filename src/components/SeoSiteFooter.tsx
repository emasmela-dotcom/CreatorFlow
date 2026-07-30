import Link from 'next/link'

export default function SeoSiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`py-10 px-6 border-t border-optimist-800 text-center ${className}`}>
      <p className="text-sm text-gray-400">© {new Date().getFullYear()} CreatorFlow365</p>
      <Link
        href="/support"
        className="mt-2 inline-block text-sm text-optimist-300 hover:text-optimist-200 transition-colors"
      >
        Contact support
      </Link>
    </footer>
  )
}
