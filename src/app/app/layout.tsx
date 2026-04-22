'use client'

import { AppShell } from '@/components/app-shell'

// All /app/* pages require an authenticated session — never statically prerender.
export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
