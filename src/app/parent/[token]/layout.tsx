'use client'

import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

// Simple full-height wrapper for the parent mobile flow.
// No AppShell, no bottom nav — parents just see the one screen.
const Shell = styled.div({
  minHeight: '100dvh',
  backgroundColor: '#fdf9f4',
  overflowX: 'hidden',
  // Vietnamese-friendly warm background
  background: `
    radial-gradient(ellipse at 10% 0%, oklch(0.88 0.06 50 / 0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 90% 100%, oklch(0.88 0.06 155 / 0.2) 0%, transparent 50%),
    #fdf9f4
  `,
})

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Shell>{children}</Shell>
}
