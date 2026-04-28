'use client'

import { useState, useEffect } from 'react'
import {
  Mic,
  Image,
  ChevronDown,
  Pencil,
  Trash2,
  Check,
  X,
  SlidersHorizontal,
  FileText,
  BookOpen,
  Heart,
  Sparkles,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUserId } from '@/hooks/use-user-id'

type Memory = {
  id: string
  prompt: string
  parentName: string
  relationship: string
  decade: string
  isProcessed: boolean
  hasPhoto: boolean
  transcript: string | null
  reflection: string | null
  aiTitle: string | null
  aiSummary: string | null
  aiTags: string[]
  createdAt: string
}
import { DecryptingOverlay } from '@/components/decrypting-overlay'
import {
  Page, PageHeader, PageTitle, PageSubtitle,
  FilterBar, FilterChip, SortBtn,
  MemoryCard, MemoryCardHeader, ParentAvatar, MemoryMeta, MemoryTitle, MemorySubMeta, StatusBadge,
  SplitBody, SplitLeft, SplitRight,
  PhotoThumb, PhotoImg,
  CardSection, SectionLabel, TranscriptText, TranscriptPending,
  ReflectionInput, ReflectionDisplay, AddReflectionBtn,
  CardFooter, FooterBtn, SaveReflBtn, HeartBtn,
  AiSection, AiLabel, AiTitle, AiSummaryText, TagRow, Tag,
  EmptyState, ReflectionActions,
  SkeletonCard, SkeletonCardHeader, SkeletonCardHeaderInfo, SkeletonCircle, SkeletonLine, SkeletonBlock,
} from './page.styles'

// ─── Constants ──────────────────────────────────────────────────────────────

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

// ─── Memory card component ───────────────────────────────────────────────────

