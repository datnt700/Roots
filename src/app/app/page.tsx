'use client'

import { useState } from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import {
  Mic,
  Film,
  Clock,
  MessageSquare,
  ChevronRight,
  Plus,
  Heart,
  Headphones,
  Users,
  BookOpen,
} from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '56rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

const Greeting = styled.div({
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.4s ease both`,
})

const GreetingLabel = styled.p({
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[1],
})

const GreetingTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.75rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1.2,
  '@media (min-width: 768px)': {
    fontSize: '2.25rem',
  },
})

const GreetingSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[2],
  lineHeight: 1.6,
})

// ─── Stats bento ─────────────────────────────────────────────────────────────

const StatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[6],
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

const StatCard = styled.div({
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  border: `1px solid ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  animation: `${fadeUp} 0.4s ease both`,
  willChange: 'transform, opacity',
})

const StatValue = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1,
})

const StatLabel = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  fontWeight: 500,
})

// ─── Quick actions ────────────────────────────────────────────────────────────

const Section = styled.section({
  marginBottom: theme.spacing[6],
})

const SectionHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[3],
})

const SectionTitle = styled.h2({
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
})

const SeeAll = styled(Link)({
  fontSize: '0.8125rem',
  color: theme.colors.primary,
  textDecoration: 'none',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

const QuickActionsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing[3],
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

const QuickActionCard = styled(Link)<{ $accent?: string }>(({ $accent }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing[3],
  padding: theme.spacing[4],
  backgroundColor: $accent ?? theme.colors.card,
  borderRadius: theme.radius['2xl'],
  border: `1px solid ${theme.colors.border}`,
  textDecoration: 'none',
  transition: `all ${theme.transitions.fast}`,
  minHeight: '6.5rem',
  willChange: 'transform',
  animation: `${fadeUp} 0.4s ease both`,
  '&:active': { opacity: 0.8, transform: 'scale(0.98)' },
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'translateY(-1px)',
    },
  },
}))

const ActionIcon = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: theme.radius.lg,
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '1.125rem', height: '1.125rem', color: '#fff' },
}))

const ActionLabel = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
})

// ─── Parents row ─────────────────────────────────────────────────────────────

const ParentsRow = styled.div({
  display: 'flex',
  gap: theme.spacing[3],
  overflowX: 'auto',
  paddingBottom: theme.spacing[2],
  scrollSnapType: 'x mandatory',
  animation: `${fadeUp} 0.4s 0.15s ease both`,
  // hide scrollbar
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
})

const ParentCard = styled.div({
  flexShrink: 0,
  scrollSnapAlign: 'start',
  width: '10rem',
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  border: `1px solid ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
})

const ParentAvatar = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  marginBottom: theme.spacing[1],
}))

const ParentName = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.2,
})

const ParentMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
})

const ParentAddCard = styled.button({
  flexShrink: 0,
  scrollSnapAlign: 'start',
  width: '10rem',
  backgroundColor: 'transparent',
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  border: `2px dashed ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  transition: `all ${theme.transitions.fast}`,
  minHeight: '8rem',
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '& svg': { width: '1.5rem', height: '1.5rem' },
})

const ParentAddLabel = styled.span({
  fontSize: '0.75rem',
  fontWeight: 500,
})

// ─── Recent memories list ─────────────────────────────────────────────────────

const MemoryList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
  animation: `${fadeUp} 0.4s 0.2s ease both`,
})

const MemoryItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  border: `1px solid ${theme.colors.border}`,
  textDecoration: 'none',
  transition: `all ${theme.transitions.fast}`,
  willChange: 'transform',
  '&:active': { opacity: 0.8, transform: 'scale(0.99)' },
  '@media (hover: hover)': {
    '&:hover': { transform: 'translateX(2px)' },
  },
})

const MemoryThumb = styled.div<{ $color: string }>(({ $color }) => ({
  width: '3rem',
  height: '3rem',
  borderRadius: theme.radius.xl,
  backgroundColor: $color,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '1.25rem', height: '1.25rem', color: '#fff' },
}))

const MemoryInfo = styled.div({
  flex: 1,
  minWidth: 0,
})

const MemoryTitle = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const MemoryMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

