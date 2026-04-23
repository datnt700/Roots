'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Button } from '@/components/ui/button'
import { ArrowDown, Play } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useMessages } from 'next-intl'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%) translateX(-50%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0) translateX(-50%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const Section = styled.section({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  paddingTop: '5rem',
})

const BackgroundContainer = styled.div({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
})

const ParallaxCircle = styled.div<{
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

const DecorativeLines = styled.div({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
})

const DecorativeSvg = styled.svg({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0.03,
})

const Content = styled.div({
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

const AnimatedContent = styled.div({
  animation: `${fadeIn} 1s ease-out forwards`,
  willChange: 'transform, opacity',
})

const Tagline = styled.p({
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[6],
})

const MainTitle = styled.h1({
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

const Subtitle = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[8],
  fontStyle: 'italic',
  '@media (min-width: 768px)': {
    fontSize: '1.875rem',
  },
})

const Headline = styled.p({
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

const HighlightText = styled.span({
  color: theme.colors.primary,
  fontWeight: 500,
})

const Description = styled.p({
  color: theme.colors.mutedForeground,
  maxWidth: '36rem',
  margin: `0 auto ${theme.spacing[12]}`,
  lineHeight: 1.6,
})

const ButtonGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
})

const PrimaryButton = styled(Button)({
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

const SecondaryButton = styled(Button)({
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[6]} ${theme.spacing[8]}`,
  fontSize: '1rem',
  fontWeight: 500,
  borderColor: theme.colors.border,
  '&:hover': {
    backgroundColor: theme.colors.muted,
  },
})

const ScrollIndicator = styled.div({
  position: 'absolute',
  bottom: '2.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  animation: `${bounce} 1s infinite`,
})

const ScrollDot = styled.div({
  width: '1.5rem',
  height: '2.5rem',
  border: '2px solid rgba(107, 101, 96, 0.3)',
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: theme.spacing[1],
})

const ScrollDotInner = styled.div({
  width: '0.375rem',
  height: '0.75rem',
  backgroundColor: 'rgba(107, 101, 96, 0.5)',
  borderRadius: theme.radius.full,
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
})

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const messages = useMessages()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const parallaxElements = section.querySelectorAll('[data-parallax]')
      parallaxElements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.5')
        ;(el as HTMLElement).style.transform =
          `translateY(${scrollY * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Section ref={sectionRef}>
      <BackgroundContainer>
        <ParallaxCircle
          data-parallax="0.3"
          top="5rem"
          left="2.5rem"
          size="18rem"
          bgColor="rgba(193, 127, 78, 0.1)"
        />
        <ParallaxCircle
          data-parallax="0.2"
          bottom="5rem"
          right="2.5rem"
          size="24rem"
          bgColor="rgba(61, 107, 79, 0.05)"
        />
        <ParallaxCircle
          data-parallax="0.4"
          top="50%"
          left="50%"
          size="50rem"
          bgColor="rgba(229, 225, 219, 0.5)"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </BackgroundContainer>

      <DecorativeLines>
        <DecorativeSvg viewBox="0 0 1440 900" fill="none">
          <path
            d="M0 450C200 350 400 550 600 450C800 350 1000 550 1200 450C1400 350 1440 450 1440 450"
            stroke="currentColor"
            strokeWidth="1"
            style={{ color: theme.colors.foreground }}
          />
          <path
            d="M0 500C200 400 400 600 600 500C800 400 1000 600 1200 500C1400 400 1440 500 1440 500"
            stroke="currentColor"
            strokeWidth="1"
            style={{ color: theme.colors.foreground }}
          />
        </DecorativeSvg>
      </DecorativeLines>

      <Content>
        <AnimatedContent>
          <Tagline>{messages.hero.tagline}</Tagline>
          <MainTitle>ROOTS</MainTitle>
          <Subtitle>{messages.hero.subtitle}</Subtitle>

          <Headline>
            {messages.hero.headlineLine1}
            <br />
            <HighlightText>{messages.hero.headlineHighlight}</HighlightText>
          </Headline>

          <Description>{messages.hero.description}</Description>

          <ButtonGroup>
            <PrimaryButton size="lg">
              {messages.hero.primaryButton}
              <ArrowDown
                style={{ marginLeft: '0.5rem', width: 16, height: 16 }}
              />
            </PrimaryButton>
            <SecondaryButton variant="outline" size="lg">
              <Play style={{ marginRight: '0.5rem', width: 16, height: 16 }} />
              {messages.hero.secondaryButton}
            </SecondaryButton>
          </ButtonGroup>
        </AnimatedContent>

        <ScrollIndicator>
          <ScrollDot>
            <ScrollDotInner />
          </ScrollDot>
        </ScrollIndicator>
      </Content>
    </Section>
  )
}
