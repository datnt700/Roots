// ─── Parent-view Font Scale ─────────────────────────────────────────────────
// This page is used by elderly parents (bố mẹ) on mobile.
// Minimum readable size: 1.125rem (18px). Nothing smaller for body copy.
// UI chrome (badges, small labels) may use 0.875rem–1rem.

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ──────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

export const ripple = keyframes`
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(2.6); opacity: 0; }
`

export const breathe = keyframes`
  0%, 100% { box-shadow: 0 8px 0 oklch(0.42 0.1 155), 0 14px 30px oklch(0.55 0.1 155 / 0.3); }
  50%       { box-shadow: 0 12px 0 oklch(0.42 0.1 155), 0 20px 40px oklch(0.55 0.1 155 / 0.4); }
`

export const recordAnim = keyframes`
  0%, 100% { box-shadow: 0 6px 0 oklch(0.4 0.15 20), 0 12px 30px oklch(0.55 0.15 20 / 0.4); }
  50%       { box-shadow: 0 10px 0 oklch(0.4 0.15 20), 0 18px 40px oklch(0.55 0.15 20 / 0.5); }
`

export const waveBar = keyframes`
  0%, 100% { transform: scaleY(0.25); }
  50%       { transform: scaleY(1); }
`

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

export const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(0.5rem) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

// ─── Styled Components ────────────────────────────────────────────────────────

export const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  backgroundColor: 'oklch(0.97 0.015 90)',
  overflowX: 'hidden',
})

// ── Header ──

export const TopBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
  borderBottom: '1px solid oklch(0.88 0.04 90)',
  backgroundColor: 'oklch(0.97 0.015 90)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
})

export const Logo = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.colors.primary,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
})

export const TurnBadge = styled.div({
  fontSize: '0.875rem', // UI badge — smaller is OK
  fontWeight: 600,
  color: 'oklch(0.5 0.08 155)',
  backgroundColor: 'oklch(0.88 0.06 155 / 0.3)',
  padding: '0.25rem 0.75rem',
  borderRadius: theme.radius.full,
})

export const HelpBtn = styled.button<{ $sent?: boolean }>(({ $sent }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.375rem 0.875rem',
  borderRadius: theme.radius.full,
  border: 'none',
  cursor: $sent ? 'default' : 'pointer',
  fontSize: '1rem', // topbar button — 1rem minimum
  fontWeight: 600,
  backgroundColor: $sent
    ? 'oklch(0.88 0.06 155 / 0.3)'
    : 'oklch(0.88 0.12 55 / 0.3)',
  color: $sent ? 'oklch(0.5 0.08 155)' : 'oklch(0.45 0.12 55)',
  transition: 'opacity 0.2s',
  opacity: $sent ? 0.8 : 1,
  '&:hover': $sent ? {} : { opacity: 0.85 },
}))

// ── Chat ──

export const ChatArea = styled.div({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: `${theme.spacing[5]} ${theme.spacing[4]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

export const AiBubbleRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.spacing[2],
  animation: `${bubbleIn} 0.35s ease both`,
})

export const ParentBubbleRow = styled.div({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'flex-end',
  gap: theme.spacing[2],
  animation: `${bubbleIn} 0.35s ease both`,
})

export const BubbleAvatar = styled.div({
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.88 0.08 155)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  flexShrink: 0,
})

export const AiBubble = styled.div({
  maxWidth: '80%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: '#fff',
  borderRadius: '0.25rem 1.25rem 1.25rem 1.25rem',
  boxShadow: '0 2px 12px oklch(0.55 0.1 155 / 0.1)',
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem', // ≥1.125rem — readable for elderly parents
  color: theme.colors.foreground,
  lineHeight: 1.6,
  border: '1px solid oklch(0.88 0.06 155 / 0.3)',
})

export const ParentBubble = styled.div({
  maxWidth: '80%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.88 0.08 155 / 0.2)',
  borderRadius: '1.25rem 0.25rem 1.25rem 1.25rem',
  fontSize: '1.125rem', // ≥1.125rem — readable for elderly parents
  color: theme.colors.foreground,
  lineHeight: 1.6,
  fontStyle: 'italic',
  border: '1px solid oklch(0.7 0.1 155 / 0.2)',
})

// ── Controls ──

export const ControlArea = styled.div({
  padding: `${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[8]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[4],
  borderTop: '1px solid oklch(0.88 0.04 90)',
  backgroundColor: 'oklch(0.97 0.015 90)',
})

export const Waveform = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  height: '2.5rem',
})

export const WaveBar = styled('div', {
  shouldForwardProp: (prop) => prop !== '$i' && prop !== '$active',
})<{ $i: number; $active: boolean }>(({ $i, $active }) => ({
  width: '3px',
  height: '100%',
  borderRadius: '2px',
  backgroundColor: $active ? theme.colors.primary : 'oklch(0.55 0.1 155 / 0.2)',
  transformOrigin: 'center',
  animation: $active
    ? `${waveBar} ${0.55 + $i * 0.12}s ease-in-out infinite`
    : 'none',
  animationDelay: `${$i * 0.07}s`,
  transform: $active ? undefined : 'scaleY(0.25)',
  transition: 'background-color 0.3s',
  willChange: 'transform',
}))

export const MicBtnWrap = styled.div({
  position: 'relative',
  width: '5.5rem',
  height: '5.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const RippleRing = styled.div({
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius.full,
  border: '2px solid oklch(0.55 0.15 20 / 0.4)',
  animation: `${ripple} 1.5s ease-out infinite`,
  pointerEvents: 'none',
})

export const RippleRing2 = styled(RippleRing)({ animationDelay: '0.5s' })