const MemoryBadge = styled.span<{ $processed: boolean }>(({ $processed }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.6875rem',
  fontWeight: 500,
  padding: '0.2rem 0.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: $processed
    ? 'oklch(0.88 0.06 155 / 0.15)'
    : theme.colors.muted,
  color: $processed ? theme.colors.primary : theme.colors.mutedForeground,
  flexShrink: 0,
  '& svg': { width: '0.625rem', height: '0.625rem' },
}))

const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[12]} ${theme.spacing[4]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[3],
})

const EmptyIcon = styled.div({
  width: '4rem',
  height: '4rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '1.75rem',
    height: '1.75rem',
    color: theme.colors.mutedForeground,
  },
})

const EmptyText = styled.p({
  fontSize: '0.9375rem',
  color: theme.colors.mutedForeground,
})

const StartButton = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  fontSize: '0.875rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: `opacity ${theme.transitions.fast}`,
  '&:hover': { opacity: 0.9 },
  '& svg': { width: '1rem', height: '1rem' },
})

// ─── Feedback banner ──────────────────────────────────────────────────────────

const FeedbackBanner = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.1)',
  border: `1px solid oklch(0.65 0.12 50 / 0.25)`,
  borderRadius: theme.radius['2xl'],
  textDecoration: 'none',
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.4s 0.08s ease both`,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': { backgroundColor: 'oklch(0.65 0.12 50 / 0.15)' },
})

const FeedbackBannerIcon = styled.div({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& svg': { width: '1.125rem', height: '1.125rem', color: '#fff' },
})

const FeedbackBannerText = styled.div({
  flex: 1,
})

const FeedbackBannerTitle = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

const FeedbackBannerSub = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PARENTS = [
  {
    id: '1',
    name: 'Bố Hùng',
    relationship: 'bố',
    recordings: 4,
    emoji: '👨',
    color: 'oklch(0.75 0.1 155)',
  },
  {
    id: '2',
    name: 'Mẹ Lan',
    relationship: 'mẹ',
    recordings: 7,
    emoji: '👩',
    color: 'oklch(0.75 0.1 50)',
  },
  {
    id: '3',
    name: 'Bà Nội',
    relationship: 'bà',
    recordings: 2,
    emoji: '👵',
    color: 'oklch(0.75 0.08 280)',
  },
]

const MOCK_MEMORIES = [
  {
    id: '1',
    prompt: 'Childhood home story',
    parentName: 'Bố Hùng',
    decade: '1970s',
    isProcessed: true,
    color: 'oklch(0.55 0.1 155)',
  },
  {
    id: '2',
    prompt: 'First job memories',
    parentName: 'Mẹ Lan',
    decade: '1980s',
    isProcessed: false,
    color: 'oklch(0.55 0.1 50)',
  },
  {
    id: '3',
    prompt: 'How they met',
    parentName: 'Bố Hùng',
    decade: '1985',
    isProcessed: true,
    color: 'oklch(0.55 0.1 155)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useI18n()
  const [pendingFeedback] = useState(3)

  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  const QUICK_ACTIONS = [
    {
      label: t('dashboard.quickActions.newRecording'),
      icon: Mic,
      href: '/app/record',
      color: theme.colors.primary,
    },
    {
      label: t('dashboard.quickActions.openStudio'),
      icon: Film,
      href: '/app/studio',
      color: theme.colors.accent,
    },
    {
      label: t('dashboard.quickActions.viewTimeline'),
      icon: Clock,
      href: '/app/timeline',
      color: 'oklch(0.55 0.12 280)',
    },
    {
      label: t('dashboard.quickActions.seeFeedback'),
      icon: MessageSquare,
      href: '/app/feedback',
      color: 'oklch(0.55 0.08 40)',
    },
  ]

  return (
    <Page>
      {/* Greeting */}
      <Greeting>
        <GreetingLabel>
          {t('app.greeting')} {timeOfDay} ☀️
        </GreetingLabel>
        <GreetingTitle>Minh</GreetingTitle>
        <GreetingSubtitle>{t('dashboard.subtitle')}</GreetingSubtitle>
      </Greeting>

      {/* Stats */}
      <StatsGrid>
        {[
          { value: '13', label: t('dashboard.stats.memories'), icon: BookOpen },
          {
            value: '2.4h',
            label: t('dashboard.stats.hours'),
            icon: Headphones,
          },
          { value: '3', label: t('dashboard.stats.parents'), icon: Users },
          { value: '2', label: t('dashboard.stats.albums'), icon: Heart },
        ].map(({ value, label }, i) => (
          <StatCard key={label} style={{ animationDelay: `${i * 0.04}s` }}>
            <StatValue>{value}</StatValue>
            <StatLabel>{label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Feedback banner */}
      {pendingFeedback > 0 && (
        <FeedbackBanner href="/app/feedback">
          <FeedbackBannerIcon>
            <Headphones />
          </FeedbackBannerIcon>
          <FeedbackBannerText>
            <FeedbackBannerTitle>
              {pendingFeedback} {t('dashboard.pendingFeedback')}
            </FeedbackBannerTitle>
            <FeedbackBannerSub>{t('feedback.subtitle')}</FeedbackBannerSub>
          </FeedbackBannerText>
          <ChevronRight
            style={{
              width: '1rem',
              height: '1rem',
              color: theme.colors.mutedForeground,
            }}
          />
        </FeedbackBanner>
      )}

      {/* Quick actions */}
      <Section>
        <SectionHeader>
          <SectionTitle>{t('dashboard.quickActions.title')}</SectionTitle>
        </SectionHeader>
        <QuickActionsGrid>
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, color }, i) => (
            <QuickActionCard
              key={href}
              href={href}
              viewTransition
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <ActionIcon $color={color}>
                <Icon />
              </ActionIcon>
              <ActionLabel>{label}</ActionLabel>
            </QuickActionCard>
          ))}
        </QuickActionsGrid>
      </Section>

      {/* Parents */}
      <Section>
        <SectionHeader>
          <SectionTitle>{t('app.sidebar.parents')}</SectionTitle>
          <SeeAll href="/app/studio">
            {t('dashboard.parentCard.viewAll')} <ChevronRight />
          </SeeAll>
        </SectionHeader>
        <ParentsRow>
          {MOCK_PARENTS.map((parent) => (
            <ParentCard key={parent.id}>
              <ParentAvatar $color={parent.color}>{parent.emoji}</ParentAvatar>
              <ParentName>{parent.name}</ParentName>
              <ParentMeta>
                {parent.recordings} {t('dashboard.parentCard.recordings')}
              </ParentMeta>
            </ParentCard>
          ))}
          <ParentAddCard>
            <Plus />
            <ParentAddLabel>{t('app.sidebar.addParent')}</ParentAddLabel>
          </ParentAddCard>
        </ParentsRow>
      </Section>

      {/* Recent memories */}
      <Section>
        <SectionHeader>
          <SectionTitle>{t('dashboard.recentMemories')}</SectionTitle>
          <SeeAll href="/app/studio">
            {t('dashboard.parentCard.viewAll')} <ChevronRight />
          </SeeAll>
        </SectionHeader>
        {MOCK_MEMORIES.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <BookOpen />
            </EmptyIcon>
            <EmptyText>{t('dashboard.noMemories')}</EmptyText>
            <StartButton href="/app/record">
              <Mic />
              {t('dashboard.startRecording')}
            </StartButton>
          </EmptyState>
        ) : (
          <MemoryList>
            {MOCK_MEMORIES.map((m) => (
              <MemoryItem key={m.id} href={`/app/studio`} viewTransition>
                <MemoryThumb $color={m.color}>
                  <Mic />
                </MemoryThumb>
                <MemoryInfo>
                  <MemoryTitle>{m.prompt}</MemoryTitle>
                  <MemoryMeta>
                    {m.parentName} · {m.decade}
                  </MemoryMeta>
                </MemoryInfo>
                <MemoryBadge $processed={m.isProcessed}>
                  {m.isProcessed
                    ? t('studio.memoryCard.processed')
                    : t('studio.memoryCard.processing')}
                </MemoryBadge>
              </MemoryItem>
            ))}
          </MemoryList>
        )}
      </Section>
    </Page>
  )
}
