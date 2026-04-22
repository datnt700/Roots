'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Check, X, Heart, MessageSquare, Shield, Users } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

const advantageIcons = [
  {
    icon: Heart,
  },
  {
    icon: Users,
  },
  {
    icon: Shield,
  },
]

const Section = styled.section({
  position: 'relative',
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: 'oklch(0.92 0.015 80 / 0.3)',
})

const Container = styled.div({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

const SectionHeader = styled.div({
  maxWidth: '48rem',
  margin: `0 auto ${theme.spacing[20]}`,
  textAlign: 'center',
})

const SectionLabel = styled.p({
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: theme.colors.primary,
  marginBottom: theme.spacing[4],
})

const SectionTitle = styled.h2({
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

const SectionDescription = styled.p({
  fontSize: '1.125rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
})

const ComparisonGrid = styled.div<{ isVisible: boolean }>(({ isVisible }) => ({
  display: 'grid',
  gap: theme.spacing[8],
  marginBottom: theme.spacing[20],
  transition: `all ${theme.transitions.verySlow}`,
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}))

const RootsCard = styled.div({
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['3xl'],
  padding: theme.spacing[8],
  border: `2px solid oklch(0.35 0.08 145 / 0.2)`,
  boxShadow: theme.shadows.lg,
  position: 'relative',
  overflow: 'hidden',
})

const CardDecoration = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '8rem',
  height: '8rem',
  backgroundColor: 'oklch(0.35 0.08 145 / 0.05)',
  borderRadius: '50%',
  filter: 'blur(32px)',
})

const CardContent = styled.div({
  position: 'relative',
})

const CardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[6],
})

const IconWrapper = styled.div<{ variant: 'primary' | 'muted' }>(
  ({ variant }) => ({
    width: '3rem',
    height: '3rem',
    borderRadius: theme.radius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      variant === 'primary' ? 'oklch(0.35 0.08 145 / 0.1)' : theme.colors.muted,
  }),
)

const CardTitleGroup = styled.div({})

const CardTitle = styled.h3<{ variant: 'primary' | 'muted' }>(
  ({ variant }) => ({
    fontFamily: theme.fonts.serif,
    fontSize: '1.5rem',
    fontWeight: 700,
    color:
      variant === 'primary'
        ? theme.colors.foreground
        : theme.colors.mutedForeground,
  }),
)

const CardSubtitle = styled.p<{ variant: 'primary' | 'muted' }>(
  ({ variant }) => ({
    fontSize: '0.875rem',
    color:
      variant === 'primary'
        ? theme.colors.primary
        : theme.colors.mutedForeground,
  }),
)

const ComparisonList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

const ComparisonItem = styled.li({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing[3],
})

const CheckCircle = styled.div<{ variant: 'primary' | 'muted' }>(
  ({ variant }) => ({
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '0.125rem',
    backgroundColor:
      variant === 'primary' ? 'oklch(0.35 0.08 145 / 0.1)' : theme.colors.muted,
  }),
)

const FeatureLabel = styled.p({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: theme.colors.mutedForeground,
  marginBottom: '0.125rem',
})

const FeatureValue = styled.p<{ variant: 'primary' | 'muted' }>(
  ({ variant }) => ({
    fontWeight: variant === 'primary' ? 500 : 400,
    color:
      variant === 'primary'
        ? theme.colors.foreground
        : theme.colors.mutedForeground,
  }),
)

const OthersCard = styled.div({
  backgroundColor: 'oklch(0.92 0.015 80 / 0.5)',
  borderRadius: theme.radius['3xl'],
  padding: theme.spacing[8],
  border: `1px solid ${theme.colors.border}`,
  position: 'relative',
  overflow: 'hidden',
})

const AdvantagesGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[8],
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

