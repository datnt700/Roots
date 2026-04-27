'use client'

import { useState, useEffect, useTransition } from 'react'
import { Menu, X } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import {
  Header, Nav, LogoLink, LogoText, LogoSubtext, DesktopNav, NavLink,
  MobileMenuButton, MobileMenu, MobileMenuContent, MobileNavLink,
  StyledButton, StyledMobileButton, LanguageGroup, LanguageButton,
  MobileLanguageRow, MobileLanguageLabel,
} from './navbar.styles'

type Locale = 'en' | 'vi' | 'fr'

const languageOptions: Array<{ locale: Locale; label: string }> = [
  { locale: 'en', label: 'EN' },
  { locale: 'vi', label: 'VI' },
  { locale: 'fr', label: 'FR' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [, startTransition] = useTransition()
  const t = useTranslations('navbar')
  const locale = useLocale() as Locale
  const router = useRouter()

  const setLocale = (next: Locale) => {
    document.cookie = `roots-locale=${next}; path=/; max-age=31536000`
    startTransition(() => router.refresh())
  }

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
