'use client'

import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import QRCode from 'qrcode'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import {
  QrCode,
  Plus,
  Download,
  Printer,
  X,
  Users,
  RefreshCw,
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
  maxWidth: '36rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[5],
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

const AddBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  flexShrink: 0,
  transition: `opacity ${theme.transitions.fast}`,
  '&:hover': { opacity: 0.88 },
  '& svg': { width: '1rem', height: '1rem' },
})

// ─── Parent cards ─────────────────────────────────────────────────────────────

const CardList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})

const ParentCard = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[4],
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
  backgroundColor: theme.colors.card,
  border: `1.5px solid ${theme.colors.border}`,
  borderRadius: '1.5rem',
  animation: `${fadeUp} 0.35s ease both`,
  boxShadow: '0 2px 12px oklch(0.55 0.1 155 / 0.05)',
  willChange: 'transform, opacity',
})

const ParentEmoji = styled.div<{ $color: string }>(({ $color }) => ({
  width: '3rem',
  height: '3rem',
  borderRadius: theme.radius.full,
  background: `linear-gradient(135deg, ${$color}, oklch(0.65 0.12 50 / 0.7))`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.375rem',
  flexShrink: 0,
}))

const ParentInfo = styled.div({
  flex: 1,
  minWidth: 0,
})

const ParentName = styled.div({
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.colors.foreground,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const RelationshipBadge = styled.span({
  display: 'inline-block',
  padding: '0.15rem 0.5rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'oklch(0.55 0.1 155 / 0.1)',
  color: theme.colors.primary,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginTop: '0.2rem',
  textTransform: 'capitalize',
})

const QRBtn = styled.button<{ $loading?: boolean }>(({ $loading }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: `1.5px solid ${theme.colors.primary}`,
  backgroundColor: 'oklch(0.88 0.06 155 / 0.1)',
  color: theme.colors.primary,
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: $loading ? 'wait' : 'pointer',
  flexShrink: 0,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': { backgroundColor: 'oklch(0.88 0.06 155 / 0.2)' },
  '& svg': {
    width: '0.875rem',
    height: '0.875rem',
    animation: $loading ? `${spin} 0.8s linear infinite` : 'none',
  },
}))

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  animation: `${fadeUp} 0.4s ease both`,
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
  maxWidth: '22rem',
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
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  textAlign: 'center',
})

const QRImage = styled.img({
  width: '14rem',
  height: '14rem',
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
})

const QRPlaceholder = styled.div({
  width: '14rem',
  height: '14rem',
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors.mutedForeground,
})

const ModalInstructions = styled.p({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  textAlign: 'center',
  lineHeight: 1.5,
})

const ExpiryNote = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.accent,
  fontWeight: 500,
})

const ModalActions = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  width: '100%',
})

const ActionBtn = styled.button<{ $primary?: boolean }>(({ $primary }) => ({
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
  cursor: 'pointer',
  transition: `opacity ${theme.transitions.fast}`,
  '&:hover': { opacity: 0.85 },
  '& svg': { width: '0.875rem', height: '0.875rem' },
}))

// ─── Types ────────────────────────────────────────────────────────────────────

type Parent = { id: string; name: string; relationship: string }

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

interface QRModalState {
  parentName: string
  qrDataUrl: string
  token: string
  expires: string
}

