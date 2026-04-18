import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const baseStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  textDecoration: 'none',
  '&:disabled': {
    pointerEvents: 'none',
    opacity: 0.5,
  },
  '&:focus-visible': {
    boxShadow: '0 0 0 2px var(--ring)',
  },
  '& svg': {
    pointerEvents: 'none',
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
  },
})

const variantStyles = {
  default: css({
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    '&:hover': {
      backgroundColor: 'var(--primary)',
      opacity: 0.9,
    },
  }),
  destructive: css({
    backgroundColor: 'var(--destructive)',
    color: 'white',
    '&:hover': {
      opacity: 0.9,
    },
  }),
  outline: css({
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    '&:hover': {
      backgroundColor: 'var(--accent)',
      color: 'var(--accent-foreground)',
    },
  }),
  secondary: css({
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    '&:hover': {
      opacity: 0.8,
    },
  }),
  ghost: css({
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'var(--accent)',
      color: 'var(--accent-foreground)',
    },
  }),
  link: css({
    backgroundColor: 'transparent',
    color: 'var(--primary)',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  }),
}

const sizeStyles = {
  default: css({
    height: '2.25rem',
    padding: '0.5rem 1rem',
  }),
  sm: css({
    height: '2rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
  }),
  lg: css({
    height: '2.5rem',
    padding: '0.5rem 1.5rem',
  }),
  icon: css({
    width: '2.25rem',
    height: '2.25rem',
    padding: 0,
  }),
  'icon-sm': css({
    width: '2rem',
    height: '2rem',
    padding: 0,
  }),
  'icon-lg': css({
    width: '2.5rem',
    height: '2.5rem',
    padding: 0,
  }),
}

type ButtonVariant = keyof typeof variantStyles
type ButtonSize = keyof typeof sizeStyles

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot ref={ref} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        {...props}
      >
        {children}
      </StyledButton>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
