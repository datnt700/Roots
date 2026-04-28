'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mic,
  Film,
  Clock,
  MessageSquare,
  ChevronRight,
  Plus,
  Headphones,
  BookOpen,
  Download,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { theme } from '@/lib/theme'
import { useUserId } from '@/hooks/use-user-id'
import { useSession } from 'next-auth/react'
import {
  Page, Greeting, GreetingLabel, GreetingTitle, GreetingSubtitle,
  StatsGrid, StatCard, StatValue, StatLabel,
  Section, SectionHeader, SectionTitle, SeeAll,
  QuickActionsGrid, QuickActionCard, ActionIcon, ActionLabel,
  ParentsRow, ParentCard, ParentAvatar, ParentName, ParentMeta, ParentAddCard, ParentAddLabel,
  MemoryList, MemoryItem, MemoryThumb, MemoryInfo, MemoryTitle, MemoryMeta, MemoryBadge,
  EmptyState, EmptyIcon, EmptyText, StartButton,
  FeedbackBanner, FeedbackBannerIcon, FeedbackBannerText, FeedbackBannerTitle, FeedbackBannerSub, FeedbackBannerArrow,
  SkeletonAvatar, SkeletonNameLine, SkeletonMetaLine,
  SkeletonMemoryRow, SkeletonMemoryThumb, SkeletonMemoryInfo, SkeletonMemoryTitleLine, SkeletonMemoryMetaLine,
} from './page.styles'

// ─── Types & constants ────────────────────────────────────────────────────────

const PARENT_COLORS = [
  'oklch(0.75 0.1 155)',
  'oklch(0.75 0.1 50)',
  'oklch(0.75 0.08 280)',
  'oklch(0.75 0.08 20)',
]

const MEMORY_COLORS = [
  'oklch(0.55 0.1 155)',
  'oklch(0.55 0.1 50)',
  'oklch(0.55 0.1 280)',
  'oklch(0.55 0.1 20)',
]

const RELATIONSHIP_EMOJI: Record<string, string> = {
  bố: '👨',
  mẹ: '👩',
  ông: '👴',
  bà: '👵',
}

type DashboardParent = {
  id: string
  name: string
  relationship: string
  recordingCount: number
}

type DashboardMemory = {
  id: string
  prompt: string
  parentName: string
  decade: string
  isProcessed: boolean
}

