'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Mic, Square, Play, Pause, RotateCcw, Save, Image, X,
  ChevronDown, Check, RefreshCw, Loader2, Lock,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUserId } from '@/hooks/use-user-id'
import { savePendingRecording, loadPendingRecording, deletePendingRecording } from '@/lib/recording-cache'
import {
  Page, ScrollArea, PageHeader, PageTitle, PageSubtitle,
  Card, CardLabel,
  ParentDropdown, ParentOption, SelectButton,
  PromptInputField, SuggestionRow, SuggestionChip, SuggestionMoreBtn,
  PhotoUploadArea, PhotoPreviewWrapper, PhotoPreviewImg, RemovePhoto,
  RecordingSection, RecordControls, RecordButton, PauseResumeBtn,
  RecordingTimer, WaveformRow, WaveBar,
  PlaybackBar, PlaybackBtn, ProgressTrack, ProgressFill, PlaybackTime,
  DecadeGrid, DecadeChip,
  TitleInput, ReflectionTextarea, ReflectionHint,
  SaveBtn, SecondaryBtn, SuccessBanner, SuccessIcon,
  SuccessTitle, SuccessSubtitle, HiddenAudio, HiddenFileInput, PhotoUploadLabel,
  ParentRelationshipHint, RecordStatus, SaveSection, SpinnerIcon, SkeletonInput,
  DraftBanner,
} from './page.styles'

// ─── Animations ───────────────────────────────────────────────────────────────



// ─── Layout ───────────────────────────────────────────────────────────────────



// ─── Cards / Sections ─────────────────────────────────────────────────────────



// ─── Parent selector ──────────────────────────────────────────────────────────



// ─── Prompt card ──────────────────────────────────────────────────────────────



// ─── Photo upload ─────────────────────────────────────────────────────────────



// ─── Recording controls ───────────────────────────────────────────────────────









// ─── Playback ─────────────────────────────────────────────────────────────────







// ─── Decade selector ─────────────────────────────────────────────────────────



// ─── Constants ────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'student-draft'

const DECADE_KEYS = [
  'unknown', 'd1960s', 'd1970s', 'd1980s', 'd1990s', 'd2000s', 'd2010s',
] as const

