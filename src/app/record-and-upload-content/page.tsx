import type { Metadata } from 'next'
import Link from 'next/link'
import { RECORD_UPLOAD_FAQ } from '@/lib/seo/guidePageFaqs'
import { faqPageJsonLd } from '@/lib/seo/faqJsonLd'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com'
const pagePath = '/record-and-upload-content'

const title = 'Record and Upload Photos & Video | CreatorFlow365'
const description =
  'Create visual content in CreatorFlow365 Documents: camera on a computer, Record here on a phone, or upload a file you already shot. Free while we build.'

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Record or upload photos and video in CreatorFlow365',
  description,
  url: `${baseUrl}${pagePath}`,
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Sign in and open Documents',
      text: 'Create a free account, sign in, and open Documents.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Record or upload',
      text: 'On a computer, choose Use this camera to take a photo or record video. On a phone, use Record here. Or choose Upload file for a photo or video you already shot.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Save original',
      text: 'Add a title if you need one, then save. The photo or video stays in your account.',
    },
  ],
}

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${baseUrl}${pagePath}`,
    siteName: 'CreatorFlow365',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}${pagePath}`,
  },
}

export default function RecordAndUploadPage() {
  return (
    <main id="main-content" className="min-h-screen bg-optimist-950 text-white px-4 sm:px-6 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <article className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Record and upload photos and video in CreatorFlow365
          </h1>
          <p className="text-lg text-gray-300">
            Creators can make visual content in CreatorFlow365, not only paste words they made somewhere else.
          </p>
          <p className="text-gray-300">
            In Documents you can use the computer camera, record on a phone, or upload a file you already shot. Then you
            can still add words and format for platforms.
          </p>
          <p className="text-sm text-optimist-400">
            The camera lives in Documents after you sign in. This page is public so Google and AI tools can read how it
            works. Free while we build.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How to record or upload</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-300">
            <li>Create a free account, sign in, and open Documents.</li>
            <li>
              On a computer, choose Use this camera to take a photo or record video. On a phone, use Record here. Or
              choose Upload file for a photo or video you already shot.
            </li>
            <li>Add a title if you need one, then save. The photo or video stays in your account.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Who this is for</h2>
          <p className="text-gray-300">
            Creators who want CreatorFlow365 to be where the clip or photo starts, and who still want to upload files
            from the regular Camera app.
          </p>
        </section>

        <section className="space-y-3">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqPageJsonLd(RECORD_UPLOAD_FAQ)),
            }}
          />
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3 text-gray-300">
            {RECORD_UPLOAD_FAQ.map((item) => (
              <p key={item.question}>
                <strong className="text-white">{item.question}</strong> {item.answer}
              </p>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Related on CreatorFlow365</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              <Link href="/creator-tools" className="text-optimist-400 hover:underline">
                Creator tools and Documents workspace
              </Link>
            </li>
            <li>
              <Link href="/ai-caption-writer-instagram-tiktok" className="text-optimist-400 hover:underline">
                AI captions for Instagram and TikTok
              </Link>
            </li>
            <li>
              <Link href="/signup" className="text-optimist-400 hover:underline">
                Create a free account
              </Link>
            </li>
          </ul>
        </section>

        <section className="pt-4 flex flex-wrap gap-3">
          <Link href="/signup" className="px-5 py-3 bg-white text-black rounded-lg font-semibold">
            Create free account
          </Link>
          <Link href="/signin" className="px-5 py-3 border border-gray-600 rounded-lg font-semibold text-white">
            Sign in to Documents
          </Link>
        </section>
      </article>
    </main>
  )
}
