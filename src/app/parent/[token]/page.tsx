'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Camera, X, Mic, Square, Loader2, Send, ChevronRight } from 'lucide-react'
import { theme } from '@/lib/theme'

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Phase =
  | 'loading'
  | 'error'
  | 'welcome'
  | 'greeting'
  | 'idle'
  | 'recording'
  | 'processing'
  | 'summary'
  | 'submitting'

type Turn = { role: 'ai' | 'parent'; text: string }

interface SessionData {
  parentId: string
  userId: string
  parentName: string
  studentName: string
  relationship: string
  locale: string
}

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function fmtTimer(sec: number) {
  return `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`
}

function getSupportedMimeType() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/mp4',
    'audio/webm',
    'audio/ogg',
  ]
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? ''
}

async function callDialogue(
  token: string,
  session: SessionData,
  turns: Turn[],
  audio?: Blob,
  photo?: File,
  photoDescription?: string,
): Promise<{ transcript?: string; aiMessage: string; isComplete: boolean; photoDescription?: string }> {
  const fd = new FormData()
  fd.append('token', token)
  fd.append('parentName', session.parentName)
  fd.append('studentName', session.studentName)
  fd.append('relationship', session.relationship)
  fd.append('turns', JSON.stringify(turns))
  if (audio) {
    const ext = audio.type.includes('mp4')
      ? 'mp4'
      : audio.type.includes('ogg')
        ? 'ogg'
        : 'webm'
    fd.append('audio', audio, `recording.${ext}`)
  }
  if (photo) fd.append('photo', photo, photo.name)
  if (photoDescription) fd.append('photoDescription', photoDescription)
  const res = await fetch('/api/dialogue', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Dialogue API error')
  return res.json()
}

async function playTTS(text: string): Promise<void> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    return new Promise<void>((resolve) => {
      const audio = new Audio(url)
      audio.onended = () => {
        URL.revokeObjectURL(url)
        resolve()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        resolve()
      }
      audio.play().catch(() => resolve())
    })
  } catch {
    // TTS is an enhancement â€” silent failure
  }
}

// â”€â”€â”€ Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const ripple = keyframes`
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(2.6); opacity: 0; }
`

const breathe = keyframes`
  0%, 100% { box-shadow: 0 8px 0 oklch(0.42 0.1 155), 0 14px 30px oklch(0.55 0.1 155 / 0.3); }
  50%       { box-shadow: 0 12px 0 oklch(0.42 0.1 155), 0 20px 40px oklch(0.55 0.1 155 / 0.4); }
`

const recordAnim = keyframes`
  0%, 100% { box-shadow: 0 6px 0 oklch(0.4 0.15 20), 0 12px 30px oklch(0.55 0.15 20 / 0.4); }
  50%       { box-shadow: 0 10px 0 oklch(0.4 0.15 20), 0 18px 40px oklch(0.55 0.15 20 / 0.5); }
`

const waveBar = keyframes`
  0%, 100% { transform: scaleY(0.25); }
  50%       { transform: scaleY(1); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(0.5rem) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

// â”€â”€â”€ Styled Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  backgroundColor: 'oklch(0.97 0.015 90)',
  overflowX: 'hidden',
})

// â”€â”€ Header â”€â”€

const TopBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
  borderBottom: '1px solid oklch(0.88 0.04 90)',
  backgroundColor: 'oklch(0.97 0.015 90)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
})

const Logo = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.colors.primary,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
})

const TurnBadge = styled.div({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'oklch(0.5 0.08 155)',
  backgroundColor: 'oklch(0.88 0.06 155 / 0.3)',
  padding: '0.25rem 0.75rem',
  borderRadius: theme.radius.full,
})

// â”€â”€ Chat â”€â”€

