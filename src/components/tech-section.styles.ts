import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

export const Section = styled.section({
  position: 'relative',
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: theme.colors.background,
})

export const Container = styled.div({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

export const SectionHeader = styled.div({
  maxWidth: '48rem',
  margin: `0 auto ${theme.spacing[20]}`,
  textAlign: 'center',
})

export const SectionLabel = styled.p({
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: theme.colors.primary,
  marginBottom: theme.spacing[4],
})

export const SectionTitle = styled.h2({
  fontFamily: theme.fonts.serif,
  fontSize: '2.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[6],
  textWrap: 'balance',
  '@media (min-width: 768px)': {
    fontSize: '3rem',
  },
  '@media (min-width: 1024px)': {
    fontSize: '3.75rem',
  },
})

export const SectionDescription = styled.p({
  fontSize: '1.125rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
})

export const TechGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[6],
  marginBottom: theme.spacing[20],
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

export const TechCard = styled.div<{ $isVisible: boolean; $index: number }>(
  ({ $isVisible, $index }) => ({
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing[6],
    border: `1px solid ${theme.colors.border}`,
    transition: `all ${theme.transitions.slow}`,
    transitionDelay: `${$index * 100}ms`,
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
    willChange: 'transform, opacity',
    '&:hover': {
      borderColor: 'oklch(0.35 0.08 145 / 0.3)',
      boxShadow: theme.shadows.lg,
    },
  }),
)

export const TechCardHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[4],
})

export const TechIconWrapper = styled.div({
  width: '3rem',
  height: '3rem',
  borderRadius: theme.radius.xl,
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: `background-color ${theme.transitions.fast}`,
  '.group:hover &': {
    backgroundColor: 'oklch(0.35 0.08 145 / 0.1)',
  },
})

export const StatusBadge = styled.span({
  fontSize: '0.75rem',
  fontWeight: 500,
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  color: theme.colors.mutedForeground,
})

export const TechTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[2],
})

export const TechDescription = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
})

export const MarketCard = styled.div({
  backgroundColor: 'oklch(0.92 0.015 80 / 0.3)',
  borderRadius: theme.radius['3xl'],
  padding: theme.spacing[8],
  border: `1px solid ${theme.colors.border}`,
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[12]}`,
  },
})

export const MarketHeader = styled.div({
  textAlign: 'center',
  marginBottom: theme.spacing[12],
})

export const MarketLabel = styled.p({
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: theme.colors.primary,
  marginBottom: theme.spacing[4],
})

export const MarketTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  '@media (min-width: 768px)': {
    fontSize: '1.875rem',
  },
})

export const MetricsGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[8],
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

export const MetricCard = styled.div<{ $isAnimated: boolean; $index: number }>(
  ({ $isAnimated, $index }) => ({
    textAlign: 'center',
    transition: `all ${theme.transitions.verySlow}`,
    transitionDelay: `${$index * 200}ms`,
    opacity: $isAnimated ? 1 : 0,
    transform: $isAnimated ? 'scale(1)' : 'scale(0.95)',
    willChange: 'transform, opacity',
  }),
)

export const MetricValue = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '3rem',
  fontWeight: 700,
  color: theme.colors.primary,
  marginBottom: theme.spacing[2],
  '@media (min-width: 768px)': {
    fontSize: '3.75rem',
  },
})

export const MetricLabel = styled.p({
  color: theme.colors.mutedForeground,
})

export const MarketFooter = styled.div({
  marginTop: theme.spacing[12],
  textAlign: 'center',
})

export const MarketText = styled.p({
  color: 'oklch(0.25 0.02 60 / 0.8)',
  maxWidth: '42rem',
  margin: '0 auto',
  lineHeight: 1.6,
})
