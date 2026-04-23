'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Play, Pause, Heart } from 'lucide-react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`

const glowPulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 8px oklch(0.65 0.12 50 / 0.5)); }
  50%       { filter: drop-shadow(0 0 20px oklch(0.65 0.12 50 / 0.8)); }
`

const heartPop = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`

const audioBar = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50%       { transform: scaleY(1); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing[6]} ${theme.spacing[5]} ${theme.spacing[10]}`,
  maxWidth: '26rem',
  margin: '0 auto',
  gap: theme.spacing[6],
})

// ─── Success section ──────────────────────────────────────────────────────────

const SuccessSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing[4],
  animation: `${fadeUp} 0.4s ease both`,
})

const RootsLogo = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.primary,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  opacity: 0.7,
})

// The lantern icon — key visual for this page
const LanternWrapper = styled.div<{ $lit: boolean }>(({ $lit }) => ({
  fontSize: '5rem',
  lineHeight: 1,
  animation: `${float} 3s ease-in-out infinite`,
  filter: $lit ? 'drop-shadow(0 0 20px oklch(0.65 0.12 50 / 0.7))' : 'none',
  transition: 'filter 0.6s ease',
  cursor: 'pointer',
  userSelect: 'none',
  willChange: 'transform',
  transform: 'translateZ(0)',
}))

const SuccessTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.625rem',
  fontWeight: 700,
  color: '#2d2a26',
  lineHeight: 1.35,
  '& em': { fontStyle: 'normal', color: theme.colors.primary },
})

const SuccessSubtitle = styled.p({
  fontSize: '0.9375rem',
  color: '#6b6560',
  lineHeight: 1.6,
})

const LanternHint = styled.p({
  fontSize: '0.8125rem',
  color: theme.colors.accent,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

const ReactionBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.xl,
  backgroundColor: 'oklch(0.65 0.15 20 / 0.1)',
  border: '1.5px solid oklch(0.65 0.15 20 / 0.25)',
  color: 'oklch(0.45 0.15 20)',
  fontSize: '0.9375rem',
  fontWeight: 600,
  animation: `${heartPop} 0.5s ease both`,
  '& svg': { width: '1.125rem', height: '1.125rem', fill: 'currentColor' },
})

// ─── Divider ──────────────────────────────────────────────────────────────────

const Divider = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: 'oklch(0.55 0.1 155 / 0.15)',
  },
})

const DividerText = styled.span({
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#9d9690',
  whiteSpace: 'nowrap',
})

// ─── Feedback (messages from child) ──────────────────────────────────────────

const FeedbackList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

const FeedbackCard = styled.div({
  backgroundColor: '#fff',
  border: '1.5px solid oklch(0.55 0.1 155 / 0.15)',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  animation: `${fadeUp} 0.4s ease both`,
  boxShadow: '0 2px 12px oklch(0.55 0.1 155 / 0.06)',
})

const FeedbackCardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[3]}`,
})

const StudentAvatar = styled.div({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  background: `linear-gradient(135deg, oklch(0.75 0.1 155), oklch(0.65 0.12 50))`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  flexShrink: 0,
})

const StudentInfo = styled.div({
  flex: 1,
  minWidth: 0,
})

const StudentNameLabel = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: '#2d2a26',
})

const FeedbackDate = styled.div({
  fontSize: '0.75rem',
  color: '#9d9690',
  marginTop: '0.125rem',
})

const NewBadge = styled.span({
  display: 'inline-flex',
  padding: '0.2rem 0.625rem',
  borderRadius: theme.radius.full,
  fontSize: '0.6875rem',
  fontWeight: 700,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.12)',
  color: theme.colors.accent,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
})

// Voice message player (amber tone)
const VoicePlayer = styled.div({
  margin: `0 ${theme.spacing[4]} ${theme.spacing[3]}`,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.65 0.12 50 / 0.08)',
  border: '1px solid oklch(0.65 0.12 50 / 0.2)',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
})

const PlayBtn = styled.button<{ $playing: boolean }>(({ $playing }) => ({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.accent,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexShrink: 0,
  transition: `transform ${theme.transitions.fast}`,
  '&:active': { transform: 'scale(0.92)' },
  '& svg': { width: '1rem', height: '1rem' },
}))

const WaveformContainer = styled.div({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '2.5px',
  height: '2rem',
})

const Bar = styled.div<{ $i: number; $playing: boolean }>(
  ({ $i, $playing }) => ({
    width: '3px',
    height: '100%',
    borderRadius: '2px',
    backgroundColor: `oklch(0.65 0.12 50 / ${0.3 + ($i % 3) * 0.2})`,
    transformOrigin: 'center',
    animation: $playing
      ? `${audioBar} ${0.5 + ($i % 5) * 0.1}s ease-in-out infinite`
      : 'none',
    transform: $playing ? undefined : `scaleY(${0.2 + ($i % 4) * 0.15})`,
    animationDelay: `${$i * 0.07}s`,
    transition: 'transform 0.3s',
  }),
)

const VoiceDuration = styled.span({
  fontSize: '0.75rem',
  fontFamily: theme.fonts.mono,
  color: theme.colors.accent,
  flexShrink: 0,
})

// Text message bubble
const TextMessage = styled.div({
  margin: `0 ${theme.spacing[4]} ${theme.spacing[4]}`,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.88 0.06 155 / 0.12)',
  border: '1px solid oklch(0.55 0.1 155 / 0.15)',
  borderRadius: '1rem',
  fontSize: '0.9375rem',
  color: '#2d2a26',
  lineHeight: 1.65,
  fontFamily: theme.fonts.sans,
})

// Heart reaction
const HeartReaction = styled.button<{ $active: boolean }>(({ $active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  margin: `0 ${theme.spacing[4]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${$active ? 'oklch(0.7 0.15 10)' : 'oklch(0.55 0.1 155 / 0.2)'}`,
  backgroundColor: $active ? 'oklch(0.95 0.04 10)' : 'transparent',
  cursor: 'pointer',
  color: $active ? 'oklch(0.6 0.18 10)' : '#9d9690',
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '1rem', height: '1rem' },
}))

// ─── Mock feedback data ───────────────────────────────────────────────────────

type ChildFeedback = {
  id: string
  type: 'voice' | 'text'
  date: string
  isNew: boolean
  voiceDuration?: number
  text?: string
}

const MOCK_FEEDBACK: ChildFeedback[] = [
  {
    id: '1',
    type: 'voice',
    date: 'Hôm nay',
    isNew: true,
    voiceDuration: 38,
  },
  {
    id: '2',
    type: 'text',
    date: 'Hôm qua',
    isNew: false,
    text: 'Bố ơi, câu chuyện của Bố hay quá! Con đã nghe đi nghe lại mấy lần rồi. Con nhớ Bố lắm. 🥺❤️',
  },
]

const SESSION = { studentName: 'Minh', parentName: 'Bố', destination: 'Pháp' }

// ─── Page ─────────────────────────────────────────────────────────────────────

function FeedbackItem({ item }: { item: ChildFeedback }) {
  const [playing, setPlaying] = useState(false)
  const [hearted, setHearted] = useState(false)

  return (
    <FeedbackCard style={{ animationDelay: `${item.id === '1' ? 0.1 : 0.2}s` }}>
      <FeedbackCardHeader>
        <StudentAvatar>👨‍🎓</StudentAvatar>
        <StudentInfo>
          <StudentNameLabel>{SESSION.studentName}</StudentNameLabel>
          <FeedbackDate>{item.date}</FeedbackDate>
        </StudentInfo>
        {item.isNew && <NewBadge>Mới</NewBadge>}
      </FeedbackCardHeader>

      {item.type === 'voice' && item.voiceDuration != null && (
        <VoicePlayer>
          <PlayBtn $playing={playing} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause /> : <Play />}
          </PlayBtn>
          <WaveformContainer>
            {Array.from({ length: 24 }).map((_, i) => (
              <Bar key={i} $i={i} $playing={playing} />
            ))}
          </WaveformContainer>
          <VoiceDuration>
            0:{item.voiceDuration.toString().padStart(2, '0')}
          </VoiceDuration>
        </VoicePlayer>
      )}

      {item.type === 'text' && item.text && (
        <TextMessage>{item.text}</TextMessage>
      )}

      <HeartReaction $active={hearted} onClick={() => setHearted((h) => !h)}>
        <Heart style={{ fill: hearted ? 'currentColor' : 'none' }} />
        {hearted ? 'Đã cảm ơn' : 'Cảm ơn con'}
      </HeartReaction>
    </FeedbackCard>
  )
}

export default function ParentDonePage() {
  const params = useParams<{ token: string }>()
  const token = params.token

  const [lanternLit, setLanternLit] = useState(false)
  const [studentReacted, setStudentReacted] = useState(false)

  // Subscribe to ❤️ reactions from the student — lights the lantern automatically
  useEffect(() => {
    if (!token) return
    const sse = new EventSource(`/api/reactions/stream?token=${token}`)
    sse.addEventListener('reaction', () => {
      setLanternLit(true)
      setStudentReacted(true)
    })
    return () => sse.close()
  }, [token])

  return (
    <Page>
      {/* Success */}
      <SuccessSection>
        <RootsLogo>GỐC</RootsLogo>

        <LanternWrapper $lit={lanternLit} onClick={() => setLanternLit(true)}>
          {lanternLit ? '🏮' : '🪔'}
        </LanternWrapper>

        <SuccessTitle>
          Ký ức của <em>{SESSION.parentName}</em>
          <br />
          đã đến tay {SESSION.studentName}!
        </SuccessTitle>

        <SuccessSubtitle>
          Câu chuyện của {SESSION.parentName} đã được gửi sang{' '}
          <strong>{SESSION.destination}</strong> và lưu giữ trong Gốc của gia
          đình mình.
        </SuccessSubtitle>

        {!lanternLit && (
          <LanternHint>
            <span>✨</span>
            Nhấn vào đèn để thắp sáng khi {SESSION.studentName} đã nghe xong
          </LanternHint>
        )}

        {studentReacted && (
          <ReactionBanner>
            <Heart />
            {SESSION.studentName} đã nghe và gửi ❤️ cho {SESSION.parentName}!
          </ReactionBanner>
        )}
      </SuccessSection>

      <Divider>
        <DividerText>Lời nhắn từ {SESSION.studentName}</DividerText>
      </Divider>

      {/* Messages from child */}
      {MOCK_FEEDBACK.length > 0 ? (
        <FeedbackList>
          {MOCK_FEEDBACK.map((item) => (
            <FeedbackItem key={item.id} item={item} />
          ))}
        </FeedbackList>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: `${theme.spacing[8]} 0`,
            color: '#9d9690',
            fontSize: '0.9rem',
          }}
        >
          <span style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', textAlign: 'center', margin: '0 auto 1rem' }}>💬</span>
          <p>
            {SESSION.studentName} chưa có tin nhắn nào. Quay lại sau nhé{' '}
            {SESSION.parentName}!
          </p>
        </div>
      )}
    </Page>
  )
}