function MemoryCardItem({
  memory,
  delay,
}: {
  memory: Memory
  delay: number
}) {
  const t = useTranslations('studio')
  const userId = useUserId()
  const [editingReflection, setEditingReflection] = useState(false)
  const [reflectionText, setReflectionText] = useState(memory.reflection ?? '')
  const [savedReflection, setSavedReflection] = useState(memory.reflection)
  const parentEmoji = RELATIONSHIP_EMOJI[memory.relationship] ?? '🧑'
  const parentColor = RELATIONSHIP_COLOR[memory.relationship] ?? 'oklch(0.7 0.06 100)'
  const [hearted, setHearted] = useState(false)
  const [heartSending, setHeartSending] = useState(false)
  // Show decrypting overlay on first mount (content is encrypted at rest)
  const [showDecrypting, setShowDecrypting] = useState(memory.isProcessed)

  const handleSaveReflection = () => {
    setSavedReflection(reflectionText)
    setEditingReflection(false)
  }

  const handleHeart = async () => {
    if (hearted || heartSending) return
    setHeartSending(true)
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId: memory.id, userId: userId ?? '' }),
      })
      setHearted(true)
    } catch {
      // Optimistic update anyway — network failure is non-critical here
      setHearted(true)
    } finally {
      setHeartSending(false)
    }
  }

  return (
    <MemoryCard style={{ animationDelay: `${delay}s`, position: 'relative' }}>
      {showDecrypting && (
        <DecryptingOverlay
          duration={650}
          label="Đang mở khóa…"
        />
      )}
      {/* Header */}
      <MemoryCardHeader>
        <ParentAvatar $color={parentColor}>
          {parentEmoji}
        </ParentAvatar>
        <MemoryMeta>
          <MemoryTitle>{memory.prompt}</MemoryTitle>
          <MemorySubMeta>
            {memory.parentName} · {memory.decade}
          </MemorySubMeta>
        </MemoryMeta>
        <StatusBadge $processed={memory.isProcessed}>
          {memory.isProcessed
            ? t('memoryCard.processed')
            : t('memoryCard.processing')}
        </StatusBadge>
      </MemoryCardHeader>

      {/* Photo + AI Summary — split left pane */}
      <SplitBody>
        <SplitLeft>
          {/* Photo */}
          {memory.hasPhoto && (
            <PhotoThumb>
              <Image />
            </PhotoThumb>
          )}

          {/* AI Summary */}
          {memory.isProcessed && memory.aiTitle && (
            <AiSection>
              <AiLabel>
                <Sparkles />
                {t('aiSummary')}
              </AiLabel>
              <AiTitle>{memory.aiTitle}</AiTitle>
              {memory.aiSummary && (
                <AiSummaryText>{memory.aiSummary}</AiSummaryText>
              )}
              {memory.aiTags.length > 0 && (
                <TagRow>
                  {memory.aiTags.map((tag) => (
                    <Tag key={tag}>#{tag}</Tag>
                  ))}
                </TagRow>
              )}
            </AiSection>
          )}
        </SplitLeft>

        <SplitRight>
          {/* Transcript */}
          <CardSection>
            <SectionLabel>
              <FileText />
              {t('memoryCard.transcript')}
            </SectionLabel>
            {memory.isProcessed && memory.transcript ? (
              <TranscriptText>{memory.transcript}</TranscriptText>
            ) : (
              <TranscriptPending>
                <span className="sr-only">Loading</span>
                  {t('memoryCard.noTranscript')}
              </TranscriptPending>
            )}
          </CardSection>

          {/* Reflection */}
          <CardSection>
            <SectionLabel>
              <BookOpen />
              {t('memoryCard.reflection')}
            </SectionLabel>
            {editingReflection ? (
              <>
                <ReflectionInput
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder={t('memoryCard.addReflection')}
                  autoFocus
                />
                <ReflectionActions>
                  <SaveReflBtn onClick={handleSaveReflection}>
                    <Check />
                    {t('saveReflection')}
                  </SaveReflBtn>
                  <FooterBtn onClick={() => setEditingReflection(false)}>
                    <X />
                    Cancel
                  </FooterBtn>
                </ReflectionActions>
              </>
            ) : savedReflection ? (
              <>
                <ReflectionDisplay>{savedReflection}</ReflectionDisplay>
                <AddReflectionBtn
                  $mt
                  onClick={() => {
                    setReflectionText(savedReflection)
                    setEditingReflection(true)
                  }}
                >
                  <Pencil />
                  {t('editReflection')}
                </AddReflectionBtn>
              </>
            ) : (
              <AddReflectionBtn onClick={() => setEditingReflection(true)}>
                <Pencil />
                  {t('memoryCard.addReflection')}
              </AddReflectionBtn>
            )}
          </CardSection>

          {/* Footer */}
          <CardFooter>
            <FooterBtn $danger onClick={() => alert(t('confirmDelete'))}>
              <Trash2 />
              {t('deleteMemory')}
            </FooterBtn>
            <HeartBtn
              $active={hearted}
              onClick={handleHeart}
              disabled={heartSending}
            >
              <Heart style={{ fill: hearted ? 'currentColor' : 'none' }} />
              {hearted ? t('hearted') : t('heart')}
            </HeartBtn>
          </CardFooter>
        </SplitRight>
      </SplitBody>
    </MemoryCard>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

type FilterKey = 'all' | 'processed' | 'pending'

export default function StudioPage() {
  const t = useTranslations('studio')
  const userId = useUserId()
  const [filter, setFilter] = useState<FilterKey>('all')
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

  const filtered = memories.filter((m) => {
    if (filter === 'processed') return m.isProcessed
    if (filter === 'pending') return !m.isProcessed
    return true
  })

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t('title')}</PageTitle>
        <PageSubtitle>{t('subtitle')}</PageSubtitle>
      </PageHeader>

      <FilterBar>
        {(['all', 'processed', 'pending'] as FilterKey[]).map((key) => (
          <FilterChip
            key={key}
            $active={filter === key}
            onClick={() => setFilter(key)}
          >
              {t(`filter.${key}` as Parameters<typeof t>[0])}
          </FilterChip>
        ))}
        <SortBtn>
          <SlidersHorizontal />
          {t('sort.newest')}
        </SortBtn>
      </FilterBar>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonCardHeader>
              <SkeletonCircle className="skeleton" />
              <SkeletonCardHeaderInfo>
                <SkeletonLine className="skeleton" $width="40%" $marginBottom="0.5rem" />
                <SkeletonLine className="skeleton" $width="25%" $height="0.75rem" />
              </SkeletonCardHeaderInfo>
            </SkeletonCardHeader>
            <SkeletonLine className="skeleton" $width="80%" />
            <SkeletonBlock className="skeleton" />
          </SkeletonCard>
        ))
      ) : filtered.length === 0 ? (
        <EmptyState>
          <Mic />
          <p>{t('emptyState')}</p>
        </EmptyState>
      ) : (
        filtered.map((m, i) => (
          <MemoryCardItem key={m.id} memory={m} delay={i * 0.05} />
        ))
      )}
    </Page>
  )
}