export const MicBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== '$recording',
})<{ $recording: boolean }>(({ $recording }) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius.full,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: $recording ? 'oklch(0.55 0.15 20)' : theme.colors.primary,
  boxShadow: $recording
    ? '0 6px 0 oklch(0.4 0.15 20), 0 12px 25px oklch(0.55 0.15 20 / 0.4)'
    : '0 8px 0 oklch(0.42 0.1 155), 0 14px 28px oklch(0.55 0.1 155 / 0.3)',
  animation: $recording
    ? `${recordAnim} 1.2s ease infinite`
    : `${breathe} 3s ease infinite`,
  '&:active': { transform: 'translateY(4px)', transition: 'transform 0.1s' },
  '& svg': { width: '2rem', height: '2rem', color: '#fff' },
}))

export const StatusText = styled.div({
  fontSize: '1.125rem', // ≥1.125rem — readable for elderly parents
  fontWeight: 600,
  color: 'oklch(0.5 0.08 155)',
})

export const TimerText = styled.div({
  fontFamily: theme.fonts.mono,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '0.05em',
})

export const SendBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== '$loading',
})<{ $loading?: boolean }>(({ $loading }) => ({
  width: '100%',
  maxWidth: '20rem',
  padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
  borderRadius: '1.25rem',
  border: 'none',
  cursor: $loading ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  // Disabled (loading) → flat clay: no depth, desaturated, reduced opacity
  // so parents can clearly see the button is not actionable.
  background: $loading
    ? theme.clay.disabledBg
    : theme.clay.primaryBg,
  boxShadow: $loading
    ? theme.clay.disabledShadow
    : '0 6px 0 oklch(0.42 0.1 155), 0 10px 20px oklch(0.55 0.1 155 / 0.25)',
  opacity: $loading ? 0.72 : 1,
  color: '#fff',
  fontSize: '1.25rem', // ≥1.125rem — readable for elderly parents
  fontWeight: 700,
  fontFamily: theme.fonts.sans,
  transition: `all ${theme.transitions.normal}`,
  '& svg': { width: '1.25rem', height: '1.25rem' },
}))

export const EndBtn = styled.button({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem', // 1rem minimum for all interactive elements
  color: 'oklch(0.55 0.06 155)',
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
})

export const OfflineBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  backgroundColor: 'oklch(0.55 0.15 40 / 0.12)',
  borderBottom: '1px solid oklch(0.55 0.15 40 / 0.25)',
  fontSize: '1rem', // 1rem minimum — offline banner must be readable
  color: 'oklch(0.4 0.1 40)',
  fontWeight: 500,
  '& svg': { width: '1rem', height: '1rem', flexShrink: 0 },
})

export const RetryBtn = styled.button({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.25rem 0.75rem',
  borderRadius: '1rem',
  border: '1px solid oklch(0.55 0.15 40 / 0.4)',
  backgroundColor: 'transparent',
  color: 'oklch(0.4 0.1 40)',
  fontSize: '0.875rem', // secondary action label
  fontWeight: 600,
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ── Photo ──

export const PhotoRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  alignSelf: 'flex-start',
})

export const PhotoWrap = styled.div({ position: 'relative' })

export const PhotoThumb = styled.img({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: theme.radius.lg,
  objectFit: 'cover',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
})

export const PhotoBtn = styled.button({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: theme.radius.lg,
  border: '2px dashed oklch(0.55 0.1 155 / 0.4)',
  backgroundColor: 'oklch(0.88 0.06 155 / 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  cursor: 'pointer',
  color: theme.colors.primary,
  '& svg': { width: '1.25rem', height: '1.25rem', opacity: 0.7 },
})

export const PhotoLabel = styled.span({
  fontSize: '0.5625rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'oklch(0.5 0.08 155)',
})

export const RemovePhotoBtn = styled.button({
  position: 'absolute',
  top: '-0.375rem',
  right: '-0.375rem',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: theme.radius.full,
  border: 'none',
  backgroundColor: 'oklch(0.55 0.15 20)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '& svg': { width: '0.625rem', height: '0.625rem' },
})

// ── Welcome screen ──

export const WelcomeWrap = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  gap: theme.spacing[6],
  animation: `${fadeUp} 0.5s ease both`,
})

export const WelcomeEmoji = styled.div({ fontSize: '4rem', lineHeight: 1 })

export const WelcomeTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.75rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  textAlign: 'center',
  lineHeight: 1.35,
  '& em': { fontStyle: 'normal', color: theme.colors.primary },
})

export const WelcomeSubtitle = styled.p({
  fontSize: '1.125rem', // ≥1.125rem — readable for elderly parents
  color: theme.colors.mutedForeground,
  textAlign: 'center',
  lineHeight: 1.65,
  maxWidth: '20rem',
})

export const StartBtn = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
  borderRadius: '1.5rem',
  border: 'none',
  cursor: 'pointer',
  background: theme.clay.primaryBg,
  color: '#fff',
  fontSize: '1.25rem', // ≥1.125rem — readable for elderly parents
  fontWeight: 700,
  fontFamily: theme.fonts.sans,
  boxShadow:
    '0 8px 0 oklch(0.42 0.1 155), 0 14px 30px oklch(0.55 0.1 155 / 0.3)',
  animation: `${breathe} 3s ease infinite`,
  '& svg': { width: '1.25rem', height: '1.25rem' },
})

// ── Loading / Error ──

export const Center = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
  padding: theme.spacing[8],
})

export const ErrorTitle = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  color: theme.colors.foreground,
  textAlign: 'center',
  lineHeight: 1.5,
})

export const ErrorHint = styled.p({
  fontSize: '1rem', // 1rem minimum for error messages
  color: theme.colors.mutedForeground,
  textAlign: 'center',
})
