'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { joinWaitlist } from '@/app/action'
import { initialWaitlistState } from '@/lib/waitlist-action-state'
import {
  Section, BackgroundDecoration, DecorationCircle, Container, ContentWrapper,
  QuoteSection, QuoteIcon, QuoteText, QuoteHighlight, VisionText,
  FormWrapper, InputWrapper, MailIcon, EmailInput, SubmitButton,
  SuccessCard, SuccessTitle, SuccessText, ErrorText,
  SecondaryCTAs, SecondaryButton, Divider,
} from './final-cta-section.styles'

export function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialWaitlistState,
  )
  const t = useTranslations('finalCta')
  const secondaryCtas = t.raw('secondaryCtas') as string[]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Section ref={sectionRef}>
      <BackgroundDecoration>
        <DecorationCircle $position="top" />
        <DecorationCircle $position="bottom" />
      </BackgroundDecoration>

      <Container>
        <ContentWrapper $isVisible={isVisible}>
          <QuoteSection>
            <QuoteIcon viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </QuoteIcon>
            <QuoteText>{t('quoteText')}</QuoteText>
            <QuoteHighlight>{t('quoteHighlight')}</QuoteHighlight>
          </QuoteSection>

          <VisionText>{t('visionText')}</VisionText>

          {!state.success ? (
            <>
              {state.message ? <ErrorText>{state.message}</ErrorText> : null}
              <FormWrapper action={formAction}>
                <InputWrapper>
                  <MailIcon />
                  <EmailInput
                    name="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    autoComplete="email"
                    required
                  />
                </InputWrapper>
                <SubmitButton type="submit" size="lg" disabled={isPending}>
                  {t('submitButton')}
                  <ArrowRight
                    style={{ marginLeft: '0.5rem', width: 16, height: 16 }}
                  />
                </SubmitButton>
              </FormWrapper>
            </>
          ) : (
            <SuccessCard>
              <SuccessTitle>{t('successTitle')}</SuccessTitle>
              <SuccessText>
                {state.message || t('successText')}
              </SuccessText>
            </SuccessCard>
          )}

          <SecondaryCTAs>
            <SecondaryButton variant="ghost">
              {secondaryCtas[0]}
            </SecondaryButton>
            <Divider>|</Divider>
            <SecondaryButton variant="ghost">
              {secondaryCtas[1]}
            </SecondaryButton>
            <Divider>|</Divider>
            <SecondaryButton variant="ghost">
              {secondaryCtas[2]}
            </SecondaryButton>
          </SecondaryCTAs>
        </ContentWrapper>
      </Container>
    </Section>
  )
}
