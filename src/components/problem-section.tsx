'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Phone, Clock, MessageCircle } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

const problemIcons = [Phone, Clock, MessageCircle]

const Section = styled.section({
  position: 'relative',
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: 'rgba(229, 225, 219, 0.3)',
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

const CardsGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[8],
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

const Card = styled.div<{ $isVisible: boolean; $index: number }>(
  ({ $isVisible, $index }) => ({
    position: 'relative',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing[8],
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    transition: `all ${theme.transitions.verySlow}`,
    transitionDelay: `${$index * 150}ms`,
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
    '&:hover': {
      boxShadow: theme.shadows.lg,
    },
  }),
)

const IconWrapper = styled.div({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: theme.radius.xl,
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing[6],
  transition: `background-color ${theme.transitions.fast}`,
  '.group:hover &': {
    backgroundColor: 'rgba(61, 107, 79, 0.1)',
  },
})

const CardTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[3],
})

const CardDescription = styled.p({
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
  marginBottom: theme.spacing[6],
})

const QuoteContainer = styled.div({
  paddingTop: theme.spacing[6],
  borderTop: `1px solid ${theme.colors.border}`,
})

const Quote = styled.p({
  fontSize: '0.875rem',
  fontStyle: 'italic',
  color: 'rgba(45, 42, 38, 0.7)',
})

const HoverAccent = styled.div({
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius['2xl'],
  border: '2px solid transparent',
  transition: `border-color ${theme.transitions.fast}`,
  pointerEvents: 'none',
  '.group:hover &': {
    borderColor: 'rgba(61, 107, 79, 0.2)',
  },
})

const EmotionalStatement = styled.div({
  marginTop: theme.spacing[20],
  textAlign: 'center',
})

const EmotionalQuote = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  color: 'rgba(45, 42, 38, 0.8)',
  fontStyle: 'italic',
  maxWidth: '42rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    fontSize: '1.875rem',
  },
})

const EmotionalAttribution = styled.p({
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[4],
})

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const { messages } = useI18n()

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
          <SectionLabel>{messages.problem.sectionLabel}</SectionLabel>
          <SectionTitle>{messages.problem.sectionTitle}</SectionTitle>
          <SectionDescription>
            {messages.problem.sectionDescription}
          </SectionDescription>
        </SectionHeader>

        <CardsGrid>
          {messages.problem.cards.map((problem, index) => {
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
            &ldquo;{messages.problem.emotionalQuote}&rdquo;
          </EmotionalQuote>
          <EmotionalAttribution>
            — {messages.problem.emotionalAttribution}
          </EmotionalAttribution>
        </EmotionalStatement>
      </Container>
    </Section>
  )
}
