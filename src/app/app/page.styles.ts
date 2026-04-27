import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Link from 'next/link'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '56rem',
  width: '100%',
  overflowX: 'hidden',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

export const Greeting = styled.div({
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.4s ease both`,
})

export const GreetingLabel = styled.p({
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[1],
})

export const GreetingTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.75rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1.2,
  '@media (min-width: 768px)': {
    fontSize: '2.25rem',
  },
})

export const GreetingSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[2],
  lineHeight: 1.6,
})

// ─── Stats bento ─────────────────────────────────────────────────────────────

export const StatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[6],
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

export const StatCard = styled.div({
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  border: `1px solid ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  animation: `${fadeUp} 0.4s ease both`,
  willChange: 'transform, opacity',
})

export const StatValue = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1,
})

export const StatLabel = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  fontWeight: 500,
})

// ─── Quick actions ────────────────────────────────────────────────────────────

export const Section = styled.section({
  marginBottom: theme.spacing[6],
})

export const SectionHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[3],
})

export const SectionTitle = styled.h2({
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
})

export const SeeAll = styled(Link)({
  fontSize: '0.8125rem',
  color: theme.colors.primary,
  textDecoration: 'none',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

export const QuickActionsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing[3],
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

export const QuickActionCard = styled(Link, { shouldForwardProp: (prop) => prop !== 'viewTransition' })<{ $accent?: string }>(({ $accent }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing[3],
  padding: theme.spacing[4],
  backgroundColor: $accent ?? theme.colors.card,
  borderRadius: theme.radius['2xl'],
  border: `1px solid ${theme.colors.border}`,
  textDecoration: 'none',
  transition: `all ${theme.transitions.fast}`,
  minHeight: '6.5rem',
  willChange: 'transform',
  animation: `${fadeUp} 0.4s ease both`,
  '&:active': { opacity: 0.8, transform: 'scale(0.98)' },
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'translateY(-1px)',
    },
  },
}))

export const ActionIcon = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: theme.radius.lg,
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '1.125rem', height: '1.125rem', color: '#fff' },
}))

export const ActionLabel = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
})

// ─── Parents row ─────────────────────────────────────────────────────────────

export const ParentsRow = styled.div({
  display: 'flex',
  gap: theme.spacing[3],
  overflowX: 'auto',
  paddingBottom: theme.spacing[2],
  scrollSnapType: 'x mandatory',
  animation: `${fadeUp} 0.4s 0.15s ease both`,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
})

export const ParentCard = styled.div({
  flexShrink: 0,
  scrollSnapAlign: 'start',
  width: '10rem',
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  border: `1px solid ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
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
  marginBottom: theme.spacing[1],
}))

export const ParentName = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.2,
})

export const ParentMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
})

export const ParentAddCard = styled.button({
  flexShrink: 0,
  scrollSnapAlign: 'start',
  width: '10rem',
  backgroundColor: 'transparent',
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  border: `2px dashed ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  transition: `all ${theme.transitions.fast}`,
  minHeight: '8rem',
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '& svg': { width: '1.5rem', height: '1.5rem' },
})

export const ParentAddLabel = styled.span({
  fontSize: '0.75rem',
  fontWeight: 500,
})

// ─── Recent memories list ─────────────────────────────────────────────────────

export const MemoryList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
  animation: `${fadeUp} 0.4s 0.2s ease both`,
})

export const MemoryItem = styled(Link, { shouldForwardProp: (prop) => prop !== 'viewTransition' })({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  border: `1px solid ${theme.colors.border}`,
  textDecoration: 'none',
  transition: `all ${theme.transitions.fast}`,
  willChange: 'transform',
  '&:active': { opacity: 0.8, transform: 'scale(0.99)' },
  '@media (hover: hover)': {
    '&:hover': { transform: 'translateX(2px)' },
  },
})

export const MemoryThumb = styled.div<{ $color: string }>(({ $color }) => ({
  width: '3rem',
  height: '3rem',
  borderRadius: theme.radius.xl,
  backgroundColor: $color,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '1.25rem', height: '1.25rem', color: '#fff' },
}))

export const MemoryInfo = styled.div({
  flex: 1,
  minWidth: 0,
})

export const MemoryTitle = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const MemoryMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

export const MemoryBadge = styled.span<{ $processed: boolean }>(({ $processed }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.6875rem',
  fontWeight: 500,
  padding: '0.2rem 0.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: $processed
    ? 'oklch(0.88 0.06 155 / 0.15)'
    : theme.colors.muted,
  color: $processed ? theme.colors.primary : theme.colors.mutedForeground,
  flexShrink: 0,
  '& svg': { width: '0.625rem', height: '0.625rem' },
}))

export const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[12]} ${theme.spacing[4]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[3],
})

export const EmptyIcon = styled.div({
  width: '4rem',
  height: '4rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '1.75rem',
    height: '1.75rem',
    color: theme.colors.mutedForeground,
  },
})

export const EmptyText = styled.p({
  fontSize: '0.9375rem',
  color: theme.colors.mutedForeground,
})

export const StartButton = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  fontSize: '0.875rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: `opacity ${theme.transitions.fast}`,
  '&:hover': { opacity: 0.9 },
  '& svg': { width: '1rem', height: '1rem' },
})

// ─── Feedback banner ─────────────────────────────────────────────────────────

export const FeedbackBanner = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.1)',
  border: `1px solid oklch(0.65 0.12 50 / 0.25)`,
  borderRadius: theme.radius['2xl'],
  textDecoration: 'none',
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.4s 0.08s ease both`,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': { backgroundColor: 'oklch(0.65 0.12 50 / 0.15)' },
})

export const FeedbackBannerIcon = styled.div({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& svg': { width: '1.125rem', height: '1.125rem', color: '#fff' },
})

export const FeedbackBannerText = styled.div({
  flex: 1,
})

export const FeedbackBannerTitle = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

export const FeedbackBannerSub = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

export const FeedbackBannerArrow = styled.div({
  flexShrink: 0,
  '& svg': { width: '1rem', height: '1rem', color: theme.colors.mutedForeground },
})

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const SkeletonAvatar = styled.div({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '50%',
  marginBottom: theme.spacing[1],
})

export const SkeletonNameLine = styled.div({
  width: '5rem',
  height: '0.875rem',
  borderRadius: theme.radius.md,
})

export const SkeletonMetaLine = styled.div({
  width: '3.5rem',
  height: '0.75rem',
  borderRadius: theme.radius.md,
  marginTop: theme.spacing[1],
})

export const SkeletonMemoryRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  border: `1px solid ${theme.colors.border}`,
})

export const SkeletonMemoryThumb = styled.div({
  width: '3rem',
  height: '3rem',
  borderRadius: theme.radius.xl,
  flexShrink: 0,
})

export const SkeletonMemoryInfo = styled.div({
  flex: 1,
})

export const SkeletonMemoryTitleLine = styled.div({
  width: '60%',
  height: '0.875rem',
  borderRadius: theme.radius.md,
  marginBottom: theme.spacing[2],
})

export const SkeletonMemoryMetaLine = styled.div({
  width: '40%',
  height: '0.75rem',
  borderRadius: theme.radius.md,
})