type DashboardStats = {
  totalMemories: number
  totalParents: number
  totalSlots: number
  estimatedHours: number
  unplayedFeedback: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const tApp = useTranslations('app')
  const tFeedback = useTranslations('feedback')
  const tStudio = useTranslations('studio')
  const userId = useUserId()
  const { data: session } = useSession()
  const displayName = session?.user?.name?.split(' ')[0] ?? tApp('greetingName')
  const [loading, setLoading] = useState(true)
  const [parents, setParents] = useState<DashboardParent[]>([])
  const [recentMemories, setRecentMemories] = useState<DashboardMemory[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/dashboard?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setParents(data.parents ?? [])
        setRecentMemories(data.recentMemories ?? [])
        setStats(data.stats ?? null)
      })
      .catch(() => {/* keep skeleton on error */})
      .finally(() => setLoading(false))
  }, [userId])

  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  const QUICK_ACTIONS = [
    {
      label: t('quickActions.newRecording'),
      icon: Mic,
      href: '/app/record',
      color: theme.colors.primary,
    },
    {
      label: t('quickActions.openStudio'),
      icon: Film,
      href: '/app/studio',
      color: theme.colors.accent,
    },
    {
      label: t('quickActions.viewTimeline'),
      icon: Clock,
      href: '/app/timeline',
      color: 'oklch(0.55 0.12 280)',
    },
    {
      label: t('quickActions.seeFeedback'),
      icon: MessageSquare,
      href: '/app/feedback',
      color: 'oklch(0.55 0.08 40)',
    },
  ]

  const unplayedFeedback = stats?.unplayedFeedback ?? 0

  return (
    <Page>
      {/* Greeting */}
      <Greeting>
        <GreetingLabel>
          {tApp('greeting')} {timeOfDay} ☀️
        </GreetingLabel>
        <GreetingTitle>{displayName}</GreetingTitle>
        <GreetingSubtitle>{t('subtitle')}</GreetingSubtitle>
      </Greeting>

      {/* Stats */}
      <StatsGrid>
        {[
          { value: loading ? '—' : String(stats?.totalMemories ?? 0), label: t('stats.memories') },
          { value: loading ? '—' : `${stats?.estimatedHours ?? 0}h`, label: t('stats.hours') },
          { value: loading ? '—' : String(stats?.totalParents ?? 0), label: t('stats.parents') },
          { value: loading ? '—' : String(stats?.totalSlots ?? 0), label: t('stats.albums') },
        ].map(({ value, label }, i) => (
          <StatCard key={label} $hero={i === 0} style={{ animationDelay: `${i * 0.04}s` }}>
            <StatValue $hero={i === 0}>{value}</StatValue>
            <StatLabel>{label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Feedback banner */}
      {unplayedFeedback > 0 && (
        <FeedbackBanner href="/app/feedback">
          <FeedbackBannerIcon>
            <Headphones />
          </FeedbackBannerIcon>
          <FeedbackBannerText>
            <FeedbackBannerTitle>
              {unplayedFeedback} {t('pendingFeedback')}
            </FeedbackBannerTitle>
            <FeedbackBannerSub>{tFeedback('subtitle')}</FeedbackBannerSub>
          </FeedbackBannerText>
          <FeedbackBannerArrow>
            <ChevronRight />
          </FeedbackBannerArrow>
        </FeedbackBanner>
      )}

      {/* Quick actions */}
      <Section>
        <SectionHeader>
          <SectionTitle>{t('quickActions.title')}</SectionTitle>
        </SectionHeader>
        <QuickActionsGrid>
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, color }, i) => (
            <QuickActionCard
              key={href}
              href={href}
              viewTransition
              $featured={href === '/app/record'}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <ActionIcon $color={color}>
                <Icon />
              </ActionIcon>
              <ActionLabel>{label}</ActionLabel>
            </QuickActionCard>
          ))}
          {userId && (
            <QuickActionCard
              as="a"
              href={`/api/export?userId=${userId}`}
              download
              style={{ animationDelay: `${QUICK_ACTIONS.length * 0.04}s` }}
            >
              <ActionIcon $color="oklch(0.55 0.1 160)">
                <Download />
              </ActionIcon>
              <ActionLabel>{t('quickActions.exportData')}</ActionLabel>
            </QuickActionCard>
          )}
        </QuickActionsGrid>
      </Section>

      {/* Parents */}
      <Section>
        <SectionHeader>
          <SectionTitle>{tApp('sidebar.parents')}</SectionTitle>
          <SeeAll href="/app/parents">
            {t('parentCard.viewAll')} <ChevronRight />
          </SeeAll>
        </SectionHeader>
        <ParentsRow>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ParentCard key={i}>
                  <SkeletonAvatar className="skeleton" />
                  <SkeletonNameLine className="skeleton" />
                  <SkeletonMetaLine className="skeleton" />
                </ParentCard>
              ))
            : parents.map((parent, i) => (
                <ParentCard key={parent.id}>
                  <ParentAvatar $color={PARENT_COLORS[i % PARENT_COLORS.length]}>
                    {RELATIONSHIP_EMOJI[parent.relationship] ?? '🧑'}
                  </ParentAvatar>
                  <ParentName>{parent.name}</ParentName>
                  <ParentMeta>
                    {parent.recordingCount} {t('parentCard.recordings')}
                  </ParentMeta>
                </ParentCard>
              ))}
          <ParentAddCard onClick={() => (window.location.href = '/app/parents')}>
            <Plus />
            <ParentAddLabel>{tApp('sidebar.addParent')}</ParentAddLabel>
          </ParentAddCard>
        </ParentsRow>
      </Section>

      {/* Recent memories */}
      <Section>
        <SectionHeader>
          <SectionTitle>{t('recentMemories')}</SectionTitle>
          <SeeAll href="/app/studio">
            {t('parentCard.viewAll')} <ChevronRight />
          </SeeAll>
        </SectionHeader>
        {loading ? (
          <MemoryList>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonMemoryRow key={i}>
                <SkeletonMemoryThumb className="skeleton" />
                <SkeletonMemoryInfo>
                  <SkeletonMemoryTitleLine className="skeleton" />
                  <SkeletonMemoryMetaLine className="skeleton" />
                </SkeletonMemoryInfo>
              </SkeletonMemoryRow>
            ))}
          </MemoryList>
        ) : recentMemories.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <BookOpen />
            </EmptyIcon>
            <EmptyText>{t('noMemories')}</EmptyText>
            <StartButton href="/app/record">
              <Mic />
              {t('startRecording')}
            </StartButton>
          </EmptyState>
        ) : (
          <MemoryList>
            {recentMemories.map((m, i) => (
              <MemoryItem key={m.id} href="/app/studio" viewTransition>
                <MemoryThumb $color={MEMORY_COLORS[i % MEMORY_COLORS.length]}>
                  <Mic />
                </MemoryThumb>
                <MemoryInfo>
                  <MemoryTitle>{m.prompt || t('untitledMemory')}</MemoryTitle>
                  <MemoryMeta>
                    {m.parentName}{m.decade ? ` · ${m.decade}` : ''}
                  </MemoryMeta>
                </MemoryInfo>
                <MemoryBadge $processed={m.isProcessed}>
                  {m.isProcessed
                    ? tStudio('memoryCard.processed')
                    : tStudio('memoryCard.processing')}
                </MemoryBadge>
              </MemoryItem>
            ))}
          </MemoryList>
        )}
      </Section>
    </Page>
  )
}
