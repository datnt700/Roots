'use client'

import { useState, useEffect, useRef } from 'react'
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
import { useTranslations } from 'next-intl'
import { useUserId } from '@/hooks/use-user-id'
import {
  Page, PageHeader, PageTitle, PageSubtitle,
  FeedbackCard, FeedbackHeader, ParentAvatar, ParentInfo, ParentName, FeedbackDate, PlayedBadge,
  MemoryContext, ContextLabel, ContextText,
  AudioPlayer, AudioPlayerRow, AudioLabel, PlayBtn, ProgressTrack, ProgressFill, AudioTime, RelistenBtn,
  ResponseSection, ResponseLabel, ResponseText, ResponseInput, ResponseActions, RecordResponseBtn, SendBtn, MarkPlayedBtn,
  EmptyState, UnreadBanner, UnreadBadge, UnreadText, RelistenRow, EmptyStateIcon,
  SkeletonCard, SkeletonCardHeader, SkeletonCardHeaderInfo, SkeletonCircle, SkeletonLine, SkeletonBlock,
} from './page.styles'

// ─── Mock data ────────────────────────────────────────────────────────────────

type FeedbackItem = {
  id: string
  memoryId: string
  parentName: string
  relationship: string
  memoryPrompt: string
  date: string
  isPlayed: boolean
  response: string | null
  createdAt: string
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

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

// ─── Feedback item component ─────────────────────────────────────────────────

function FeedbackCardItem({
  item,
  delay,
}: {
  item: FeedbackItem
  delay: number
}) {
  const t = useTranslations('feedback')
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(0)
  const [isPlayed, setIsPlayed] = useState(item.isPlayed)
  const [responseText, setResponseText] = useState(item.response ?? '')
  const [savedResponse, setSavedResponse] = useState(item.response)
  const parentEmoji = RELATIONSHIP_EMOJI[item.relationship] ?? '🧑'
  const parentColor = RELATIONSHIP_COLOR[item.relationship] ?? 'oklch(0.7 0.06 100)'

  const handleSend = () => {
    if (!responseText.trim()) return
    setSavedResponse(responseText)
    setIsPlayed(true)
  }

  return (
    <FeedbackCard style={{ animationDelay: `${delay}s` }}>
      {/* Header */}
      <FeedbackHeader>
        <ParentAvatar $color={parentColor}>
          {parentEmoji}
        </ParentAvatar>
        <ParentInfo>
          <ParentName>{item.parentName}</ParentName>
          <FeedbackDate>{item.date}</FeedbackDate>
        </ParentInfo>
        <PlayedBadge $played={isPlayed}>
          {isPlayed ? (
            <>
              <Check />
              {t('played')}
            </>
          ) : (
            <>{t('markPlayed')}</>
          )}
        </PlayedBadge>
      </FeedbackHeader>

      {/* Memory context */}
      <MemoryContext>
        <ContextLabel>{t('inResponseTo')}</ContextLabel>
        <ContextText>"{item.memoryPrompt}"</ContextText>
      </MemoryContext>

      {/* Audio player */}
      <AudioPlayer>
        <AudioLabel>
          {t('fromParent')} {item.parentName}
        </AudioLabel>
        <AudioPlayerRow>
          <PlayBtn $playing={playing} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause /> : <Play />}
          </PlayBtn>
          <ProgressTrack>
            <ProgressFill $pct={pct} />
          </ProgressTrack>
          <AudioTime>
            {fmtTime(Math.floor((300 * pct) / 100))} / --:--
          </AudioTime>
        </AudioPlayerRow>
        <RelistenRow>
          <RelistenBtn
            onClick={() => {
              setPct(0)
              setPlaying(false)
            }}
          >
            <RotateCcw />
            {t('listenAgain')}
          </RelistenBtn>
        </RelistenRow>
      </AudioPlayer>

      {/* Response */}
      <ResponseSection>
        <ResponseLabel>
          <MessageSquare />
          {t('yourResponse')}
        </ResponseLabel>
        {savedResponse ? <ResponseText>"{savedResponse}"</ResponseText> : null}
        <ResponseInput
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder={t('writeResponse')}
        />
        <ResponseActions>
          <RecordResponseBtn>
            <Mic />
            {t('recordResponse')}
          </RecordResponseBtn>
          {!isPlayed && (
            <MarkPlayedBtn onClick={() => setIsPlayed(true)}>
              <Check />
              {t('markPlayed')}
            </MarkPlayedBtn>
          )}
          <SendBtn
            $disabled={!responseText.trim()}
            onClick={handleSend}
            disabled={!responseText.trim()}
          >
            <Send />
            {t('sendResponse')}
          </SendBtn>
        </ResponseActions>
      </ResponseSection>
    </FeedbackCard>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeedbackPage() {
  const t = useTranslations('feedback')
  const userId = useUserId()
  const [unread, setUnread] = useState(0)
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Fetch feedback list
  useEffect(() => {
    if (!userId) return
    fetch(`/api/feedback?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setFeedbackList(data.feedback ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  // Subscribe to SSE stream for real-time new-feedback notifications
  useEffect(() => {
    if (!userId) return
    const es = new EventSource(`/api/feedback/stream?userId=${userId}`)
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
  }, [userId])

  const dismissUnread = () => setUnread(0)

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t('title')}</PageTitle>
        <PageSubtitle>{t('subtitle')}</PageSubtitle>
      </PageHeader>

      {/* Real-time unread notification banner */}
      {unread > 0 && (
        <UnreadBanner onClick={dismissUnread}>
          <Bell />
          <UnreadText>
            {unread === 1
              ? '1 tin nhắn mới từ gia đình'
              : `${unread} tin nhắn mới từ gia đình`}
          </UnreadText>
          <UnreadBadge>{unread}</UnreadBadge>
        </UnreadBanner>
      )}

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonCardHeader>
              <SkeletonCircle className="skeleton" />
              <SkeletonCardHeaderInfo>
                <SkeletonLine className="skeleton" $width="35%" $marginBottom="0.5rem" />
                <SkeletonLine className="skeleton" $width="20%" $height="0.75rem" />
              </SkeletonCardHeaderInfo>
            </SkeletonCardHeader>
            <SkeletonLine className="skeleton" $width="65%" />
            <SkeletonBlock className="skeleton" />
          </SkeletonCard>
        ))
      ) : feedbackList.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon><Headphones /></EmptyStateIcon>
          <p>{t('noFeedback')}</p>
        </EmptyState>
      ) : (
        feedbackList.map((item, i) => (
          <FeedbackCardItem key={item.id} item={item} delay={i * 0.06} />
        ))
      )}
    </Page>
  )
}
