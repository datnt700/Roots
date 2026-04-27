import styled from '@emotion/styled'
import { Heart } from 'lucide-react'
import { theme } from '@/lib/theme'

export const FooterWrapper = styled.footer({
  backgroundColor: theme.colors.background,
  borderTop: `1px solid ${theme.colors.border}`,
  padding: `${theme.spacing[12]} 0`,
})

export const Container = styled.div({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

export const TopRow = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing[6],
  '@media (min-width: 768px)': {
    flexDirection: 'row',
  },
})

export const Logo = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
})

export const LogoText = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

export const LogoSubtext = styled.span({
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
})

export const LinksContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[6],
  fontSize: '0.875rem',
})

export const FooterLink = styled.a({
  color: theme.colors.mutedForeground,
  textDecoration: 'none',
  transition: `color ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
  },
})

export const Copyright = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
})

export const HeartIcon = styled(Heart)({
  width: '1rem',
  height: '1rem',
  color: theme.colors.accent,
  fill: theme.colors.accent,
})

export const Tagline = styled.div({
  marginTop: theme.spacing[8],
  paddingTop: theme.spacing[8],
  borderTop: `1px solid ${theme.colors.border}`,
  textAlign: 'center',
})

export const TaglineText = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  color: 'oklch(0.25 0.02 60 / 0.6)',
  fontStyle: 'italic',
})
