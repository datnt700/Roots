'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div({
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

const Card = styled.div({
  width: '100%',
  maxWidth: '24rem',
  backgroundColor: '#fff',
  borderRadius: '1.75rem',
  border: `1px solid oklch(0.55 0.1 155 / 0.12)`,
  boxShadow: '0 4px 40px oklch(0.55 0.1 155 / 0.08)',
  padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  animation: `${fadeUp} 0.4s ease both`,
})

const LogoBadge = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing[6],
})

const LogoMark = styled.div({
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

const LogoText = styled.div({
  fontFamily: theme.fonts.serif,
  fontSize: '1.375rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '0.06em',
})

const LogoSub = styled.div({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.25rem',
  textAlign: 'center',
})

// ─── OAuth buttons ────────────────────────────────────────────────────────────

const OAuthStack = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[5],
})

const OAuthButton = styled.button<{ $loading?: boolean }>(({ $loading }) => ({
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

const OAuthIcon = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
})

// ─── Divider ──────────────────────────────────────────────────────────────────

const Divider = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[5],
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: 'oklch(0.55 0.05 155 / 0.15)',
  },
})

const DividerText = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  whiteSpace: 'nowrap',
})

// ─── Tabs (login / register) ──────────────────────────────────────────────────

const TabRow = styled.div({
  display: 'flex',
  backgroundColor: 'oklch(0.93 0.02 155 / 0.4)',
  borderRadius: '0.875rem',
  padding: '0.25rem',
  marginBottom: theme.spacing[5],
})

const Tab = styled.button<{ $active: boolean }>(({ $active }) => ({
  flex: 1,
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: '0.625rem',
  border: 'none',
  backgroundColor: $active ? '#fff' : 'transparent',
  color: $active ? theme.colors.foreground : theme.colors.mutedForeground,
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  boxShadow: $active ? '0 1px 4px oklch(0.55 0.1 155 / 0.1)' : 'none',
}))

// ─── Form ─────────────────────────────────────────────────────────────────────

const FormStack = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})

const FieldGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

const FieldLabel = styled.label({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

const InputWrapper = styled.div({
  position: 'relative',
})

const Input = styled.input<{ $error?: boolean }>(({ $error }) => ({
  width: '100%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: '0.875rem',
  border: `1.5px solid ${$error ? 'oklch(0.65 0.15 20)' : 'oklch(0.55 0.05 155 / 0.2)'}`,
  backgroundColor: '#fff',
  color: theme.colors.foreground,
  fontSize: '0.9375rem',
  fontFamily: theme.fonts.sans,
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': { borderColor: theme.colors.primary },
  '&::placeholder': { color: theme.colors.mutedForeground },
  boxSizing: 'border-box',
}))

const EyeBtn = styled.button({
  position: 'absolute',
  right: theme.spacing[4],
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  '& svg': { width: '1rem', height: '1rem' },
})

const ErrorBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: '0.875rem',
  backgroundColor: 'oklch(0.95 0.04 20)',
  border: '1px solid oklch(0.8 0.08 20)',
  color: 'oklch(0.45 0.15 20)',
  fontSize: '0.8125rem',
  '& svg': { width: '1rem', height: '1rem', flexShrink: 0 },
})

const SubmitButton = styled.button<{ $loading: boolean }>(({ $loading }) => ({
  width: '100%',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: '0.875rem',
  border: 'none',
  backgroundColor: $loading ? 'oklch(0.75 0.06 155)' : theme.colors.primary,
  color: '#fff',
  fontSize: '0.9375rem',
  fontWeight: 700,
  fontFamily: theme.fonts.sans,
  cursor: $loading ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  transition: `all ${theme.transitions.fast}`,
  boxShadow: $loading ? 'none' : '0 4px 12px oklch(0.55 0.1 155 / 0.3)',
  '& svg': { width: '1rem', height: '1rem' },
}))

const ForgotLink = styled.button({
  background: 'none',
  border: 'none',
  color: theme.colors.mutedForeground,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  textAlign: 'right',
  padding: 0,
  '&:hover': { color: theme.colors.primary },
})

