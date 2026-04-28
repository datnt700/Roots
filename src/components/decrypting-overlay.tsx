'use client'

import { useState, useEffect, useRef } from 'react'
import styled, { CSSObject } from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Lock, Unlock } from 'lucide-react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`

const shimmer = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

// ─── Styles ───────────────────────────────────────────────────────────────────

const Overlay = styled.div<{ $exiting: boolean }>(({ $exiting }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  // Glass surface
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(18px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
  borderRadius: 'inherit',
  animation: `${$exiting ? fadeOut : fadeIn} 0.3s ease both`,
  pointerEvents: $exiting ? 'none' : 'auto',
  overflow: 'hidden',
  // Shimmer sweep
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
    animation: `${shimmer} 1s ease-in-out`,
  } as CSSObject,
}))

const IconWrap = styled.div<{ $unlocked: boolean }>(({ $unlocked }) => ({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: $unlocked
    ? 'oklch(0.88 0.06 155 / 0.2)'
    : 'oklch(0.75 0.04 80 / 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: `background-color ${theme.transitions.normal}`,
  '& svg': {
    width: '1.1rem',
    height: '1.1rem',
    color: $unlocked ? theme.colors.primary : theme.colors.mutedForeground,
    transition: `color ${theme.transitions.normal}`,
  },
}))

const Label = styled.p({
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.06em',
  color: theme.colors.mutedForeground,
})

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DecryptingOverlay — wrap a container with `position: relative` and
 * render this inside. It auto-dismisses after `duration` ms.
 *
 * @example
 * <div style={{ position: 'relative' }}>
 *   <DecryptingOverlay />
 *   {sensitiveContent}
 * </div>
 */
export function DecryptingOverlay({
  duration = 700,
  label = 'Đang mở khóa…',
}: {
  duration?: number
  label?: string
}) {
  const [phase, setPhase] = useState<'locking' | 'unlocking' | 'done'>('locking')
  const [exiting, setExiting] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    // Phase 1: show Lock icon briefly
    const t1 = setTimeout(() => {
      if (mountedRef.current) setPhase('unlocking')
    }, duration * 0.45)

    // Phase 2: start fade-out
    const t2 = setTimeout(() => {
      if (mountedRef.current) setExiting(true)
    }, duration * 0.75)

    // Phase 3: unmount
    const t3 = setTimeout(() => {
      if (mountedRef.current) setPhase('done')
    }, duration + 300)

    return () => {
      mountedRef.current = false
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [duration])

  if (phase === 'done') return null

  return (
    <Overlay $exiting={exiting} aria-hidden="true">
      <IconWrap $unlocked={phase === 'unlocking'}>
        {phase === 'unlocking' ? <Unlock /> : <Lock />}
      </IconWrap>
      <Label>{label}</Label>
    </Overlay>
  )
}
