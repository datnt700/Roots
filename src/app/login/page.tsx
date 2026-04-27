'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import {
  Page, Card, LogoBadge, LogoMark, LogoText, LogoSub,
  OAuthStack, OAuthButton, OAuthIcon,
  Divider, DividerText,
  TabRow, Tab,
  FormStack, FieldGroup, FieldLabel, InputWrapper, Input, EyeBtn,
  ErrorBanner, SubmitButton, ForgotLink,
} from './page.styles'

// ─── Brand Icons ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 9a9 9 0 1 0-10.406 8.892V11.62H5.309V9h2.285V7.017c0-2.256 1.343-3.503 3.4-3.503.985 0 2.015.176 2.015.176v2.215h-1.135c-1.118 0-1.467.694-1.467 1.406V9h2.496l-.399 2.62h-2.097v6.272A9.003 9.003 0 0 0 18 9z" fill="#1877F2"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.477 0c.07.82-.225 1.63-.7 2.23-.497.628-1.295 1.115-2.1 1.061-.09-.79.252-1.62.72-2.197C10.888.484 11.73 0 12.477 0zm2.854 6.432c-.09.055-1.838 1.056-1.818 3.156.021 2.51 2.2 3.343 2.237 3.357-.025.087-.345 1.182-1.14 2.303-.692.98-1.415 1.956-2.51 1.973-1.073.018-1.42-.637-2.648-.637-1.228 0-1.613.618-2.63.655-1.057.037-1.862-1.046-2.563-2.022C2.612 13.12 1.546 9.99 2.782 7.877c.607-1.044 1.69-1.703 2.866-1.72 1.042-.018 2.025.7 2.664.7.64 0 1.84-.866 3.098-.74.527.022 2.006.214 2.956 1.609l-.035.006z" fill="currentColor"/>
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