function QRModal({
  modal,
  onClose,
}: {
  modal: QRModalState
  onClose: () => void
}) {
  const t = useTranslations()

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = modal.qrDataUrl
    a.download = `roots-qr-${modal.parentName.replace(/\s+/g, '-')}.png`
    a.click()
  }

  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code – GỐC · ${modal.parentName}</title>
          <style>
            body {
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: Georgia, serif;
              gap: 1.25rem;
              background: #fff;
            }
            img { width: 240px; height: 240px; }
            h2 { font-size: 1.25rem; color: #2d2a26; margin: 0; }
            p { font-size: 0.875rem; color: #6b6560; text-align: center; max-width: 280px; margin: 0; line-height: 1.5; }
            small { font-size: 0.75rem; color: #9d9690; }
          </style>
        </head>
        <body>
          <h2>GỐC</h2>
          <img src="${modal.qrDataUrl}" alt="QR Code" />
          <p>Quét mã QR này để ghi lại câu chuyện của <strong>${modal.parentName}</strong></p>
          <small>Hết hạn: ${new Date(modal.expires).toLocaleString('vi-VN')}</small>
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

        <ModalTitle>{t('parents.qrModal.title')}</ModalTitle>

        {modal.qrDataUrl ? (
          <QRImage src={modal.qrDataUrl} alt="QR Code" />
        ) : (
          <QRPlaceholder>
            <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} />
          </QRPlaceholder>
        )}

        <div style={{ textAlign: 'center' }}>
          <ModalInstructions>
            {t('parents.qrModal.instructions')}
          </ModalInstructions>
          <ExpiryNote>{t('parents.qrModal.expires')}</ExpiryNote>
        </div>

        <ModalActions>
          <ActionBtn onClick={handleDownload}>
            <Download />
            {t('parents.qrModal.download')}
          </ActionBtn>
          <ActionBtn $primary onClick={handlePrint}>
            <Printer />
            {t('parents.qrModal.print')}
          </ActionBtn>
        </ModalActions>
      </ModalPanel>
    </ModalOverlay>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentsPage() {
  const t = useTranslations()
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingQR, setLoadingQR] = useState<string | null>(null)
  const [modal, setModal] = useState<QRModalState | null>(null)

  useEffect(() => {
    fetch(`/api/parents?userId=${MOCK_USER_ID}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.parents)) setParents(data.parents)
      })
      .catch(() => {
        /* no DB yet, stay empty */
      })
      .finally(() => setLoading(false))
  }, [])

  const handleGenerateQR = async (parent: Parent) => {
    setLoadingQR(parent.id)
    try {
      const res = await fetch('/api/parent-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: parent.id }),
      })
      if (!res.ok) throw new Error('Failed to create session')

      const { token, qrUrl, expiresAt } = (await res.json()) as {
        token: string
        qrUrl: string
        expiresAt: string
      }

      const fullUrl = `${window.location.origin}${qrUrl}`
      const qrDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#2d2a26', light: '#f7f5f2' },
      })

      setModal({
        parentName: parent.name,
        qrDataUrl,
        token,
        expires: expiresAt,
      })
    } catch {
      alert('Không thể tạo QR. Vui lòng thử lại.')
    } finally {
      setLoadingQR(null)
    }
  }

  const getEmoji = (rel: string) =>
    RELATIONSHIP_EMOJI[rel.toLowerCase()] ?? RELATIONSHIP_EMOJI.other
  const getColor = (rel: string) =>
    RELATIONSHIP_COLOR[rel.toLowerCase()] ?? RELATIONSHIP_COLOR.other

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{t('parents.title')}</PageTitle>
          <PageSubtitle>{t('parents.subtitle')}</PageSubtitle>
        </div>
        <AddBtn>
          <Plus />
          {t('parents.addParent')}
        </AddBtn>
      </PageHeader>

      {loading ? (
        <CardList>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: '5.5rem',
                borderRadius: '1.5rem',
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </CardList>
      ) : parents.length === 0 ? (
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
          <p>{t('parents.empty')}</p>
        </EmptyState>
      ) : (
        <CardList>
          {parents.map((parent, i) => (
            <ParentCard
              key={parent.id}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <ParentEmoji $color={getColor(parent.relationship)}>
                {getEmoji(parent.relationship)}
              </ParentEmoji>
              <ParentInfo>
                <ParentName>{parent.name}</ParentName>
                <RelationshipBadge>{parent.relationship}</RelationshipBadge>
              </ParentInfo>
              <QRBtn
                $loading={loadingQR === parent.id}
                onClick={() => handleGenerateQR(parent)}
                disabled={loadingQR === parent.id}
              >
                {loadingQR === parent.id ? <RefreshCw /> : <QrCode />}
                {t('parents.generateQR')}
              </QRBtn>
            </ParentCard>
          ))}
        </CardList>
      )}

      {modal && <QRModal modal={modal} onClose={() => setModal(null)} />}
    </Page>
  )
}
