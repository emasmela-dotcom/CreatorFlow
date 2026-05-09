import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | CreatorFlow365',
  description:
    'Compare CreatorFlow365 plans—from Starter to Business—with trials & credits explained on the homepage.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
