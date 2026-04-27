'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Mic,
  Image,
  Share2,
  Download,
  ChevronRight,
  Clock,
  BookOpen,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUserId } from '@/hooks/use-user-id'
import {
  Page, HeroSection, PageTitle, PageSubtitle, HeroActions, ActionBtn,
  TabBar, Tab, TabContent,
  DecadeSection, DecadeHeader, DecadeLabel, DecadeTitle, DecadeCount,
  TimelineList, TimelineItem, TimelineDot, TimelineCard, TimelineCardBody, TimelineCardTitle, TimelineCardMeta, TimelineCardBadge, TimelineCardPhoto,
  AlbumsGrid, AlbumCard, AlbumCover, AlbumInfo, AlbumName, AlbumCount, AddAlbumCard, AddAlbumLabel, EmptyDecade,
  TabLabel, DecadeChevron, SkeletonSection, SkeletonLine, SkeletonBlock,
} from './page.styles'

// ─── Constants ────────────────────────────────────────────────────────────────

const RELATIONSHIP_EMOJI: Record<string, string> = {
  bố: '👨',
  ba: '👨',
  mẹ: '👩',
  má: '👩',
  ông: '👴',
  bà: '👵',
  other: '👤',
}

const RELATIONSHIP_COLOR: Record<string, string> = {
  bố: 'oklch(0.65 0.1 155)',
  ba: 'oklch(0.65 0.1 155)',
  mẹ: 'oklch(0.7 0.12 50)',
  má: 'oklch(0.7 0.12 50)',
  ông: 'oklch(0.6 0.08 220)',
  bà: 'oklch(0.65 0.1 320)',
  other: 'oklch(0.6 0.05 100)',
}

const DECADE_COLORS: Record<string, string> = {
  d1950s: 'oklch(0.68 0.08 30)',
  d1960s: 'oklch(0.68 0.09 60)',
  d1970s: 'oklch(0.7 0.08 40)',
  d1980s: 'oklch(0.65 0.1 280)',
  d1990s: 'oklch(0.68 0.1 155)',
  d2000s: 'oklch(0.65 0.09 200)',
  d2010s: 'oklch(0.65 0.08 320)',
  unknown: 'oklch(0.6 0.04 100)',
}

type Memory = {
  id: string
  prompt: string
  parentName: string
  relationship: string
  decade: string
  isProcessed: boolean
  hasPhoto: boolean
}

type DecadeGroup = {
  key: string
  label: string
  color: string
  memories: Memory[]
}

function groupByDecade(memories: Memory[]): DecadeGroup[] {
  const map = new Map<string, Memory[]>()
  for (const m of memories) {
    const key = m.decade || 'unknown'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(m)
  }

  const order = ['d1950s', 'd1960s', 'd1970s', 'd1980s', 'd1990s', 'd2000s', 'd2010s', 'unknown']
  const labelMap: Record<string, string> = {
    d1950s: '1950s', d1960s: '1960s', d1970s: '1970s', d1980s: '1980s',
    d1990s: '1990s', d2000s: '2000s', d2010s: '2010s', unknown: 'Unknown',
  }

  return order
    .filter((k) => map.has(k))
    .map((k) => ({
      key: k,
      label: labelMap[k] ?? k,
      color: DECADE_COLORS[k] ?? 'oklch(0.6 0.04 100)',
      memories: map.get(k)!,
    }))
}

// ─── Component ────────────────────────────────────────────────────────────────

type TabKey = 'decades' | 'albums'

