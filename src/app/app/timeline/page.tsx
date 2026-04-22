'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
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
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div({
  minHeight: 'calc(100dvh - 3.5rem)',
  backgroundColor: theme.colors.background,
})

const HeroSection = styled.div({
  padding: `${theme.spacing[6]} ${theme.spacing[4]} ${theme.spacing[4]}`,
  background: `linear-gradient(160deg, oklch(0.88 0.06 155 / 0.15) 0%, transparent 60%)`,
  borderBottom: `1px solid ${theme.colors.border}`,
  animation: `${fadeUp} 0.3s ease both`,
})

const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.625rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1.2,
})

const PageSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[1],
  lineHeight: 1.5,
})

const HeroActions = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  marginTop: theme.spacing[4],
})

const ActionBtn = styled.button<{ $primary?: boolean }>(({ $primary }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${$primary ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $primary ? theme.colors.primary : 'transparent',
  color: $primary ? '#fff' : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: $primary ? 600 : 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TabBar = styled.div({
  display: 'flex',
  borderBottom: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.card,
  padding: `0 ${theme.spacing[4]}`,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
})

const Tab = styled.button<{ $active: boolean }>(({ $active }) => ({
  flexShrink: 0,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  borderBottom: $active
    ? `2px solid ${theme.colors.primary}`
    : '2px solid transparent',
  background: 'none',
  border: 'none',
  borderBottom: $active
    ? `2px solid ${theme.colors.primary}`
    : '2px solid transparent',
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  whiteSpace: 'nowrap',
}))

const TabContent = styled.div({
  overflowY: 'auto',
})

// ─── Decades view ─────────────────────────────────────────────────────────────

const DecadeSection = styled.div({
  marginBottom: theme.spacing[2],
  animation: `${fadeUp} 0.35s ease both`,
})

const DecadeHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[2]}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: 'oklch(0.97 0.005 80 / 0.92)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
})

const DecadeLabel = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  '& svg': {
    width: '0.875rem',
    height: '0.875rem',
    color: theme.colors.primary,
  },
})

const DecadeTitle = styled.h2({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

const DecadeCount = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginLeft: 'auto',
})

