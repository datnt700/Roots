'use client'

import { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Save,
  Image,
  X,
  ChevronDown,
  Check,
  Shuffle,
  Loader2,
} from 'lucide-react'
import { theme } from '@/lib/theme'
import { useI18n } from '@/components/i18n-provider'

// ─── Animations ───────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.08); opacity: 0.85; }
`

const waveAnim = keyframes`
  0%, 100% { height: 0.5rem; }
  50%       { height: 2.5rem; }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100dvh - 3.5rem)',
  backgroundColor: theme.colors.background,
})

const ScrollArea = styled.div({
  flex: 1,
  overflowY: 'auto',
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  paddingBottom: theme.spacing[4],
  maxWidth: '40rem',
  margin: '0 auto',
  width: '100%',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

const PageHeader = styled.div({
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.3s ease both`,
})

const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
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

// ─── Cards / Sections ─────────────────────────────────────────────────────────

const Card = styled.div({
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
})

const CardLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[3],
})

// ─── Parent selector ──────────────────────────────────────────────────────────

const SelectButton = styled.button({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  cursor: 'pointer',
  fontSize: '0.9375rem',
  color: theme.colors.foreground,
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
  },
  '& svg': {
    width: '1rem',
    height: '1rem',
    color: theme.colors.mutedForeground,
  },
})

// ─── Prompt card ──────────────────────────────────────────────────────────────

const PromptBox = styled.div({
  position: 'relative',
  backgroundColor: 'oklch(0.88 0.06 155 / 0.12)',
  border: `1.5px solid oklch(0.88 0.06 155 / 0.3)`,
  borderRadius: theme.radius.xl,
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
  marginBottom: theme.spacing[3],
})

const PromptText = styled.p({
  fontSize: '1rem',
  fontFamily: theme.fonts.serif,
  color: theme.colors.foreground,
  lineHeight: 1.6,
  fontStyle: 'italic',
})

const PromptActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  marginTop: theme.spacing[3],
})

const PromptAction = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.colors.primary,
  background: 'none',
  border: `1px solid oklch(0.88 0.06 155 / 0.4)`,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  cursor: 'pointer',
  '& svg': { width: '0.75rem', height: '0.75rem' },
})

// ─── Photo upload ─────────────────────────────────────────────────────────────

const PhotoUploadArea = styled.label({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing[2],
  height: '7rem',
  border: `2px dashed ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  },
  '& svg': { width: '1.5rem', height: '1.5rem' },
})

const PhotoPreviewWrapper = styled.div({
  position: 'relative',
  borderRadius: theme.radius.xl,
  overflow: 'hidden',
  height: '10rem',
})

const PhotoPreviewImg = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const RemovePhoto = styled.button({
  position: 'absolute',
  top: theme.spacing[2],
  right: theme.spacing[2],
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'rgba(0,0,0,0.5)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Recording controls ───────────────────────────────────────────────────────

const RecordingSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[6],
  padding: `${theme.spacing[6]} 0 ${theme.spacing[4]}`,
})

const RecordButton = styled.button<{ $recording: boolean }>(
  ({ $recording }) => ({
    width: '5rem',
    height: '5rem',
    borderRadius: theme.radius.full,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $recording ? '#dc2626' : theme.colors.primary,
    color: '#fff',
    boxShadow: $recording
      ? '0 0 0 0.5rem rgba(220, 38, 38, 0.2)'
      : `0 0 0 0.5rem oklch(0.88 0.06 155 / 0.2)`,
    animation: $recording ? `${pulse} 1.5s ease-in-out infinite` : 'none',
    transition: `background-color ${theme.transitions.fast}`,
    willChange: 'transform',
    transform: 'translateZ(0)',
    '& svg': { width: '1.75rem', height: '1.75rem' },
  }),
)

const RecordingTimer = styled.div({
  fontSize: '2rem',
  fontFamily: theme.fonts.mono,
  fontWeight: 600,
  color: theme.colors.foreground,
  letterSpacing: '0.05em',
})

const WaveformRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.2rem',
  height: '3rem',
})

