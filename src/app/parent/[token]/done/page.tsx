'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Play, Pause, Heart } from 'lucide-react'
import { theme } from '@/lib/theme'
import {
  Page, SuccessSection, RootsLogo, LanternWrapper, SuccessTitle, SuccessSubtitle, LanternHint, ReactionBanner,
  Divider, DividerText,
  FeedbackList, FeedbackCard, FeedbackCardHeader, StudentAvatar, StudentInfo, StudentNameLabel, FeedbackDate, NewBadge,
  VoicePlayer, PlayBtn, WaveformContainer, Bar, VoiceDuration,
  TextMessage, HeartReaction,
} from './page.styles'

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
    date: 'H├┤m nay',
    isNew: true,
    voiceDuration: 38,
  },
  {
    id: '2',
    type: 'text',
    date: 'H├┤m qua',
    isNew: false,
    text: 'Bß╗æ ╞íi, c├óu chuyß╗çn cß╗ºa Bß╗æ hay qu├í! Con ─æ├ú nghe ─æi nghe lß║íi mß║Ñy lß║ºn rß╗ôi. Con nhß╗¢ Bß╗æ lß║»m. ≡ƒÑ║Γ¥ñ∩╕Å',
  },
]

const SESSION = { studentName: 'Minh', parentName: 'Bß╗æ', destination: 'Ph├íp' }

// ΓöÇΓöÇΓöÇ Page ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function FeedbackItem({ item }: { item: ChildFeedback }) {
  const [playing, setPlaying] = useState(false)
  const [hearted, setHearted] = useState(false)

  return (
    <FeedbackCard style={{ animationDelay: `${item.id === '1' ? 0.1 : 0.2}s` }}>
      <FeedbackCardHeader>
        <StudentAvatar>≡ƒæ¿ΓÇì≡ƒÄô</StudentAvatar>
        <StudentInfo>
          <StudentNameLabel>{SESSION.studentName}</StudentNameLabel>
          <FeedbackDate>{item.date}</FeedbackDate>
        </StudentInfo>
        {item.isNew && <NewBadge>Mß╗¢i</NewBadge>}
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
        {hearted ? '─É├ú cß║úm ╞ín' : 'Cß║úm ╞ín con'}
      </HeartReaction>
    </FeedbackCard>
  )
}

export default function ParentDonePage() {
  const params = useParams<{ token: string }>()
  const token = params.token

  const [lanternLit, setLanternLit] = useState(false)
  const [studentReacted, setStudentReacted] = useState(false)

  // Subscribe to Γ¥ñ∩╕Å reactions from the student ΓÇö lights the lantern automatically
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
        <RootsLogo>Gß╗ÉC</RootsLogo>

        <LanternWrapper $lit={lanternLit} onClick={() => setLanternLit(true)}>
          {lanternLit ? '≡ƒÅ«' : '≡ƒ¬ö'}
        </LanternWrapper>

        <SuccessTitle>
          K├╜ ß╗⌐c cß╗ºa <em>{SESSION.parentName}</em>
          <br />
          ─æ├ú ─æß║┐n tay {SESSION.studentName}!
        </SuccessTitle>

        <SuccessSubtitle>
          C├óu chuyß╗çn cß╗ºa {SESSION.parentName} ─æ├ú ─æ╞░ß╗úc gß╗¡i sang{' '}
          <strong>{SESSION.destination}</strong> v├á l╞░u giß╗» trong Gß╗æc cß╗ºa gia
          ─æ├¼nh m├¼nh.
        </SuccessSubtitle>

        {!lanternLit && (
          <LanternHint>
            <span>Γ£¿</span>
            Nhß║Ñn v├áo ─æ├¿n ─æß╗â thß║»p s├íng khi {SESSION.studentName} ─æ├ú nghe xong
          </LanternHint>
        )}

        {studentReacted && (
          <ReactionBanner>
            <Heart />
            {SESSION.studentName} ─æ├ú nghe v├á gß╗¡i Γ¥ñ∩╕Å cho {SESSION.parentName}!
          </ReactionBanner>
        )}
      </SuccessSection>

      <Divider>
        <DividerText>Lß╗¥i nhß║»n tß╗½ {SESSION.studentName}</DividerText>
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
          <span style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', textAlign: 'center', margin: '0 auto 1rem' }}>≡ƒÆ¼</span>
          <p>
            {SESSION.studentName} ch╞░a c├│ tin nhß║»n n├áo. Quay lß║íi sau nh├⌐{' '}
            {SESSION.parentName}!
          </p>
        </div>
      )}
    </Page>
  )
}
