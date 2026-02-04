import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service – CreatorFlow365',
  description: 'Terms of Service for CreatorFlow365. Rules and agreement for using our platform.',
}

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: February 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Agreement</h2>
            <p>By using CreatorFlow365 (&quot;Service&quot;) at www.creatorflow365.com, you agree to these Terms. If you do not agree, do not use the Service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Use of the Service</h2>
            <p>You must use the Service in compliance with applicable laws and our policies. You are responsible for your account and the content you create. You may not misuse the Service, attempt to gain unauthorized access, or use it to harm others.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Subscription & payment</h2>
            <p>Paid plans are billed according to the pricing shown at signup. Trials may be offered; after the trial, you will be charged unless you cancel. Refunds are handled per our refund policy. You may upgrade or cancel as allowed in your account.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Your content</h2>
            <p>You retain ownership of content you create. By using the Service, you grant us the rights needed to operate, store, and display your content. We do not claim ownership of your content.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Limitation of liability</h2>
            <p>The Service is provided &quot;as is&quot;. We are not liable for indirect, incidental, or consequential damages, or for loss of data or revenue, to the extent permitted by law.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Changes</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes via email or a notice in the Service. Continued use after changes constitutes acceptance.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">7. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:support@creatorflow365.com" className="text-purple-400 hover:underline">support@creatorflow365.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
