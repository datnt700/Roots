'use client'

import { useEffect, useRef, useState } from 'react'
import { Layers, Smartphone, Database, ArrowRight } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import {
  Section, Container, SectionHeader, SectionLabel, SectionTitle, SectionDescription,
  DesktopContainer, ProgressContainer, ProgressLine, ProgressLineFill,
  StepButtons, StepButton, ContentWrapper, ContentGrid,
  Badge, ContentTitle, ContentDescription, FeatureList, FeatureItem, FeatureDot,
  VisualContainer, VisualBox, VisualContent, IconBox, VisualTitle, VisualSubtitle,
  DecorativeCircle, NavigationButtons, NavButton,
  MobileContainer, MobileCard, StepNumber, MobileBadge, MobileTitle, MobileDescription,
  MobileFeatureList, MobileFeatureItem, MobileFeatureDot, ConnectionLine,
} from './solution-section.styles'

const stepMeta = [
  {
    icon: Layers,
    color: { bg: 'rgba(193, 127, 78, 0.1)', text: '#c17f4e' },
  },
  {
    icon: Smartphone,
    color: { bg: 'rgba(61, 107, 79, 0.1)', text: '#3d6b4f' },
  },
  {
    icon: Database,
    color: { bg: 'rgba(139, 154, 132, 0.2)', text: '#6b6560' },
  },
]

export function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('solution')
  type SolutionStep = { title: string; subtitle: string; description: string; features: string[] }
  const steps = t.raw('steps') as SolutionStep[]

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
    <Section id="solution" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionLabel>{t('sectionLabel')}</SectionLabel>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>
            {t('sectionDescription')}
          </SectionDescription>
        </SectionHeader>

        <DesktopContainer>
          <ProgressContainer>
            <ProgressLine />
            <ProgressLineFill
              $progress={((activeStep + 1) / steps.length) * 100}
            />
            <StepButtons>
              {steps.map((step, index) => (
                <StepButton
                  key={index}
                  onClick={() => setActiveStep(index)}
                  $isActive={index <= activeStep}
                >
                  {String(index + 1).padStart(2, '0')}
                </StepButton>
              ))}
            </StepButtons>
          </ProgressContainer>

          <ContentWrapper $isVisible={isVisible}>
            {steps.map((step, index) => {
              const Icon = stepMeta[index].icon
              if (index !== activeStep) return null

              return (
                <ContentGrid key={index}>
                  <div>
                    <Badge
                      $bgColor={stepMeta[index].color.bg}
                      $textColor={stepMeta[index].color.text}
                    >
                      <Icon style={{ width: 16, height: 16 }} />
                      {step.subtitle}
                    </Badge>
                    <ContentTitle>{step.title}</ContentTitle>
                    <ContentDescription>{step.description}</ContentDescription>

                    <FeatureList>
                      {step.features.map((feature, i) => (
                        <FeatureItem key={i}>
                          <FeatureDot />
                          {feature}
                        </FeatureItem>
                      ))}
                    </FeatureList>
                  </div>

                  <VisualContainer>
                    <VisualBox>
                      <VisualContent>
                        <IconBox
                          $bgColor={stepMeta[index].color.bg}
                          $textColor={stepMeta[index].color.text}
                        >
                          <Icon style={{ width: 48, height: 48 }} />
                        </IconBox>
                        <VisualTitle>{step.title}</VisualTitle>
                        <VisualSubtitle>{step.subtitle}</VisualSubtitle>
                      </VisualContent>
                    </VisualBox>

                    <DecorativeCircle $position="top" />
                    <DecorativeCircle $position="bottom" />
                  </VisualContainer>
                </ContentGrid>
              )
            })}
          </ContentWrapper>

          <NavigationButtons>
            <NavButton
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              <ArrowRight
                style={{ width: 20, height: 20, transform: 'rotate(180deg)' }}
              />
            </NavButton>
            <NavButton
              onClick={() =>
                setActiveStep(Math.min(steps.length - 1, activeStep + 1))
              }
              disabled={activeStep === steps.length - 1}
            >
              <ArrowRight style={{ width: 20, height: 20 }} />
            </NavButton>
          </NavigationButtons>
        </DesktopContainer>

        <MobileContainer>
          {steps.map((step, index) => {
            const Icon = stepMeta[index].icon

            return (
              <MobileCard key={index} $isVisible={isVisible} $index={index}>
                <StepNumber>{String(index + 1).padStart(2, '0')}</StepNumber>

                <MobileBadge
                  $bgColor={stepMeta[index].color.bg}
                  $textColor={stepMeta[index].color.text}
                >
                  <Icon style={{ width: 12, height: 12 }} />
                  {step.subtitle}
                </MobileBadge>
                <MobileTitle>{step.title}</MobileTitle>
                <MobileDescription>{step.description}</MobileDescription>

                <MobileFeatureList>
                  {step.features.map((feature, i) => (
                    <MobileFeatureItem key={i}>
                      <MobileFeatureDot />
                      {feature}
                    </MobileFeatureItem>
                  ))}
                </MobileFeatureList>

                {index < steps.length - 1 && <ConnectionLine />}
              </MobileCard>
            )
          })}
        </MobileContainer>
      </Container>
    </Section>
  )
}
