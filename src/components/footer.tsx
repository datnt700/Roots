'use client'

import styled from '@emotion/styled'
import { Heart } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

const FooterWrapper = styled.footer({
  backgroundColor: theme.colors.background,
  borderTop: `1px solid ${theme.colors.border}`,
  padding: `${theme.spacing[12]} 0`,
})

const Container = styled.div({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

const TopRow = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing[6],
  '@media (min-width: 768px)': {
    flexDirection: 'row',
  },
})

const Logo = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
})

const LogoText = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

const LogoSubtext = styled.span({
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
})

const LinksContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[6],
  fontSize: '0.875rem',
})

const FooterLink = styled.a({
  color: theme.colors.mutedForeground,
  textDecoration: 'none',
  transition: `color ${theme.transitions.fast}`,
  '&:hover': {
    color: theme.colors.foreground,
  },
})

const Copyright = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
})

const HeartIcon = styled(Heart)({
  width: '1rem',
  height: '1rem',
  color: theme.colors.accent,
  fill: theme.colors.accent,
})

const Tagline = styled.div({
  marginTop: theme.spacing[8],
  paddingTop: theme.spacing[8],
  borderTop: `1px solid ${theme.colors.border}`,
  textAlign: 'center',
})

const TaglineText = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  color: 'oklch(0.25 0.02 60 / 0.6)',
  fontStyle: 'italic',
})

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { messages } = useI18n()

  return (
    <FooterWrapper>
      <Container>
        <TopRow>
          <Logo>
            <LogoText>ROOTS</LogoText>
            <LogoSubtext>{messages.footer.logoSubtext}</LogoSubtext>
          </Logo>

          <LinksContainer>
            <FooterLink href="#">{messages.footer.privacyPolicy}</FooterLink>
            <FooterLink href="#">{messages.footer.termsOfService}</FooterLink>
            <FooterLink href="#">{messages.footer.contact}</FooterLink>
          </LinksContainer>

          <Copyright>
            <span>{messages.footer.madeWith}</span>
            <HeartIcon />
            <span>
              {messages.footer.inVietnam} &copy; {currentYear}
            </span>
          </Copyright>
        </TopRow>

        <Tagline>
          <TaglineText>&ldquo;{messages.footer.tagline}&rdquo;</TaglineText>
        </Tagline>
      </Container>
    </FooterWrapper>
  )
}
