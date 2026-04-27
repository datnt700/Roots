import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Link from 'next/link'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const breathe = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.92; }
  50%       { transform: scale(1.05); opacity: 1;    }
`

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1.25rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  background: `
    radial-gradient(ellipse at 15% 20%, oklch(0.88 0.06 155 / 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 80%, oklch(0.88 0.06 50 / 0.14) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, oklch(0.92 0.02 80 / 0.4) 0%, transparent 70%),
    #fdf9f4
  `,
  fontFamily: theme.fonts.sans,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',

  // Subtle texture dots
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(circle, oklch(0.6 0.05 80 / 0.06) 1px, transparent 1px)`,
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
  },
})

export const Inner = styled.div({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: `${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both`,
})

export const LogoMark = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[8],
  animation: `${breathe} 4s ease-in-out infinite`,
})

export const BrandName = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '0.85rem',
  fontWeight: 600,
  letterSpacing: '0.35em',
  color: theme.colors.primary,
  textTransform: 'uppercase',
  opacity: 0.75,
})

export const Code = styled.div({
  fontSize: 'clamp(5.5rem, 22vw, 10rem)',
  fontFamily: theme.fonts.serif,
  fontWeight: 700,
  lineHeight: 1,
  color: 'transparent',
  WebkitTextStroke: '2px oklch(0.55 0.12 155 / 0.22)',
  letterSpacing: '-0.03em',
  marginBottom: theme.spacing[5],
  userSelect: 'none',
})

export const Title = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: 'clamp(1.25rem, 4vw, 1.8rem)',
  fontWeight: 600,
  color: theme.colors.foreground,
  marginBottom: theme.spacing[3],
  lineHeight: 1.3,
})

export const Description = styled.p({
  fontSize: '0.95rem',
  color: theme.colors.mutedForeground,
  maxWidth: '28rem',
  lineHeight: 1.7,
  marginBottom: theme.spacing[8],
})

export const Actions = styled.div({
  display: 'flex',
  gap: theme.spacing[3],
  flexWrap: 'wrap',
  justifyContent: 'center',
})

export const PrimaryBtn = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} 1.75rem`,
  background: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  fontFamily: theme.fonts.sans,
  fontSize: '0.9rem',
  fontWeight: 500,
  textDecoration: 'none',
  transition: theme.transitions.fast,
  boxShadow: '0 2px 8px oklch(0.45 0.12 155 / 0.25)',
  '&:hover': {
    opacity: 0.88,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 14px oklch(0.45 0.12 155 / 0.32)',
  },
  '&:active': { transform: 'translateY(0)' },
})

export const SecondaryBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} 1.75rem`,
  background: 'transparent',
  color: theme.colors.mutedForeground,
  border: `1.5px solid ${theme.colors.border}`,
  borderRadius: theme.radius.full,
  fontFamily: theme.fonts.sans,
  fontSize: '0.9rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: theme.transitions.fast,
  '&:hover': {
    background: theme.colors.muted,
    color: theme.colors.foreground,
    borderColor: 'transparent',
  },
  '&:active': { opacity: 0.75 },
})
