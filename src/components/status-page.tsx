'use client'

import Image from 'next/image'
import {
  Page, Inner, LogoMark, BrandName, Code, Title, Description, Actions, PrimaryBtn, SecondaryBtn,
} from './status-page.styles'

// ─── Props ────────────────────────────────────────────────────────────────────

interface StatusPageProps {
  code: string
  title: string
  description: string
  homeHref?: string
  homeLabel?: string
  onReset?: () => void
  resetLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusPage({
  code,
  title,
  description,
  homeHref = '/',
  homeLabel = 'Về trang chủ',
  onReset,
  resetLabel = 'Thử lại',
}: StatusPageProps) {
  return (
    <Page>
      <Inner>
        <LogoMark>
          <Image
            src="/icon.svg"
            alt="Roots"
            width={72}
            height={72}
            priority
            style={{ borderRadius: '1rem' }}
          />
          <BrandName>Roots · Gốc</BrandName>
        </LogoMark>

        <Code>{code}</Code>

        <Title>{title}</Title>
        <Description>{description}</Description>

        <Actions>
          <PrimaryBtn href={homeHref}>{homeLabel}</PrimaryBtn>
          {onReset && (
            <SecondaryBtn onClick={onReset}>{resetLabel}</SecondaryBtn>
          )}
        </Actions>
      </Inner>
    </Page>
  )
}
