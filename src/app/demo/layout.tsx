import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Demo | CreatorFlow365',
  description:
    'Explore CreatorFlow365 without signing up—see scheduling & tools in context. Then start your free trial.',
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
