'use client'

import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'
import type { Locale } from '@/lib/i18n'

const Header = styled.header<{ $isScrolled: boolean }>(({ $isScrolled }) => ({
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

const Nav = styled.nav({
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

const LogoLink = styled.a({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  textDecoration: 'none',
})

const LogoText = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '-0.025em',
})

const LogoSubtext = styled.span({
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
})

const DesktopNav = styled.div({
  display: 'none',
  alignItems: 'center',
  gap: theme.spacing[8],
  '@media (min-width: 768px)': {
    display: 'flex',
  },
})

const NavLink = styled.a({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  textDecoration: 'none',
  transition: `color ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
  },
})

const MobileMenuButton = styled.button({
  padding: theme.spacing[2],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  '@media (min-width: 768px)': {
    display: 'none',
  },
})

const MobileMenu = styled.div({
  backgroundColor: theme.colors.background,
  borderBottom: `1px solid ${theme.colors.border}`,
  '@media (min-width: 768px)': {
    display: 'none',
  },
})

const MobileMenuContent = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

const MobileNavLink = styled.a({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  textDecoration: 'none',
  padding: `${theme.spacing[2]} 0`,
  transition: `color ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
  },
})

const StyledButton = styled(Button)({
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  padding: `0 ${theme.spacing[6]}`,
  '&:hover': {
    opacity: 0.9,
  },
})

const StyledMobileButton = styled(Button)({
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  width: '100%',
  '&:hover': {
    opacity: 0.9,
  },
})

const LanguageGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
})

const LanguageButton = styled.button<{ $active: boolean }>(({ $active }) => ({
  border: `1px solid ${$active ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $active ? theme.colors.primary : 'transparent',
  color: $active
    ? theme.colors.primaryForeground
    : theme.colors.mutedForeground,
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

const MobileLanguageRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing[3],
})

const MobileLanguageLabel = styled.span({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
})

const languageOptions: Array<{ locale: Locale; label: string }> = [
  { locale: 'en', label: 'EN' },
  { locale: 'vi', label: 'VI' },
  { locale: 'fr', label: 'FR' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Header $isScrolled={isScrolled}>
      <Nav>
        <LogoLink href="#">
          <LogoText>ROOTS</LogoText>
          <LogoSubtext>{t('logoSubtext')}</LogoSubtext>
        </LogoLink>

        <DesktopNav>
          <NavLink href="#problem">{t('story')}</NavLink>
          <NavLink href="#solution">{t('howItWorks')}</NavLink>
          <NavLink href="#tech">{t('technology')}</NavLink>
          <LanguageGroup aria-label={t('languageLabel')}>
            {languageOptions.map((option) => (
              <LanguageButton
                key={option.locale}
                type="button"
                $active={locale === option.locale}
                onClick={() => setLocale(option.locale)}
                aria-pressed={locale === option.locale}
                aria-label={`${t('languageLabel')}: ${option.label}`}
              >
                {option.label}
              </LanguageButton>
            ))}
          </LanguageGroup>
          <StyledButton size="sm">{t('joinWaitlist')}</StyledButton>
        </DesktopNav>

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X
              style={{ width: 24, height: 24, color: theme.colors.foreground }}
            />
          ) : (
            <Menu
              style={{ width: 24, height: 24, color: theme.colors.foreground }}
            />
          )}
        </MobileMenuButton>
      </Nav>

      {isMobileMenuOpen && (
        <MobileMenu>
          <MobileMenuContent>
            <MobileNavLink
              href="#problem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('story')}
            </MobileNavLink>
            <MobileNavLink
              href="#solution"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('howItWorks')}
            </MobileNavLink>
            <MobileNavLink
              href="#tech"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('technology')}
            </MobileNavLink>
            <MobileLanguageRow>
              <MobileLanguageLabel>{t('languageLabel')}</MobileLanguageLabel>
              <LanguageGroup aria-label={t('languageLabel')}>
                {languageOptions.map((option) => (
                  <LanguageButton
                    key={option.locale}
                    type="button"
                    $active={locale === option.locale}
                    onClick={() => setLocale(option.locale)}
                    aria-pressed={locale === option.locale}
                    aria-label={`${t('languageLabel')}: ${option.label}`}
                  >
                    {option.label}
                  </LanguageButton>
                ))}
              </LanguageGroup>
            </MobileLanguageRow>
            <StyledMobileButton size="sm">
              {t('joinWaitlist')}
            </StyledMobileButton>
          </MobileMenuContent>
        </MobileMenu>
      )}
    </Header>
  )
}
