import Link from 'next/link'
import type { Metadata } from 'next'
import SupportForm from '@/components/SupportForm'

export const metadata: Metadata = {
  title: 'Support | CreatorFlow365',
  description: 'Contact CreatorFlow365 support. Send a message and we will reply by email.',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-md">
          <nav className="mb-8 text-sm">
            <Link href="/dashboard" className="text-purple-400 hover:underline">
              Back to app
            </Link>
          </nav>

          <header className="border-b border-gray-800 pb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-400">Support</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Contact us</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Send a message from here — your email app will not open. You will get a confirmation at
              the address you enter when mail is configured, and we will reply there too.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              We reply to the email address you enter below.
            </p>
          </header>

          <SupportForm />
        </div>
      </main>
    </div>
  )
}