const ChatArea = styled.div({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: `${theme.spacing[5]} ${theme.spacing[4]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

const AiBubbleRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.spacing[2],
  animation: `${bubbleIn} 0.35s ease both`,
})

const ParentBubbleRow = styled.div({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'flex-end',
  gap: theme.spacing[2],
  animation: `${bubbleIn} 0.35s ease both`,
})

const BubbleAvatar = styled.div({
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.88 0.08 155)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  flexShrink: 0,
})

const AiBubble = styled.div({
  maxWidth: '80%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: '#fff',
  borderRadius: '0.25rem 1.25rem 1.25rem 1.25rem',
  boxShadow: '0 2px 12px oklch(0.55 0.1 155 / 0.1)',
  fontFamily: theme.fonts.serif,
  fontSize: '1.0625rem',
  color: '#2d2a26',
  lineHeight: 1.55,
  border: '1px solid oklch(0.88 0.06 155 / 0.3)',
})

const ParentBubble = styled.div({
  maxWidth: '80%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.88 0.08 155 / 0.2)',
  borderRadius: '1.25rem 0.25rem 1.25rem 1.25rem',
  fontSize: '0.9375rem',
  color: '#3d3a36',
  lineHeight: 1.55,
  fontStyle: 'italic',
  border: '1px solid oklch(0.7 0.1 155 / 0.2)',
})

// â”€â”€ Controls â”€â”€

const ControlArea = styled.div({
  padding: `${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[8]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[4],
  borderTop: '1px solid oklch(0.88 0.04 90)',
  backgroundColor: 'oklch(0.97 0.015 90)',
})

const Waveform = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  height: '2.5rem',
})

const WaveBar = styled('div', {
  shouldForwardProp: (prop) => prop !== '$i' && prop !== '$active',
})<{ $i: number; $active: boolean }>(({ $i, $active }) => ({
  width: '3px',
  height: '100%',
  borderRadius: '2px',
  backgroundColor: $active ? theme.colors.primary : 'oklch(0.55 0.1 155 / 0.2)',
  transformOrigin: 'center',
  animation: $active
    ? `${waveBar} ${0.55 + $i * 0.12}s ease-in-out infinite`
    : 'none',
  animationDelay: `${$i * 0.07}s`,
  transform: $active ? undefined : 'scaleY(0.25)',
  transition: 'background-color 0.3s',
  willChange: 'transform',
}))

const MicBtnWrap = styled.div({
  position: 'relative',
  width: '5.5rem',
  height: '5.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const RippleRing = styled.div({
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius.full,
  border: '2px solid oklch(0.55 0.15 20 / 0.4)',
  animation: `${ripple} 1.5s ease-out infinite`,
  pointerEvents: 'none',
})

const RippleRing2 = styled(RippleRing)({ animationDelay: '0.5s' })

const MicBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== '$recording',
})<{ $recording: boolean }>(({ $recording }) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius.full,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: $recording ? 'oklch(0.55 0.15 20)' : theme.colors.primary,
  boxShadow: $recording
    ? '0 6px 0 oklch(0.4 0.15 20), 0 12px 25px oklch(0.55 0.15 20 / 0.4)'
    : '0 8px 0 oklch(0.42 0.1 155), 0 14px 28px oklch(0.55 0.1 155 / 0.3)',
  animation: $recording
    ? `${recordAnim} 1.2s ease infinite`
    : `${breathe} 3s ease infinite`,
  '&:active': { transform: 'translateY(4px)', transition: 'transform 0.1s' },
  '& svg': { width: '2rem', height: '2rem', color: '#fff' },
}))

const StatusText = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'oklch(0.5 0.08 155)',
})

const TimerText = styled.div({
  fontFamily: theme.fonts.mono,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#2d2a26',
  letterSpacing: '0.05em',
})

const SendBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== '$loading',
})<{ $loading?: boolean }>(({ $loading }) => ({
  width: '100%',
  maxWidth: '20rem',
  padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
  borderRadius: '1.25rem',
  border: 'none',
  cursor: $loading ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  backgroundColor: theme.colors.primary,
  color: '#fff',
  fontSize: '1.0625rem',
  fontWeight: 700,
  fontFamily: theme.fonts.sans,
  boxShadow: '0 6px 0 oklch(0.42 0.1 155), 0 10px 20px oklch(0.55 0.1 155 / 0.25)',
  '& svg': { width: '1.125rem', height: '1.125rem' },
}))

const EndBtn = styled.button({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: 'oklch(0.55 0.06 155)',
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
})

