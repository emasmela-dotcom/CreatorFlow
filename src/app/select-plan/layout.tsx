import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Plans & Tools | CreatorFlow365',
  description:
    'Pick a tier and see included tools before checkout. Plans from $9/mo—14-day trial, no credit card required.',
}

export default function SelectPlanLayout({ children }: { children: React.ReactNode }) {
  return children
}
