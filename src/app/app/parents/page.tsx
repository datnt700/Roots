'use client'

import { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import QRCode from 'qrcode'
import { theme } from '@/lib/theme'
import {
  QrCode,
  Plus,
  Download,
  Printer,
  X,
  Users,
  BookOpen,
  Edit3,
  RefreshCw,
  Check,
} from 'lucide-react'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
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
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[6],
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
  lineHeight: 1.5,
})

// ─── Parent section ───────────────────────────────────────────────────────────

const ParentSection = styled.section({
  marginBottom: theme.spacing[8],
  animation: `${fadeUp} 0.35s ease both`,
})

const ParentHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[3],
})

const ParentEmoji = styled.div<{ $color: string }>(({ $color }) => ({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  background: `linear-gradient(135deg, ${$color}, oklch(0.65 0.12 50 / 0.7))`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  flexShrink: 0,
}))

const ParentLabel = styled.div({ flex: 1 })

const ParentName = styled.div({
  fontFamily: theme.fonts.serif,
  fontWeight: 700,
  fontSize: '1.125rem',
  color: theme.colors.foreground,
})

const RelBadge = styled.span({
  display: 'inline-block',
  padding: '0.1rem 0.45rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.55 0.1 155 / 0.1)',
  color: theme.colors.primary,
  fontSize: '0.7rem',
  fontWeight: 600,
  marginTop: '0.2rem',
  textTransform: 'capitalize',
})

const AddSlotBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
  borderRadius: theme.radius.lg,
  border: `1.5px dashed ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  fontSize: '0.8rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Slot grid ────────────────────────────────────────────────────────────────

const SlotGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
  gap: theme.spacing[3],
})

const SlotCard = styled.div<{ $hasRecording: boolean }>(
  ({ $hasRecording }) => ({
    position: 'relative',
    borderRadius: '1.25rem',
    border: `1.5px solid ${$hasRecording ? 'oklch(0.55 0.1 155 / 0.35)' : theme.colors.border}`,
    backgroundColor: $hasRecording
      ? 'oklch(0.55 0.1 155 / 0.04)'
      : theme.colors.card,
    padding: theme.spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2],
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    animation: `${fadeUp} 0.3s ease both`,
    '&:hover': {
      borderColor: theme.colors.primary,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.sm,
    },
  }),
)

const SlotPageNum = styled.div({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: theme.colors.mutedForeground,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
})

const SlotTitle = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

const SlotPrompt = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.4,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  fontStyle: 'italic',
})

const SlotBadge = styled.div<{ $hasRecording: boolean }>(
  ({ $hasRecording }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: $hasRecording ? theme.colors.primary : theme.colors.mutedForeground,
    marginTop: 'auto',
    '& svg': { width: '0.75rem', height: '0.75rem' },
  }),
)

const AddSlotCard = styled.button({
  borderRadius: '1.25rem',
  border: `1.5px dashed ${theme.colors.border}`,
  backgroundColor: 'transparent',
  padding: theme.spacing[4],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  fontSize: '0.8rem',
  transition: `all ${theme.transitions.fast}`,
  minHeight: '8rem',
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '& svg': { width: '1.5rem', height: '1.5rem', opacity: 0.4 },
})

// ─── QR Modal ─────────────────────────────────────────────────────────────────

const ModalOverlay = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  backgroundColor: 'rgba(0,0,0,0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing[5],
  animation: `${fadeUp} 0.2s ease both`,
})

const ModalPanel = styled.div({
  width: '100%',
  maxWidth: '24rem',
  backgroundColor: theme.colors.card,
  borderRadius: '2rem',
  padding: `${theme.spacing[6]} ${theme.spacing[5]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[4],
  animation: `${scaleIn} 0.25s ease both`,
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  position: 'relative',
  maxHeight: '90vh',
  overflowY: 'auto',
})