// â”€â”€ Photo â”€â”€

const PhotoRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  alignSelf: 'flex-start',
})

const PhotoWrap = styled.div({ position: 'relative' })

const PhotoThumb = styled.img({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: theme.radius.lg,
  objectFit: 'cover',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
})

const PhotoBtn = styled.button({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: theme.radius.lg,
  border: '2px dashed oklch(0.55 0.1 155 / 0.4)',
  backgroundColor: 'oklch(0.88 0.06 155 / 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  cursor: 'pointer',
  color: theme.colors.primary,
  '& svg': { width: '1.25rem', height: '1.25rem', opacity: 0.7 },
})

const PhotoLabel = styled.span({
  fontSize: '0.5625rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'oklch(0.5 0.08 155)',
})

const RemovePhotoBtn = styled.button({
  position: 'absolute',
  top: '-0.375rem',
  right: '-0.375rem',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: theme.radius.full,
  border: 'none',
  backgroundColor: 'oklch(0.55 0.15 20)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '& svg': { width: '0.625rem', height: '0.625rem' },
})

// â”€â”€ Welcome screen â”€â”€

const WelcomeWrap = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  gap: theme.spacing[6],
  animation: `${fadeUp} 0.5s ease both`,
})

const WelcomeEmoji = styled.div({ fontSize: '4rem', lineHeight: 1 })

const WelcomeTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.75rem',
  fontWeight: 700,
  color: '#2d2a26',
  textAlign: 'center',
  lineHeight: 1.35,
  '& em': { fontStyle: 'normal', color: theme.colors.primary },
})

const WelcomeSubtitle = styled.p({
  fontSize: '0.9375rem',
  color: '#6b6560',
  textAlign: 'center',
  lineHeight: 1.65,
  maxWidth: '20rem',
})

const StartBtn = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
  borderRadius: '1.5rem',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: theme.colors.primary,
  color: '#fff',
  fontSize: '1.0625rem',
  fontWeight: 700,
  fontFamily: theme.fonts.sans,
  boxShadow: '0 8px 0 oklch(0.42 0.1 155), 0 14px 30px oklch(0.55 0.1 155 / 0.3)',
  animation: `${breathe} 3s ease infinite`,
  '& svg': { width: '1.125rem', height: '1.125rem' },
})

// â”€â”€ Loading / Error â”€â”€

const Center = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
  padding: theme.spacing[8],
})

const ErrorTitle = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  color: '#2d2a26',
  textAlign: 'center',
  lineHeight: 1.5,
})

const ErrorHint = styled.p({
  fontSize: '0.875rem',
  color: '#9d9690',
  textAlign: 'center',
})

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const WAVE_COUNT = 18

