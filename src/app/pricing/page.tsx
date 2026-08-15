import { redirect } from 'next/navigation'

/** Pricing is hidden while free-build. Paid plans launch later. */
export default function PricingPage() {
  redirect('/')
}