export default function TimelinePage() {
  const t = useTranslations('timeline')
  const tStudio = useTranslations('studio')
  const userId = useUserId()
  const [activeTab, setActiveTab] = useState<TabKey>('decades')
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/memories?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setMemories(data.memories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const decades = groupByDecade(memories)
  const totalMemories = memories.length

  return (
    <Page>
      {/* Hero */}
      <HeroSection>
        <PageTitle>{t('title')}</PageTitle>
        <PageSubtitle>
          {totalMemories} {t('memoryCount')} · {t('subtitle')}
        </PageSubtitle>
        <HeroActions>
          <ActionBtn $primary>
            <Plus />
            {t('addAlbum')}
          </ActionBtn>
          <ActionBtn>
            <Share2 />
            {t('shareTimeline')}
          </ActionBtn>
          <ActionBtn>
            <Download />
            {t('exportPdf')}
          </ActionBtn>
        </HeroActions>
      </HeroSection>

      {/* Tabs */}
      <TabBar>
        <Tab
          $active={activeTab === 'decades'}
          onClick={() => setActiveTab('decades')}
        >
          <TabLabel>
            <Clock />
            {t('decades.title')}
          </TabLabel>
        </Tab>
        <Tab
          $active={activeTab === 'albums'}
          onClick={() => setActiveTab('albums')}
        >
          <TabLabel>
            <BookOpen />
            Albums
          </TabLabel>
        </Tab>
      </TabBar>

      <TabContent>
        {activeTab === 'decades' ? (
          <>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <SkeletonSection key={i}>
                  <SkeletonLine className="skeleton" $width="30%" $marginBottom="1rem" />
                  <SkeletonBlock className="skeleton" $marginBottom="0.5rem" />
                  <SkeletonBlock className="skeleton" />
                </SkeletonSection>
              ))
            ) : decades.length === 0 ? (
              <EmptyDecade>{t('emptyAlbum')}</EmptyDecade>
            ) : (
              decades.map((decade, di) => (
                <DecadeSection
                  key={decade.key}
                  style={{ animationDelay: `${di * 0.06}s` }}
                >
                  <DecadeHeader>
                    <DecadeLabel>
                      <Clock />
                      <DecadeTitle>{decade.label}</DecadeTitle>
                    </DecadeLabel>
                    <DecadeCount>
                      {decade.memories.length} {t('memoryCount')}
                    </DecadeCount>
                    <DecadeChevron>
                      <ChevronRight />
                    </DecadeChevron>
                  </DecadeHeader>

                  <TimelineList>
                    {decade.memories.map((m, mi) => {
                      const emoji = RELATIONSHIP_EMOJI[m.relationship] ?? '🧑'
                      const color = RELATIONSHIP_COLOR[m.relationship] ?? 'oklch(0.7 0.06 100)'
                      return (
                        <TimelineItem
                          key={m.id}
                          style={{ animationDelay: `${di * 0.06 + mi * 0.04}s` }}
                        >
                          <TimelineDot $color={color}>{emoji}</TimelineDot>
                          <TimelineCard>
                            {m.hasPhoto && (
                              <TimelineCardPhoto>
                                <Image />
                              </TimelineCardPhoto>
                            )}
                            <TimelineCardBody>
                              <TimelineCardTitle>{m.prompt}</TimelineCardTitle>
                              <TimelineCardMeta>
                                <span>{m.parentName}</span>
                                {m.isProcessed ? (
                                  <TimelineCardBadge>
                                    <Mic />
                                    {tStudio('memoryCard.processed')}
                                  </TimelineCardBadge>
                                ) : (
                                  <TimelineCardBadge>
                                    {tStudio('memoryCard.processing')}
                                  </TimelineCardBadge>
                                )}
                              </TimelineCardMeta>
                            </TimelineCardBody>
                          </TimelineCard>
                        </TimelineItem>
                      )
                    })}
                  </TimelineList>
                </DecadeSection>
              ))
            )}
          </>
        ) : (
          <AlbumsGrid>
            <AddAlbumCard>
              <Plus />
              <AddAlbumLabel>{t('addAlbum')}</AddAlbumLabel>
            </AddAlbumCard>
          </AlbumsGrid>
        )}
      </TabContent>
    </Page>
  )
}
