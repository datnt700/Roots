'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import {
  Home,
  Mic,
  Film,
  Clock,
  MessageSquare,
  Plus,
  X,
  ChevronRight,
  Settings,
  LogOut,
  Users,
  Menu,
  Bell,
} from 'lucide-react'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'
import { signOut } from 'next-auth/react'

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'dashboard', href: '/app', icon: Home },
  { key: 'record', href: '/app/record', icon: Mic },
  { key: 'studio', href: '/app/studio', icon: Film },
  { key: 'timeline', href: '/app/timeline', icon: Clock },
  { key: 'feedback', href: '/app/feedback', icon: MessageSquare },
  { key: 'parents', href: '/app/parents', icon: Users },
] as const

const BOTTOM_NAV_HEIGHT = '4.5rem'
const TOP_HEADER_HEIGHT = '3.5rem'
const SIDEBAR_WIDTH = '16rem'

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

// ─── Styled — Layout shell ────────────────────────────────────────────────────

const Shell = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  maxHeight: '100dvh',
  overflow: 'hidden',
  backgroundColor: theme.colors.background,
  position: 'relative',
  '@media (min-width: 1024px)': {
    flexDirection: 'row',
    height: 'auto',
    minHeight: '100dvh',
    maxHeight: 'none',
    overflow: 'visible',
  },
})

// Left sidebar — desktop only
const Sidebar = styled.aside({
  display: 'none',
  '@media (min-width: 1024px)': {
    display: 'flex',
    flexDirection: 'column',
    width: SIDEBAR_WIDTH,
    minHeight: '100dvh',
    borderRight: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.card,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 30,
    padding: `${theme.spacing[6]} 0`,
  },
})

const SidebarLogo = styled.div({
  padding: `0 ${theme.spacing[6]} ${theme.spacing[6]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  marginBottom: theme.spacing[4],
})

const SidebarLogoText = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '-0.025em',
})

const SidebarLogoSub = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginLeft: theme.spacing[1],
})

const SidebarNav = styled.nav({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  padding: `0 ${theme.spacing[3]}`,
})

const SidebarLink = styled(Link, { shouldForwardProp: (prop) => prop !== '$active' && prop !== 'viewTransition' })<{ $active: boolean }>(({ $active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  backgroundColor: $active ? 'oklch(0.88 0.06 155 / 0.15)' : 'transparent',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: $active
      ? 'oklch(0.88 0.06 155 / 0.2)'
      : theme.colors.muted,
    color: $active ? theme.colors.primary : theme.colors.foreground,
  },
  '& svg': {
    flexShrink: 0,
    width: '1.125rem',
    height: '1.125rem',
  },
}))

const SidebarBottom = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[3]}`,
  borderTop: `1px solid ${theme.colors.border}`,
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
})

const SidebarAction = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
  borderRadius: theme.radius.lg,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  width: '100%',
  textAlign: 'left',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: theme.colors.muted,
    color: theme.colors.foreground,
  },
  '& svg': {
    flexShrink: 0,
    width: '1.125rem',
    height: '1.125rem',
  },
})

// Main content wrapper — fixed between header and bottom nav on mobile, normal flow on desktop
const MainContent = styled.div({
  position: 'fixed',
  top: TOP_HEADER_HEIGHT,
  bottom: BOTTOM_NAV_HEIGHT,
  left: 0,
  right: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  backgroundColor: theme.colors.background,
  '@media (min-width: 1024px)': {
    position: 'static',
    flex: 1,
    marginLeft: SIDEBAR_WIDTH,
    minHeight: '100dvh',
    overflowY: 'visible',
    bottom: 'auto',
    top: 'auto',
  },
})

// Top header — mobile only
const TopHeader = styled.header({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 20,
  height: TOP_HEADER_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.97 0.005 80 / 0.9)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${theme.colors.border}`,
  '@media (min-width: 1024px)': {
    display: 'none',
  },
})

const TopHeaderLogo = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '-0.02em',
})

const HeaderActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
})

const IconButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: theme.radius.lg,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: theme.colors.foreground,
  transition: `background ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: theme.colors.muted,
  },
  '& svg': {
    width: '1.25rem',
    height: '1.25rem',
  },
})

const NotifBadgeWrap = styled.div({
  position: 'relative',
  display: 'flex',
})

const NotifBadge = styled.div({
  position: 'absolute',
  top: '-0.125rem',
  right: '-0.125rem',
  minWidth: '1rem',
  height: '1rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  fontSize: '0.625rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  padding: '0 0.2rem',
  border: '1.5px solid var(--background)',
})

const PageContent = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

