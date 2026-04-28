'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import {
  Page, PageHeader, PageTitle, PageSubtitle,
  ParentSection, ParentHeader, ParentEmoji, ParentLabel, ParentName, RelBadge, AddSlotBtn,
  SlotGrid, SlotCard, SlotPageNum, SlotTitle, SlotPrompt, SlotBadge, AddSlotCard,
  ModalOverlay, ModalPanel, ModalClose, ModalTitle, ModalSubtitle,
  QRImage, QRPlaceholder, PromptEditor, PromptLabel, PromptTextarea,
  ModalActions, ActionBtn, EmptyState,
  StickerPhotoGroup, StickerHiddenInput, StickerPhotoRow, StickerPhotoImg, RemoveStickerPhotoBtn, AddStickerPhotoBtn,
  SkeletonSectionWrapper, SkeletonParentHeader, SkeletonParentInfo, SkeletonCircle, SkeletonLine, SkeletonSlotCard,
  DeletePageBtn,
  ConfirmOverlay, ConfirmPanel, ConfirmIcon, ConfirmTitle, ConfirmBody, ConfirmActions, ConfirmCancelBtn, ConfirmDeleteBtn,
  spin,
} from './page.styles'
import { useTranslations } from 'next-intl'
import { useUserId } from '@/hooks/use-user-id'
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
  Mic,
  ImagePlus,
  Trash2,
  AlertTriangle,
} from 'lucide-react'

// --- Types --------------------------------------------------------------------

// --- Types --------------------------------------------------------------------

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
  parentId: string
  parentName: string
  title: string
  prompt: string
  pageNumber: number
  qrDataUrl: string
  token: string
}

