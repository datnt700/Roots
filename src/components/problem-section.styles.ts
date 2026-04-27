import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

export const Section = styled.section({
  position: 'relative',
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: 'rgba(229, 225, 219, 0.3)',
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

export const CardsGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[8],
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

export const Card = styled.div<{ $isVisible: boolean; $index: number }>(
  ({ $isVisible, $index }) => ({
    position: 'relative',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing[8],
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    transition: `all ${theme.transitions.verySlow}`,
    transitionDelay: `${$index * 150}ms`,
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
    willChange: 'transform, opacity',
    '&:hover': {
      boxShadow: theme.shadows.lg,
    },
  }),
)

export const IconWrapper = styled.div({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: theme.radius.xl,
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing[6],
  transition: `background-color ${theme.transitions.fast}`,
  '.group:hover &': {
    backgroundColor: 'rgba(61, 107, 79, 0.1)',
  },
})

export const CardTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[3],
})

export const CardDescription = styled.p({
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
  marginBottom: theme.spacing[6],
})

export const QuoteContainer = styled.div({
  paddingTop: theme.spacing[6],
  borderTop: `1px solid ${theme.colors.border}`,
})

export const Quote = styled.p({
  fontSize: '0.875rem',
  fontStyle: 'italic',
  color: 'rgba(45, 42, 38, 0.7)',
})

export const HoverAccent = styled.div({
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius['2xl'],
  border: '2px solid transparent',
  transition: `border-color ${theme.transitions.fast}`,
  pointerEvents: 'none',
  '.group:hover &': {
    borderColor: 'rgba(61, 107, 79, 0.2)',
  },
})

export const EmotionalStatement = styled.div({
  marginTop: theme.spacing[20],
  textAlign: 'center',
})

export const EmotionalQuote = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  color: 'rgba(45, 42, 38, 0.8)',
  fontStyle: 'italic',
  maxWidth: '42rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    fontSize: '1.875rem',
  },
})

export const EmotionalAttribution = styled.p({
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[4],
})