const NotifDropdown = styled.div({
  position: 'fixed',
  top: `calc(${TOP_HEADER_HEIGHT} + 0.5rem)`,
  right: theme.spacing[3],
  width: 'min(22rem, calc(100vw - 1.5rem))',
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius['2xl'],
  boxShadow: theme.shadows.lg,
  zIndex: 60,
  overflow: 'hidden',
  animation: `${fadeIn} 0.15s ease`,
})

const NotifDropdownHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
})

const NotifDropdownTitle = styled.span({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

const NotifDropdownSeeAll = styled(Link)({
  fontSize: '0.75rem',
  color: theme.colors.primary,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': { textDecoration: 'underline' },
})

const NotifDropdownList = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const NotifDropdownItem = styled.div<{ $unread: boolean }>(({ $unread }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing[3],
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  backgroundColor: $unread ? 'oklch(0.88 0.06 155 / 0.07)' : 'transparent',
  borderBottom: `1px solid ${theme.colors.border}`,
  '&:last-child': { borderBottom: 'none' },
}))

const NotifDropdownDot = styled.div({
  width: '0.45rem',
  height: '0.45rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  flexShrink: 0,
  marginTop: '0.375rem',
})

const NotifDropdownDotPlaceholder = styled.div({
  width: '0.45rem',
  flexShrink: 0,
})

const NotifDropdownBody = styled.div({
  flex: 1,
  minWidth: 0,
})

const NotifDropdownItemTitle = styled.div({
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: theme.colors.foreground,
  lineHeight: 1.4,
})

const NotifDropdownItemMeta = styled.div({
  fontSize: '0.7rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

// ─── Bottom Nav — mobile only ─────────────────────────────────────────────────

const BottomNav = styled.nav({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 40,
  height: BOTTOM_NAV_HEIGHT,
  willChange: 'transform',
  display: 'flex',
  alignItems: 'stretch',
  backgroundColor: 'oklch(0.97 0.005 80 / 0.95)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderTop: `1px solid ${theme.colors.border}`,
  paddingBottom: 'env(safe-area-inset-bottom)',
  animation: `${slideUp} 0.3s ease`,
  '@media (min-width: 1024px)': {
    display: 'none',
  },
})

const BottomNavItem = styled(Link, { shouldForwardProp: (prop) => prop !== '$active' && prop !== 'viewTransition' })<{ $active: boolean }>(({ $active }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  textDecoration: 'none',
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  transition: `color ${theme.transitions.fast}, transform 100ms ease`,
  position: 'relative',
  paddingTop: theme.spacing[1],
  '&:active': {
    opacity: 0.7,
    transform: 'scale(0.92)',
  },
}))

const BottomNavDot = styled.div<{ $active: boolean }>(({ $active }) => ({
  position: 'absolute',
  top: '0.3rem',
  width: '0.3rem',
  height: '0.3rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  opacity: $active ? 1 : 0,
  transition: `opacity ${theme.transitions.fast}`,
}))

const NavIcon = styled.div<{ $active: boolean }>(({ $active }) => ({
  width: '1.375rem',
  height: '1.375rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '100%',
    height: '100%',
    strokeWidth: $active ? 2.2 : 1.8,
  },
}))

const NavLabel = styled.span({
  fontSize: '0.625rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  lineHeight: 1,
})

// ─── Mobile Sidebar Overlay ────────────────────────────────────────────────────

const Overlay = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  backgroundColor: 'rgba(0,0,0,0.4)',
  animation: `${fadeIn} 0.2s ease`,
  willChange: 'opacity',
  '@media (min-width: 1024px)': {
    display: 'none',
  },
})

const MobileSidebarPanel = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: '80vw',
  maxWidth: '18rem',
  zIndex: 51,
  backgroundColor: theme.colors.card,
  borderRight: `1px solid ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing[6]} 0`,
  animation: `${slideIn} 0.25s ease`,
  willChange: 'transform',
})

const MobileSidebarHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing[5]} ${theme.spacing[5]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  marginBottom: theme.spacing[4],
})

const CloseButton = styled.button({
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
  '&:hover': { backgroundColor: theme.colors.muted },
  '& svg': { width: '1.125rem', height: '1.125rem' },
})

// ─── Component ────────────────────────────────────────────────────────────────

interface AppShellProps {
  children: React.ReactNode
}

const MOCK_NOTIFS = [
  { id: '1', title: 'Bố Hùng completed a new recording', meta: '2 hours ago', unread: true },
  { id: '2', title: "Memory 'Childhood home' is ready to review", meta: '5 hours ago', unread: true },
  { id: '3', title: 'Mẹ Lan has 3 pending feedback responses', meta: '1 day ago', unread: false },
  { id: '4', title: 'New story prompt available for Bà Nội', meta: '2 days ago', unread: false },
  { id: '5', title: 'Timeline updated with 2 new memories', meta: '3 days ago', unread: false },
]

