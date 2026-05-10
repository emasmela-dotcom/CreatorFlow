import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard | CreatorFlow365',
  description:
    'Signed-in creator workspace—calendar, drafts, scheduling & analytics. Sign in at creatorflow365.com.',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