type Parent = { id: string; name: string; relationship: string }

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
  const t = useTranslations('record')
  const userId = useUserId()

  const searchParams = useSearchParams()
  const [parents, setParents] = useState<Parent[]>([])
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [parentOpen, setParentOpen] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [suggestionOffset, setSuggestionOffset] = useState(0)
  const [memoryTitle, setMemoryTitle] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [decade, setDecade] = useState('unknown')
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [playback, setPlayback] = useState(false)
  const [playPct, setPlayPct] = useState(0)
  const [reflection, setReflection] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string>('')
  const [draftRestored, setDraftRestored] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioBlobRef = useRef<Blob | null>(null)
  const audioElemRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const prompts = Array.from({ length: 8 }, (_, i) => t(`prompts.${i}` as Parameters<typeof t>[0]))

  // Restore draft from IndexedDB on mount
  useEffect(() => {
    void (async () => {
      try {
        const draft = await loadPendingRecording(DRAFT_KEY)
        if (!draft) return
        audioBlobRef.current = draft.blob
        if (audioElemRef.current) {
          audioElemRef.current.src = URL.createObjectURL(draft.blob)
        }
        setRecordState('recorded')
        setDraftRestored(true)
      } catch { /* silent */ }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch parents + apply URL params
  useEffect(() => {
    const urlParentId = searchParams.get('parentId')
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt) setPromptText(decodeURIComponent(urlPrompt))
    fetch(`/api/parents?userId=${userId ?? ''}`)
      .then((r) => r.json())
      .then((data) => {
        const list: Parent[] = data.parents ?? []
        setParents(list)
        const pre = urlParentId ? list.find((p) => p.id === urlParentId) : list[0]
        if (pre) setSelectedParent(pre)
      })
      .catch(() => {})
  }, [searchParams])

  // Timer — only ticks when recording AND not paused
  useEffect(() => {
    if (recordState === 'recording' && !paused) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [recordState, paused])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoUrl(URL.createObjectURL(file))
    }
  }

  const handleRecord = async () => {
    if (recordState === 'recording') {
      mediaRecorderRef.current?.stop()
      setPaused(false)
      setRecordState('recorded')
      return
    }

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
        if (audioElemRef.current) {
          audioElemRef.current.src = URL.createObjectURL(blob)
        }
        stream.getTracks().forEach((t) => t.stop())
        // Auto-save draft so browser-close doesn't lose the recording
        savePendingRecording({ id: DRAFT_KEY, blob, mimeType: 'audio/webm', savedAt: Date.now() }).catch(() => {})
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setElapsed(0)
      setPlayPct(0)
      setRecordState('recording')
    } catch {
      alert(t('micPermission'))
    }
  }

  const handlePauseResume = () => {
    const rec = mediaRecorderRef.current
    if (!rec) return
    if (paused) {
      rec.resume()
      setPaused(false)
    } else {
      rec.pause()
      setPaused(true)
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
    setPaused(false)
    setDraftRestored(false)
    setRecordState('idle')
    deletePendingRecording(DRAFT_KEY).catch(() => {})
  }

  const handleSave = async () => {
    if (!audioBlobRef.current || !selectedParent) return
    setSaving(true)
    setSaveStatus(t('savingUploading'))
    try {
      // 1. Upload audio
      const audioKey = await uploadBlob(audioBlobRef.current, 'audio')

      // 2. Upload photo (if any)
      let photoKey: string | undefined
      if (photoFile) {
        setSaveStatus(t('savingPhoto'))
        photoKey = await uploadBlob(photoFile, 'photo')
      }

      // 3. Create memory record
      setSaveStatus(t('savingMemory'))
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId ?? '',
          parentId: selectedParent.id,
          prompt: promptText,
          decade,
          audioKey,
          photoKey,
        }),
      })
      if (!res.ok) throw new Error('Failed to save memory')
      const { id: memoryId } = await res.json()

      // 4. Save private reflection (encrypted server-side)
      if (reflection.trim()) {
        setSaveStatus(t('savingReflection'))
        await fetch('/api/reflections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memoryId, content: reflection }),
        }).catch(() => { /* silent */ })
      }

      // 5. Kick off Whisper (fire-and-forget)
      setSaveStatus(t('savingTranscribing'))
      fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, titleHint: memoryTitle || undefined }),
      }).catch(() => {})

      // 6. Clear IndexedDB draft
      deletePendingRecording(DRAFT_KEY).catch(() => {})

      setSaving(false)
      setRecordState('saved')
    } catch {
      setSaving(false)
      setSaveStatus('')
      alert(t('saveFailed'))
    }
  }

  const suggestions = [0, 1, 2].map((i) => prompts[(suggestionOffset + i) % prompts.length] ?? '')
  const rotateSuggestions = () => setSuggestionOffset((o) => (o + 3) % prompts.length)
  const dynamicTitle = selectedParent
    ? t('recordingFor', { name: selectedParent.name })
    : t('title')

  return (
    <Page>
      {/* Hidden native audio element for playback */}
      <HiddenAudio ref={audioElemRef} />

      <ScrollArea>
        <PageHeader>
          <PageTitle>{dynamicTitle}</PageTitle>
          <PageSubtitle>{t('subtitle')}</PageSubtitle>
        </PageHeader>

        {/* Draft restored notice */}
        {draftRestored && (
          <DraftBanner>
            <Check />
            {t('draftRestored')}
          </DraftBanner>
        )}

        {/* Saved success */}
        {recordState === 'saved' && (
          <SuccessBanner>
            <SuccessIcon>
              <Check />
            </SuccessIcon>
            <div>
              <SuccessTitle>
                {t('saved')}
              </SuccessTitle>
              <SuccessSubtitle>
                {t('savedSubtitle')}
              </SuccessSubtitle>
            </div>
          </SuccessBanner>
        )}

        {/* Parent selector */}
        <Card style={{ animationDelay: '0.05s' }}>
          <CardLabel>{t('selectParent')}</CardLabel>
          {parents.length === 0 ? (
            <SkeletonInput className="skeleton" />
          ) : (
            <>
              <SelectButton onClick={() => setParentOpen((o) => !o)}>
                <span>{selectedParent?.name ?? t('selectParentPlaceholder')}</span>
                <ChevronDown />
              </SelectButton>
              {parentOpen && (
                <ParentDropdown>
                  {parents.map((p) => (
                    <ParentOption
                      key={p.id}
                      $selected={selectedParent?.id === p.id}
                      onClick={() => {
                        setSelectedParent(p)
                        setParentOpen(false)
                      }}
                    >
                      <span>{p.name}</span>
                      <ParentRelationshipHint>
                        {p.relationship}
                      </ParentRelationshipHint>
                    </ParentOption>
                  ))}
                </ParentDropdown>
              )}
            </>
          )}
        </Card>

        {/* Quick Title */}
        <Card style={{ animationDelay: '0.08s' }}>
          <CardLabel>{t('quickTitle')}</CardLabel>
          <TitleInput
            type="text"
            value={memoryTitle}
            onChange={(e) => setMemoryTitle(e.target.value)}
            placeholder={t('quickTitlePlaceholder')}
          />
        </Card>

        {/* Prompt */}
        <Card style={{ animationDelay: '0.1s' }}>
          <CardLabel>{t('promptLabel')}</CardLabel>
          <PromptInputField
            rows={2}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={t('promptPlaceholder')}
          />
          <SuggestionRow>
            {suggestions.map((s) => (
              <SuggestionChip
                key={s}
                $active={promptText === s}
                onClick={() => setPromptText((cur) => cur === s ? '' : s)}
              >
                {s}
              </SuggestionChip>
            ))}
            <SuggestionMoreBtn onClick={rotateSuggestions} title={t('moreSuggestions')}>
              <RefreshCw />
            </SuggestionMoreBtn>
          </SuggestionRow>
        </Card>

        {/* Recording */}
        <Card style={{ animationDelay: '0.15s' }}>
          <RecordingSection>
            <WaveformRow>
              {Array.from({ length: 24 }).map((_, i) => (
                <WaveBar key={i} $delay={i % 8} $active={recordState === 'recording' && !paused} />
              ))}
            </WaveformRow>

            <RecordingTimer>{fmtTime(elapsed)}</RecordingTimer>

            <RecordControls>
              {recordState === 'recording' && (
                <PauseResumeBtn
                  onClick={handlePauseResume}
                  aria-label={paused ? t('resumeRecording') : t('pauseRecording')}
                >
                  {paused ? <Play /> : <Pause />}
                </PauseResumeBtn>
              )}
              <RecordButton
                $recording={recordState === 'recording'}
                onClick={handleRecord}
                aria-label={recordState === 'recording' ? t('stopRecording') : t('startRecording')}
              >
                {recordState === 'recording' ? <Square /> : <Mic />}
              </RecordButton>
            </RecordControls>

            <RecordStatus>
              {recordState === 'recording'
                ? paused ? t('pausedRecording') : t('recordingTime')
                : recordState === 'recorded'
                  ? t('playback')
                  : t('startRecording')}
            </RecordStatus>
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
          <CardLabel>{t('uploadPhoto')}</CardLabel>
          {photoUrl ? (
            <PhotoPreviewWrapper>
              <PhotoPreviewImg src={photoUrl} alt={t('photoPreview')} />
              <RemovePhoto onClick={() => setPhotoUrl(null)}>
                <X />
              </RemovePhoto>
            </PhotoPreviewWrapper>
          ) : (
            <>
              <HiddenFileInput
                type="file"
                accept="image/*"
                id="photo-upload"
                onChange={handlePhotoChange}
              />
              <PhotoUploadArea htmlFor="photo-upload">
                <Image />
                <PhotoUploadLabel>
                  {t('uploadPhoto')}
                </PhotoUploadLabel>
              </PhotoUploadArea>
            </>
          )}
        </Card>

        {/* Decade */}
        <Card style={{ animationDelay: '0.25s' }}>
          <CardLabel>{t('decade')}</CardLabel>
          <DecadeGrid>
            {DECADE_KEYS.map((key) => (
              <DecadeChip
                key={key}
                $selected={decade === key}
                onClick={() => setDecade(key)}
              >
                {t(`decadeOptions.${key}` as Parameters<typeof t>[0])}
              </DecadeChip>
            ))}
          </DecadeGrid>
        </Card>

        {/* Private Reflection — visible once recording is done */}
        {(recordState === 'recorded' || recordState === 'saved') && (
          <Card style={{ animationDelay: '0.28s' }}>
            <CardLabel>{t('reflection')}</CardLabel>
            <ReflectionTextarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={t('reflectionPlaceholder')}
              disabled={recordState === 'saved'}
            />
            <ReflectionHint>
              <Lock />
              {t('reflectionHint')}
            </ReflectionHint>
          </Card>
        )}

        {/* Save */}
        <SaveSection>
          <SaveBtn
            $disabled={recordState !== 'recorded' || saving}
            onClick={handleSave}
            disabled={recordState !== 'recorded' || saving}
          >
            {saving ? (
              <SpinnerIcon>
                <Loader2 />
              </SpinnerIcon>
            ) : (
              <Save />
            )}
            {saving ? saveStatus || t('saving') : t('saveMemory')}
          </SaveBtn>
          {(recordState === 'recorded' || recordState === 'recording') && (
            <SecondaryBtn onClick={handleRetake}>
              <RotateCcw />
              {t('retake')}
            </SecondaryBtn>
          )}
        </SaveSection>
      </ScrollArea>
    </Page>
  )
}