export function AppShell({ children }: AppShellProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const unreadCount = MOCK_NOTIFS.filter((n) => n.unread).length

  const isActive = (href: string) =>
    mounted
      ? href === '/app'
        ? pathname === '/app'
        : pathname.startsWith(href)
      : false

  const sidebarNav = (
    <>
      <SidebarNav>
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => (
          <SidebarLink
            key={key}
            href={href}
            $active={isActive(href)}
            onClick={() => setSidebarOpen(false)}
            viewTransition
          >
            <Icon />
            {t(`app.nav.${key}` as Parameters<typeof t>[0])}
            {isActive(href) && (
              <ChevronRight
                style={{
                  marginLeft: 'auto',
                  width: '0.875rem',
                  height: '0.875rem',
                  opacity: 0.5,
                }}
              />
            )}
          </SidebarLink>
        ))}
      </SidebarNav>
      <SidebarBottom>
        <SidebarAction>
          <Users />
          {t('app.sidebar.parents')}
        </SidebarAction>
        <SidebarAction>
          <Settings />
          {t('app.sidebar.settings')}
        </SidebarAction>
        <SidebarAction style={{ color: 'var(--destructive)' }} onClick={() => signOut({ redirectTo: '/login' })}>
          <LogOut />
          {t('app.sidebar.logout')}
        </SidebarAction>
      </SidebarBottom>
    </>
  )

  return (
    <Shell>
      {/* Desktop sidebar */}
      <Sidebar>
        <SidebarLogo>
          <SidebarLogoText>GỐC</SidebarLogoText>
          <SidebarLogoSub>ROOTS</SidebarLogoSub>
        </SidebarLogo>
        {sidebarNav}
      </Sidebar>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <Overlay onClick={() => setSidebarOpen(false)} />
          <MobileSidebarPanel>
            <MobileSidebarHeader>
              <span
                style={{
                  fontFamily: theme.fonts.serif,
                  fontWeight: 700,
                  fontSize: '1.125rem',
                }}
              >
                GỐC <SidebarLogoSub>ROOTS</SidebarLogoSub>
              </span>
              <CloseButton onClick={() => setSidebarOpen(false)}>
                <X />
              </CloseButton>
            </MobileSidebarHeader>
            {sidebarNav}
          </MobileSidebarPanel>
        </>
      )}

      {/* Main content */}
      <MainContent>
        {/* Mobile top header */}
        <TopHeader>
          <TopHeaderLogo>GỐC</TopHeaderLogo>
          <HeaderActions>
            <NotifBadgeWrap>
              <IconButton aria-label="Notifications" onClick={() => setNotifOpen((o) => !o)}>
                <Bell />
              </IconButton>
              {unreadCount > 0 && <NotifBadge>{unreadCount}</NotifBadge>}
            </NotifBadgeWrap>
            <IconButton
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </IconButton>
          </HeaderActions>
        </TopHeader>

        <PageContent>{children}</PageContent>
      </MainContent>

      {/* Notification dropdown */}
      {notifOpen && (
        <>
          <Overlay style={{ backgroundColor: 'transparent', zIndex: 59 }} onClick={() => setNotifOpen(false)} />
          <NotifDropdown>
            <NotifDropdownHeader>
              <NotifDropdownTitle>Notifications</NotifDropdownTitle>
              <NotifDropdownSeeAll href="/app/feedback" onClick={() => setNotifOpen(false)}>
                See all
              </NotifDropdownSeeAll>
            </NotifDropdownHeader>
            <NotifDropdownList>
              {MOCK_NOTIFS.map((n) => (
                <NotifDropdownItem key={n.id} $unread={n.unread}>
                  {n.unread ? <NotifDropdownDot /> : <NotifDropdownDotPlaceholder />}
                  <NotifDropdownBody>
                    <NotifDropdownItemTitle>{n.title}</NotifDropdownItemTitle>
                    <NotifDropdownItemMeta>{n.meta}</NotifDropdownItemMeta>
                  </NotifDropdownBody>
                </NotifDropdownItem>
              ))}
            </NotifDropdownList>
          </NotifDropdown>
        </>
      )}

      {/* Bottom nav — mobile */}
      <BottomNav>
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <BottomNavItem
              key={key}
              href={href}
              $active={active}
              viewTransition
            >
              <BottomNavDot $active={active} />
              <NavIcon $active={active}>
                <Icon />
              </NavIcon>
              <NavLabel>
                {t(`app.nav.${key}` as Parameters<typeof t>[0])}
              </NavLabel>
            </BottomNavItem>
          )
        })}
      </BottomNav>
    </Shell>
  )
}
