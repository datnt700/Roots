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

export const DesktopContainer = styled.div({
  display: 'none',
  '@media (min-width: 1024px)': {
    display: 'block',
  },
})

export const ProgressContainer = styled.div({
  position: 'relative',
  marginBottom: theme.spacing[16],
})

export const ProgressLine = styled.div({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: '2px',
  backgroundColor: theme.colors.border,
  transform: 'translateY(-50%)',
})

export const ProgressLineFill = styled.div<{ $progress: number }>(({ $progress }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  height: '2px',
  backgroundColor: theme.colors.primary,
  transform: 'translateY(-50%)',
  transition: `width ${theme.transitions.verySlow}`,
  width: `${$progress}%`,
}))

export const StepButtons = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
})

export const StepButton = styled.button<{ $isActive: boolean }>(({ $isActive }) => ({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  transition: `all ${theme.transitions.normal}`,
  backgroundColor: $isActive ? theme.colors.primary : theme.colors.muted,
  color: $isActive ? theme.colors.primaryForeground : theme.colors.mutedForeground,
  transform: $isActive ? 'scale(1.1)' : 'scale(1)',
  '&:hover': {
    backgroundColor: $isActive ? theme.colors.primary : 'rgba(229, 225, 219, 0.8)',
  },
}))

export const ContentWrapper = styled.div<{ $isVisible: boolean }>(({ $isVisible }) => ({
  transition: `all ${theme.transitions.verySlow}`,
  opacity: $isVisible ? 1 : 0,
  transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
  willChange: 'transform, opacity',
}))

export const ContentGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[16],
  alignItems: 'center',
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
})

export const Badge = styled.div<{ $bgColor: string; $textColor: string }>(
  ({ $bgColor: bgColor, $textColor: textColor }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.radius.full,
    fontSize: '0.875rem',
    marginBottom: theme.spacing[6],
    backgroundColor: bgColor,
    color: textColor,
  }),
)

export const ContentTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.875rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[4],
  '@media (min-width: 768px)': {
    fontSize: '2.25rem',
  },
})

export const ContentDescription = styled.p({
  fontSize: '1.125rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
  marginBottom: theme.spacing[8],
})

export const FeatureList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})

export const FeatureItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  color: 'oklch(0.25 0.02 60 / 0.8)',
})

export const FeatureDot = styled.div({
  width: '0.375rem',
  height: '0.375rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.primary,
})

export const VisualContainer = styled.div({
  position: 'relative',
})

export const VisualBox = styled.div({
  aspectRatio: '1',
  borderRadius: theme.radius['3xl'],
  backgroundColor: 'rgba(229, 225, 219, 0.5)',
  border: `1px solid ${theme.colors.border}`,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const VisualContent = styled.div({
  textAlign: 'center',
  padding: theme.spacing[12],
})

export const IconBox = styled.div<{ $bgColor: string; $textColor: string }>(
  ({ $bgColor: bgColor, $textColor: textColor }) => ({
    width: '6rem',
    height: '6rem',
    borderRadius: theme.radius['2xl'],
    backgroundColor: bgColor,
    margin: `0 auto ${theme.spacing[6]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: textColor,
  }),
)

export const VisualTitle = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[2],
})

export const VisualSubtitle = styled.p({
  color: theme.colors.mutedForeground,
})

export const DecorativeCircle = styled.div<{ $position: 'top' | 'bottom' }>(
  ({ $position }) => ({
    position: 'absolute',
    width: $position === 'top' ? '6rem' : '8rem',
    height: $position === 'top' ? '6rem' : '8rem',
    backgroundColor:
      $position === 'top'
        ? 'rgba(61, 107, 79, 0.05)'
        : 'rgba(193, 127, 78, 0.05)',
    borderRadius: '50%',
    filter: 'blur(32px)',
    ...($position === 'top'
      ? { top: '-1rem', right: '-1rem' }
      : { bottom: '-1rem', left: '-1rem' }),
  }),
)

export const NavigationButtons = styled.div({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing[4],
  marginTop: theme.spacing[12],
})

export const NavButton = styled.button<{ disabled: boolean }>(({ disabled }) => ({
  padding: theme.spacing[3],
  borderRadius: '50%',
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.3 : 1,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: disabled ? 'transparent' : theme.colors.muted,
  },
}))

export const MobileContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[8],
  '@media (min-width: 1024px)': {
    display: 'none',
  },
})

export const MobileCard = styled.div<{ $isVisible: boolean; $index: number }>(
  ({ $isVisible, $index }) => ({
    position: 'relative',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing[8],
    border: `1px solid ${theme.colors.border}`,
    transition: `all ${theme.transitions.verySlow}`,
    transitionDelay: `${$index * 150}ms`,
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
  }),
)

export const StepNumber = styled.div({
  position: 'absolute',
  top: '-0.75rem',
  left: '-0.75rem',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
})

export const MobileBadge = styled.div<{ $bgColor: string; $textColor: string }>(
  ({ $bgColor: bgColor, $textColor: textColor }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
    borderRadius: theme.radius.full,
    fontSize: '0.75rem',
    marginBottom: theme.spacing[4],
    backgroundColor: bgColor,
    color: textColor,
  }),
)

export const MobileTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[3],
})

export const MobileDescription = styled.p({
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing[6],
})

export const MobileFeatureList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
})

export const MobileFeatureItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  fontSize: '0.875rem',
  color: 'oklch(0.25 0.02 60 / 0.8)',
})

export const MobileFeatureDot = styled.div({
  width: '0.25rem',
  height: '0.25rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.primary,
})

export const ConnectionLine = styled.div({
  position: 'absolute',
  bottom: '-2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '2px',
  height: '2rem',
  backgroundColor: theme.colors.border,
})
