import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${theme.spacing[6]} ${theme.spacing[4]}`,
  background: `
    radial-gradient(ellipse at 15% 10%, oklch(0.88 0.06 155 / 0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 90%, oklch(0.88 0.06 50 / 0.15) 0%, transparent 50%),
    #fdf9f4
  `,
})

export const Card = styled.div({
  width: '100%',
  maxWidth: '24rem',
  backgroundColor: '#fff',
  borderRadius: '1.75rem',
  border: `1px solid oklch(0.55 0.1 155 / 0.12)`,
  boxShadow: '0 4px 40px oklch(0.55 0.1 155 / 0.08)',
  padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  animation: `${fadeUp} 0.4s ease both`,
})

export const LogoBadge = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing[6],
})

export const LogoMark = styled.div({
  width: '3rem',
  height: '3rem',
  borderRadius: theme.radius['2xl'],
  background: `linear-gradient(135deg, ${theme.colors.primary}, oklch(0.65 0.12 50))`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  marginBottom: theme.spacing[3],
  boxShadow: '0 4px 16px oklch(0.55 0.1 155 / 0.25)',
})

export const LogoText = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1.375rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '0.06em',
})

export const LogoSub = styled.div({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.25rem',
  textAlign: 'center',
})

// ─── OAuth buttons ────────────────────────────────────────────────────────────

export const OAuthStack = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[5],
})

export const OAuthButton = styled.button<{ $loading?: boolean }>(({ $loading }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: '0.875rem',
  border: `1.5px solid oklch(0.55 0.05 155 / 0.15)`,
  backgroundColor: '#fff',
  color: '#2d2a26',
  fontSize: '0.9375rem',
  fontWeight: 600,
  fontFamily: theme.fonts.sans,
  cursor: $loading ? 'not-allowed' : 'pointer',
  opacity: $loading ? 0.7 : 1,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: '#f7f5f2',
    borderColor: 'oklch(0.55 0.1 155 / 0.3)',
  },
  '&:active': { transform: 'scale(0.98)' },
}))

export const OAuthIcon = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
})

// ─── Divider ──────────────────────────────────────────────────────────────────

export const Divider = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[5],
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: theme.colors.border,
  },
})

export const DividerText = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  whiteSpace: 'nowrap',
})

// ─── Tabs (login / register) ──────────────────────────────────────────────────

export const TabRow = styled.div({
  display: 'flex',
  borderRadius: theme.radius.xl,
  backgroundColor: theme.colors.muted,
  padding: '0.25rem',
  marginBottom: theme.spacing[5],
})

export const Tab = styled.button<{ $active: boolean }>(({ $active }) => ({
  flex: 1,
  padding: `${theme.spacing[2]} 0`,
  borderRadius: theme.radius.lg,
  border: 'none',
  backgroundColor: $active ? '#fff' : 'transparent',
  color: $active ? theme.colors.foreground : theme.colors.mutedForeground,
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  boxShadow: $active ? theme.shadows.sm : 'none',
}))

// ─── Form ─────────────────────────────────────────────────────────────────────

export const FormStack = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
})

export const FieldGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
})

export const FieldLabel = styled.label({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.colors.foreground,
})

export const InputWrapper = styled.div({
  position: 'relative',
})

export const Input = styled.input<{ $error?: boolean }>(({ $error }) => ({
  width: '100%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${$error ? 'oklch(0.65 0.18 25)' : theme.colors.border}`,
  backgroundColor: theme.colors.background,
  fontSize: '0.9375rem',
  color: theme.colors.foreground,
  fontFamily: theme.fonts.sans,
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': {
    borderColor: $error ? 'oklch(0.65 0.18 25)' : theme.colors.primary,
  },
  '&::placeholder': { color: theme.colors.mutedForeground },
}))

export const EyeBtn = styled.button({
  position: 'absolute',
  right: theme.spacing[3],
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing[1],
  '& svg': { width: '1rem', height: '1rem' },
})

export const ErrorBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.95 0.05 25)',
  border: `1px solid oklch(0.85 0.1 25)`,
  borderRadius: theme.radius.xl,
  fontSize: '0.875rem',
  color: 'oklch(0.55 0.2 25)',
  '& svg': { width: '1rem', height: '1rem', flexShrink: 0 },
})

export const SubmitButton = styled.button<{ $loading: boolean }>(({ $loading }) => ({
  width: '100%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.xl,
  border: 'none',
  backgroundColor: theme.colors.primary,
  color: '#fff',
  fontSize: '0.9375rem',
  fontWeight: 600,
  fontFamily: theme.fonts.sans,
  cursor: $loading ? 'not-allowed' : 'pointer',
  opacity: $loading ? 0.7 : 1,
  transition: `all ${theme.transitions.fast}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  '&:hover:not(:disabled)': { opacity: 0.9 },
  '&:active': { transform: 'scale(0.98)' },
  '& svg': { width: '1rem', height: '1rem' },
}))

export const ForgotLink = styled.button({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  textAlign: 'right',
  width: '100%',
  padding: 0,
  '&:hover': { color: theme.colors.primary },
})