const ModalClose = styled.button({
  position: 'absolute',
  top: theme.spacing[4],
  right: theme.spacing[4],
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.full,
  border: 'none',
  backgroundColor: theme.colors.muted,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors.mutedForeground,
  '& svg': { width: '1rem', height: '1rem' },
})

const ModalTitle = styled.h2({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  textAlign: 'center',
})

const ModalSubtitle = styled.p({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  textAlign: 'center',
  lineHeight: 1.5,
  marginTop: `-${theme.spacing[2]}`,
})

const QRImage = styled.img({
  width: '13rem',
  height: '13rem',
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
})

const QRPlaceholder = styled.div({
  width: '13rem',
  height: '13rem',
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors.mutedForeground,
})

const PromptEditor = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
})

const PromptLabel = styled.label({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: theme.colors.mutedForeground,
})

const PromptTextarea = styled.textarea({
  width: '100%',
  minHeight: '4.5rem',
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  color: theme.colors.foreground,
  fontSize: '0.875rem',
  fontFamily: theme.fonts.sans,
  lineHeight: 1.5,
  resize: 'none',
  outline: 'none',
  boxSizing: 'border-box',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': { borderColor: theme.colors.primary },
})

const ModalActions = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  width: '100%',
})

const ActionBtn = styled.button<{ $primary?: boolean; $loading?: boolean }>(
  ({ $primary, $loading }) => ({
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[1],
    padding: `${theme.spacing[3]}`,
    borderRadius: theme.radius.xl,
    border: `1.5px solid ${$primary ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: $primary ? theme.colors.primary : 'transparent',
    color: $primary ? '#fff' : theme.colors.foreground,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: $loading ? 'wait' : 'pointer',
    transition: `opacity ${theme.transitions.fast}`,
    '&:hover': { opacity: 0.85 },
    '& svg': {
      width: '0.875rem',
      height: '0.875rem',
      animation: $loading ? `${spin} 0.8s linear infinite` : 'none',
    },
  }),
)

const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  animation: `${fadeUp} 0.4s ease both`,
})

// ─── Types ────────────────────────────────────────────────────────────────────

type Parent = { id: string; name: string; relationship: string }

type Slot = {
  id: string
  pageNumber: number
  title: string
  prompt: string
  parentId: string
  parentName: string
  relationship: string
  coverPhotoKey: string | null
  hasRecording: boolean
}

interface ModalState {
  slotId: string
  parentName: string
  title: string
  prompt: string
  pageNumber: number
  qrDataUrl: string
  token: string
}

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

const MOCK_USER_ID = 'demo-user'

// ─── QR Modal component ───────────────────────────────────────────────────────

function QRModal({
  modal,
  onClose,
  onSlotUpdated,
}: {
  modal: ModalState
  onClose: () => void
  onSlotUpdated: (slotId: string, title: string, prompt: string) => void
}) {
  const [prompt, setPrompt] = useState(modal.prompt)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/slots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: modal.slotId,
          title: modal.title,
          prompt,
        }),
      })
      onSlotUpdated(modal.slotId, modal.title, prompt)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = () => {
    if (!modal.qrDataUrl) return
    const a = document.createElement('a')
    a.href = modal.qrDataUrl
    a.download = `roots-qr-trang${modal.pageNumber}-${modal.parentName.replace(/\s+/g, '-')}.png`
    a.click()
  }

  const handlePrint = () => {
    if (!modal.qrDataUrl) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR – GỐC · ${modal.parentName} · Trang ${modal.pageNumber}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Georgia, serif; gap: 1.25rem; background: #fff; }
            img { width: 240px; height: 240px; }
            h2 { font-size: 1.25rem; color: #2d2a26; margin: 0; }
            p { font-size: 0.875rem; color: #6b6560; text-align: center; max-width: 280px; margin: 0; line-height: 1.5; }
            small { font-size: 0.75rem; color: #9d9690; }
          </style>
        </head>
        <body>
          <h2>GỐC · Trang ${modal.pageNumber}</h2>
          <img src="${modal.qrDataUrl}" alt="QR Code" />
          <p>Quét mã QR này để ghi lại câu chuyện của <strong>${modal.parentName}</strong></p>
          ${prompt ? `<small>Chủ đề: ${prompt}</small>` : ''}
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose}>
          <X />
        </ModalClose>

        <ModalTitle>
          Trang {modal.pageNumber} · {modal.parentName}
        </ModalTitle>
        <ModalSubtitle>
          Mã QR vĩnh viễn — dán vào album, quét nhiều lần
        </ModalSubtitle>

        {modal.qrDataUrl ? (
          <QRImage src={modal.qrDataUrl} alt="QR Code" />
        ) : (
          <QRPlaceholder>
            <QrCode style={{ opacity: 0.3, width: '3rem', height: '3rem' }} />
          </QRPlaceholder>
        )}

        <PromptEditor>
          <PromptLabel>Câu hỏi con muốn hỏi</PromptLabel>
          <PromptTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="VD: Kể cho con nghe về thời thơ ấu của bố..."
            rows={3}
          />
        </PromptEditor>

        <ModalActions>
          {modal.qrDataUrl && (
            <>
              <ActionBtn onClick={handleDownload}>
                <Download />
                Tải về
              </ActionBtn>
              <ActionBtn onClick={handlePrint}>
                <Printer />
                In
              </ActionBtn>
            </>
          )}
          <ActionBtn
            $primary
            $loading={saving}
            onClick={handleSave}
            disabled={saving}
          >
            {saved ? <Check /> : saving ? <RefreshCw /> : <Edit3 />}
            {saved ? 'Đã lưu' : 'Lưu'}
          </ActionBtn>
        </ModalActions>
      </ModalPanel>
    </ModalOverlay>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [creatingSlot, setCreatingSlot] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/parents?userId=${MOCK_USER_ID}`)
        .then((r) => r.json())
        .catch(() => ({ parents: [] })),
      fetch(`/api/slots?userId=${MOCK_USER_ID}`)
        .then((r) => r.json())
        .catch(() => ({ slots: [] })),
    ])
      .then(([pData, sData]) => {
        if (Array.isArray(pData.parents)) setParents(pData.parents)
        if (Array.isArray(sData.slots)) setSlots(sData.slots)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleOpenSlot = useCallback((slot: Slot) => {
    setModal({
      slotId: slot.id,
      parentName: slot.parentName,
      title: slot.title,
      prompt: slot.prompt,
      pageNumber: slot.pageNumber,
      qrDataUrl: '',
      token: '',
    })
  }, [])

  const handleCreateSlot = useCallback(async (parent: Parent) => {
    setCreatingSlot(parent.id)
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: MOCK_USER_ID,
          parentId: parent.id,
          title: `Câu chuyện với ${parent.name}`,
          prompt: '',
        }),
      })
      if (!res.ok) throw new Error('Failed to create slot')
      const { slotId, token, qrUrl, pageNumber } = (await res.json()) as {
        slotId: string
        token: string
        qrUrl: string
        pageNumber: number
      }

      const fullUrl = `${window.location.origin}${qrUrl}`
      const qrDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#2d2a26', light: '#f7f5f2' },
      })

      const newSlot: Slot = {
        id: slotId,
        pageNumber,
        title: `Câu chuyện với ${parent.name}`,
        prompt: '',
        parentId: parent.id,
        parentName: parent.name,
        relationship: parent.relationship,
        coverPhotoKey: null,
        hasRecording: false,
      }
      setSlots((prev) => [...prev, newSlot])

      setModal({
        slotId,
        parentName: parent.name,
        title: newSlot.title,
        prompt: '',
        pageNumber,
        qrDataUrl,
        token,
      })
    } catch {
      alert('Không thể tạo trang album. Vui lòng thử lại.')
    } finally {
      setCreatingSlot(null)
    }
  }, [])

  const handleSlotUpdated = useCallback(
    (slotId: string, title: string, prompt: string) => {
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, title, prompt } : s)),
      )
    },
    [],
  )

  const getEmoji = (rel: string) =>
    RELATIONSHIP_EMOJI[rel.toLowerCase()] ?? RELATIONSHIP_EMOJI.other
  const getColor = (rel: string) =>
    RELATIONSHIP_COLOR[rel.toLowerCase()] ?? RELATIONSHIP_COLOR.other

  if (loading) {
    return (
      <Page>
        <PageHeader>
          <div>
            <PageTitle>Album gia đình</PageTitle>
            <PageSubtitle>Mỗi trang album là một câu chuyện</PageSubtitle>
          </div>
        </PageHeader>
        <SlotGrid>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: '8rem',
                borderRadius: '1.25rem',
                animationDelay: `${i * 0.06}s`,
              }}
            />
          ))}
        </SlotGrid>
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Album gia đình</PageTitle>
          <PageSubtitle>
            Mỗi trang album là một câu chuyện — dán QR, kể mãi mãi
          </PageSubtitle>
        </div>
      </PageHeader>

      {parents.length === 0 ? (
        <EmptyState>
          <Users
            style={{
              width: '2.5rem',
              height: '2.5rem',
              margin: '0 auto 1rem',
              opacity: 0.3,
              display: 'block',
            }}
          />
          <p>Chưa có người thân nào. Thêm người thân để bắt đầu.</p>
        </EmptyState>
      ) : (
        parents.map((parent, pi) => {
          const parentSlots = slots.filter((s) => s.parentId === parent.id)
          return (
            <ParentSection
              key={parent.id}
              style={{ animationDelay: `${pi * 0.07}s` }}
            >
              <ParentHeader>
                <ParentEmoji $color={getColor(parent.relationship)}>
                  {getEmoji(parent.relationship)}
                </ParentEmoji>
                <ParentLabel>
                  <ParentName>{parent.name}</ParentName>
                  <RelBadge>{parent.relationship}</RelBadge>
                </ParentLabel>
                <AddSlotBtn
                  onClick={() => handleCreateSlot(parent)}
                  disabled={creatingSlot === parent.id}
                >
                  {creatingSlot === parent.id ? (
                    <RefreshCw
                      style={{ animation: `${spin} 0.8s linear infinite` }}
                    />
                  ) : (
                    <Plus />
                  )}
                  Thêm trang
                </AddSlotBtn>
              </ParentHeader>

              <SlotGrid>
                {parentSlots.map((slot, si) => (
                  <SlotCard
                    key={slot.id}
                    $hasRecording={slot.hasRecording}
                    onClick={() => handleOpenSlot(slot)}
                    style={{ animationDelay: `${(pi * 4 + si) * 0.05}s` }}
                  >
                    <SlotPageNum>Trang {slot.pageNumber}</SlotPageNum>
                    <SlotTitle>
                      {slot.title || `Câu chuyện với ${slot.parentName}`}
                    </SlotTitle>
                    {slot.prompt && <SlotPrompt>"{slot.prompt}"</SlotPrompt>}
                    <SlotBadge $hasRecording={slot.hasRecording}>
                      {slot.hasRecording ? (
                        <>
                          <BookOpen />
                          Đã có kỷ niệm
                        </>
                      ) : (
                        <>
                          <QrCode />
                          Chưa quét
                        </>
                      )}
                    </SlotBadge>
                  </SlotCard>
                ))}

                <AddSlotCard
                  onClick={() => handleCreateSlot(parent)}
                  disabled={creatingSlot === parent.id}
                >
                  {creatingSlot === parent.id ? (
                    <RefreshCw
                      style={{ animation: `${spin} 0.8s linear infinite` }}
                    />
                  ) : (
                    <Plus />
                  )}
                  Trang mới
                </AddSlotCard>
              </SlotGrid>
            </ParentSection>
          )
        })
      )}

      {modal && (
        <QRModal
          modal={modal}
          onClose={() => setModal(null)}
          onSlotUpdated={handleSlotUpdated}
        />
      )}
    </Page>
  )
}
