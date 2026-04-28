import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '48rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

export const PageHeader = styled.div({
  marginBottom: theme.spacing[5],
  animation: `${fadeUp} 0.3s ease both`,
})

export const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

export const PageSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[1],
})

// ─── Feedback card ────────────────────────────────────────────────────────────

export const FeedbackCard = styled.div({
  // Glass surface — consistent with all other app cards
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.35s ease both`,
  willChange: 'transform, opacity',
})

export const FeedbackHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[3]}`,
})

export const ParentAvatar = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  flexShrink: 0,
}))

export const ParentInfo = styled.div({
  flex: 1,
  minWidth: 0,
})

export const ParentName = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

export const FeedbackDate = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

export const PlayedBadge = styled.span<{ $played: boolean }>(({ $played }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.625rem',
  borderRadius: theme.radius.full,
  fontSize: '0.6875rem',
  fontWeight: 600,
  backgroundColor: $played
    ? 'oklch(0.88 0.06 155 / 0.12)'
    : 'oklch(0.65 0.12 50 / 0.1)',
  color: $played ? theme.colors.primary : theme.colors.accent,
  flexShrink: 0,
  '& svg': { width: '0.625rem', height: '0.625rem' },
}))

export const MemoryContext = styled.div({
  margin: `0 ${theme.spacing[4]}`,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: theme.colors.muted,
  borderRadius: theme.radius.xl,
  marginBottom: theme.spacing[3],
})

export const ContextLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[1],
})

export const ContextText = styled.div({
  fontSize: '0.8125rem',
  color: theme.colors.foreground,
  fontStyle: 'italic',
})

export const AudioPlayer = styled.div({
  margin: `0 ${theme.spacing[4]} ${theme.spacing[3]}`,
  padding: `${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.08)',
  border: `1px solid oklch(0.65 0.12 50 / 0.2)`,
  borderRadius: theme.radius.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})

export const AudioPlayerRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
})

export const AudioLabel = styled.div({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.colors.accent,
  letterSpacing: '0.05em',
})

export const PlayBtn = styled.button<{ $playing: boolean }>(({ $playing }) => ({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexShrink: 0,
  animation: $playing ? `${pulse} 2s ease infinite` : 'none',
  '& svg': { width: '1.1rem', height: '1.1rem' },
}))

export const ProgressTrack = styled.div({
  flex: 1,
  height: '0.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.2)',
  position: 'relative',
})

export const ProgressFill = styled.div<{ $pct: number }>(({ $pct }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: `${$pct}%`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  transition: 'width 0.1s linear',
}))

export const AudioTime = styled.span({
  fontSize: '0.75rem',
  fontFamily: theme.fonts.mono,
  color: theme.colors.accent,
  flexShrink: 0,
})

export const RelistenBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.75rem',
  color: theme.colors.accent,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

export const ResponseSection = styled.div({
  borderTop: `1px solid ${theme.colors.border}`,
  padding: `${theme.spacing[4]}`,
})

export const ResponseLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[3],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

export const ResponseText = styled.p({
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  lineHeight: 1.7,
  fontStyle: 'italic',
  marginBottom: theme.spacing[3],
})

export const ResponseInput = styled.textarea({
  width: '100%',
  minHeight: '4.5rem',
  padding: `${theme.spacing[3]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  fontFamily: theme.fonts.sans,
  lineHeight: 1.6,
  resize: 'none',
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': { borderColor: theme.colors.primary },
  '&::placeholder': { color: theme.colors.mutedForeground },
})

export const ResponseActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  marginTop: theme.spacing[2],
})

export const RecordResponseBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

export const SendBtn = styled.button<{ $disabled: boolean }>(({ $disabled }) => ({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.lg,
  backgroundColor: $disabled ? theme.colors.muted : theme.colors.primary,
  color: $disabled ? theme.colors.mutedForeground : '#fff',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: $disabled ? 'not-allowed' : 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

export const MarkPlayedBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

export const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[3],
  color: theme.colors.mutedForeground,
})

export const UnreadBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.1)',
  border: `1px solid oklch(0.65 0.12 50 / 0.25)`,
  borderRadius: theme.radius.xl,
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
  cursor: 'pointer',
  '& svg': {
    width: '1rem',
    height: '1rem',
    color: theme.colors.accent,
    flexShrink: 0,
  },
})

export const UnreadBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.25rem',
  height: '1.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  color: '#fff',
  fontSize: '0.6875rem',
  fontWeight: 700,
  padding: '0 0.3rem',
  marginLeft: 'auto',
})

export const UnreadText = styled.span({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.colors.foreground,
})

export const RelistenRow = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const EmptyStateIcon = styled.div({
  '& svg': { width: '3rem', height: '3rem', opacity: 0.3 },
})

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const shimmer = keyframes`
  from { background-position: -400px 0; }
  to   { background-position: 400px 0; }
`

const skeletonShimmer = {
  backgroundColor: theme.colors.muted,
  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
  backgroundSize: '400px 100%',
  backgroundRepeat: 'no-repeat' as const,
  animation: `${shimmer} 1.4s ease-in-out infinite`,
}

export const SkeletonCard = styled.div({
  // Glass surface — matches real FeedbackCard
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  padding: '1.25rem',
  marginBottom: theme.spacing[4],
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const SkeletonCardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const SkeletonCardHeaderInfo = styled.div({
  flex: 1,
})

export const SkeletonCircle = styled.div({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  flexShrink: 0,
  ...skeletonShimmer,
})

export const SkeletonLine = styled.div<{ $width?: string; $height?: string; $marginBottom?: string }>(
  ({ $width = '100%', $height = '0.875rem', $marginBottom }) => ({
    width: $width,
    height: $height,
    borderRadius: '0.375rem',
    marginBottom: $marginBottom,
    ...skeletonShimmer,
  }),
)

export const SkeletonBlock = styled.div<{ $height?: string }>(
  ({ $height = '3rem' }) => ({
    width: '100%',
    height: $height,
    borderRadius: '0.75rem',
    ...skeletonShimmer,
  }),
)
