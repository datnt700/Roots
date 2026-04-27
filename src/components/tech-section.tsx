'use client'

import { useEffect, useRef, useState } from 'react'
import { Cable, Cpu, Image, Mic, Lock, Brain } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import {
  Section, Container, SectionHeader, SectionLabel, SectionTitle, SectionDescription,
  TechGrid, TechCard, TechCardHeader, TechIconWrapper, StatusBadge, TechTitle, TechDescription,
  MarketCard, MarketHeader, MarketLabel, MarketTitle, MetricsGrid, MetricCard,
  MetricValue, MetricLabel, MarketFooter, MarketText,
} from './tech-section.styles'

const techIcons = [Cable, Brain, Mic, Image, Lock, Cpu]

export function TechSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [countersAnimated, setCountersAnimated] = useState(false)
  const t = useTranslations('tech')
  const features = t.raw('features') as Array<{ title: string; description: string; status: string }>
  const metrics = t.raw('metrics') as Array<{ value: string; label: string }>

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setTimeout(() => setCountersAnimated(true), 500)
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
    <Section id="tech" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionLabel>{t('sectionLabel')}</SectionLabel>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>
            {t('sectionDescription')}
          </SectionDescription>
        </SectionHeader>

        <TechGrid>
          {features.map((feature, index) => {
            const Icon = techIcons[index]

            return (
              <TechCard
                key={index}
                $isVisible={isVisible}
                $index={index}
                className="group"
              >
                <TechCardHeader>
                  <TechIconWrapper>
                    <Icon
                      style={{
                        width: 24,
                        height: 24,
                        color: theme.colors.primary,
                      }}
                    />
                  </TechIconWrapper>
                  <StatusBadge>{feature.status}</StatusBadge>
                </TechCardHeader>
                <TechTitle>{feature.title}</TechTitle>
                <TechDescription>{feature.description}</TechDescription>
              </TechCard>
            )
          })}
        </TechGrid>

        <MarketCard>
          <MarketHeader>
            <MarketLabel>{t('marketLabel')}</MarketLabel>
            <MarketTitle>{t('marketTitle')}</MarketTitle>
          </MarketHeader>

          <MetricsGrid>
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                $isAnimated={countersAnimated}
                $index={index}
              >
                <MetricValue>{metric.value}</MetricValue>
                <MetricLabel>{metric.label}</MetricLabel>
              </MetricCard>
            ))}
          </MetricsGrid>

          <MarketFooter>
            <MarketText>{t('marketText')}</MarketText>
          </MarketFooter>
        </MarketCard>
      </Container>
    </Section>
  )
}
