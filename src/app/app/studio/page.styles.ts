import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '52rem',
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

// ─── Filter/sort bar ─────────────────────────────────────────────────────────

export const FilterBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[4],
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  animation: `${fadeUp} 0.3s 0.05s ease both`,
})

export const FilterChip = styled.button<{ $active: boolean }>(({ $active }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${$active ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $active ? 'oklch(0.88 0.06 155 / 0.12)' : 'transparent',
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: $active ? 600 : 400,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '0.75rem', height: '0.75rem' },
}))

export const SortBtn = styled.button({
  marginLeft: 'auto',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Memory card ─────────────────────────────────────────────────────────────

export const MemoryCard = styled.div({
  // Glass surface
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

// ─── Split-view body (desktop: audio-left / transcript-right) ───────────────

export const SplitBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 640px)': {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
})

export const SplitLeft = styled.div({
  // Media pane: photo + AI summary
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 640px)': {
    width: '44%',
    flexShrink: 0,
    borderRight: '1px solid var(--glass-border)',
  },
})

export const SplitRight = styled.div({
  // Text pane: transcript + reflection + footer
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

export const MemoryCardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
})

export const ParentAvatar = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
  flexShrink: 0,
}))

export const MemoryMeta = styled.div({
  flex: 1,
  minWidth: 0,
})

export const MemoryTitle = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const MemorySubMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

export const StatusBadge = styled.span<{ $processed: boolean }>(({ $processed }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.625rem',
  borderRadius: theme.radius.full,
  fontSize: '0.6875rem',
  fontWeight: 600,
  backgroundColor: $processed
    ? 'oklch(0.88 0.06 155 / 0.15)'
    : theme.colors.muted,
  color: $processed ? theme.colors.primary : theme.colors.mutedForeground,
  flexShrink: 0,
}))

export const PhotoThumb = styled.div({
  width: '100%',
  height: '10rem',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '2rem',
    height: '2rem',
    color: theme.colors.mutedForeground,
  },
})

export const PhotoImg = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const CardSection = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  '&:last-child': { borderBottom: 'none' },
})

export const SectionLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[2],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

export const TranscriptText = styled.p({
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  lineHeight: 1.7,
  fontFamily: theme.fonts.serif,
})

export const TranscriptPending = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
  fontStyle: 'italic',
})

export const ReflectionInput = styled.textarea({
  width: '100%',
  minHeight: '5rem',
  padding: `${theme.spacing[3]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.primary}`,
  backgroundColor: theme.colors.background,
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  fontFamily: theme.fonts.sans,
  lineHeight: 1.6,
  resize: 'vertical',
  outline: 'none',
  '&::placeholder': { color: theme.colors.mutedForeground },
})

export const ReflectionDisplay = styled.p({
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  lineHeight: 1.7,
  fontStyle: 'italic',
})

export const AddReflectionBtn = styled.button<{ $mt?: boolean }>(({ $mt }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: '0.8125rem',
  color: theme.colors.primary,
  fontWeight: 500,
  border: `1px solid oklch(0.88 0.06 155 / 0.4)`,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  background: 'none',
  cursor: 'pointer',
  marginTop: $mt ? theme.spacing[2] : undefined,
  '& svg': { width: '0.75rem', height: '0.75rem' },
}))

export const CardFooter = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
})

export const FooterBtn = styled.button<{ $danger?: boolean }>(({ $danger }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${$danger ? theme.colors.destructive : theme.colors.border}`,
  backgroundColor: 'transparent',
  color: $danger ? theme.colors.destructive : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: $danger ? 'rgba(220,38,38,0.05)' : theme.colors.muted,
  },
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

export const SaveReflBtn = styled.button({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  border: 'none',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

export const HeartBtn = styled.button<{ $active: boolean }>(({ $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${$active ? 'oklch(0.65 0.15 20)' : theme.colors.border}`,
  backgroundColor: $active ? 'oklch(0.65 0.15 20 / 0.08)' : 'transparent',
  color: $active ? 'oklch(0.55 0.15 20)' : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  marginLeft: 'auto',
  '&:hover': {
    backgroundColor: $active
      ? 'oklch(0.65 0.15 20 / 0.14)'
      : theme.colors.muted,
  },
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

// ─── AI Summary section ───────────────────────────────────────────────────────

export const AiSection = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  background: 'oklch(0.55 0.1 155 / 0.03)',
})

export const AiLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.primary,
  marginBottom: theme.spacing[2],
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

export const AiTitle = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[1],
})

export const AiSummaryText = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.65,
})

export const TagRow = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[1],
  marginTop: theme.spacing[2],
})

export const Tag = styled.span({
  display: 'inline-block',
  padding: '0.2rem 0.6rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.55 0.1 155 / 0.1)',
  color: theme.colors.primary,
  fontSize: '0.75rem',
  fontWeight: 500,
})

export const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  fontSize: '0.9375rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[3],
  '& svg': { width: '2.5rem', height: '2.5rem', opacity: 0.3 },
})

// ─── Reflection actions row ───────────────────────────────────────────────────

export const ReflectionActions = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  marginTop: theme.spacing[2],
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
  // Glass surface — matches real MemoryCard
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

export const SkeletonBlock = styled.div<{ $height?: string; $radius?: string }>(
  ({ $height = '3.5rem', $radius = '0.75rem' }) => ({
    width: '100%',
    height: $height,
    borderRadius: $radius,
    ...skeletonShimmer,
  }),
)
