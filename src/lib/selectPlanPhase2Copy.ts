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
    headline: 'Starter — $9/month',
    blocks: [
      'For one person starting out.',
      'Record, save, come back and change it. Three social accounts.',
      '10 Claude writes per day. Free while we build. You will not be charged until paid plans go live.',
    ],
    includedBullets: [
      'Record, save, come back and change it',
      '3 social accounts',
      '10 Claude writes per day',
    ],
    whoBullets: [
      'One person starting out',
    ],
    faq: [
      {
        q: 'Do I need a card today?',
        a: 'No. Free while we build. These prices start when paid plans go live.',
      },
      {
        q: 'Can I upgrade later?',
        a: 'Yes. You can move to Creator or Business from your account.',
      },
    ],
  },
  pro: {
    headline: 'Creator — $49/month',
    blocks: [
      'For someone posting for real.',
      'Everything in Starter, plus 10 social accounts and 3 people on the team.',
      '10 Claude writes per day. Free while we build. You will not be charged until paid plans go live.',
    ],
    includedBullets: [
      'Everything in Starter',
      '10 social accounts',
      '3 people on the team',
      '10 Claude writes per day',
    ],
    whoBullets: [
      'Someone posting for real',
    ],
    faq: [
      {
        q: 'How is Creator different from Starter?',
        a: 'Creator adds more accounts and a team of three.',
      },
      {
        q: 'Do I pay today?',
        a: 'No. Free while we build. These prices start when paid plans go live.',
      },
    ],
  },
  agency: {
    headline: 'Business — $149/month',
    blocks: [
      'For a shop with many pages.',
      'Everything in Creator, plus unlimited accounts and team.',
      '10 Claude writes per day. Free while we build. You will not be charged until paid plans go live.',
    ],
    includedBullets: [
      'Everything in Creator',
      'Unlimited accounts and team',
      '10 Claude writes per day',
    ],
    whoBullets: [
      'A shop with many pages',
    ],
    faq: [
      {
        q: 'Is there a seat limit?',
        a: 'No. Business has unlimited team members.',
      },
      {
        q: 'Do I pay today?',
        a: 'No. Free while we build. These prices start when paid plans go live.',
      },
    ],
  },
}