// ─── Provider icons (inline SVG, no extra dep) ───────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoadingProvider(provider)
    setError(null)
    await signIn(provider, { callbackUrl: '/app' })
    // signIn will redirect — no need to clear loading
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        // Create account first, then sign in
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, locale: 'vi' }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'Đăng ký thất bại')
          return
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          mode === 'login'
            ? 'Email hoặc mật khẩu không đúng'
            : 'Đăng nhập thất bại sau khi đăng ký',
        )
        return
      }

      router.push('/app')
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <Card>
        {/* Logo */}
        <LogoBadge>
          <LogoMark>🌿</LogoMark>
          <LogoText>GỐC</LogoText>
          <LogoSub>Bảo tàng ký ức gia đình</LogoSub>
        </LogoBadge>

        {/* OAuth buttons — always shown */}
        <OAuthStack>
          <OAuthButton
            type="button"
            $loading={loadingProvider === 'google'}
            onClick={() => handleOAuth('google')}
            disabled={loadingProvider !== null}
          >
            <OAuthIcon>
              {loadingProvider === 'google' ? (
                <Loader2
                  style={{
                    width: 18,
                    height: 18,
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : (
                <GoogleIcon />
              )}
            </OAuthIcon>
            Tiếp tục với Google
          </OAuthButton>

          <OAuthButton
            type="button"
            $loading={loadingProvider === 'facebook'}
            onClick={() => handleOAuth('facebook')}
            disabled={loadingProvider !== null}
          >
            <OAuthIcon>
              {loadingProvider === 'facebook' ? (
                <Loader2 style={{ width: 18, height: 18 }} />
              ) : (
                <FacebookIcon />
              )}
            </OAuthIcon>
            Tiếp tục với Facebook
          </OAuthButton>

          <OAuthButton
            type="button"
            $loading={loadingProvider === 'apple'}
            onClick={() => handleOAuth('apple')}
            disabled={loadingProvider !== null}
          >
            <OAuthIcon>
              {loadingProvider === 'apple' ? (
                <Loader2 style={{ width: 18, height: 18 }} />
              ) : (
                <AppleIcon />
              )}
            </OAuthIcon>
            Tiếp tục với Apple
          </OAuthButton>
        </OAuthStack>

        {/* Divider */}
        <Divider>
          <DividerText>hoặc dùng email</DividerText>
        </Divider>

        {/* Login / Register tabs */}
        <TabRow>
          <Tab
            $active={mode === 'login'}
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
            }}
          >
            Đăng nhập
          </Tab>
          <Tab
            $active={mode === 'register'}
            type="button"
            onClick={() => {
              setMode('register')
              setError(null)
            }}
          >
            Tạo tài khoản
          </Tab>
        </TabRow>

        {/* Error */}
        {error && (
          <ErrorBanner style={{ marginBottom: theme.spacing[3] }}>
            <AlertCircle />
            {error}
          </ErrorBanner>
        )}

        {/* Form */}
        <FormStack onSubmit={handleSubmit}>
          {mode === 'register' && (
            <FieldGroup>
              <FieldLabel htmlFor="name">Tên của bạn</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn Minh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="minh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
              {mode === 'login' && (
                <ForgotLink type="button">Quên mật khẩu?</ForgotLink>
              )}
            </div>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={
                  mode === 'register' ? 'Ít nhất 8 ký tự' : '••••••••'
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === 'register' ? 'new-password' : 'current-password'
                }
                style={{ paddingRight: '3rem' }}
                required
              />
              <EyeBtn
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </EyeBtn>
            </InputWrapper>
          </FieldGroup>

          <SubmitButton type="submit" $loading={loading} disabled={loading}>
            {loading && (
              <Loader2 style={{ animation: 'spin 1s linear infinite' }} />
            )}
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </SubmitButton>
        </FormStack>
      </Card>

      {/* Spin keyframe injected globally via inline style hack */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Page>
  )
}
