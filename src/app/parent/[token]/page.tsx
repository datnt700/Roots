'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Camera, X, RefreshCw, Send, Mic, Square, Loader2 } from 'lucide-react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const ripple = keyframes`
  0%   { transform: scale(1);    opacity: 0.6; }
  100% { transform: scale(2.2);  opacity: 0; }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.04); }
`

const breathe = keyframes`
  0%, 100% { box-shadow: 0 8px 0 oklch(0.42 0.1 155), 0 14px 30px oklch(0.55 0.1 155 / 0.3); }
  50%       { box-shadow: 0 12px 0 oklch(0.42 0.1 155), 0 20px 40px oklch(0.55 0.1 155 / 0.4); }
`

const recordPulse = keyframes`
  0%, 100% { box-shadow: 0 6px 0 oklch(0.4 0.15 20), 0 12px 30px oklch(0.55 0.15 20 / 0.4); }
  50%       { box-shadow: 0 10px 0 oklch(0.4 0.15 20), 0 18px 40px oklch(0.55 0.15 20 / 0.5); }
`

const waveBar = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50%       { transform: scaleY(1); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing[6]} ${theme.spacing[5]}`,
  maxWidth: '26rem',
  margin: '0 auto',
  gap: theme.spacing[6],
})

// Top greeting
const Greeting = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing[3],
  animation: `${fadeIn} 0.4s ease both`,
})

const RootsLogo = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.primary,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  opacity: 0.7,
  marginBottom: theme.spacing[1],
})

const StudentAvatar = styled.div({
  width: '4.5rem',
  height: '4.5rem',
  borderRadius: theme.radius.full,
  background: `linear-gradient(135deg, oklch(0.75 0.1 155), oklch(0.65 0.12 50))`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  boxShadow: '0 4px 16px oklch(0.55 0.1 155 / 0.25)',
})

const GreetingText = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.625rem',
  fontWeight: 700,
  color: '#2d2a26',
  lineHeight: 1.3,
  '& em': {
    fontStyle: 'normal',
    color: theme.colors.primary,
  },
})

const GreetingSubtext = styled.p({
  fontSize: '0.9375rem',
  color: '#6b6560',
  lineHeight: 1.6,
})

// Photo upload
const PhotoSection = styled.div({
  animation: `${fadeIn} 0.4s 0.1s ease both`,
  opacity: 0,
  animationFillMode: 'both',
})

const PhotoFrame = styled.div<{ $hasPhoto: boolean }>(({ $hasPhoto }) => ({
  width: '100%',
  aspectRatio: '4/3',
  borderRadius: '1.5rem',
  border: $hasPhoto ? 'none' : '2px dashed oklch(0.55 0.1 155 / 0.35)',
  backgroundColor: $hasPhoto ? 'transparent' : 'oklch(0.88 0.06 155 / 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[3],
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  transition: `all ${theme.transitions.fast}`,
}))

const PhotoPreview = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const PhotoPrompt = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[2],
  color: theme.colors.primary,
  '& svg': { width: '2.5rem', height: '2.5rem', opacity: 0.6 },
})

const PhotoPromptText = styled.span({
  fontSize: '1rem',
  fontWeight: 500,
  color: '#6b6560',
})

const PhotoOverlayActions = styled.div({
  position: 'absolute',
  top: theme.spacing[3],
  right: theme.spacing[3],
  display: 'flex',
  gap: theme.spacing[2],
})

const IconButton = styled.button({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'rgba(0,0,0,0.5)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  backdropFilter: 'blur(4px)',
  '& svg': { width: '1rem', height: '1rem' },
})

// Recording section
const RecordSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[4],
  animation: `${fadeIn} 0.4s 0.2s ease both`,
  opacity: 0,
  animationFillMode: 'both',
})

const PromptCard = styled.div({
  width: '100%',
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
  backgroundColor: 'oklch(0.88 0.06 50 / 0.15)',
  border: '1.5px solid oklch(0.65 0.12 50 / 0.25)',
  borderRadius: '1.25rem',
  textAlign: 'center',
})

const PromptLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.colors.accent,
  marginBottom: theme.spacing[2],
})

const PromptText = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  color: '#2d2a26',
  lineHeight: 1.5,
  fontStyle: 'italic',
})

// Waveform
const Waveform = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  height: '2.5rem',
})

const WaveBar = styled.div<{ $delay: number; $active: boolean }>(
  ({ $delay, $active }) => ({
    width: '3px',
    height: '100%',
    borderRadius: '2px',
    backgroundColor: $active
      ? theme.colors.primary
      : 'oklch(0.55 0.1 155 / 0.2)',
    transformOrigin: 'center',
    animation: $active
      ? `${waveBar} ${0.6 + $delay * 0.15}s ease-in-out infinite`
      : 'none',
    animationDelay: `${$delay * 0.08}s`,
    transform: $active ? undefined : 'scaleY(0.3)',
    transition: 'background-color 0.3s',
    willChange: 'transform',
  }),
)

// Claymorphism record button
const RecordButtonWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const RippleRing = styled.div({
  position: 'absolute',
  width: '7rem',
  height: '7rem',
  borderRadius: theme.radius.full,
  border: '2px solid oklch(0.55 0.15 20 / 0.4)',
  animation: `${ripple} 1.5s ease-out infinite`,
  willChange: 'transform, opacity',
})

const RippleRing2 = styled(RippleRing)({
  animationDelay: '0.5s',
})

const RecordButton = styled.button<{ $recording: boolean }>(
  ({ $recording }) => ({
    width: '6rem',
    height: '6rem',
    borderRadius: theme.radius.full,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    transition: `all ${theme.transitions.normal}`,
    // Claymorphism idle (forest green)
    backgroundColor: $recording ? 'oklch(0.55 0.15 20)' : theme.colors.primary,
    boxShadow: $recording
      ? '0 6px 0 oklch(0.4 0.15 20), 0 12px 30px oklch(0.55 0.15 20 / 0.4)'
      : '0 8px 0 oklch(0.42 0.1 155), 0 14px 30px oklch(0.55 0.1 155 / 0.3)',
    animation: $recording
      ? `${recordPulse} 1.2s ease infinite`
      : `${breathe} 3s ease infinite`,
    '&:active': { transform: 'translateY(4px)', transition: 'transform 0.1s' },
    '& svg': { width: '2.25rem', height: '2.25rem', color: '#fff' },
  }),
)

const RecordLabel = styled.div<{ $recording: boolean }>(({ $recording }) => ({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: $recording ? 'oklch(0.55 0.15 20)' : theme.colors.primary,
  letterSpacing: '0.02em',
  transition: `color ${theme.transitions.fast}`,
}))

const TimerDisplay = styled.div({
  fontFamily: theme.fonts.mono,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#2d2a26',
  letterSpacing: '0.05em',
})

// Submit section
const SubmitSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
  animation: `${fadeIn} 0.4s 0.3s ease both`,
  opacity: 0,
  animationFillMode: 'both',
})

const SendButton = styled.button<{ $disabled: boolean; $loading: boolean }>(
  ({ $disabled, $loading }) => ({
    width: '100%',
    padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
    borderRadius: '1.25rem',
    border: 'none',
    cursor: $disabled || $loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    backgroundColor:
      $disabled || $loading ? 'oklch(0.85 0.04 155)' : theme.colors.primary,
    color: '#fff',
    fontSize: '1.0625rem',
    fontWeight: 700,
    fontFamily: theme.fonts.sans,
    // Claymorphism
    boxShadow:
      $disabled || $loading
        ? 'none'
        : '0 6px 0 oklch(0.42 0.1 155), 0 10px 20px oklch(0.55 0.1 155 / 0.25)',
    transition: `all ${theme.transitions.fast}`,
    '&:active': {
      transform: 'translateY(3px)',
      boxShadow: '0 3px 0 oklch(0.42 0.1 155)',
    },
    '& svg': { width: '1.125rem', height: '1.125rem' },
  }),
)

const HintText = styled.p({
  textAlign: 'center',
  fontSize: '0.8125rem',
  color: '#9d9690',
  lineHeight: 1.5,
})

// ─── Mock session data ────────────────────────────────────────────────────────

const MOCK_SESSION = {
  studentName: 'Minh',
  parentName: 'Bố',
  relationship: 'bố',
  prompts: [
    'Bố kể cho con nghe về ngôi nhà thời thơ ấu của mình nhé?',
    'Bố nhớ gì về công việc đầu tiên của mình không?',
    'Kể con nghe kỷ niệm vui nhất thời trẻ của Bố đi?',
    'Bố và Mẹ gặp nhau lần đầu tiên ở đâu vậy?',
  ],
}

function fmtTimer(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type RecordState = 'idle' | 'recording' | 'recorded' | 'sending' | 'sent'

export default function ParentRecordPage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const token = params.token

  // In production: fetch session from /api/parent-sessions?token=<token>
  const session = MOCK_SESSION
  const promptIdx = 0 // In production: vary by session or let parent shuffle

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [timer, setTimer] = useState(0)
  const [promptI, setPromptI] = useState(promptIdx)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Recording timer
  useEffect(() => {
    if (recordState === 'recording') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [recordState])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUrl(URL.createObjectURL(file))
  }

  const toggleRecord = () => {
    if (recordState === 'idle') {
      setTimer(0)
      setRecordState('recording')
    } else if (recordState === 'recording') {
      setRecordState('recorded')
    }
  }

  const handleSend = async () => {
    if (recordState !== 'recorded' && recordState !== 'idle') return
    setRecordState('sending')
    // Simulate upload
    await new Promise((r) => setTimeout(r, 1800))
    setRecordState('sent')
    router.push(`/parent/${token}/done`)
  }

  const canSend =
    recordState === 'recorded' || (recordState === 'idle' && photoUrl)

  const waveCount = 20
  const waveActive = recordState === 'recording'

  return (
    <Page>
      {/* Greeting */}
      <Greeting>
        <RootsLogo>GỐC</RootsLogo>
        <StudentAvatar>👨‍🎓</StudentAvatar>
        <GreetingText>
          Chào <em>{session.parentName}</em>,<br />
          con đang lắng nghe đây!
        </GreetingText>
        <GreetingSubtext>
          {session.studentName} muốn lưu giữ câu chuyện của {session.parentName}{' '}
          mãi mãi.
        </GreetingSubtext>
      </Greeting>

      {/* Photo upload */}
      <PhotoSection>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        <PhotoFrame
          $hasPhoto={!!photoUrl}
          onClick={() => !photoUrl && fileRef.current?.click()}
        >
          {photoUrl ? (
            <>
              <PhotoPreview src={photoUrl} alt="Ảnh đã tải" />
              <PhotoOverlayActions>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    fileRef.current?.click()
                  }}
                >
                  <RefreshCw />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoUrl(null)
                  }}
                >
                  <X />
                </IconButton>
              </PhotoOverlayActions>
            </>
          ) : (
            <PhotoPrompt>
              <Camera />
              <PhotoPromptText>Chụp ảnh kỷ niệm (tuỳ chọn)</PhotoPromptText>
            </PhotoPrompt>
          )}
        </PhotoFrame>
      </PhotoSection>

      {/* Recording */}
      <RecordSection>
        <PromptCard>
          <PromptLabel>Câu hỏi gợi ý</PromptLabel>
          <PromptText>"{session.prompts[promptI]}"</PromptText>
        </PromptCard>

        {/* Waveform */}
        <Waveform>
          {Array.from({ length: waveCount }).map((_, i) => (
            <WaveBar key={i} $delay={i} $active={waveActive} />
          ))}
        </Waveform>

        {/* Timer */}
        {(recordState === 'recording' || recordState === 'recorded') && (
          <TimerDisplay>{fmtTimer(timer)}</TimerDisplay>
        )}

        {/* Claymorphism record button */}
        <RecordButtonWrapper>
          {recordState === 'recording' && (
            <>
              <RippleRing />
              <RippleRing2 />
            </>
          )}
          <RecordButton
            $recording={recordState === 'recording'}
            onClick={toggleRecord}
          >
            {recordState === 'recording' ? <Square /> : <Mic />}
          </RecordButton>
        </RecordButtonWrapper>

        <RecordLabel $recording={recordState === 'recording'}>
          {recordState === 'idle' && 'Nhấn để bắt đầu kể chuyện'}
          {recordState === 'recording' && 'Đang ghi... nhấn để dừng'}
          {recordState === 'recorded' &&
            `Đã ghi ${fmtTimer(timer)} — sẵn sàng gửi!`}
        </RecordLabel>
      </RecordSection>

      {/* Submit */}
      <SubmitSection>
        <SendButton
          $disabled={!canSend}
          $loading={recordState === 'sending'}
          onClick={handleSend}
          disabled={!canSend || recordState === 'sending'}
        >
          {recordState === 'sending' ? (
            <>
              <Loader2 style={{ animation: `${spin} 1s linear infinite` }} />
              Đang gửi sang {session.studentName}...
            </>
          ) : (
            <>
              <Send />
              Gửi cho {session.studentName}
            </>
          )}
        </SendButton>
        <HintText>
          Câu chuyện của {session.parentName} sẽ được giữ gìn mãi mãi trong Gốc
          của gia đình mình.
        </HintText>
      </SubmitSection>
    </Page>
  )
}