// Timeline list
const TimelineList = styled.div({
  position: 'relative',
  padding: `0 ${theme.spacing[4]} ${theme.spacing[4]}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: `calc(${theme.spacing[4]} + 1.375rem)`,
    top: 0,
    bottom: 0,
    width: '1.5px',
    backgroundColor: theme.colors.border,
  },
})

const TimelineItem = styled.div({
  display: 'flex',
  gap: theme.spacing[4],
  paddingBottom: theme.spacing[4],
  position: 'relative',
  animation: `${scaleIn} 0.3s ease both`,
})

const TimelineDot = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: $color,
  border: `2px solid ${theme.colors.card}`,
  boxShadow: theme.shadows.sm,
  flexShrink: 0,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
}))

const TimelineCard = styled.div({
  flex: 1,
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  transition: `box-shadow ${theme.transitions.fast}`,
  cursor: 'pointer',
  '&:hover': { boxShadow: theme.shadows.md },
  '&:active': { opacity: 0.8 },
})

const TimelineCardBody = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
})

const TimelineCardTitle = styled.div({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
  marginBottom: theme.spacing[1],
})

const TimelineCardMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
})

const TimelineCardBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.6875rem',
  padding: '0.15rem 0.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  color: theme.colors.mutedForeground,
  '& svg': { width: '0.625rem', height: '0.625rem' },
})

const TimelineCardPhoto = styled.div({
  width: '100%',
  height: '6rem',
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '1.5rem',
    height: '1.5rem',
    color: theme.colors.mutedForeground,
  },
})

// ─── Albums view ─────────────────────────────────────────────────────────────

const AlbumsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]}`,
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

const AlbumCard = styled.div({
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  animation: `${scaleIn} 0.3s ease both`,
  '&:hover': { boxShadow: theme.shadows.md, transform: 'translateY(-1px)' },
  '&:active': { opacity: 0.8 },
})

const AlbumCover = styled.div<{ $color: string }>(({ $color }) => ({
  height: '6rem',
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '2rem', height: '2rem', color: '#fff', opacity: 0.8 },
}))

const AlbumInfo = styled.div({
  padding: `${theme.spacing[3]}`,
})

const AlbumName = styled.div({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

const AlbumCount = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

const AddAlbumCard = styled.button({
  backgroundColor: 'transparent',
  border: `2px dashed ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  minHeight: '9rem',
  color: theme.colors.mutedForeground,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '& svg': { width: '1.5rem', height: '1.5rem' },
})

const AddAlbumLabel = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 500,
})

const EmptyDecade = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
})

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DECADES = [
  {
    label: '1970s',
    color: 'oklch(0.7 0.08 40)',
    memories: [
      {
        id: '1',
        prompt: 'Ngôi nhà thời thơ ấu',
        parent: 'Bố Hùng',
        emoji: '👨',
        hasPhoto: false,
        processed: true,
        color: 'oklch(0.75 0.1 155)',
      },
      {
        id: '2',
        prompt: 'Ngày đầu tiên đi học',
        parent: 'Bố Hùng',
        emoji: '👨',
        hasPhoto: true,
        processed: true,
        color: 'oklch(0.75 0.1 155)',
      },
    ],
  },
  {
    label: '1980s',
    color: 'oklch(0.65 0.1 280)',
    memories: [
      {
        id: '3',
        prompt: 'Công việc đầu tiên',
        parent: 'Mẹ Lan',
        emoji: '👩',
        hasPhoto: false,
        processed: false,
        color: 'oklch(0.75 0.1 50)',
      },
    ],
  },
  {
    label: '1990s',
    color: 'oklch(0.68 0.1 155)',
    memories: [
      {
        id: '4',
        prompt: 'Bố và mẹ gặp nhau',
        parent: 'Bố Hùng',
        emoji: '👨',
        hasPhoto: false,
        processed: true,
        color: 'oklch(0.75 0.1 155)',
      },
      {
        id: '5',
        prompt: 'Đám cưới của bố mẹ',
        parent: 'Bà Nội',
        emoji: '👵',
        hasPhoto: true,
        processed: true,
        color: 'oklch(0.75 0.08 280)',
      },
      {
        id: '6',
        prompt: 'Ngày con chào đời',
        parent: 'Mẹ Lan',
        emoji: '👩',
        hasPhoto: true,
        processed: true,
        color: 'oklch(0.75 0.1 50)',
      },
    ],
  },
]

const MOCK_ALBUMS = [
  { id: '1', name: 'Thời thơ ấu', count: 4, color: 'oklch(0.65 0.1 155)' },
  {
    id: '2',
    name: 'Hôn nhân & Gia đình',
    count: 6,
    color: 'oklch(0.65 0.1 50)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

type TabKey = 'decades' | 'albums'

export default function TimelinePage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<TabKey>('decades')

  const totalMemories = MOCK_DECADES.reduce(
    (sum, d) => sum + d.memories.length,
    0,
  )

  return (
    <Page>
      {/* Hero */}
      <HeroSection>
        <PageTitle>{t('timeline.title')}</PageTitle>
        <PageSubtitle>
          {totalMemories} {t('timeline.memoryCount')} · {t('timeline.subtitle')}
        </PageSubtitle>
        <HeroActions>
          <ActionBtn $primary>
            <Plus />
            {t('timeline.addAlbum')}
          </ActionBtn>
          <ActionBtn>
            <Share2 />
            {t('timeline.shareTimeline')}
          </ActionBtn>
          <ActionBtn>
            <Download />
            {t('timeline.exportPdf')}
          </ActionBtn>
        </HeroActions>
      </HeroSection>

      {/* Tabs */}
      <TabBar>
        <Tab
          $active={activeTab === 'decades'}
          onClick={() => setActiveTab('decades')}
        >
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
            {t('timeline.decades.title')}
          </span>
        </Tab>
        <Tab
          $active={activeTab === 'albums'}
          onClick={() => setActiveTab('albums')}
        >
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <BookOpen style={{ width: '0.875rem', height: '0.875rem' }} />
            Albums
          </span>
        </Tab>
      </TabBar>

      <TabContent>
        {activeTab === 'decades' ? (
          <>
            {MOCK_DECADES.map((decade, di) => (
              <DecadeSection
                key={decade.label}
                style={{ animationDelay: `${di * 0.06}s` }}
              >
                <DecadeHeader>
                  <DecadeLabel>
                    <Clock />
                    <DecadeTitle>{decade.label}</DecadeTitle>
                  </DecadeLabel>
                  <DecadeCount>
                    {decade.memories.length} {t('timeline.memoryCount')}
                  </DecadeCount>
                  <ChevronRight
                    style={{
                      width: '1rem',
                      height: '1rem',
                      color: theme.colors.mutedForeground,
                    }}
                  />
                </DecadeHeader>

                {decade.memories.length === 0 ? (
                  <EmptyDecade>{t('timeline.emptyAlbum')}</EmptyDecade>
                ) : (
                  <TimelineList>
                    {decade.memories.map((m, mi) => (
                      <TimelineItem
                        key={m.id}
                        style={{ animationDelay: `${di * 0.06 + mi * 0.04}s` }}
                      >
                        <TimelineDot $color={m.color}>{m.emoji}</TimelineDot>
                        <TimelineCard>
                          {m.hasPhoto && (
                            <TimelineCardPhoto>
                              <Image />
                            </TimelineCardPhoto>
                          )}
                          <TimelineCardBody>
                            <TimelineCardTitle>{m.prompt}</TimelineCardTitle>
                            <TimelineCardMeta>
                              <span>{m.parent}</span>
                              {m.processed ? (
                                <TimelineCardBadge>
                                  <Mic />
                                  {t('studio.memoryCard.processed')}
                                </TimelineCardBadge>
                              ) : (
                                <TimelineCardBadge>
                                  {t('studio.memoryCard.processing')}
                                </TimelineCardBadge>
                              )}
                            </TimelineCardMeta>
                          </TimelineCardBody>
                        </TimelineCard>
                      </TimelineItem>
                    ))}
                  </TimelineList>
                )}
              </DecadeSection>
            ))}
          </>
        ) : (
          <AlbumsGrid>
            {MOCK_ALBUMS.map((album, i) => (
              <AlbumCard
                key={album.id}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <AlbumCover $color={album.color}>
                  <BookOpen />
                </AlbumCover>
                <AlbumInfo>
                  <AlbumName>{album.name}</AlbumName>
                  <AlbumCount>
                    {album.count} {t('timeline.memoryCount')}
                  </AlbumCount>
                </AlbumInfo>
              </AlbumCard>
            ))}
            <AddAlbumCard>
              <Plus />
              <AddAlbumLabel>{t('timeline.addAlbum')}</AddAlbumLabel>
            </AddAlbumCard>
          </AlbumsGrid>
        )}
      </TabContent>
    </Page>
  )
}
