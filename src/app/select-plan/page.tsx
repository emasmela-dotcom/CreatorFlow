import Link from 'next/link'

export default function SelectPlanPage() {
  return (
    <main className="min-h-screen bg-optimist-950 text-white flex items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Plans coming soon
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          We are building live AI features and paid tiers. For now, everything is
          free — no credit card required.
        </p>
        <p className="mt-4 text-sm text-optimist-200">
          Free while we build. Paid plans with live AI later.
        </p>
        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-optimist-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-optimist-500 transition-colors"
          >
            Create free account
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          You will be notified when paid plans launch. No surprise charges.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-optimist-300 hover:text-white">
          ← Back to home
        </Link>
      </div>
    </main>
  )
}
