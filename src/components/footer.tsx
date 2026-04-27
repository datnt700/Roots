'use client'

import { useTranslations } from 'next-intl'
import {
  FooterWrapper, Container, TopRow, Logo, LogoText, LogoSubtext,
  LinksContainer, FooterLink, Copyright, HeartIcon, Tagline, TaglineText,
} from './footer.styles'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')

  return (
    <FooterWrapper>
      <Container>
        <TopRow>
          <Logo>
            <LogoText>ROOTS</LogoText>
            <LogoSubtext>{t('logoSubtext')}</LogoSubtext>
          </Logo>

          <LinksContainer>
            <FooterLink href="#">{t('privacyPolicy')}</FooterLink>
            <FooterLink href="#">{t('termsOfService')}</FooterLink>
            <FooterLink href="#">{t('contact')}</FooterLink>
          </LinksContainer>

          <Copyright>
            <span>{t('madeWith')}</span>
            <HeartIcon />
            <span>
              {t('inVietnam')} &copy; {currentYear}
            </span>
          </Copyright>
        </TopRow>

        <Tagline>
          <TaglineText>&ldquo;{t('tagline')}&rdquo;</TaglineText>
        </Tagline>
      </Container>
    </FooterWrapper>
  )
}