const AdvantageCard = styled.div<{ isVisible: boolean; index: number }>(
  ({ isVisible, index }) => ({
    textAlign: 'center',
    transition: `all ${theme.transitions.verySlow}`,
    transitionDelay: `${(index + 2) * 150}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
  }),
)

const AdvantageIcon = styled.div({
  width: '4rem',
  height: '4rem',
  borderRadius: theme.radius['2xl'],
  backgroundColor: 'oklch(0.35 0.08 145 / 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: `0 auto ${theme.spacing[6]}`,
})

const AdvantageTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[3],
})

const AdvantageDescription = styled.p({
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
})

export function CompetitiveSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { messages } = useI18n()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Section ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionLabel>{messages.competitive.sectionLabel}</SectionLabel>
          <SectionTitle>{messages.competitive.sectionTitle}</SectionTitle>
          <SectionDescription>
            {messages.competitive.sectionDescription}
          </SectionDescription>
        </SectionHeader>

        <ComparisonGrid isVisible={isVisible}>
          <RootsCard>
            <CardDecoration />
            <CardContent>
              <CardHeader>
                <IconWrapper variant="primary">
                  <Heart
                    style={{
                      width: 24,
                      height: 24,
                      color: theme.colors.primary,
                    }}
                  />
                </IconWrapper>
                <CardTitleGroup>
                  <CardTitle variant="primary">
                    {messages.competitive.rootsTitle}
                  </CardTitle>
                  <CardSubtitle variant="primary">
                    {messages.competitive.rootsSubtitle}
                  </CardSubtitle>
                </CardTitleGroup>
              </CardHeader>

              <ComparisonList>
                {messages.competitive.comparisons.map((item, index) => (
                  <ComparisonItem key={index}>
                    <CheckCircle variant="primary">
                      <Check
                        style={{
                          width: 12,
                          height: 12,
                          color: theme.colors.primary,
                        }}
                      />
                    </CheckCircle>
                    <div>
                      <FeatureLabel>{item.feature}</FeatureLabel>
                      <FeatureValue variant="primary">
                        {item.roots}
                      </FeatureValue>
                    </div>
                  </ComparisonItem>
                ))}
              </ComparisonList>
            </CardContent>
          </RootsCard>

          <OthersCard>
            <CardContent>
              <CardHeader>
                <IconWrapper variant="muted">
                  <MessageSquare
                    style={{
                      width: 24,
                      height: 24,
                      color: theme.colors.mutedForeground,
                    }}
                  />
                </IconWrapper>
                <CardTitleGroup>
                  <CardTitle variant="muted">
                    {messages.competitive.othersTitle}
                  </CardTitle>
                  <CardSubtitle variant="muted">
                    {messages.competitive.othersSubtitle}
                  </CardSubtitle>
                </CardTitleGroup>
              </CardHeader>

              <ComparisonList>
                {messages.competitive.comparisons.map((item, index) => (
                  <ComparisonItem key={index}>
                    <CheckCircle variant="muted">
                      <X
                        style={{
                          width: 12,
                          height: 12,
                          color: theme.colors.mutedForeground,
                        }}
                      />
                    </CheckCircle>
                    <div>
                      <FeatureLabel>{item.feature}</FeatureLabel>
                      <FeatureValue variant="muted">{item.others}</FeatureValue>
                    </div>
                  </ComparisonItem>
                ))}
              </ComparisonList>
            </CardContent>
          </OthersCard>
        </ComparisonGrid>

        <AdvantagesGrid>
          {messages.competitive.advantages.map((advantage, index) => {
            const Icon = advantageIcons[index].icon

            return (
              <AdvantageCard key={index} isVisible={isVisible} index={index}>
                <AdvantageIcon>
                  <Icon
                    style={{
                      width: 32,
                      height: 32,
                      color: theme.colors.primary,
                    }}
                  />
                </AdvantageIcon>
                <AdvantageTitle>{advantage.title}</AdvantageTitle>
                <AdvantageDescription>
                  {advantage.description}
                </AdvantageDescription>
              </AdvantageCard>
            )
          })}
        </AdvantagesGrid>
      </Container>
    </Section>
  )
}
