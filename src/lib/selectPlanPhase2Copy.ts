import type { PlanId } from '@/lib/toolsByPlan'

export type Phase2PlanCopy = {
  headline: string
  blocks: [string, string, string]
  includedBullets: string[]
  whoBullets: string[]
  faq: { q: string; a: string }[]
}

export const PHASE2_BY_PLAN: Record<PlanId, Phase2PlanCopy> = {
  starter: {
    headline: 'Starter — AI captions, library, and hashtags',
    blocks: [
      'CreatorFlow365 Starter gives you AI-assisted caption writing, unlimited hashtag sets and templates, and a cloud content library for $9/month. Start with a 14-day free trial—no credit card required.',
      'Built for beginner and part-time creators who want organized drafts and faster captions without paying for multiple separate tools.',
      'Starter includes analytics support, three connected social accounts, and 500 AI calls per month so you can post consistently.',
    ],
    includedBullets: [
      'AI writing tools (500 calls/month)',
      'Unlimited documents, hashtag sets, and templates',
      'Three connected social accounts',
      'Starter analytics support',
      'Email support (48hr target response)',
    ],
    whoBullets: [
      'New creators building a consistent posting habit',
      'Part-time creators who want caption help on a budget',
      'Anyone testing the platform before upgrading',
    ],
    faq: [
      {
        q: 'Do I need a card for the trial?',
        a: 'No. You get a 14-day free trial without adding a credit card.',
      },
      {
        q: 'What if a tool shows a credit badge?',
        a: 'Credit-badge tools are not included in this plan. You can buy credits or upgrade to use them.',
      },
      {
        q: 'Can I upgrade later?',
        a: 'Yes. You can move to Essential, Creator, Professional, or Business anytime from signup or billing.',
      },
      {
        q: 'What happens to my content if I do not subscribe?',
        a: 'If you do not subscribe after the trial, trial changes are reverted per our Content Ownership Policy. If you subscribe, you keep what you created.',
      },
    ],
  },
  growth: {
    headline: 'Essential — Schedule and analyze across five accounts',
    blocks: [
      'Essential connects five social accounts—Instagram, X, LinkedIn, TikTok, and YouTube—and keeps your posting plan and content analytics in one dashboard for $19/month. 14-day trial, no credit card required.',
      'For creators posting regularly who want visibility into what works instead of guessing across separate apps.',
      'Includes 1,000 AI calls per month, content analytics, unlimited documents and templates, and faster email support than Starter.',
    ],
    includedBullets: [
      'Five connected social accounts',
      'Content analytics across connected accounts',
      '1,000 AI calls/month',
      'Smart scheduling calendar',
      'Unlimited documents, hashtag sets, templates',
      'Email support (24hr target response)',
    ],
    whoBullets: [
      'Multi-platform creators who want one library and calendar',
      'Creators ready to use performance data in weekly planning',
      'Teams sharing drafts via unlimited documents',
    ],
    faq: [
      {
        q: 'How is Essential different from Starter?',
        a: 'Essential adds more accounts, content analytics, and twice the monthly AI calls.',
      },
      {
        q: 'Is the trial the same?',
        a: 'Yes—14 days free with no credit card required.',
      },
      {
        q: 'Are all tools in my plan automatically included?',
        a: 'Only tools listed for Essential apply. Higher-tier or credit-only tools require credits or an upgrade.',
      },
      {
        q: 'Can I change plans mid-cycle?',
        a: 'Yes. You can upgrade or downgrade according to your account billing rules.',
      },
    ],
  },
  pro: {
    headline: 'Creator — Brand deals, team workspace, advanced analytics',
    blocks: [
      'Creator includes brand collaboration tools, a three-seat team workspace, ten social accounts, unlimited AI calls, API access, and advanced analytics for $49/month. 14-day trial, no credit card required.',
      'For full-time creators and small teams managing partnerships who need deliverables and performance data in one workflow.',
      'Priority support with a 12-hour target response helps when campaigns have tight deadlines.',
    ],
    includedBullets: [
      'Brand collaboration tracking',
      'Team workspace (3 members)',
      'Ten connected social accounts',
      'Unlimited AI calls',
      'API access',
      'Advanced analytics',
      'Priority support (12hr target response)',
    ],
    whoBullets: [
      'Creators landing or negotiating brand deals',
      'Teams of two or three sharing content and calendars',
      'Creators who need exportable metrics for partners',
    ],
    faq: [
      {
        q: 'Who counts as a team seat?',
        a: 'Each invited collaborator using your Creator workspace counts toward the three-member limit.',
      },
      {
        q: 'Do I still need credits for some tools?',
        a: 'Tools outside Creator tier or marked for credits still require credits or a higher plan.',
      },
      {
        q: 'Can agencies use Creator?',
        a: 'Small teams can; agencies with white-label needs usually choose Professional or Business.',
      },
      {
        q: 'Trial terms?',
        a: 'Same 14-day trial with no credit card; subscribe to keep trial content per policy.',
      },
    ],
  },
  business: {
    headline: 'Professional — White-label options for teams and agencies',
    blocks: [
      'Professional adds white-label options, unlimited social accounts, a ten-seat team workspace, premium analytics with predictions, and advanced API access for $79/month. 14-day trial, no credit card required.',
      'For professional creators and agencies that need branded client experiences without stacking separate enterprise contracts.',
      'This tier uses white-label options—Business tier below offers full white-label for agencies that need the maximum scope.',
    ],
    includedBullets: [
      'White-label options (client-facing branding)',
      'Unlimited connected social accounts',
      'Team workspace (10 members)',
      'Premium analytics and predictions',
      'Maximum AI performance tier',
      'Advanced API access',
      'Priority support (6hr target response)',
    ],
    whoBullets: [
      'Agencies managing multiple client accounts',
      'Professional creators with a larger internal team',
      'Consultants delivering branded tool access',
    ],
    faq: [
      {
        q: 'What is the difference between Professional and Business?',
        a: 'Professional includes white-label options and ten seats. Business adds full white-label, unlimited team members, enterprise analytics, custom integrations, and a dedicated account manager.',
      },
      {
        q: 'Are competitor price claims guaranteed?',
        a: 'Compare plans on our pricing section; external competitor pricing changes over time.',
      },
      {
        q: 'Credits and premium tools?',
        a: 'Same rule: tools not in your tier may still require credits or upgrade.',
      },
      {
        q: 'Trial?',
        a: '14-day free trial, no credit card required.',
      },
    ],
  },
  agency: {
    headline: 'Business — Full white-label for agencies at scale',
    blocks: [
      'Business includes unlimited team members and accounts, full white-label, enterprise analytics, custom API integrations, and a dedicated account manager for onboarding and escalation—$149/month. 14-day trial, no credit card required.',
      'For agencies replacing multiple tools with one white-labeled workspace clients experience under your brand.',
      'Priority support uses a two-hour target response for the fastest escalations on the platform.',
    ],
    includedBullets: [
      'Unlimited team members and accounts',
      'Full white-label',
      'Enterprise analytics and reporting',
      'Custom integrations and API',
      'Dedicated account manager (onboarding and escalation)',
      'Priority support (2hr target response)',
    ],
    whoBullets: [
      'Agencies managing many client accounts',
      'Teams consolidating scheduler, AI, analytics, and ops',
      'Shops that resell or bundle software under their brand',
    ],
    faq: [
      {
        q: 'Is there a seat limit?',
        a: 'No. Business has unlimited team members.',
      },
      {
        q: 'What does full white-label mean?',
        a: 'Clients primarily see your branding for the delivered experience; CreatorFlow365 operates in the background.',
      },
      {
        q: 'What does the dedicated account manager do?',
        a: 'Onboarding help, workspace guidance, and escalation support—not unlimited strategic consulting unless you agree that separately.',
      },
      {
        q: 'Annual contract?',
        a: 'Plans are month-to-month unless you negotiate otherwise; trial remains 14 days without a card.',
      },
    ],
  },
}
