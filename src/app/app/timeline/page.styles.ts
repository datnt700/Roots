import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  minHeight: 'calc(100dvh - 3.5rem)',
  backgroundColor: theme.colors.background,
})

export const HeroSection = styled.div({
  padding: `${theme.spacing[6]} ${theme.spacing[4]} ${theme.spacing[4]}`,
  background: `linear-gradient(160deg, oklch(0.88 0.06 155 / 0.15) 0%, transparent 60%)`,
  borderBottom: `1px solid ${theme.colors.border}`,
  animation: `${fadeUp} 0.3s ease both`,
})

export const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.625rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1.2,
})

export const PageSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[1],
  lineHeight: 1.5,
})

export const HeroActions = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  marginTop: theme.spacing[4],
})

export const ActionBtn = styled.button<{ $primary?: boolean }>(({ $primary }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${$primary ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $primary ? theme.colors.primary : 'transparent',
  color: $primary ? '#fff' : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: $primary ? 600 : 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const TabBar = styled.div({
  display: 'flex',
  borderBottom: `1px solid ${theme.colors.border}`,
  // Glass sticky tab bar
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(12px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
  position: 'sticky',
  top: 0,
  zIndex: 9,
  padding: `0 ${theme.spacing[4]}`,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
})

export const Tab = styled.button<{ $active: boolean }>(({ $active }) => ({
  flexShrink: 0,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  borderBottom: $active
    ? `2px solid ${theme.colors.primary}`
    : '2px solid transparent',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  whiteSpace: 'nowrap',
}))

export const TabContent = styled.div({
  overflowY: 'auto',
})

// ─── Decades view ─────────────────────────────────────────────────────────────

export const DecadeSection = styled.div({
  marginBottom: theme.spacing[2],
  animation: `${fadeUp} 0.35s ease both`,
})

export const DecadeHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[2]}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
  // Glass sticky header
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(16px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
  borderBottom: '1px solid var(--glass-border)',
})

export const DecadeLabel = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  '& svg': {
    width: '0.875rem',
    height: '0.875rem',
    color: theme.colors.primary,
  },
})

export const DecadeTitle = styled.h2({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

export const DecadeCount = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginLeft: 'auto',
})

export const TimelineList = styled.div({
  position: 'relative',
  padding: `0 ${theme.spacing[4]} ${theme.spacing[4]}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: `calc(${theme.spacing[4]} + 1.375rem)`,
    top: '1rem',
    bottom: '1rem',
    width: '2px',
    // Gradient spine: vivid at top, fades out at bottom
    background: `linear-gradient(to bottom, ${theme.colors.primary}, oklch(0.60 0.08 155 / 0.4) 60%, transparent)`,
    borderRadius: theme.radius.full,
  },
})

export const TimelineItem = styled.div({
  display: 'flex',
  gap: theme.spacing[4],
  paddingBottom: theme.spacing[4],
  position: 'relative',
  animation: `${scaleIn} 0.3s ease both`,
})

export const TimelineDot = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: $color,
  // Layered ring: card border + accent ring for visual depth
  border: `3px solid var(--background, #f7f5f2)`,
  boxShadow: `0 0 0 2px ${theme.colors.primary}, ${theme.shadows.md}`,
  flexShrink: 0,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
}))

export const TimelineCard = styled.div({
  flex: 1,
  // Glass surface on timeline cards
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(12px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  transition: `box-shadow ${theme.transitions.fast}, transform ${theme.transitions.fast}`,
  cursor: 'pointer',
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: `${theme.shadows.md}, var(--glass-inset)`,
      transform: 'translateX(2px)',
    },
  },
  '&:active': { opacity: 0.8 },
})

export const TimelineCardBody = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
})

export const TimelineCardTitle = styled.div({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
  marginBottom: theme.spacing[1],
})

export const TimelineCardMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
})

export const TimelineCardBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.6875rem',
  padding: '0.15rem 0.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  color: theme.colors.mutedForeground,
  '& svg': { width: '0.625rem', height: '0.625rem' },
})

export const TimelineCardPhoto = styled.div({
  width: '100%',
  height: '6rem',
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '1.5rem',
    height: '1.5rem',
    color: theme.colors.mutedForeground,
  },
})

// ─── Albums view ─────────────────────────────────────────────────────────────

export const AlbumsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]}`,
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

export const AlbumCard = styled.div({
  // Glass surface
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(12px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  animation: `${scaleIn} 0.3s ease both`,
  willChange: 'transform, opacity',
  '@media (hover: hover)': {
    '&:hover': { boxShadow: theme.shadows.md, transform: 'translateY(-2px)' },
  },
  '&:active': { opacity: 0.8, transform: 'scale(0.98)' },
})

export const AlbumCover = styled.div<{ $color: string }>(({ $color }) => ({
  height: '6rem',
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '2rem', height: '2rem', color: '#fff', opacity: 0.8 },
}))

export const AlbumInfo = styled.div({
  padding: `${theme.spacing[3]}`,
})

export const AlbumName = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

export const AlbumCount = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

export const AddAlbumCard = styled.button({
  backgroundColor: 'transparent',
  border: `2px dashed ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  minHeight: '9rem',
  color: theme.colors.mutedForeground,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '& svg': { width: '1.5rem', height: '1.5rem' },
})

export const AddAlbumLabel = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 500,
})

export const EmptyDecade = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
})

export const DecadeChevron = styled.div({
  flexShrink: 0,
  '& svg': { width: '1rem', height: '1rem', color: theme.colors.mutedForeground },
})

export const TabLabel = styled.span({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const SkeletonSection = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  padding: '1.25rem',
  margin: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[3]}`,
})

export const SkeletonLine = styled.div<{ $width?: string; $height?: string; $marginBottom?: string }>(
  ({ $width = '100%', $height = '1rem', $marginBottom }) => ({
    width: $width,
    height: $height,
    borderRadius: '0.375rem',
    marginBottom: $marginBottom,
  }),
)

export const SkeletonBlock = styled.div<{ $height?: string; $marginBottom?: string }>(
  ({ $height = '3rem', $marginBottom }) => ({
    width: '100%',
    height: $height,
    borderRadius: '0.75rem',
    marginBottom: $marginBottom,
  }),
)
