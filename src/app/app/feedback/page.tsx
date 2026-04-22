'use client'

import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import {
  Headphones,
  Mic,
  Send,
  Check,
  Play,
  Pause,
  MessageSquare,
  RotateCcw,
  Bell,
} from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

// Hardcoded for now — replace with session.user.id when auth wired to UI
const MOCK_USER_ID = 'demo-user'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '44rem',
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

// ─── Feedback card ────────────────────────────────────────────────────────────

const FeedbackCard = styled.div({
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  overflow: 'hidden',
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.35s ease both`,
  willChange: 'transform, opacity',
})

const FeedbackHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[3]}`,
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
  flexShrink: 0,
}))

const ParentInfo = styled.div({
  flex: 1,
  minWidth: 0,
})

const ParentName = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

const FeedbackDate = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

const PlayedBadge = styled.span<{ $played: boolean }>(({ $played }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.625rem',
  borderRadius: theme.radius.full,
  fontSize: '0.6875rem',
  fontWeight: 600,
  backgroundColor: $played
    ? 'oklch(0.88 0.06 155 / 0.12)'
    : 'oklch(0.65 0.12 50 / 0.1)',
  color: $played ? theme.colors.primary : theme.colors.accent,
  flexShrink: 0,
  '& svg': { width: '0.625rem', height: '0.625rem' },
}))

// Memory context
const MemoryContext = styled.div({
  margin: `0 ${theme.spacing[4]}`,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: theme.colors.muted,
  borderRadius: theme.radius.xl,
  marginBottom: theme.spacing[3],
})

const ContextLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[1],
})

const ContextText = styled.div({
  fontSize: '0.8125rem',
  color: theme.colors.foreground,
  fontStyle: 'italic',
})

// Audio player
const AudioPlayer = styled.div({
  margin: `0 ${theme.spacing[4]} ${theme.spacing[3]}`,
  padding: `${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.08)',
  border: `1px solid oklch(0.65 0.12 50 / 0.2)`,
  borderRadius: theme.radius.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})

const AudioPlayerRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
})

const AudioLabel = styled.div({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.colors.accent,
  letterSpacing: '0.05em',
})

const PlayBtn = styled.button<{ $playing: boolean }>(({ $playing }) => ({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexShrink: 0,
  animation: $playing ? `${pulse} 2s ease infinite` : 'none',
  '& svg': { width: '1.1rem', height: '1.1rem' },
}))

const ProgressTrack = styled.div({
  flex: 1,
  height: '0.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.2)',
  position: 'relative',
})

const ProgressFill = styled.div<{ $pct: number }>(({ $pct }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: `${$pct}%`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  transition: 'width 0.1s linear',
}))

const AudioTime = styled.span({
  fontSize: '0.75rem',
  fontFamily: theme.fonts.mono,
  color: theme.colors.accent,
  flexShrink: 0,
})

const RelistenBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.75rem',
  color: theme.colors.accent,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

// Response section
const ResponseSection = styled.div({
  borderTop: `1px solid ${theme.colors.border}`,
  padding: `${theme.spacing[4]}`,
})

const ResponseLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[3],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

const ResponseText = styled.p({
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  lineHeight: 1.7,
  fontStyle: 'italic',
  marginBottom: theme.spacing[3],
})

const ResponseInput = styled.textarea({
  width: '100%',
  minHeight: '4.5rem',
  padding: `${theme.spacing[3]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  fontSize: '0.9rem',
  color: theme.colors.foreground,
  fontFamily: theme.fonts.sans,
  lineHeight: 1.6,
  resize: 'none',
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': { borderColor: theme.colors.primary },
  '&::placeholder': { color: theme.colors.mutedForeground },
})

const ResponseActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  marginTop: theme.spacing[2],
})

const RecordResponseBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

const SendBtn = styled.button<{ $disabled: boolean }>(({ $disabled }) => ({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.lg,
  backgroundColor: $disabled ? theme.colors.muted : theme.colors.primary,
  color: $disabled ? theme.colors.mutedForeground : '#fff',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: $disabled ? 'not-allowed' : 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

const MarkPlayedBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[3],
  color: theme.colors.mutedForeground,
})

const UnreadBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.1)',
  border: `1px solid oklch(0.65 0.12 50 / 0.25)`,
  borderRadius: theme.radius.xl,
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
  '& svg': {
    width: '1rem',
    height: '1rem',
    color: theme.colors.accent,
    flexShrink: 0,
  },
})

const UnreadBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.25rem',
  height: '1.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  color: '#fff',
  fontSize: '0.6875rem',
  fontWeight: 700,
  padding: '0 0.3rem',
  marginLeft: 'auto',
})

// ─── Mock data ────────────────────────────────────────────────────────────────

type FeedbackItem = {
  id: string
  parentName: string
  parentEmoji: string
  parentColor: string
  memoryPrompt: string
  date: string
  duration: number
  isPlayed: boolean
  response: string | null
}

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: '1',
    parentName: 'Bố Hùng',
    parentEmoji: '👨',
    parentColor: 'oklch(0.75 0.1 155)',
    memoryPrompt: 'Kể về ngôi nhà thời thơ ấu',
    date: '2 ngày trước',
    duration: 142,
    isPlayed: false,
    response: null,
  },
  {
    id: '2',
    parentName: 'Mẹ Lan',
    parentEmoji: '👩',
    parentColor: 'oklch(0.75 0.1 50)',
    memoryPrompt: 'Công việc đầu tiên của mẹ',
    date: '5 ngày trước',
    duration: 87,
    isPlayed: true,
    response: 'Con thấy mẹ thật dũng cảm. Con sẽ luôn nhớ câu chuyện này.',
  },
  {
    id: '3',
    parentName: 'Bà Nội',
    parentEmoji: '👵',
    parentColor: 'oklch(0.75 0.08 280)',
    memoryPrompt: 'Kỷ niệm về ngày giải phóng',
    date: '1 tuần trước',
    duration: 203,
    isPlayed: true,
    response: null,
  },
]

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ─── Feedback item component ─────────────────────────────────────────────────

