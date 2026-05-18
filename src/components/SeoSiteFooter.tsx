import Link from 'next/link'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/creator-tools', label: 'Creator tools' },
  { href: '/ai-caption-writer-instagram-tiktok', label: 'AI captions' },
  { href: '/social-media-scheduler-for-creators', label: 'Scheduler' },
  { href: '/content-creator-analytics-platform', label: 'Analytics' },
  { href: '/demo', label: 'Demo' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/signin', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
] as const

export default function SeoSiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`py-10 px-6 border-t border-gray-800 ${className}`}>
      <nav
        className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-400"
        aria-label="Site"
      >
        {LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="hover:text-white transition-colors">
            {label}
          </Link>
        ))}
        <a href="mailto:support@creatorflow365.com" className="hover:text-white transition-colors">
          Support
        </a>
      </nav>
    </footer>
  )
}
