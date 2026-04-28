'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  spin,
  Wrap, TopBar, Logo, TurnBadge, HelpBtn,
  ChatArea, AiBubbleRow, ParentBubbleRow, BubbleAvatar, AiBubble, ParentBubble,
  ControlArea, Waveform, WaveBar, MicBtnWrap, RippleRing, RippleRing2, MicBtn,
  StatusText, TimerText, SendBtn, EndBtn,
  OfflineBanner, RetryBtn,
  PhotoRow, PhotoWrap, PhotoThumb, PhotoBtn, PhotoLabel, RemovePhotoBtn,
  WelcomeWrap, WelcomeEmoji, WelcomeTitle, WelcomeSubtitle, StartBtn,
  Center, ErrorTitle, ErrorHint,
} from './page.styles'
import {
  Camera,
  X,
  Mic,
  Square,
  Loader2,
  Send,
  ChevronRight,
  WifiOff,
  Phone,
  RefreshCw,
} from 'lucide-react'
import { theme } from '@/lib/theme'
import {
  savePendingRecording,
  loadPendingRecording,
  deletePendingRecording,
} from '@/lib/recording-cache'

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
  slotId: string
  parentId: string
  userId: string
  parentName: string
  studentName: string
  relationship: string
  locale: string
  prompt: string
  pageNumber: number
}

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function fmtTimer(sec: number) {
  return `${Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`
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
): Promise<{
  transcript?: string
  aiMessage: string
  isComplete: boolean
  photoDescription?: string
}> {
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



// â”€â”€â”€ Styled Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€



// â”€â”€ Header â”€â”€







// â”€â”€ Chat â”€â”€













// â”€â”€ Controls â”€â”€

























// â”€â”€ Photo â”€â”€











// â”€â”€ Welcome screen â”€â”€









// â”€â”€ Loading / Error â”€â”€







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
  const [isOffline, setIsOffline] = useState(false)
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null)
  const [pendingTurns, setPendingTurns] = useState<Turn[] | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [helpSent, setHelpSent] = useState(false)

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
  useEffect(() => {
    turnsRef.current = turns
  }, [turns])
  useEffect(() => {
    sessionRef.current = session
  }, [session])
  useEffect(() => {
    photoDescriptionRef.current = photoDescription
  }, [photoDescription])

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  // Online / offline detection
  useEffect(() => {
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    setIsOffline(!navigator.onLine)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

    // Retry a failed recording
  const handleRetry = useCallback(async () => {
    if (!pendingBlob || !pendingTurns || !sessionRef.current) return
    setRetrying(true)
    setFlashError(null)
    const sess = sessionRef.current
    const current = pendingTurns
    try {
      const { transcript, aiMessage, isComplete } = await callDialogue(
        token,
        sess,
        current,
        pendingBlob,
        undefined,
        photoDescriptionRef.current ?? undefined,
      )
      deletePendingRecording(token).catch(() => {})
      setPendingBlob(null)
      setPendingTurns(null)
      const next: Turn[] = [...current]
      if (transcript) next.push({ role: 'parent', text: transcript })
      next.push({ role: 'ai', text: aiMessage })
      setTurns(next)
      turnsRef.current = next
      setPhase(isComplete ? 'summary' : 'idle')
    } catch {
      setFlashError('Van chua gui duoc. Kiem tra mang va thu lai.')
    } finally {
      setRetrying(false)
    }
  }, [pendingBlob, pendingTurns, token])

  // Auto-retry on reconnect when there is a pending recording
  useEffect(() => {
    if (!isOffline && pendingBlob && pendingTurns && !retrying) {
      handleRetry()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline])

  // On mount: check IndexedDB for a recording left from a previous session
  useEffect(() => {
    loadPendingRecording(token).then((cached) => {
      if (cached) {
        const blob = new Blob([cached.blob], { type: cached.mimeType })
        setPendingBlob(blob)
        // turns context is lost across page refresh — user must retry manually
        setFlashError('Phát hiện ghi âm chưa gửi. Nhấn Thử lại để gửi.')
      }
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch slot on mount → show welcome screen
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/slots?token=${encodeURIComponent(token)}`)
        if (!res.ok) {
          setPhase('error')
          return
        }
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
  const handleHelp = async () => {
    if (helpSent) return
    try {
      await fetch('/api/help-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch {
      // Silent failure â€” the button still shows as sent
    }
    setHelpSent(true)
  }
  const handleStart = useCallback(async () => {
    const sess = sessionRef.current
    if (!sess) return
    setPhase('greeting')
    try {
      const result = await callDialogue(
        token,
        sess,
        [],
        undefined,
        photoFile ?? undefined,
      )
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
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
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
      const blob = new Blob(chunksRef.current, {
        type: mr.mimeType || 'audio/webm',
      })
      audioBlobsRef.current.push(blob)

      const sess = sessionRef.current!
      const current = turnsRef.current

      // Save to IndexedDB immediately — before network call
      savePendingRecording({
        id: token,
        blob,
        mimeType: blob.type,
        savedAt: Date.now(),
      }).catch(() => {})

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
        // Upload succeeded — clear the cache
        deletePendingRecording(token).catch(() => {})
        setPendingBlob(null)
        setPendingTurns(null)

        const next: Turn[] = [...current]
        if (transcript) next.push({ role: 'parent', text: transcript })
        next.push({ role: 'ai', text: aiMessage })
        setTurns(next)
        turnsRef.current = next

        setPhase(isComplete ? 'summary' : 'idle')
      } catch {
        // Keep blob for retry
        setPendingBlob(blob)
        setPendingTurns(current)
        setFlashError(
          isOffline
            ? 'Mất kết nối. Ghi âm đã được lưu — sẽ tự động gửi khi có mạng.'
            : 'Gửi không thành công. Nhấn Thử lại.'
        )
      }
    }
    mr.stop()
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
      await fetch('/api/slots/save', { method: 'POST', body: fd })
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
  const inConversation = [
    'idle',
    'recording',
    'processing',
    'summary',
    'submitting',
  ].includes(phase)

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <Wrap>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />
      {/* Loading */}
      {phase === 'loading' && (
        <Center>
          <Loader2
            style={{
              width: '2.5rem',
              height: '2.5rem',
              color: theme.colors.primary,
              animation: `${spin} 1s linear infinite`,
            }}
          />
          <StatusText>Äang káº¿t ná»‘i...</StatusText>
        </Center>
      )}

      {/* Error */}
      {phase === 'error' && (
        <Center>
          <span style={{ fontSize: '3rem' }}>ðŸ˜”</span>
          <ErrorTitle>
            MÃ£ QR khÃ´ng há»£p lá»‡
            <br />
            hoáº·c Ä‘Ã£ háº¿t háº¡n
          </ErrorTitle>
          <ErrorHint>Vui lÃ²ng xin mÃ£ QR má»›i tá»« ngÆ°á»i thÃ¢n.</ErrorHint>
        </Center>
      )}

      {/* Welcome */}
      {phase === 'welcome' && session && (
        <>
          <TopBar>
            <Logo>Gá»C</Logo>
          </TopBar>
          <WelcomeWrap>
            <WelcomeEmoji>ðŸŒ¿</WelcomeEmoji>
            <WelcomeTitle>
              ChÃ o <em>{session.parentName}</em>!
            </WelcomeTitle>
            <WelcomeSubtitle>
              {session.studentName} muá»‘n lÆ°u giá»¯ tiáº¿ng nÃ³i vÃ  cÃ¢u
              chuyá»‡n cá»§a {session.relationship} Ä‘á»ƒ cÃ³ thá»ƒ nghe láº¡i
              mÃ£i mÃ£i.
              <br />
              <br />
              Con sáº½ trÃ² chuyá»‡n cÃ¹ng {session.parentName} â€” cá»© tá»±
              nhiÃªn nhÆ° Ä‘ang gá»i Ä‘iá»‡n nhÃ©!
            </WelcomeSubtitle>
            {/* Optional photo — analyzed by AI Vision on greeting */}
            <PhotoRow
              style={{
                justifyContent: 'center',
                marginBottom: theme.spacing[4],
              }}
            >
              {photoUrl ? (
                <PhotoWrap>
                  <PhotoThumb src={photoUrl} alt="Ảnh" />
                  <RemovePhotoBtn
                    onClick={() => {
                      setPhotoUrl(null)
                      setPhotoFile(null)
                    }}
                  >
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
            <StartBtn onClick={handleStart} aria-label="Bắt đầu chia sẻ ký ức">
              Bắt đầu <ChevronRight />
            </StartBtn>
          </WelcomeWrap>
        </>
      )}

      {/* Greeting: fetching first AI message */}
      {phase === 'greeting' && (
        <>
          <TopBar>
            <Logo>Gá»C</Logo>
          </TopBar>
          <Center>
            <Loader2
              style={{
                width: '2rem',
                height: '2rem',
                color: theme.colors.primary,
                animation: `${spin} 1s linear infinite`,
              }}
            />
            <StatusText>Äang chuáº©n bá»‹...</StatusText>
          </Center>
        </>
      )}

      {/* Conversation */}
      {inConversation && session && (
        <>
          <TopBar>
            <Logo>Gá»C</Logo>
            {parentTurnCount > 0 && (
              <TurnBadge>LÆ°á»£t {parentTurnCount}</TurnBadge>
            )}
            <HelpBtn
              $sent={helpSent}
              onClick={handleHelp}
              aria-label={helpSent ? 'Đã nhắn con đến hỗ trợ' : 'Nhắn con đến giúp bạn'}
            >
              <Phone size={14} />
              {helpSent ? 'Đã gửi' : 'Gọi cho con'}
            </HelpBtn>
          </TopBar>

          {/* Offline / pending-retry banner */}
          {(isOffline || pendingBlob) && (
            <OfflineBanner>
              <WifiOff size={16} />
              {isOffline
                ? 'Mất kết nối — ghi âm sẽ được lưu và gửi khi có mạng'
                : 'Ghi âm chưa gửi — nhấn Thử lại khi có mạng'}
              {pendingBlob && pendingTurns && !isOffline && (
                <RetryBtn onClick={handleRetry} disabled={retrying}>
                  <RefreshCw size={14} />
                  {retrying ? 'Đang gửi…' : 'Thử lại'}
                </RetryBtn>
              )}
            </OfflineBanner>
          )}

          <ChatArea>
            {turns.map((turn, i) =>
              turn.role === 'ai' ? (
                <AiBubbleRow key={i}>
                  <BubbleAvatar>ðŸŒ¿</BubbleAvatar>
                  <AiBubble>{turn.text}</AiBubble>
                </AiBubbleRow>
              ) : (
                <ParentBubbleRow key={i}>
                  <ParentBubble>
                    ðŸŽ™ {turn.text || '[ÄÃ£ ghi Ã¢m]'}
                  </ParentBubble>
                </ParentBubbleRow>
              ),
            )}

            {phase === 'processing' && (
              <AiBubbleRow>
                <BubbleAvatar>ðŸŒ¿</BubbleAvatar>
                <AiBubble style={{ color: 'oklch(0.6 0.06 155)' }}>
                  <Loader2
                    style={{
                      width: '1rem',
                      height: '1rem',
                      animation: `${spin} 1s linear infinite`,
                      verticalAlign: 'middle',
                    }}
                  />{' '}
                  Äang suy nghÄ©...
                </AiBubble>
              </AiBubbleRow>
            )}

            <div ref={chatEndRef} />
          </ChatArea>

          <ControlArea>
            {/* Error flash */}
            {flashError && (
              <StatusText
                style={{
                  color: 'oklch(0.52 0.16 25)',
                  fontSize: '0.8125rem',
                  marginBottom: theme.spacing[2],
                }}
              >
                ⚠️ {flashError}
              </StatusText>
            )}
            {(phase === 'idle' || phase === 'summary') && (
              <>
                <PhotoRow>
                  {photoUrl ? (
                    <PhotoWrap>
                      <PhotoThumb src={photoUrl} alt="áº¢nh" />
                      <RemovePhotoBtn
                        onClick={() => {
                          setPhotoUrl(null)
                          setPhotoFile(null)
                        }}
                      >
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
                  <MicBtn
                    $recording={false}
                    onClick={startRecording}
                    aria-label="Nhấn để bắt đầu ghi âm"
                  >
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
                  <MicBtn
                    $recording={true}
                    onClick={stopAndProcess}
                    aria-label="Nhấn để dừng ghi âm"
                  >
                    <Square />
                  </MicBtn>
                </MicBtnWrap>
                <StatusText>Äang ghi... nháº¥n Ä‘á»ƒ dá»«ng</StatusText>
              </>
            )}

            {/* Processing */}
            {phase === 'processing' && (
              <StatusText>
                <Loader2
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    animation: `${spin} 1s linear infinite`,
                    verticalAlign: 'middle',
                  }}
                />{' '}
                Äang suy nghÄ©...
              </StatusText>
            )}

            {/* Summary / Submitting */}
            {(phase === 'summary' || phase === 'submitting') && (
              <SendBtn
                $loading={phase === 'submitting'}
                onClick={handleSubmit}
                disabled={phase === 'submitting'}
                aria-label={phase === 'submitting' ? 'Đang gửi ký ức...' : `Gửi ký ức cho ${session.studentName}`}
              >
                {phase === 'submitting' ? (
                  <>
                    <Loader2
                      style={{ animation: `${spin} 1s linear infinite` }}
                    />{' '}
                    Äang gá»­i...
                  </>
                ) : (
                  <>
                    <Send /> Gá»­i cho {session.studentName}
                  </>
                )}
              </SendBtn>
            )}
          </ControlArea>
        </>
      )}
    </Wrap>
  )
}