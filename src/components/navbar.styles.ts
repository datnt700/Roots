import styled from '@emotion/styled'
import { Button } from '@/components/ui/button'
import { theme } from '@/lib/theme'

export const Header = styled.header<{ $isScrolled: boolean }>(({ $isScrolled }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  transition: `all ${theme.transitions.normal}`,
  backgroundColor: $isScrolled ? 'rgba(247, 245, 242, 0.9)' : 'transparent',
  backdropFilter: $isScrolled ? 'blur(12px)' : 'none',
  borderBottom: $isScrolled ? `1px solid ${theme.colors.border}` : 'none',
  boxShadow: $isScrolled ? theme.shadows.sm : 'none',
}))

export const Nav = styled.nav({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  height: '5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

export const LogoLink = styled.a({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  textDecoration: 'none',
})

export const LogoText = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '-0.025em',
})

export const LogoSubtext = styled.span({
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
})

export const DesktopNav = styled.div({
  display: 'none',
  alignItems: 'center',
  gap: theme.spacing[8],
  '@media (min-width: 768px)': {
    display: 'flex',
  },
})

export const NavLink = styled.a({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  textDecoration: 'none',
  transition: `color ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
  },
})

export const MobileMenuButton = styled.button({
  padding: theme.spacing[2],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  '@media (min-width: 768px)': {
    display: 'none',
  },
})

export const MobileMenu = styled.div({
  backgroundColor: theme.colors.background,
  borderBottom: `1px solid ${theme.colors.border}`,
  '@media (min-width: 768px)': {
    display: 'none',
  },
})

export const MobileMenuContent = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

export const MobileNavLink = styled.a({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  textDecoration: 'none',
  padding: `${theme.spacing[2]} 0`,
  transition: `color ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
  },
})

export const StyledButton = styled(Button)({
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  padding: `0 ${theme.spacing[6]}`,
  '&:hover': {
    opacity: 0.9,
  },
})

export const StyledMobileButton = styled(Button)({
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  width: '100%',
  '&:hover': {
    opacity: 0.9,
  },
})

export const LanguageGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
})

export const LanguageButton = styled.button<{ $active: boolean }>(({ $active }) => ({
  border: `1px solid ${$active ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $active ? theme.colors.primary : 'transparent',
  color: $active ? theme.colors.primaryForeground : theme.colors.mutedForeground,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
  fontSize: '0.75rem',
  fontWeight: 600,
  lineHeight: 1,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    color: $active ? theme.colors.primaryForeground : theme.colors.foreground,
    borderColor: theme.colors.primary,
  },
}))

export const MobileLanguageRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing[3],
})

export const MobileLanguageLabel = styled.span({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
})