const RELATIONSHIP_EMOJI: Record<string, string> = {
  bố: '👴',
  ba: '👴',
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


// --- QR Modal component -------------------------------------------------------

function QRModal({
  modal,
  onClose,
  onSlotUpdated,
  onSlotDeleted,
}: {
  modal: ModalState
  onClose: () => void
  onSlotUpdated: (slotId: string, title: string, prompt: string) => void
  onSlotDeleted: (slotId: string) => void
}) {
  const t = useTranslations('parents')
  const router = useRouter()
  const [prompt, setPrompt] = useState(modal.prompt)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [stickerPhoto, setStickerPhoto] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/slots?slotId=${modal.slotId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      onSlotDeleted(modal.slotId)
      onClose()
    } catch {
      alert(t('modal.deleteError'))
      setDeleting(false)
      setConfirmDelete(false)
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
    const stickerHtml = `
      <div class="sticker">
        <span class="brand">G?C &middot; ROOTS</span>
        ${stickerPhoto ? `<img class="child-photo" src="${stickerPhoto}" alt="" />` : ""}<span class="parent-name">${modal.parentName}</span>
        <div class="qr-wrap">
          <img class="qr" src="${modal.qrDataUrl}" alt="QR" />
        </div>
        <div class="divider"></div>
        ${prompt ? `<span class="topic">&ldquo;${prompt}&rdquo;</span>` : ''}
        <span class="instruction">Qu�t m� d? k? chuy?n<br>c�ng tr? l� AI ti?ng Vi?t</span>
        <span class="page-num">Trang ${modal.pageNumber}</span>
      </div>`
    win.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Sticker K� ?c � ${modal.parentName} � Trang ${modal.pageNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#ede8de;font-family:'DM Sans',system-ui,sans-serif;padding:2rem}
    .controls{text-align:center;margin-bottom:2rem}
    .print-btn{padding:.625rem 2rem;background:#4a7c59;color:#fff;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.9375rem;font-weight:600;cursor:pointer;letter-spacing:.02em}
    .hint{margin-top:.5rem;font-size:.75rem;color:#7a7268;line-height:1.5}
    .sheet-label{font-family:'Playfair Display',Georgia,serif;font-size:.875rem;color:#5a5248;text-align:center;margin-bottom:1.25rem;font-style:italic}
    .grid{display:grid;grid-template-columns:repeat(3,200px);gap:1.5rem;justify-content:center;max-width:700px;margin:0 auto}
    .sticker{width:200px;background:#fff;border-radius:18px;padding:1.25rem 1rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:.7rem;box-shadow:0 4px 24px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);border:1.5px solid #e0d8cc;position:relative;overflow:hidden}
    .sticker::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5a8a6a,#a3c9a8,#5a8a6a)}
    .brand{font-size:.5rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#5a8a6a}
    .parent-name{font-family:'Playfair Display',Georgia,serif;font-size:.9375rem;font-weight:700;color:#2d2a26;text-align:center;line-height:1.3}
    .qr-wrap{padding:5px;border:1.5px solid #e0d8cc;border-radius:10px;background:#fff}
    .qr{display:block;width:118px;height:118px}
    .divider{width:30px;height:1px;background:linear-gradient(90deg,transparent,#c8bfb0,transparent)}
    .topic{font-size:.625rem;color:#7a7268;text-align:center;font-style:italic;line-height:1.45;max-width:155px;font-family:'Playfair Display',Georgia,serif}
    .instruction{font-size:.5625rem;color:#aaa098;text-align:center;line-height:1.6;max-width:155px}
    .page-num{position:absolute;bottom:.5rem;right:.75rem;font-size:.5rem;color:#c8bfb0;font-family:'Playfair Display',serif;font-style:italic}
    .child-photo{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #e0d8cc;margin-top:-0.25rem}
    @media print{
      body{background:#fff;padding:.3cm}
      .controls{display:none}
      .grid{gap:1cm}
      .sticker{box-shadow:none;border-color:#ccc}
    }
  </style>
</head>
<body>
  <div class="controls">
    <button class="print-btn" onclick="window.print()">???&nbsp; In Sticker</button>
    <p class="hint">In tr�n gi?y decal A4 &mdash; c?t theo du?ng vi?n &mdash; d�n v�o album ?nh</p>
  </div>
  <p class="sheet-label">Sticker K� ?c &mdash; ${modal.parentName} &mdash; 3 b?n m?i t?</p>
  <div class="grid">
    ${stickerHtml}
    ${stickerHtml}
    ${stickerHtml}
  </div>
</body>
</html>`)
    win.document.close()
  }

  return (
    <>
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose}>
          <X />
        </ModalClose>

        <ModalTitle>
          {t('modal.title', { number: modal.pageNumber, name: modal.parentName })}
        </ModalTitle>
        <ModalSubtitle>
          {t('modal.subtitle')}
        </ModalSubtitle>

        {modal.qrDataUrl ? (
          <QRImage src={modal.qrDataUrl} alt="QR Code" />
        ) : (
          <QRPlaceholder>
            <QrCode />
          </QRPlaceholder>
        )}

        <StickerPhotoGroup>

          <StickerHiddenInput

            ref={photoInputRef}

            type="file"

            accept="image/*"

            onChange={(e) => {

              const f = e.target.files?.[0]

              if (!f) return

              const reader = new FileReader()

              reader.onload = (ev) => setStickerPhoto(ev.target?.result as string ?? null)

              reader.readAsDataURL(f)

            }}

          />

          {stickerPhoto ? (

            <StickerPhotoRow>

              <StickerPhotoImg src={stickerPhoto} alt='' />

              <RemoveStickerPhotoBtn

                onClick={() => setStickerPhoto(null)}

              >

                Xoá ảnh

              </RemoveStickerPhotoBtn>

            </StickerPhotoRow>

          ) : (

            <AddStickerPhotoBtn

              onClick={() => photoInputRef.current?.click()}

            >

              <ImagePlus size={14} />

              Thêm ảnh vào sticker

            </AddStickerPhotoBtn>

          )}

        </StickerPhotoGroup>
        <PromptEditor>
          <PromptLabel>{t('modal.promptLabel')}</PromptLabel>
          <PromptTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('modal.promptPlaceholder')}
            rows={3}
          />
        </PromptEditor>

        <ModalActions>
          <ActionBtn
            onClick={() => {
              onClose()
              const params = new URLSearchParams({ parentId: modal.parentId })
              if (prompt) params.set('prompt', prompt)
              router.push(`/app/record?${params}`)
            }}
          >
            <Mic />
            {t('modal.recordTry')}
          </ActionBtn>
          {modal.qrDataUrl && (
            <>
              <ActionBtn onClick={handleDownload}>
                <Download />
                {t('modal.download')}
              </ActionBtn>
              <ActionBtn onClick={handlePrint}>
                <Printer />
                {t('modal.print')}
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
            {saved ? t('modal.saved') : t('modal.save')}
          </ActionBtn>
        </ModalActions>

        <DeletePageBtn onClick={() => setConfirmDelete(true)}>
          <Trash2 />
          {t('modal.deletePage')}
        </DeletePageBtn>
      </ModalPanel>
    </ModalOverlay>

    {confirmDelete && (
      <ConfirmOverlay>
        <ConfirmPanel>
          <ConfirmIcon><AlertTriangle /></ConfirmIcon>
          <ConfirmTitle>{t('modal.deleteConfirmTitle')}</ConfirmTitle>
          <ConfirmBody>{t('modal.deleteConfirmBody')}</ConfirmBody>
          <ConfirmActions>
            <ConfirmCancelBtn onClick={() => setConfirmDelete(false)} disabled={deleting}>
              {t('modal.deleteConfirmNo')}
            </ConfirmCancelBtn>
            <ConfirmDeleteBtn $loading={deleting} onClick={handleDelete} disabled={deleting}>
              {deleting ? <RefreshCw /> : <Trash2 />}
              {t('modal.deleteConfirmYes')}
            </ConfirmDeleteBtn>
          </ConfirmActions>
        </ConfirmPanel>
      </ConfirmOverlay>
    )}
    </>
  )
}

// --- Page ---------------------------------------------------------------------

export default function ParentsPage() {
  const t = useTranslations('parents')
  const userId = useUserId()
  const [parents, setParents] = useState<Parent[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [creatingSlot, setCreatingSlot] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      fetch(`/api/parents?userId=${userId}`)
        .then((r) => r.json())
        .catch(() => ({ parents: [] })),
      fetch(`/api/slots?userId=${userId}`)
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
      parentId: slot.parentId,
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
          userId: userId ?? '',
          parentId: parent.id,
      title: `${t('slotDefaultTitle', { name: parent.name })}`,
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
        title: t('slotDefaultTitle', { name: parent.name }),
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
        parentId: parent.id,
        parentName: parent.name,
        title: t('slotDefaultTitle', { name: parent.name }),
        prompt: '',
        pageNumber,
        qrDataUrl,
        token,
      })
    } catch {
      alert(t('createError'))
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

  const handleSlotDeleted = useCallback((slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId))
  }, [])

  const getEmoji = (rel: string) =>
    RELATIONSHIP_EMOJI[rel.toLowerCase()] ?? RELATIONSHIP_EMOJI.other
  const getColor = (rel: string) =>
    RELATIONSHIP_COLOR[rel.toLowerCase()] ?? RELATIONSHIP_COLOR.other

  if (loading) {
    return (
      <Page>
        <PageHeader>
          <div>
            <PageTitle>{t('title')}</PageTitle>
            <PageSubtitle>{t('subtitleLoading')}</PageSubtitle>
          </div>
        </PageHeader>
        {[0, 1].map((pi) => (
          <SkeletonSectionWrapper key={pi}>
            {/* Parent section header skeleton */}
            <SkeletonParentHeader>
              <SkeletonCircle
                className="skeleton"
                style={{ animationDelay: `${pi * 0.08}s` }}
              />
              <SkeletonParentInfo>
                <SkeletonLine
                  className="skeleton"
                  $width={pi === 0 ? '7rem' : '6rem'}
                  style={{ animationDelay: `${pi * 0.08 + 0.04}s` }}
                />
                <SkeletonLine
                  className="skeleton"
                  $width="3.5rem"
                  $height="0.6875rem"
                  style={{ animationDelay: `${pi * 0.08 + 0.06}s` }}
                />
              </SkeletonParentInfo>
              {/* AddSlotBtn placeholder */}
              <SkeletonLine
                className="skeleton"
                $width="5.5rem"
                $height="1.75rem"
                style={{ flexShrink: 0, animationDelay: `${pi * 0.08 + 0.08}s` }}
              />
            </SkeletonParentHeader>
            {/* Slot cards skeleton grid */}
            <SlotGrid>
              {[0, 1, 2].map((si) => (
                <SkeletonSlotCard
                  key={si}
                  className="skeleton"
                  style={{ animationDelay: `${(pi * 3 + si) * 0.055}s` }}
                />
              ))}
            </SlotGrid>
          </SkeletonSectionWrapper>
        ))}
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{t('title')}</PageTitle>
          <PageSubtitle>
            {t('subtitle')}
          </PageSubtitle>
        </div>
      </PageHeader>

      {parents.length === 0 ? (
        <EmptyState>
          <Users />
          <p>{t('empty')}</p>
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
                  {t('addPage')}
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
                    <SlotPageNum>{t('slotPage', { number: slot.pageNumber })}</SlotPageNum>
                    <SlotTitle>
                      {slot.title || t('slotDefaultTitle', { name: slot.parentName })}
                    </SlotTitle>
                    {slot.prompt && <SlotPrompt>\u201c{slot.prompt}\u201d</SlotPrompt>}
                    <SlotBadge $hasRecording={slot.hasRecording}>
                      {slot.hasRecording ? (
                        <>
                          <BookOpen />
                          {t('recorded')}
                        </>
                      ) : (
                        <>
                          <QrCode />
                          {t('notScanned')}
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
                  {t('newPage')}
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
          onSlotDeleted={handleSlotDeleted}
        />
      )}
    </Page>
  )
}