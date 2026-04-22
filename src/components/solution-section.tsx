'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Layers, Smartphone, Database, ArrowRight } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

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

const Section = styled.section({
  position: 'relative',
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: theme.colors.background,
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

const DesktopContainer = styled.div({
  display: 'none',
  '@media (min-width: 1024px)': {
    display: 'block',
  },
})

const ProgressContainer = styled.div({
  position: 'relative',
  marginBottom: theme.spacing[16],
})

const ProgressLine = styled.div({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: '2px',
  backgroundColor: theme.colors.border,
  transform: 'translateY(-50%)',
})

const ProgressLineFill = styled.div<{ $progress: number }>(({ $progress }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  height: '2px',
  backgroundColor: theme.colors.primary,
  transform: 'translateY(-50%)',
  transition: `width ${theme.transitions.verySlow}`,
  width: `${$progress}%`,
}))

const StepButtons = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
})

const StepButton = styled.button<{ $isActive: boolean }>(({ $isActive }) => ({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  transition: `all ${theme.transitions.normal}`,
  backgroundColor: $isActive ? theme.colors.primary : theme.colors.muted,
  color: $isActive
    ? theme.colors.primaryForeground
    : theme.colors.mutedForeground,
  transform: $isActive ? 'scale(1.1)' : 'scale(1)',
  '&:hover': {
    backgroundColor: $isActive
      ? theme.colors.primary
      : 'rgba(229, 225, 219, 0.8)',
  },
}))

const ContentWrapper = styled.div<{ $isVisible: boolean }>(
  ({ $isVisible }) => ({
    transition: `all ${theme.transitions.verySlow}`,
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
    willChange: 'transform, opacity',
  }),
)

const ContentGrid = styled.div({
  display: 'grid',
  gap: theme.spacing[16],
  alignItems: 'center',
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
})

const Badge = styled.div<{ bgColor: string; textColor: string }>(
  ({ bgColor, textColor }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.radius.full,
    fontSize: '0.875rem',
    marginBottom: theme.spacing[6],
    backgroundColor: bgColor,
    color: textColor,
  }),
)

const ContentTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.875rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[4],
  '@media (min-width: 768px)': {
    fontSize: '2.25rem',
  },
})

const ContentDescription = styled.p({
  fontSize: '1.125rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.6,
  marginBottom: theme.spacing[8],
})

const FeatureList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})

const FeatureItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  color: 'oklch(0.25 0.02 60 / 0.8)',
})

const FeatureDot = styled.div({
  width: '0.375rem',
  height: '0.375rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.primary,
})

const VisualContainer = styled.div({
  position: 'relative',
})

const VisualBox = styled.div({
  aspectRatio: '1',
  borderRadius: theme.radius['3xl'],
  backgroundColor: 'rgba(229, 225, 219, 0.5)',
  border: `1px solid ${theme.colors.border}`,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const VisualContent = styled.div({
  textAlign: 'center',
  padding: theme.spacing[12],
})

const IconBox = styled.div<{ bgColor: string; textColor: string }>(
  ({ bgColor, textColor }) => ({
    width: '6rem',
    height: '6rem',
    borderRadius: theme.radius['2xl'],
    backgroundColor: bgColor,
    margin: `0 auto ${theme.spacing[6]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: textColor,
  }),
)

const VisualTitle = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[2],
})

const VisualSubtitle = styled.p({
  color: theme.colors.mutedForeground,
})

const DecorativeCircle = styled.div<{ $position: 'top' | 'bottom' }>(
  ({ $position }) => ({
    position: 'absolute',
    width: $position === 'top' ? '6rem' : '8rem',
    height: $position === 'top' ? '6rem' : '8rem',
    backgroundColor:
      $position === 'top'
        ? 'rgba(61, 107, 79, 0.05)'
        : 'rgba(193, 127, 78, 0.05)',
    borderRadius: '50%',
    filter: 'blur(32px)',
    ...($position === 'top'
      ? { top: '-1rem', right: '-1rem' }
      : { bottom: '-1rem', left: '-1rem' }),
  }),
)

const NavigationButtons = styled.div({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing[4],
  marginTop: theme.spacing[12],
})

const NavButton = styled.button<{ disabled: boolean }>(({ disabled }) => ({
  padding: theme.spacing[3],
  borderRadius: '50%',
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.3 : 1,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: disabled ? 'transparent' : theme.colors.muted,
  },
}))

const MobileContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[8],
  '@media (min-width: 1024px)': {
    display: 'none',
  },
})

const MobileCard = styled.div<{ $isVisible: boolean; $index: number }>(
  ({ $isVisible, $index }) => ({
    position: 'relative',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing[8],
    border: `1px solid ${theme.colors.border}`,
    transition: `all ${theme.transitions.verySlow}`,
    transitionDelay: `${$index * 150}ms`,
    opacity: $isVisible ? 1 : 0,
    transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
  }),
)

const StepNumber = styled.div({
  position: 'absolute',
  top: '-0.75rem',
  left: '-0.75rem',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
})

const MobileBadge = styled.div<{ bgColor: string; textColor: string }>(
  ({ bgColor, textColor }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
    borderRadius: theme.radius.full,
    fontSize: '0.75rem',
    marginBottom: theme.spacing[4],
    backgroundColor: bgColor,
    color: textColor,
  }),
)

const MobileTitle = styled.h3({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[3],
})

const MobileDescription = styled.p({
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing[6],
})

const MobileFeatureList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
})

const MobileFeatureItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  fontSize: '0.875rem',
  color: 'oklch(0.25 0.02 60 / 0.8)',
})

const MobileFeatureDot = styled.div({
  width: '0.25rem',
  height: '0.25rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.primary,
})

const ConnectionLine = styled.div({
  position: 'absolute',
  bottom: '-2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '2px',
  height: '2rem',
  backgroundColor: theme.colors.border,
})

export function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { messages } = useI18n()
  const steps = messages.solution.steps

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
          <SectionLabel>{messages.solution.sectionLabel}</SectionLabel>
          <SectionTitle>{messages.solution.sectionTitle}</SectionTitle>
          <SectionDescription>
            {messages.solution.sectionDescription}
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
                      bgColor={stepMeta[index].color.bg}
                      textColor={stepMeta[index].color.text}
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
                          bgColor={stepMeta[index].color.bg}
                          textColor={stepMeta[index].color.text}
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
                  bgColor={stepMeta[index].color.bg}
                  textColor={stepMeta[index].color.text}
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
