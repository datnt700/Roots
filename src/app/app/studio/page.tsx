'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
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
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

const MOCK_USER_ID = 'demo-user'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '48rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

const PageHeader = styled.div({
  marginBottom: theme.spacing[5],
  animation: `${fadeUp} 0.3s ease both`,
})

const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

const PageSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[1],
})

// ─── Filter/sort bar ─────────────────────────────────────────────────────────

const FilterBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[4],
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  animation: `${fadeUp} 0.3s 0.05s ease both`,
})

const FilterChip = styled.button<{ $active: boolean }>(({ $active }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${$active ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $active ? 'oklch(0.88 0.06 155 / 0.12)' : 'transparent',
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: $active ? 600 : 400,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '0.75rem', height: '0.75rem' },
}))

const SortBtn = styled.button({
  marginLeft: 'auto',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Memory card ─────────────────────────────────────────────────────────────

const MemoryCard = styled.div({
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.35s ease both`,
  willChange: 'transform, opacity',
})

const MemoryCardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
})

const ParentAvatar = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: $color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
  flexShrink: 0,
}))

const MemoryMeta = styled.div({
  flex: 1,
  minWidth: 0,
})

const MemoryTitle = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const MemorySubMeta = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

const StatusBadge = styled.span<{ $processed: boolean }>(({ $processed }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.625rem',
  borderRadius: theme.radius.full,
  fontSize: '0.6875rem',
  fontWeight: 600,
  backgroundColor: $processed
    ? 'oklch(0.88 0.06 155 / 0.15)'
    : theme.colors.muted,
  color: $processed ? theme.colors.primary : theme.colors.mutedForeground,
  flexShrink: 0,
}))

// Photo thumbnail
const PhotoThumb = styled.div({
  width: '100%',
  height: '10rem',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.colors.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '2rem',
    height: '2rem',
    color: theme.colors.mutedForeground,
  },
})

const PhotoImg = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

// Sections inside card
const CardSection = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  '&:last-child': { borderBottom: 'none' },
})

const SectionLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[2],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

const TranscriptText = styled.p({
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  lineHeight: 1.7,
  fontFamily: theme.fonts.serif,
})

const TranscriptPending = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  color: theme.colors.mutedForeground,
  fontSize: '0.875rem',
  fontStyle: 'italic',
})

const ReflectionInput = styled.textarea({
  width: '100%',
  minHeight: '5rem',
  padding: `${theme.spacing[3]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.primary}`,
  backgroundColor: theme.colors.background,
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  fontFamily: theme.fonts.sans,
  lineHeight: 1.6,
  resize: 'vertical',
  outline: 'none',
  '&::placeholder': { color: theme.colors.mutedForeground },
})

const ReflectionDisplay = styled.p({
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  lineHeight: 1.7,
  fontStyle: 'italic',
})

const AddReflectionBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: '0.8125rem',
  color: theme.colors.primary,
  fontWeight: 500,
  border: `1px solid oklch(0.88 0.06 155 / 0.4)`,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  background: 'none',
  cursor: 'pointer',
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

// Card footer actions
const CardFooter = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
})

const FooterBtn = styled.button<{ $danger?: boolean }>(({ $danger }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${$danger ? theme.colors.destructive : theme.colors.border}`,
  backgroundColor: 'transparent',
  color: $danger ? theme.colors.destructive : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: $danger ? 'rgba(220,38,38,0.05)' : theme.colors.muted,
  },
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

const SaveReflBtn = styled.button({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  border: 'none',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

const HeartBtn = styled.button<{ $active: boolean }>(({ $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${$active ? 'oklch(0.65 0.15 20)' : theme.colors.border}`,
  backgroundColor: $active ? 'oklch(0.65 0.15 20 / 0.08)' : 'transparent',
  color: $active ? 'oklch(0.55 0.15 20)' : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  marginLeft: 'auto',
  '&:hover': {
    backgroundColor: $active
      ? 'oklch(0.65 0.15 20 / 0.14)'
      : theme.colors.muted,
  },
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

// ─── AI Summary section ───────────────────────────────────────────────────────

const AiSection = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  background: 'oklch(0.55 0.1 155 / 0.03)',
})

const AiLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.primary,
  marginBottom: theme.spacing[2],
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

const AiTitle = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[1],
})

const AiSummaryText = styled.p({
  fontSize: '0.875rem',
  color: '#4a4540',
  lineHeight: 1.65,
})

const TagRow = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[1],
  marginTop: theme.spacing[2],
})

const Tag = styled.span({
  display: 'inline-block',
  padding: '0.2rem 0.6rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.55 0.1 155 / 0.1)',
  color: theme.colors.primary,
  fontSize: '0.75rem',
  fontWeight: 500,
})

const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  fontSize: '0.9375rem',
})

// ─── Mock data ────────────────────────────────────────────────────────────────

type MockMemory = {
  id: string
  prompt: string
  parentName: string
  parentEmoji: string
  parentColor: string
  decade: string
  isProcessed: boolean
  transcript: string | null
  reflection: string | null
  hasPhoto: boolean
  aiTitle: string | null
  aiSummary: string | null
  aiTags: string[]
}

const MOCK_MEMORIES: MockMemory[] = [
  {
    id: '1',
    prompt: 'Kể cho con nghe về ngôi nhà thời thơ ấu',
    parentName: 'Bố Hùng',
    parentEmoji: '👨',
    parentColor: 'oklch(0.75 0.1 155)',
    decade: '1970s',
    isProcessed: true,
    transcript:
      'Hồi đó nhà mình ở một con phố nhỏ, buổi sáng thường nghe tiếng chuông xe đạp. Bố hay dậy sớm để đi học, trời còn tối lắm. Bà nội hay nấu xôi để bố ăn trước khi đi...',
    reflection:
      'Nghe bố kể mà thấy thương quá. Hồi nhỏ khó khăn vậy mà bố vẫn chăm học.',
    hasPhoto: true,
    aiTitle: 'Ngôi nhà nhỏ đầu phố',
    aiSummary:
      'Bố kể về tuổi thơ trong một con phố nhỏ yên bình, nơi tiếng chuông xe đạp vang lên mỗi sớm mai. Hình ảnh bà nội dậy sớm nấu xôi tiễn bố đi học là ký ức ấm áp và xúc động nhất.',
    aiTags: ['tuổi thơ', 'hà nội', 'thập niên 70', 'bà nội', 'gia đình'],
  },
  {
    id: '2',
    prompt: 'Công việc đầu tiên của mẹ như thế nào?',
    parentName: 'Mẹ Lan',
    parentEmoji: '👩',
    parentColor: 'oklch(0.75 0.1 50)',
    decade: '1985',
    isProcessed: false,
    transcript: null,
    reflection: null,
    hasPhoto: false,
    aiTitle: null,
    aiSummary: null,
    aiTags: [],
  },
  {
    id: '3',
    prompt: 'Bố và mẹ gặp nhau như thế nào?',
    parentName: 'Bố Hùng',
    parentEmoji: '👨',
    parentColor: 'oklch(0.75 0.1 155)',
    decade: '1990s',
    isProcessed: true,
    transcript:
      'Lần đầu gặp mẹ là ở một đám cưới của bạn chung. Khi đó mẹ mặc chiếc áo dài xanh, bố nghe mẹ cười từ đầu phòng mà tim đã đập loạn rồi...',
    reflection: null,
    hasPhoto: false,
    aiTitle: 'Tiếng cười đầu phòng tiệc',
    aiSummary:
      'Bố kể về lần đầu gặp mẹ tại đám cưới của bạn chung — chiếc áo dài xanh và tiếng cười vang vọng đã khiến tim bố đập loạn. Một câu chuyện tình yêu giản dị mà đầy xúc cảm.',
    aiTags: ['tình yêu', 'thập niên 90', 'đám cưới', 'bố mẹ gặp nhau'],
  },
]

// ─── Memory card component ───────────────────────────────────────────────────

function MemoryCardItem({
  memory,
  delay,
}: {
  memory: MockMemory
  delay: number
}) {
  const { t } = useI18n()
  const [editingReflection, setEditingReflection] = useState(false)
  const [reflectionText, setReflectionText] = useState(memory.reflection ?? '')
  const [savedReflection, setSavedReflection] = useState(memory.reflection)
  const [hearted, setHearted] = useState(false)
  const [heartSending, setHeartSending] = useState(false)

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
        body: JSON.stringify({ memoryId: memory.id, userId: MOCK_USER_ID }),
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
    <MemoryCard style={{ animationDelay: `${delay}s` }}>
      {/* Header */}
      <MemoryCardHeader>
        <ParentAvatar $color={memory.parentColor}>
          {memory.parentEmoji}
        </ParentAvatar>
        <MemoryMeta>
          <MemoryTitle>{memory.prompt}</MemoryTitle>
          <MemorySubMeta>
            {memory.parentName} · {memory.decade}
          </MemorySubMeta>
        </MemoryMeta>
        <StatusBadge $processed={memory.isProcessed}>
          {memory.isProcessed
            ? t('studio.memoryCard.processed')
            : t('studio.memoryCard.processing')}
        </StatusBadge>
      </MemoryCardHeader>

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
            Tóm tắt AI
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

      {/* Transcript */}
      <CardSection>
        <SectionLabel>
          <FileText />
          {t('studio.memoryCard.transcript')}
        </SectionLabel>
        {memory.isProcessed && memory.transcript ? (
          <TranscriptText>{memory.transcript}</TranscriptText>
        ) : (
          <TranscriptPending>
            <span className="sr-only">Loading</span>
            {t('studio.memoryCard.noTranscript')}
          </TranscriptPending>
        )}
      </CardSection>

      {/* Reflection */}
      <CardSection>
        <SectionLabel>
          <BookOpen />
          {t('studio.memoryCard.reflection')}
        </SectionLabel>
        {editingReflection ? (
          <>
            <ReflectionInput
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder={t('studio.memoryCard.addReflection')}
              autoFocus
            />
            <div
              style={{
                display: 'flex',
                gap: theme.spacing[2],
                marginTop: theme.spacing[2],
              }}
            >
              <SaveReflBtn onClick={handleSaveReflection}>
                <Check />
                {t('studio.saveReflection')}
              </SaveReflBtn>
              <FooterBtn onClick={() => setEditingReflection(false)}>
                <X />
                Cancel
              </FooterBtn>
            </div>
          </>
        ) : savedReflection ? (
          <>
            <ReflectionDisplay>{savedReflection}</ReflectionDisplay>
            <AddReflectionBtn
              style={{ marginTop: theme.spacing[2] }}
              onClick={() => {
                setReflectionText(savedReflection)
                setEditingReflection(true)
              }}
            >
              <Pencil />
              {t('studio.editReflection')}
            </AddReflectionBtn>
          </>
        ) : (
          <AddReflectionBtn onClick={() => setEditingReflection(true)}>
            <Pencil />
            {t('studio.memoryCard.addReflection')}
          </AddReflectionBtn>
        )}
      </CardSection>

      {/* Footer */}
      <CardFooter>
        <FooterBtn $danger onClick={() => alert(t('studio.confirmDelete'))}>
          <Trash2 />
          {t('studio.deleteMemory')}
        </FooterBtn>
        <HeartBtn
          $active={hearted}
          onClick={handleHeart}
          disabled={heartSending}
        >
          <Heart style={{ fill: hearted ? 'currentColor' : 'none' }} />
          {hearted ? t('studio.hearted') : t('studio.heart')}
        </HeartBtn>
      </CardFooter>
    </MemoryCard>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

type FilterKey = 'all' | 'processed' | 'pending'

export default function StudioPage() {
  const { t } = useI18n()
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = MOCK_MEMORIES.filter((m) => {
    if (filter === 'processed') return m.isProcessed
    if (filter === 'pending') return !m.isProcessed
    return true
  })

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t('studio.title')}</PageTitle>
        <PageSubtitle>{t('studio.subtitle')}</PageSubtitle>
      </PageHeader>

      <FilterBar>
        {(['all', 'processed', 'pending'] as FilterKey[]).map((key) => (
          <FilterChip
            key={key}
            $active={filter === key}
            onClick={() => setFilter(key)}
          >
            {t(`studio.filter.${key}` as Parameters<typeof t>[0])}
          </FilterChip>
        ))}
        <SortBtn>
          <SlidersHorizontal />
          {t('studio.sort.newest')}
        </SortBtn>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState>
          <Mic
            style={{
              width: '2.5rem',
              height: '2.5rem',
              marginBottom: theme.spacing[3],
              opacity: 0.3,
            }}
          />
          <p>{t('studio.emptyState')}</p>
        </EmptyState>
      ) : (
        filtered.map((m, i) => (
          <MemoryCardItem key={m.id} memory={m} delay={i * 0.05} />
        ))
      )}
    </Page>
  )
}