export default function ParentRecordPage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const token = params.token

  const [phase, setPhase] = useState<Phase>('loading')
  const [session, setSession] = useState<SessionData | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [timer, setTimer] = useState(0)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoDescription, setPhotoDescription] = useState<string | null>(null)
  const [flashError, setFlashError] = useState<string | null>(null)

  // Refs for values needed in async callbacks without stale closures
  const turnsRef = useRef<Turn[]>([])
  const sessionRef = useRef<SessionData | null>(null)
  const audioBlobsRef = useRef<Blob[]>([])
  const chunksRef = useRef<Blob[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const photoDescriptionRef = useRef<string | null>(null)

  // Keep refs in sync
  useEffect(() => { turnsRef.current = turns }, [turns])
  useEffect(() => { sessionRef.current = session }, [session])
  useEffect(() => { photoDescriptionRef.current = photoDescription }, [photoDescription])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns])

  // Recording timer
  useEffect(() => {
    if (phase === 'recording') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  // Fetch session on mount â†’ show welcome screen
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(
          `/api/parent-sessions?token=${encodeURIComponent(token)}`,
        )
        if (!res.ok) { setPhase('error'); return }
        const data: SessionData = await res.json()
        setSession(data)
        sessionRef.current = data
        setPhase('welcome')
      } catch {
        setPhase('error')
      }
    }
    fetchSession()
  }, [token])

  // "Báº¯t Ä‘áº§u" â€” unlocks audio context, fetches greeting, plays TTS
  const handleStart = useCallback(async () => {
    const sess = sessionRef.current
    if (!sess) return
    setPhase('greeting')
    try {
      const result = await callDialogue(token, sess, [], undefined, photoFile ?? undefined)
      const t: Turn = { role: 'ai', text: result.aiMessage }
      setTurns([t])
      turnsRef.current = [t]
      if (result.photoDescription) {
        setPhotoDescription(result.photoDescription)
        photoDescriptionRef.current = result.photoDescription
      }
    } catch {
      const fallback = `Dáº¡ chÃ o ${sess.parentName} áº¡! Con lÃ  trá»£ lÃ½ cá»§a ${sess.studentName}. BÃ¡c cÃ³ thá»ƒ ká»ƒ cho con nghe má»™t ká»· niá»‡m Ä‘Ã¡ng nhá»› khÃ´ng áº¡?`
      const t: Turn = { role: 'ai', text: fallback }
      setTurns([t])
      turnsRef.current = [t]
    }
    setPhase('idle')
  }, [token, photoFile])

  // Start MediaRecorder
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedMimeType()
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.start(200)
      mediaRecorderRef.current = mr
      setTimer(0)
      setFlashError(null)
      setPhase('recording')
    } catch {
      alert('Vui lÃ²ng cho phÃ©p truy cáº­p microphone vÃ  thá»­ láº¡i.')
    }
  }, [])

  // Stop recording â†’ Whisper â†’ GPT-4o â†’ TTS
  const stopAndProcess = useCallback(() => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return

    mr.onstop = async () => {
      mr.stream.getTracks().forEach((t) => t.stop())
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
      audioBlobsRef.current.push(blob)

      const sess = sessionRef.current!
      const current = turnsRef.current

      setPhase('processing')
      try {
        const { transcript, aiMessage, isComplete } = await callDialogue(
          token,
          sess,
          current,
          blob,
          undefined,
          photoDescriptionRef.current ?? undefined,
        )
        const next: Turn[] = [...current]
        if (transcript) next.push({ role: 'parent', text: transcript })
        next.push({ role: 'ai', text: aiMessage })
        setTurns(next)
        turnsRef.current = next

        setPhase(isComplete ? 'summary' : 'idle')
      } catch {
        setFlashError('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.')
        setPhase('idle')
      }
    }

    mr.stop()
  }, [token])

  // End conversation early (after â‰¥1 parent turn)
  const handleEndEarly = useCallback(async () => {
    const sess = sessionRef.current!
    const current = turnsRef.current
    const closing = `Dáº¡, cáº£m Æ¡n ${sess.parentName} ráº¥t nhiá»u áº¡! Nhá»¯ng cÃ¢u chuyá»‡n cá»§a ${sess.parentName} sáº½ Ä‘Æ°á»£c ${sess.studentName} trÃ¢n trá»ng mÃ£i mÃ£i. Con cáº£m Æ¡n bÃ¡c!`
    const next: Turn[] = [...current, { role: 'ai', text: closing }]
    setTurns(next)
    turnsRef.current = next
    setPhase('summary')
  }, [])

  // Submit â€” upload last audio blob + full dialogue â†’ create Memory
  const handleSubmit = useCallback(async () => {
    setPhase('submitting')
    setFlashError(null)
    try {
      const fd = new FormData()
      fd.append('token', token)
      fd.append('turns', JSON.stringify(turnsRef.current))
      const blobs = audioBlobsRef.current
      if (blobs.length > 0) {
        const last = blobs[blobs.length - 1]
        const ext = last.type.includes('mp4') ? 'mp4' : 'webm'
        fd.append('audio', last, `recording.${ext}`)
      }
      if (photoFile) fd.append('photo', photoFile, photoFile.name)
      await fetch('/api/parent-sessions/save', { method: 'POST', body: fd })
      router.push(`/parent/${token}/done`)
    } catch {
      setFlashError('Gửi không thành công. Vui lòng thử lại.')
      setPhase('summary')
    }
  }, [token, photoFile, router])

  // Photo picker
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoUrl(URL.createObjectURL(file))
  }

  const parentTurnCount = turns.filter((t) => t.role === 'parent').length
  const inConversation = ['idle', 'recording', 'processing', 'summary', 'submitting'].includes(phase)

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <Wrap>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoChange} />
      {/* Loading */}
      {phase === 'loading' && (
        <Center>
          <Loader2 style={{ width: '2.5rem', height: '2.5rem', color: theme.colors.primary, animation: `${spin} 1s linear infinite` }} />
          <StatusText>Äang káº¿t ná»‘i...</StatusText>
        </Center>
      )}

      {/* Error */}
      {phase === 'error' && (
        <Center>
          <span style={{ fontSize: '3rem' }}>ðŸ˜”</span>
          <ErrorTitle>MÃ£ QR khÃ´ng há»£p lá»‡<br />hoáº·c Ä‘Ã£ háº¿t háº¡n</ErrorTitle>
          <ErrorHint>Vui lÃ²ng xin mÃ£ QR má»›i tá»« ngÆ°á»i thÃ¢n.</ErrorHint>
        </Center>
      )}

      {/* Welcome */}
      {phase === 'welcome' && session && (
        <>
          <TopBar><Logo>Gá»C</Logo></TopBar>
          <WelcomeWrap>
            <WelcomeEmoji>ðŸŒ¿</WelcomeEmoji>
            <WelcomeTitle>
              ChÃ o <em>{session.parentName}</em>!
            </WelcomeTitle>
            <WelcomeSubtitle>
              {session.studentName} muá»‘n lÆ°u giá»¯ tiáº¿ng nÃ³i vÃ  cÃ¢u chuyá»‡n cá»§a{' '}
              {session.relationship} Ä‘á»ƒ cÃ³ thá»ƒ nghe láº¡i mÃ£i mÃ£i.
              <br /><br />
              Con sáº½ trÃ² chuyá»‡n cÃ¹ng {session.parentName} â€” cá»© tá»± nhiÃªn nhÆ° Ä‘ang gá»i Ä‘iá»‡n nhÃ©!
            </WelcomeSubtitle>
            {/* Optional photo — analyzed by AI Vision on greeting */}
            <PhotoRow style={{ justifyContent: 'center', marginBottom: theme.spacing[4] }}>
              {photoUrl ? (
                <PhotoWrap>
                  <PhotoThumb src={photoUrl} alt="Ảnh" />
                  <RemovePhotoBtn onClick={() => { setPhotoUrl(null); setPhotoFile(null) }}>
                    <X />
                  </RemovePhotoBtn>
                </PhotoWrap>
              ) : (
                <PhotoBtn onClick={() => fileRef.current?.click()}>
                  <Camera />
                  <PhotoLabel>Thêm ảnh (không bắt buộc)</PhotoLabel>
                </PhotoBtn>
              )}
            </PhotoRow>
            <StartBtn onClick={handleStart}>
              Báº¯t Ä‘áº§u <ChevronRight />
            </StartBtn>
          </WelcomeWrap>
        </>
      )}

      {/* Greeting: fetching first AI message */}
      {phase === 'greeting' && (
        <>
          <TopBar><Logo>Gá»C</Logo></TopBar>
          <Center>
            <Loader2 style={{ width: '2rem', height: '2rem', color: theme.colors.primary, animation: `${spin} 1s linear infinite` }} />
            <StatusText>Äang chuáº©n bá»‹...</StatusText>
          </Center>
        </>
      )}

      {/* Conversation */}
      {inConversation && session && (
        <>
          <TopBar>
            <Logo>Gá»C</Logo>
            {parentTurnCount > 0 && <TurnBadge>LÆ°á»£t {parentTurnCount}</TurnBadge>}
          </TopBar>

          <ChatArea>
            {turns.map((turn, i) =>
              turn.role === 'ai' ? (
                <AiBubbleRow key={i}>
                  <BubbleAvatar>ðŸŒ¿</BubbleAvatar>
                  <AiBubble>{turn.text}</AiBubble>
                </AiBubbleRow>
              ) : (
                <ParentBubbleRow key={i}>
                  <ParentBubble>ðŸŽ™ {turn.text || '[ÄÃ£ ghi Ã¢m]'}</ParentBubble>
                </ParentBubbleRow>
              ),
            )}

            {phase === 'processing' && (
              <AiBubbleRow>
                <BubbleAvatar>ðŸŒ¿</BubbleAvatar>
                <AiBubble style={{ color: 'oklch(0.6 0.06 155)' }}>
                  <Loader2 style={{ width: '1rem', height: '1rem', animation: `${spin} 1s linear infinite`, verticalAlign: 'middle' }} />{' '}
                  Äang suy nghÄ©...
                </AiBubble>
              </AiBubbleRow>
            )}

            <div ref={chatEndRef} />
          </ChatArea>

          <ControlArea>
            {/* Error flash */}
            {flashError && (
              <StatusText style={{ color: 'oklch(0.52 0.16 25)', fontSize: '0.8125rem', marginBottom: theme.spacing[2] }}>
                ⚠️ {flashError}
              </StatusText>
            )}
            {(phase === 'idle' || phase === 'summary') && (
              <>
                <PhotoRow>
                  {photoUrl ? (
                    <PhotoWrap>
                      <PhotoThumb src={photoUrl} alt="áº¢nh" />
                      <RemovePhotoBtn onClick={() => { setPhotoUrl(null); setPhotoFile(null) }}>
                        <X />
                      </RemovePhotoBtn>
                    </PhotoWrap>
                  ) : (
                    <PhotoBtn onClick={() => fileRef.current?.click()}>
                      <Camera />
                      <PhotoLabel>áº¢nh</PhotoLabel>
                    </PhotoBtn>
                  )}
                </PhotoRow>
              </>
            )}

            {/* AI speaking (disabled — text-only mode) */}
            {false && (
              <>
                <Waveform>
                  {Array.from({ length: WAVE_COUNT }).map((_, i) => (
                    <WaveBar key={i} $i={i} $active={true} />
                  ))}
                </Waveform>
                <StatusText>Äang nÃ³i...</StatusText>
              </>
            )}

            {/* Idle: mic button */}
            {phase === 'idle' && (
              <>
                <MicBtnWrap>
                  <MicBtn $recording={false} onClick={startRecording}>
                    <Mic />
                  </MicBtn>
                </MicBtnWrap>
                <StatusText>Nháº¥n Ä‘á»ƒ tráº£ lá»i</StatusText>
                {parentTurnCount >= 1 && (
                  <EndBtn onClick={handleEndEarly}>Káº¿t thÃºc sá»›m</EndBtn>
                )}
              </>
            )}

            {/* Recording */}
            {phase === 'recording' && (
              <>
                <Waveform>
                  {Array.from({ length: WAVE_COUNT }).map((_, i) => (
                    <WaveBar key={i} $i={i} $active={true} />
                  ))}
                </Waveform>
                <TimerText>{fmtTimer(timer)}</TimerText>
                <MicBtnWrap>
                  <RippleRing />
                  <RippleRing2 />
                  <MicBtn $recording={true} onClick={stopAndProcess}>
                    <Square />
                  </MicBtn>
                </MicBtnWrap>
                <StatusText>Äang ghi... nháº¥n Ä‘á»ƒ dá»«ng</StatusText>
              </>
            )}

            {/* Processing */}
            {phase === 'processing' && (
              <StatusText>
                <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: `${spin} 1s linear infinite`, verticalAlign: 'middle' }} />{' '}
                Äang suy nghÄ©...
              </StatusText>
            )}

            {/* Summary / Submitting */}
            {(phase === 'summary' || phase === 'submitting') && (
              <SendBtn
                $loading={phase === 'submitting'}
                onClick={handleSubmit}
                disabled={phase === 'submitting'}
              >
                {phase === 'submitting' ? (
                  <><Loader2 style={{ animation: `${spin} 1s linear infinite` }} /> Äang gá»­i...</>
                ) : (
                  <><Send /> Gá»­i cho {session.studentName}</>
                )}
              </SendBtn>
            )}
          </ControlArea>
        </>
      )}
    </Wrap>
  )
}
