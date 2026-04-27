import styled from '@emotion/styled'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { theme } from '@/lib/theme'

export const Section = styled.section({
  position: 'relative',
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: theme.colors.foreground,
  color: theme.colors.background,
  overflow: 'hidden',
})

export const BackgroundDecoration = styled.div({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
})

export const DecorationCircle = styled.div<{ $position: 'top' | 'bottom' }>(
  ({ $position: position }) => ({
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(48px)',
    ...(position === 'top'
      ? {
          top: 0,
          left: '25%',
          width: '24rem',
          height: '24rem',
          backgroundColor: 'oklch(0.35 0.08 145 / 0.1)',
        }
      : {
          bottom: 0,
          right: '25%',
          width: '16rem',
          height: '16rem',
          backgroundColor: 'oklch(0.55 0.12 55 / 0.1)',
        }),
  }),
)

export const Container = styled.div({
  position: 'relative',
  maxWidth: '56rem',
  margin: '0 auto',
  padding: `0 ${theme.spacing[6]}`,
  textAlign: 'center',
  '@media (min-width: 1024px)': {
    padding: `0 ${theme.spacing[8]}`,
  },
})

export const ContentWrapper = styled.div<{ $isVisible: boolean }>(({ $isVisible }) => ({
  transition: `all 1s ease`,
  opacity: $isVisible ? 1 : 0,
  transform: $isVisible ? 'translateY(0)' : 'translateY(2rem)',
  willChange: 'transform, opacity',
}))

export const QuoteSection = styled.div({
  marginBottom: theme.spacing[12],
})

export const QuoteIcon = styled.svg({
  width: '3rem',
  height: '3rem',
  margin: `0 auto ${theme.spacing[6]}`,
  color: 'oklch(0.35 0.08 145 / 0.6)',
})

export const QuoteText = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 300,
  lineHeight: 1.6,
  marginBottom: theme.spacing[4],
  textWrap: 'balance',
  '@media (min-width: 768px)': {
    fontSize: '2.25rem',
  },
  '@media (min-width: 1024px)': {
    fontSize: '3rem',
  },
})

export const QuoteHighlight = styled.p({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.primary,
  '@media (min-width: 768px)': {
    fontSize: '2.25rem',
  },
  '@media (min-width: 1024px)': {
    fontSize: '3rem',
  },
})

export const VisionText = styled.p({
  fontSize: '1.125rem',
  color: 'oklch(0.97 0.01 85 / 0.7)',
  maxWidth: '42rem',
  margin: `0 auto ${theme.spacing[12]}`,
  lineHeight: 1.6,
  '@media (min-width: 768px)': {
    fontSize: '1.25rem',
  },
})

export const FormWrapper = styled.form({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
  maxWidth: '38rem',
  margin: `0 auto ${theme.spacing[8]}`,
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
})

export const InputWrapper = styled.div({
  position: 'relative',
  width: '100%',
  '@media (min-width: 640px)': {
    width: 'auto',
    flex: 1,
  },
})

export const MailIcon = styled(Mail)({
  position: 'absolute',
  left: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '1.25rem',
  height: '1.25rem',
  color: 'oklch(0.97 0.01 85 / 0.4)',
})

export const EmailInput = styled.input({
  width: '100%',
  height: '3.5rem',
  paddingLeft: '3rem',
  paddingRight: '1rem',
  backgroundColor: 'oklch(0.97 0.01 85 / 0.1)',
  border: '1px solid oklch(0.97 0.01 85 / 0.2)',
  borderRadius: theme.radius.full,
  color: theme.colors.background,
  fontSize: '1rem',
  outline: 'none',
  transition: `all ${theme.transitions.fast}`,
  '&::placeholder': {
    color: 'oklch(0.97 0.01 85 / 0.4)',
  },
  '&:focus': {
    borderColor: 'oklch(0.35 0.08 145 / 0.5)',
    boxShadow: '0 0 0 3px oklch(0.35 0.08 145 / 0.2)',
  },
})

export const SubmitButton = styled(Button)({
  width: '100%',
  height: '3.5rem',
  backgroundColor: theme.colors.primary,
  color: theme.colors.primaryForeground,
  borderRadius: theme.radius.full,
  padding: `0 ${theme.spacing[8]}`,
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: '0 10px 15px -3px oklch(0.35 0.08 145 / 0.3)',
  '@media (min-width: 640px)': {
    width: 'auto',
  },
  '&:hover': {
    backgroundColor: 'oklch(0.35 0.08 145 / 0.9)',
  },
})

export const SuccessCard = styled.div({
  backgroundColor: 'oklch(0.35 0.08 145 / 0.2)',
  border: '1px solid oklch(0.35 0.08 145 / 0.3)',
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[6],
  maxWidth: '30rem',
  margin: `0 auto ${theme.spacing[8]}`,
})

export const SuccessTitle = styled.p({
  color: theme.colors.primary,
  fontWeight: 500,
  marginBottom: theme.spacing[1],
})

export const SuccessText = styled.p({
  color: 'oklch(0.97 0.01 85 / 0.7)',
  fontSize: '0.875rem',
})

export const ErrorText = styled.p({
  color: theme.colors.destructive,
  fontSize: '0.875rem',
  marginBottom: theme.spacing[6],
})

export const SecondaryCTAs = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
  fontSize: '0.875rem',
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
})

export const SecondaryButton = styled(Button)({
  color: 'oklch(0.97 0.01 85 / 0.7)',
  borderRadius: theme.radius.full,
  '&:hover': {
    color: theme.colors.background,
    backgroundColor: 'oklch(0.97 0.01 85 / 0.1)',
  },
})

export const Divider = styled.span({
  display: 'none',
  color: 'oklch(0.97 0.01 85 / 0.3)',
  '@media (min-width: 640px)': {
    display: 'block',
  },
})