const WaveBar = styled.div<{ $delay: number; $active: boolean }>(
  ({ $delay, $active }) => ({
    width: '0.2rem',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    opacity: $active ? 1 : 0.2,
    animation: $active
      ? `${waveAnim} ${0.8 + $delay * 0.1}s ease-in-out infinite`
      : 'none',
    height: '0.5rem',
    alignSelf: 'center',
    willChange: 'transform',
    transform: 'translateZ(0)',
  }),
)

// ─── Playback ─────────────────────────────────────────────────────────────────

const PlaybackBar = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
})

const PlaybackBtn = styled.button({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexShrink: 0,
  '& svg': { width: '1rem', height: '1rem' },
})

const ProgressTrack = styled.div({
  flex: 1,
  height: '0.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  position: 'relative',
  cursor: 'pointer',
})

const ProgressFill = styled.div<{ $pct: number }>(({ $pct }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: `${$pct}%`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  transition: 'width 0.1s linear',
}))

const PlaybackTime = styled.span({
  fontSize: '0.75rem',
  fontFamily: theme.fonts.mono,
  color: theme.colors.mutedForeground,
  flexShrink: 0,
})

// ─── Decade selector ─────────────────────────────────────────────────────────

const DecadeGrid = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[2],
})

const DecadeChip = styled.button<{ $selected: boolean }>(({ $selected }) => ({
  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.full,
  border: `1.5px solid ${$selected ? theme.colors.primary : theme.colors.border}`,
  backgroundColor: $selected ? 'oklch(0.88 0.06 155 / 0.15)' : 'transparent',
  color: $selected ? theme.colors.primary : theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  fontWeight: $selected ? 600 : 400,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
}))

// ─── Save button ──────────────────────────────────────────────────────────────

const SaveBtn = styled.button<{ $disabled: boolean }>(({ $disabled }) => ({
  width: '100%',
  padding: `${theme.spacing[4]}`,
  borderRadius: theme.radius.xl,
  backgroundColor: $disabled ? theme.colors.muted : theme.colors.primary,
  color: $disabled ? theme.colors.mutedForeground : '#fff',
  border: 'none',
  cursor: $disabled ? 'not-allowed' : 'pointer',
  fontSize: '1rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  transition: `all ${theme.transitions.fast}`,
  '& svg': { width: '1.125rem', height: '1.125rem' },
}))

const SecondaryBtn = styled.button({
  width: '100%',
  padding: `${theme.spacing[3]}`,
  borderRadius: theme.radius.xl,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  border: `1.5px solid ${theme.colors.border}`,
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  marginTop: theme.spacing[2],
  '& svg': { width: '1rem', height: '1rem' },
})

const SuccessBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: theme.spacing[4],
  backgroundColor: 'oklch(0.88 0.06 155 / 0.12)',
  border: `1px solid oklch(0.88 0.06 155 / 0.3)`,
  borderRadius: theme.radius.xl,
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
})

const SuccessIcon = styled.div({
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& svg': { width: '1rem', height: '1rem', color: '#fff' },
})

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PARENTS = [
  { id: '1', name: 'Bố Hùng' },
  { id: '2', name: 'Mẹ Lan' },
  { id: '3', name: 'Bà Nội' },
]

// Hardcoded user — replace with real session.user.id when auth is wired to UI
const MOCK_USER_ID = 'demo-user'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

async function uploadBlob(
  blob: Blob,
  folder: 'audio' | 'photo',
): Promise<string> {
  const form = new FormData()
  form.append('file', blob, folder === 'audio' ? 'recording.webm' : 'photo.jpg')
  form.append('folder', folder)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Upload failed')
  const { key } = await res.json()
  return key as string
}

// ─── Component ────────────────────────────────────────────────────────────────

type RecordState = 'idle' | 'recording' | 'recorded' | 'saved'

