import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Try Demo – CreatorFlow365',
  description: 'Try CreatorFlow365 with no signup. See scheduling, analytics, and creator tools in action.',
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
