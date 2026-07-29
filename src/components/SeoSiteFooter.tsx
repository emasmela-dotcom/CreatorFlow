import Link from 'next/link'

export default function SeoSiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`py-10 px-6 border-t border-gray-800 text-center ${className}`}>
      <p className="text-sm text-gray-400">© {new Date().getFullYear()} CreatorFlow365</p>
      <Link
        href="/support"
        className="mt-2 inline-block text-sm text-amber-200/90 hover:text-amber-100 transition-colors"
      >
        Contact support
      </Link>
    </footer>
  )
}
