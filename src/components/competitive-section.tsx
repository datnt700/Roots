'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X, Heart, MessageSquare, Shield, Users } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import {
  Section, Container, SectionHeader, SectionLabel, SectionTitle, SectionDescription,
  ComparisonGrid, RootsCard, CardDecoration, CardContent, CardHeader,
  IconWrapper, CardTitleGroup, CardTitle, CardSubtitle,
  ComparisonList, ComparisonItem, CheckCircle, FeatureLabel, FeatureValue,
  OthersCard, AdvantagesGrid, AdvantageCard, AdvantageIcon, AdvantageTitle, AdvantageDescription,
} from './competitive-section.styles'

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

export function CompetitiveSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('competitive')
  const comparisons = t.raw('comparisons') as Array<{ feature: string; roots: string; others: string }>
  const advantages = t.raw('advantages') as Array<{ title: string; description: string }>

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
          <SectionLabel>{t('sectionLabel')}</SectionLabel>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>
            {t('sectionDescription')}
          </SectionDescription>
        </SectionHeader>

        <ComparisonGrid $isVisible={isVisible}>
          <RootsCard>
            <CardDecoration />
            <CardContent>
              <CardHeader>
                <IconWrapper $variant="primary">
                  <Heart
                    style={{
                      width: 24,
                      height: 24,
                      color: theme.colors.primary,
                    }}
                  />
                </IconWrapper>
                <CardTitleGroup>
                  <CardTitle $variant="primary">
                    {t('rootsTitle')}
                  </CardTitle>
                  <CardSubtitle $variant="primary">
                    {t('rootsSubtitle')}
                  </CardSubtitle>
                </CardTitleGroup>
              </CardHeader>

              <ComparisonList>
                {comparisons.map((item, index) => (
                  <ComparisonItem key={index}>
                    <CheckCircle $variant="primary">
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
                      <FeatureValue $variant="primary">
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
                <IconWrapper $variant="muted">
                  <MessageSquare
                    style={{
                      width: 24,
                      height: 24,
                      color: theme.colors.mutedForeground,
                    }}
                  />
                </IconWrapper>
                <CardTitleGroup>
                  <CardTitle $variant="muted">
                    {t('othersTitle')}
                  </CardTitle>
                  <CardSubtitle $variant="muted">
                    {t('othersSubtitle')}
                  </CardSubtitle>
                </CardTitleGroup>
              </CardHeader>

              <ComparisonList>
                {comparisons.map((item, index) => (
                  <ComparisonItem key={index}>
                    <CheckCircle $variant="muted">
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
                      <FeatureValue $variant="muted">{item.others}</FeatureValue>
                    </div>
                  </ComparisonItem>
                ))}
              </ComparisonList>
            </CardContent>
          </OthersCard>
        </ComparisonGrid>

        <AdvantagesGrid>
          {advantages.map((advantage, index) => {
            const Icon = advantageIcons[index].icon

            return (
              <AdvantageCard key={index} $isVisible={isVisible} $index={index}>
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
