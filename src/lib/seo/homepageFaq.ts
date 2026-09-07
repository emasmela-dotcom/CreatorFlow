import type { FaqPair } from '@/lib/seo/faqJsonLd'

/** Single source for homepage FAQ UI + matching FAQPage JSON-LD */
export const HOMEPAGE_FAQ_PAIRS: FaqPair[] = [
  {
    question: 'How does CreatorFlow365 work with social platforms?',
    answer:
      'You save your original in Documents, pick the platforms, and CreatorFlow365 formats the copy for each one. You copy that text and post it. Some accounts can be connected. We only describe auto-posting after it is proven live.',
  },
  {
    question: 'Is CreatorFlow365 free?',
    answer:
      'Yes. CreatorFlow365 is free while we build. Create a free account to use Documents and AI Coach. Paid plans are not live yet.',
  },
  {
    question: 'Do I need a credit card?',
    answer:
      'No. You can create an account with no credit card. There is nothing to subscribe to today because paid plans have not launched.',
  },
  {
    question: 'Does formatted copy get saved?',
    answer:
      'No. Your original is saved. Formatted versions are for copy-and-post only. Deleting originals frees save slots.',
  },
  {
    question: 'What is AI Coach?',
    answer:
      'AI Coach is the in-app Groq assistant for captions, drafts, and tips. You need a free account to use it. We do not charge per word. Advanced AI will be described on this site when paid plans launch.',
  },
  {
    question: 'Can agencies and teams use CreatorFlow365?',
    answer:
      'Yes. They can use the same free workspace today. White-label, unlimited team seats, and a dedicated account manager are not live. We will not list those until they are real.',
  },
]
