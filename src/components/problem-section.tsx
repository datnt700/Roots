'use client'

import { useEffect, useRef, useState } from 'react'
import { Phone, Clock, MessageCircle } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import {
  Section, Container, SectionHeader, SectionLabel, SectionTitle, SectionDescription,
  CardsGrid, Card, IconWrapper, CardTitle, CardDescription,
  QuoteContainer, Quote, HoverAccent, EmotionalStatement, EmotionalQuote, EmotionalAttribution,
} from './problem-section.styles'

const problemIcons = [Phone, Clock, MessageCircle]

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const t = useTranslations('problem')
  const cards = t.raw('cards') as Array<{ title: string; description: string; quote: string }>

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-index') || '0',
            )
            setVisibleCards((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.3 },
    )

    const cards = sectionRef.current?.querySelectorAll('[data-index]')
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <Section id="problem" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionLabel>{t('sectionLabel')}</SectionLabel>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>
            {t('sectionDescription')}
          </SectionDescription>
        </SectionHeader>

        <CardsGrid>
          {cards.map((problem, index) => {
            const Icon = problemIcons[index]
            const isVisible = visibleCards.includes(index)

            return (
              <Card
                key={index}
                data-index={index}
                $isVisible={isVisible}
                $index={index}
                className="group"
              >
                <IconWrapper>
                  <Icon
                    style={{
                      width: 24,
                      height: 24,
                      color: theme.colors.primary,
                    }}
                  />
                </IconWrapper>

                <CardTitle>{problem.title}</CardTitle>
                <CardDescription>{problem.description}</CardDescription>

                <QuoteContainer>
                  <Quote>&ldquo;{problem.quote}&rdquo;</Quote>
                </QuoteContainer>

                <HoverAccent />
              </Card>
            )
          })}
        </CardsGrid>

        <EmotionalStatement>
          <EmotionalQuote>
            &ldquo;{t('emotionalQuote')}&rdquo;
          </EmotionalQuote>
          <EmotionalAttribution>
            — {t('emotionalAttribution')}
          </EmotionalAttribution>
        </EmotionalStatement>
      </Container>
    </Section>
  )
}
