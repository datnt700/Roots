'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { X } from 'lucide-react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(1rem) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

// ─── Styled ───────────────────────────────────────────────────────────────────

const Backdrop = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  animation: `${fadeIn} 0.15s ease`,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: 0,
  '@media (min-width: 480px)': {
    alignItems: 'center',
    padding: theme.spacing[4],
  },
})

const Panel = styled.div<{ $size: ModalSize }>(({ $size }) => {
  const maxWidths: Record<ModalSize, string> = {
    sm: '22rem',
    md: '32rem',
    lg: '44rem',
    full: '100%',
  }
  return {
    position: 'relative',
    width: '100%',
    maxWidth: maxWidths[$size],
    maxHeight: '92dvh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.card,
    borderRadius: `${theme.radius['2xl']} ${theme.radius['2xl']} 0 0`,
    boxShadow: theme.shadows.lg,
    animation: `${slideUp} 0.2s ease`,
    overflow: 'hidden',
    '@media (min-width: 480px)': {
      borderRadius: theme.radius['2xl'],
    },
  }
})

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  flexShrink: 0,
})

const TitleArea = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  minWidth: 0,
})

const Title = styled.h2({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  lineHeight: 1.3,
  margin: 0,
})

const Subtitle = styled.p({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  margin: 0,
  lineHeight: 1.4,
})

const CloseBtn = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.md,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  flexShrink: 0,
  transition: `background ${theme.transitions.fast}`,
  '&:hover': { backgroundColor: theme.colors.muted, color: theme.colors.foreground },
  '& svg': { width: '1.125rem', height: '1.125rem' },
})

const Body = styled.div({
  flex: 1,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
})

const Footer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
  borderTop: `1px solid ${theme.colors.border}`,
  flexShrink: 0,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  subtitle?: string
  /** Rendered below the body, right-aligned */
  footer?: React.ReactNode
  size?: ModalSize
  /** Whether clicking the backdrop closes the modal. Default: true */
  closeOnBackdrop?: boolean
  /** Whether pressing Escape closes the modal. Default: true */
  closeOnEsc?: boolean
  children?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape key handler
  useEffect(() => {
    if (!open || !closeOnEsc) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, closeOnEsc, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!open) return null

  return createPortal(
    <Backdrop
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
    >
      <Panel $size={size} ref={panelRef} onClick={(e) => e.stopPropagation()}>
        {(title != null) && (
          <Header>
            <TitleArea>
              <Title>{title}</Title>
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </TitleArea>
            <CloseBtn onClick={onClose} aria-label="Close">
              <X />
            </CloseBtn>
          </Header>
        )}

        <Body>{children}</Body>

        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Backdrop>,
    document.body,
  )
}
