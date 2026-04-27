import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Button } from '@/components/ui/button'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%) translateX(-50%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0) translateX(-50%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Section = styled.section({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  paddingTop: '5rem',
})

export const BackgroundContainer = styled.div({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
})

export const ParallaxCircle = styled.div<{
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: string
  bgColor: string
}>(({ top, bottom, left, right, size, bgColor }) => ({
  position: 'absolute',
  top,
  bottom,
  left,
  right,
  width: size,
  height: size,
  backgroundColor: bgColor,
  borderRadius: '50%',
  filter: 'blur(48px)',
}))

export const DecorativeLines = styled.div({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
})

export const DecorativeSvg = styled.svg({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0.03,
})

export const Content = styled.div({
  position: 'relative',
  zIndex: 10,
  maxWidth: '64rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  textAlign: 'center',
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

export const AnimatedContent = styled.div({
  animation: `${fadeIn} 1s ease-out forwards`,
  willChange: 'transform, opacity',
})

export const Tagline = styled.p({
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[6],
})

export const MainTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '3.75rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[4],
  letterSpacing: '-0.025em',
  '@media (min-width: 768px)': {
    fontSize: '6rem',
  },
  '@media (min-width: 1024px)': {
    fontSize: '8rem',
  },
})

export const Subtitle = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[8],
  fontStyle: 'italic',
  '@media (min-width: 768px)': {
    fontSize: '1.875rem',
  },
})

export const Headline = styled.p({
  fontSize: '1.25rem',
  color: 'rgba(45, 42, 38, 0.8)',
  maxWidth: '42rem',
  margin: `0 auto ${theme.spacing[6]}`,
  lineHeight: 1.6,
  fontWeight: 300,
  '@media (min-width: 768px)': {
    fontSize: '1.5rem',
  },
})

export const HighlightText = styled.span({
  color: theme.colors.primary,
  fontWeight: 500,
})

export const Description = styled.p({
  color: theme.colors.mutedForeground,
  maxWidth: '36rem',
  margin: `0 auto ${theme.spacing[12]}`,
  lineHeight: 1.6,
})

export const ButtonGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
})

export const PrimaryButton = styled(Button)({
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[6]} ${theme.spacing[8]}`,
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: '0 10px 15px -3px rgba(61, 107, 79, 0.2)',
  '&:hover': {
    opacity: 0.9,
  },
})

export const SecondaryButton = styled(Button)({
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[6]} ${theme.spacing[8]}`,
  fontSize: '1rem',
  fontWeight: 500,
  borderColor: theme.colors.border,
  '&:hover': {
    backgroundColor: theme.colors.muted,
  },
})

export const ScrollIndicator = styled.div({
  position: 'absolute',
  bottom: '2.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  animation: `${bounce} 1s infinite`,
})

export const ScrollDot = styled.div({
  width: '1.5rem',
  height: '2.5rem',
  border: '2px solid rgba(107, 101, 96, 0.3)',
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: theme.spacing[1],
})

export const ScrollDotInner = styled.div({
  width: '0.375rem',
  height: '0.75rem',
  backgroundColor: 'rgba(107, 101, 96, 0.5)',
  borderRadius: theme.radius.full,
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
})

// ─── Modal ────────────────────────────────────────────────────────────────────

export const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(1rem) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const ModalOverlay = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing[6],
  backgroundColor: 'rgba(28, 24, 20, 0.6)',
  backdropFilter: 'blur(6px)',
})

export const ModalCard = styled.div({
  position: 'relative',
  width: '100%',
  maxWidth: '48rem',
  maxHeight: '82vh',
  overflowY: 'auto',
  backgroundColor: theme.colors.card,
  color: theme.colors.foreground,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  boxShadow: theme.shadows.lg,
  padding: theme.spacing[8],
  animation: `${popIn} ${theme.transitions.normal}`,
  '@media (min-width: 768px)': {
    padding: theme.spacing[10],
  },
})

export const ModalCloseButton = styled.button({
  position: 'absolute',
  top: theme.spacing[4],
  right: theme.spacing[4],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: theme.radius.full,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  color: theme.colors.mutedForeground,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
    backgroundColor: theme.colors.muted,
  },
})

export const ModalTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  color: theme.colors.foreground,
  marginBottom: theme.spacing[6],
  paddingRight: theme.spacing[10],
})

export const ModalParagraph = styled.p({
  marginBottom: theme.spacing[5],
  color: theme.colors.mutedForeground,
  lineHeight: 1.8,
  fontSize: '1rem',
  '&:last-of-type': {
    marginBottom: 0,
  },
})
