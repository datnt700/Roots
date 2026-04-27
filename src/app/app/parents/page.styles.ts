import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '56rem',
  width: '100%',
  overflowX: 'hidden',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.3s ease both`,
})

export const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
})

export const PageSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[1],
  lineHeight: 1.5,
})

// ─── Parent section ───────────────────────────────────────────────────────────

export const ParentSection = styled.section({
  marginBottom: theme.spacing[8],
  animation: `${fadeUp} 0.35s ease both`,
})

export const ParentHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[3],
})

export const ParentEmoji = styled.div<{ $color: string }>(({ $color }) => ({
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

export const ParentLabel = styled.div({ flex: 1 })

export const ParentName = styled.div({
  fontFamily: theme.fonts.serif,
  fontWeight: 700,
  fontSize: '1.125rem',
  color: theme.colors.foreground,
})

export const RelBadge = styled.span({
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

export const AddSlotBtn = styled.button({
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

export const SlotGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
  gap: theme.spacing[3],
})

export const SlotCard = styled.div<{ $hasRecording: boolean }>(
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

export const SlotPageNum = styled.div({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: theme.colors.mutedForeground,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
})

export const SlotTitle = styled.div({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

export const SlotPrompt = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.4,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  fontStyle: 'italic',
})

export const SlotBadge = styled.div<{ $hasRecording: boolean }>(
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

export const AddSlotCard = styled.button({
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

export const ModalOverlay = styled.div({
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

export const ModalPanel = styled.div({
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

export const ModalClose = styled.button({
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

export const ModalTitle = styled.h2({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  textAlign: 'center',
})

export const ModalSubtitle = styled.p({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  textAlign: 'center',
  lineHeight: 1.5,
  marginTop: `-${theme.spacing[2]}`,
})

export const QRImage = styled.img({
  width: '13rem',
  height: '13rem',
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
})

export const QRPlaceholder = styled.div({
  width: '13rem',
  height: '13rem',
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors.mutedForeground,
  '& svg': { opacity: 0.3, width: '3rem', height: '3rem' },
})

export const PromptEditor = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
})

export const PromptLabel = styled.label({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: theme.colors.mutedForeground,
})

export const PromptTextarea = styled.textarea({
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

export const ModalActions = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  width: '100%',
})

export const ActionBtn = styled.button<{ $primary?: boolean; $loading?: boolean }>(
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

export const EmptyState = styled.div({
  textAlign: 'center',
  padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
  color: theme.colors.mutedForeground,
  animation: `${fadeUp} 0.4s ease both`,
  '& svg': {
    width: '2.5rem',
    height: '2.5rem',
    margin: '0 auto 1rem',
    opacity: 0.3,
    display: 'block',
  },
})

// ─── Sticker photo upload ─────────────────────────────────────────────────────

export const StickerPhotoGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.25rem',
})

export const StickerHiddenInput = styled.input({
  display: 'none',
})

export const StickerPhotoRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const StickerPhotoImg = styled.img({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #e0d8cc',
})

export const RemoveStickerPhotoBtn = styled.button({
  fontSize: '0.75rem',
  color: '#9d9690',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'underline',
})

export const AddStickerPhotoBtn = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.375rem 0.875rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#5a8a6a',
  background: 'oklch(0.88 0.06 155 / 0.2)',
  border: '1px dashed #a3c9a8',
  borderRadius: '8px',
  cursor: 'pointer',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const SkeletonSectionWrapper = styled.div({
  marginBottom: '2rem',
})

export const SkeletonParentHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '0.875rem',
})

export const SkeletonParentInfo = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
})

export const SkeletonCircle = styled.div({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  flexShrink: 0,
})

export const SkeletonLine = styled.div<{ $width?: string; $height?: string }>(
  ({ $width = '100%', $height = '1rem' }) => ({
    width: $width,
    height: $height,
    borderRadius: '0.5rem',
  }),
)

export const SkeletonSlotCard = styled.div({
  height: '9rem',
  borderRadius: '1.25rem',
})
