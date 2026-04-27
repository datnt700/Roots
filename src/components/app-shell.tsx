'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Mic,
  Film,
  Clock,
  MessageSquare,
  X,
  Settings,
  LogOut,
  Users,
  Menu,
  Bell,
  Plus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { signOut } from 'next-auth/react'
import {
  BOTTOM_NAV_HEIGHT, TOP_HEADER_HEIGHT, SIDEBAR_WIDTH,
  Shell, Sidebar, SidebarLogo, SidebarLogoText, SidebarLogoSub, BrandName,
  NavChevron, SidebarNav, SidebarLink, SidebarBottom, SidebarAction,
  MainContent, TopHeader, TopHeaderLogo, HeaderActions, IconButton,
  NotifBadgeWrap, NotifBadge, PageContent,
  NotifDropdown, NotifDropdownHeader, NotifDropdownTitle, NotifDropdownSeeAll,
  NotifDropdownList, NotifDropdownItem, NotifDropdownDot, NotifDropdownDotPlaceholder,
  NotifDropdownBody, NotifDropdownItemTitle, NotifDropdownItemMeta,
  BottomNav, BottomNavItem, BottomNavDot, NavIcon, NavLabel,
  Overlay, MobileSidebarPanel, MobileSidebarHeader, CloseButton, RecordFAB,
} from './app-shell.styles'

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'dashboard', href: '/app', icon: Home },
  { key: 'studio', href: '/app/studio', icon: Film },
  { key: 'timeline', href: '/app/timeline', icon: Clock },
  { key: 'feedback', href: '/app/feedback', icon: MessageSquare },
  { key: 'parents', href: '/app/parents', icon: Users },
] as const







// ─── Bottom Nav — mobile only ─────────────────────────────────────────────────



// ─── Mobile Sidebar Overlay ────────────────────────────────────────────────────



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
  const t = useTranslations('app')
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
            {t(`nav.${key}` as Parameters<typeof t>[0])}
            {isActive(href) && <NavChevron />}
          </SidebarLink>
        ))}
      </SidebarNav>
      <SidebarBottom>
        <SidebarAction>
          <Users />
          {t('sidebar.parents')}
        </SidebarAction>
        <SidebarAction>
          <Settings />
          {t('sidebar.settings')}
        </SidebarAction>
        <SidebarAction style={{ color: 'var(--destructive)' }} onClick={() => signOut({ redirectTo: '/login' })}>
          <LogOut />
          {t('sidebar.logout')}
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
              <BrandName>
                GỐC <SidebarLogoSub>ROOTS</SidebarLogoSub>
              </BrandName>
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

      {/* Record FAB — always visible */}
      <RecordFAB href="/app/record" aria-label={t('nav.record')}>
        <Mic />
      </RecordFAB>

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
                {t(`nav.${key}` as Parameters<typeof t>[0])}
              </NavLabel>
            </BottomNavItem>
          )
        })}
      </BottomNav>
    </Shell>
  )
}