function FeedbackCardItem({
  item,
  delay,
}: {
  item: FeedbackItem
  delay: number
}) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(0)
  const [isPlayed, setIsPlayed] = useState(item.isPlayed)
  const [responseText, setResponseText] = useState(item.response ?? '')
  const [savedResponse, setSavedResponse] = useState(item.response)

  const handleSend = () => {
    if (!responseText.trim()) return
    setSavedResponse(responseText)
    setIsPlayed(true)
  }

  return (
    <FeedbackCard style={{ animationDelay: `${delay}s` }}>
      {/* Header */}
      <FeedbackHeader>
        <ParentAvatar $color={item.parentColor}>
          {item.parentEmoji}
        </ParentAvatar>
        <ParentInfo>
          <ParentName>{item.parentName}</ParentName>
          <FeedbackDate>{item.date}</FeedbackDate>
        </ParentInfo>
        <PlayedBadge $played={isPlayed}>
          {isPlayed ? (
            <>
              <Check />
              {t('feedback.played')}
            </>
          ) : (
            <>{t('feedback.markPlayed')}</>
          )}
        </PlayedBadge>
      </FeedbackHeader>

      {/* Memory context */}
      <MemoryContext>
        <ContextLabel>In response to</ContextLabel>
        <ContextText>"{item.memoryPrompt}"</ContextText>
      </MemoryContext>

      {/* Audio player */}
      <AudioPlayer>
        <AudioLabel>
          {t('feedback.fromParent')} {item.parentName}
        </AudioLabel>
        <AudioPlayerRow>
          <PlayBtn $playing={playing} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause /> : <Play />}
          </PlayBtn>
          <ProgressTrack>
            <ProgressFill $pct={pct} />
          </ProgressTrack>
          <AudioTime>
            {fmtTime(Math.floor((item.duration * pct) / 100))} /{' '}
            {fmtTime(item.duration)}
          </AudioTime>
        </AudioPlayerRow>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <RelistenBtn
            onClick={() => {
              setPct(0)
              setPlaying(false)
            }}
          >
            <RotateCcw />
            {t('feedback.listenAgain')}
          </RelistenBtn>
        </div>
      </AudioPlayer>

      {/* Response */}
      <ResponseSection>
        <ResponseLabel>
          <MessageSquare />
          {t('feedback.yourResponse')}
        </ResponseLabel>
        {savedResponse ? <ResponseText>"{savedResponse}"</ResponseText> : null}
        <ResponseInput
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder={t('feedback.writeResponse')}
        />
        <ResponseActions>
          <RecordResponseBtn>
            <Mic />
            {t('feedback.recordResponse')}
          </RecordResponseBtn>
          {!isPlayed && (
            <MarkPlayedBtn onClick={() => setIsPlayed(true)}>
              <Check />
              {t('feedback.markPlayed')}
            </MarkPlayedBtn>
          )}
          <SendBtn
            $disabled={!responseText.trim()}
            onClick={handleSend}
            disabled={!responseText.trim()}
          >
            <Send />
            {t('feedback.sendResponse')}
          </SendBtn>
        </ResponseActions>
      </ResponseSection>
    </FeedbackCard>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeedbackPage() {
  const { t } = useI18n()
  const [unread, setUnread] = useState(0)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Subscribe to SSE stream for real-time new-feedback notifications
  useEffect(() => {
    const es = new EventSource(`/api/feedback/stream?userId=${MOCK_USER_ID}`)
    eventSourceRef.current = es

    es.addEventListener('new-feedback', (e) => {
      const data = JSON.parse((e as MessageEvent).data) as { unread: number }
      setUnread(data.unread)
    })

    es.onerror = () => {
      // EventSource auto-reconnects — no action needed
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [])

  const dismissUnread = () => setUnread(0)

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t('feedback.title')}</PageTitle>
        <PageSubtitle>{t('feedback.subtitle')}</PageSubtitle>
      </PageHeader>

      {/* Real-time unread notification banner */}
      {unread > 0 && (
        <UnreadBanner onClick={dismissUnread} style={{ cursor: 'pointer' }}>
          <Bell />
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme.colors.foreground,
            }}
          >
            {unread === 1
              ? '1 tin nhắn mới từ gia đình'
              : `${unread} tin nhắn mới từ gia đình`}
          </span>
          <UnreadBadge>{unread}</UnreadBadge>
        </UnreadBanner>
      )}

      {MOCK_FEEDBACK.length === 0 ? (
        <EmptyState>
          <Headphones style={{ width: '3rem', height: '3rem', opacity: 0.3 }} />
          <p>{t('feedback.noFeedback')}</p>
        </EmptyState>
      ) : (
        MOCK_FEEDBACK.map((item, i) => (
          <FeedbackCardItem key={item.id} item={item} delay={i * 0.06} />
        ))
      )}
    </Page>
  )
}
