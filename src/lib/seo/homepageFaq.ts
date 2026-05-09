import type { FaqPair } from '@/lib/seo/faqJsonLd'

/** Single source for homepage FAQ UI + matching FAQPage JSON-LD */
export const HOMEPAGE_FAQ_PAIRS: FaqPair[] = [
  {
    question: 'How does CreatorFlow365 work with social platforms?',
    answer:
      'You create and organize content inside CreatorFlow365. Depending on your setup, you can connect accounts for scheduling or copy content to publish where you need it. See the note below the signup buttons on this page for how publishing fits your workflow.',
  },
  {
    question: "What happens if I don't subscribe after the trial?",
    answer:
      'Trial changes may be reverted per our Content Ownership Policy. If you subscribe, content you created during the trial is kept according to that policy.',
  },
  {
    question: 'Is a credit card required for the free trial?',
    answer: 'No. You get 14 days free with no card on file.',
  },
  {
    question: "What's the difference between AI calls and credits?",
    answer:
      "AI calls are included per plan (see pricing cards). Credits are an add-on for premium tools outside your plan's included usage; purchased credits roll over month to month.",
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes. You can upgrade or downgrade as your needs change.',
  },
  {
    question: 'Does CreatorFlow365 work for agencies?',
    answer:
      'Yes. Professional includes white-label options; Business includes full white-label, unlimited team members, and a dedicated account manager for onboarding and escalation—see pricing for details.',
  },
]