export default function RecordPage() {
  const { t } = useI18n()

  const [selectedParent, setSelectedParent] = useState(MOCK_PARENTS[0])
  const [promptIdx, setPromptIdx] = useState(0)
  const [usePrompt, setUsePrompt] = useState(true)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [decade, setDecade] = useState('unknown')
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [playback, setPlayback] = useState(false)
  const [playPct, setPlayPct] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string>('')

  // Real recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioBlobRef = useRef<Blob | null>(null)
  const audioElemRef = useRef<HTMLAudioElement | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const prompts = (t('record.prompts') as unknown as string[] | undefined) ?? []
  const DECADE_KEYS = [
    'unknown',
    'd1960s',
    'd1970s',
    'd1980s',
    'd1990s',
    'd2000s',
    'd2010s',
  ] as const

  // Recording timer
  useEffect(() => {
    if (recordState === 'recording') {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [recordState])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoUrl(URL.createObjectURL(file))
    }
  }

  const handleRecord = async () => {
    if (recordState === 'recording') {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setRecordState('recorded')
      return
    }

    // Start recording — request mic access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioBlobRef.current = blob
        // Wire up native audio element for playback
        if (audioElemRef.current) {
          audioElemRef.current.src = URL.createObjectURL(blob)
        }
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setElapsed(0)
      setPlayPct(0)
      setRecordState('recording')
    } catch {
      alert('Không thể truy cập mic. Vui lòng cho phép quyền microphone.')
    }
  }

  const handlePlayPause = () => {
    const audio = audioElemRef.current
    if (!audio) return
    if (playback) {
      audio.pause()
      setPlayback(false)
    } else {
      audio.play()
      setPlayback(true)
      audio.ontimeupdate = () => {
        if (audio.duration)
          setPlayPct((audio.currentTime / audio.duration) * 100)
      }
      audio.onended = () => {
        setPlayback(false)
        setPlayPct(0)
      }
    }
  }

  const handleRetake = () => {
    audioElemRef.current?.pause()
    audioBlobRef.current = null
    setElapsed(0)
    setPlayPct(0)
    setPlayback(false)
    setRecordState('idle')
  }

  const handleSave = async () => {
    if (!audioBlobRef.current) return
    setSaving(true)
    setSaveStatus('Đang tải lên...')

    try {
      // 1. Upload audio to S3
      const audioKey = await uploadBlob(audioBlobRef.current, 'audio')

      // 2. Upload photo (if any)
      let photoKey: string | undefined
      if (photoFile) {
        setSaveStatus('Đang tải ảnh...')
        photoKey = await uploadBlob(photoFile, 'photo')
      }

      // 3. Create memory record in DB
      setSaveStatus('Đang lưu ký ức...')
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: MOCK_USER_ID,
          parentId: selectedParent.id,
          prompt: usePrompt ? (prompts[promptIdx] ?? '') : '',
          decade,
          audioKey,
          photoKey,
        }),
      })

      if (!res.ok) throw new Error('Failed to save memory')
      const { id: memoryId } = await res.json()

      // 4. Kick off Whisper transcription (fire-and-forget — don't block UI)
      setSaveStatus('Đang phiên âm (nền)...')
      fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId }),
      }).catch(() => {
        /* silent — transcription can be retried from Studio */
      })

      setSaving(false)
      setRecordState('saved')
    } catch {
      setSaving(false)
      setSaveStatus('')
      alert('Lưu thất bại. Vui lòng thử lại.')
    }
  }

  const shufflePrompt = () => setPromptIdx((i) => (i + 1) % prompts.length)

  return (
    <Page>
      {/* Hidden native audio element for playback */}
      <audio ref={audioElemRef} style={{ display: 'none' }} />

      <ScrollArea>
        <PageHeader>
          <PageTitle>{t('record.title')}</PageTitle>
          <PageSubtitle>{t('record.subtitle')}</PageSubtitle>
        </PageHeader>

        {/* Saved success */}
        {recordState === 'saved' && (
          <SuccessBanner>
            <SuccessIcon>
              <Check />
            </SuccessIcon>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: theme.colors.foreground,
                }}
              >
                {t('record.saved')}
              </div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  color: theme.colors.mutedForeground,
                  marginTop: '0.125rem',
                }}
              >
                {t('studio.subtitle')}
              </div>
            </div>
          </SuccessBanner>
        )}

        {/* Parent selector */}
        <Card style={{ animationDelay: '0.05s' }}>
          <CardLabel>{t('record.selectParent')}</CardLabel>
          <SelectButton>
            <span>{selectedParent.name}</span>
            <ChevronDown />
          </SelectButton>
        </Card>

        {/* Prompt */}
        {usePrompt && (
          <Card style={{ animationDelay: '0.1s' }}>
            <CardLabel>{t('record.promptLabel')}</CardLabel>
            <PromptBox>
              <PromptText>"{prompts[promptIdx] ?? ''}"​</PromptText>
            </PromptBox>
            <PromptActions>
              <PromptAction onClick={shufflePrompt}>
                <Shuffle /> Shuffle
              </PromptAction>
              <PromptAction onClick={() => setUsePrompt(false)}>
                <X /> {t('record.skipPrompt')}
              </PromptAction>
            </PromptActions>
          </Card>
        )}

        {/* Recording */}
        <Card style={{ animationDelay: '0.15s' }}>
          <RecordingSection>
            {/* Waveform */}
            <WaveformRow>
              {Array.from({ length: 24 }).map((_, i) => (
                <WaveBar
                  key={i}
                  $delay={i % 8}
                  $active={recordState === 'recording'}
                />
              ))}
            </WaveformRow>

            {/* Timer */}
            <RecordingTimer>{fmtTime(elapsed)}</RecordingTimer>

            {/* Record button */}
            <RecordButton
              $recording={recordState === 'recording'}
              onClick={handleRecord}
              aria-label={
                recordState === 'recording'
                  ? t('record.stopRecording')
                  : t('record.startRecording')
              }
            >
              {recordState === 'recording' ? <Square /> : <Mic />}
            </RecordButton>
            <div
              style={{
                fontSize: '0.8125rem',
                color: theme.colors.mutedForeground,
              }}
            >
              {recordState === 'recording'
                ? t('record.recordingTime')
                : recordState === 'recorded'
                  ? t('record.playback')
                  : t('record.startRecording')}
            </div>
          </RecordingSection>

          {/* Playback controls */}
          {(recordState === 'recorded' || recordState === 'saved') && (
            <PlaybackBar>
              <PlaybackBtn onClick={handlePlayPause}>
                {playback ? <Pause /> : <Play />}
              </PlaybackBtn>
              <ProgressTrack>
                <ProgressFill $pct={playPct} />
              </ProgressTrack>
              <PlaybackTime>{fmtTime(elapsed)}</PlaybackTime>
            </PlaybackBar>
          )}
        </Card>

        {/* Photo upload */}
        <Card style={{ animationDelay: '0.2s' }}>
          <CardLabel>{t('record.uploadPhoto')}</CardLabel>
          {photoUrl ? (
            <PhotoPreviewWrapper>
              <PhotoPreviewImg src={photoUrl} alt={t('record.photoPreview')} />
              <RemovePhoto onClick={() => setPhotoUrl(null)}>
                <X />
              </RemovePhoto>
            </PhotoPreviewWrapper>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                id="photo-upload"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <PhotoUploadArea htmlFor="photo-upload">
                <Image />
                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  {t('record.uploadPhoto')}
                </span>
              </PhotoUploadArea>
            </>
          )}
        </Card>

        {/* Decade */}
        <Card style={{ animationDelay: '0.25s' }}>
          <CardLabel>{t('record.decade')}</CardLabel>
          <DecadeGrid>
            {DECADE_KEYS.map((key) => (
              <DecadeChip
                key={key}
                $selected={decade === key}
                onClick={() => setDecade(key)}
              >
                {t(`record.decadeOptions.${key}` as Parameters<typeof t>[0])}
              </DecadeChip>
            ))}
          </DecadeGrid>
        </Card>

        {/* Save */}
        <div style={{ paddingBottom: theme.spacing[4] }}>
          <SaveBtn
            $disabled={recordState !== 'recorded' || saving}
            onClick={handleSave}
            disabled={recordState !== 'recorded' || saving}
          >
            {saving ? (
              <Loader2
                style={{
                  animation: 'spin 1s linear infinite',
                  width: '1.125rem',
                  height: '1.125rem',
                }}
              />
            ) : (
              <Save />
            )}
            {saving ? saveStatus || t('record.saving') : t('record.saveMemory')}
          </SaveBtn>
          {(recordState === 'recorded' || recordState === 'recording') && (
            <SecondaryBtn onClick={handleRetake}>
              <RotateCcw />
              {t('record.retake')}
            </SecondaryBtn>
          )}
        </div>
      </ScrollArea>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Page>
  )
}
