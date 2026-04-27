'use client'

import { useEffect, useRef } from 'react'
import { ArrowDown, Play } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import {
  Section, BackgroundContainer, ParallaxCircle, DecorativeLines, DecorativeSvg,
  Content, AnimatedContent, Tagline, MainTitle, Subtitle, Headline, HighlightText,
  Description, ButtonGroup, PrimaryButton, SecondaryButton, ScrollIndicator,
  ScrollDot, ScrollDotInner,
} from './hero-section.styles'


export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('hero')

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
          <Tagline>{t('tagline')}</Tagline>
          <MainTitle>ROOTS</MainTitle>
          <Subtitle>{t('subtitle')}</Subtitle>

          <Headline>
            {t('headlineLine1')}
            <br />
            <HighlightText>{t('headlineHighlight')}</HighlightText>
          </Headline>

          <Description>{t('description')}</Description>

          <ButtonGroup>
            <PrimaryButton size="lg">
              {t('primaryButton')}
              <ArrowDown
                style={{ marginLeft: '0.5rem', width: 16, height: 16 }}
              />
            </PrimaryButton>
            <SecondaryButton variant="outline" size="lg">
              <Play style={{ marginRight: '0.5rem', width: 16, height: 16 }} />
              {t('secondaryButton')}
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
