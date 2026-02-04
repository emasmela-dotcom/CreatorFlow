import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy – CreatorFlow365',
  description: 'Privacy Policy for CreatorFlow365. How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: February 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Who we are</h2>
            <p>CreatorFlow365 (&quot;we&quot;, &quot;our&quot;) operates www.creatorflow365.com. We provide tools and services for content creators to manage, schedule, and optimize their content.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Information we collect</h2>
            <p>We collect information you provide when you sign up, use our services, or contact us: email, account and payment details (processed by Stripe), and content you create or upload. We also collect usage data (e.g. pages visited, features used) to improve our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. How we use it</h2>
            <p>We use your information to provide and improve our services, process payments, send account-related and product updates, and comply with legal obligations. We do not sell your personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Data retention & security</h2>
            <p>We retain your data for as long as your account is active or as needed to provide services and comply with law. We use industry-standard measures to protect your data.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Your rights</h2>
            <p>You may access, correct, or delete your personal information from your account settings or by contacting us. You may also opt out of marketing emails.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Contact</h2>
            <p>For privacy questions or requests, contact us at <a href="mailto:support@creatorflow365.com" className="text-purple-400 hover:underline">support@creatorflow365.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
