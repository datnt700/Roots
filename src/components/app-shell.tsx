'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { signOut, useSession } from 'next-auth/react'
import {
  Shell, Sidebar, SidebarLogo, SidebarLogoMark, SidebarLogoText, SidebarLogoSub, SidebarCollapseBtn,
  BrandName,
  SidebarNav, SidebarLink, SidebarRecordLink, SidebarSeparator, SidebarNotifDot,
  SidebarBottom, SidebarAction,
  SidebarUserSection, SidebarAvatar, SidebarUserInfo, SidebarUserName, SidebarUserRole,
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
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const unreadCount = MOCK_NOTIFS.filter((n) => n.unread).length

  const userName = session?.user?.name ?? 'You'
  const userInitial = userName[0]?.toUpperCase() ?? 'U'

  const isActive = (href: string) =>
    mounted
      ? href === '/app'
        ? pathname === '/app'
        : pathname.startsWith(href)
      : false

  const sidebarNav = (
    <>
      <SidebarNav>
        {/* Record — Claymorphism featured button */}
        <SidebarRecordLink
          href="/app/record"
          onClick={() => setSidebarOpen(false)}
        >
          <Mic />
          <span>{t('nav.record')}</span>
        </SidebarRecordLink>

        <SidebarSeparator />

        {NAV_ITEMS.map(({ key, href, icon: Icon }) => (
          <SidebarLink
            key={key}
            href={href}
            $active={isActive(href)}
            onClick={() => setSidebarOpen(false)}
            //viewTransition
          >
            <Icon />
            <span>{t(`nav.${key}` as Parameters<typeof t>[0])}</span>
            {key === 'feedback' && unreadCount > 0 && <SidebarNotifDot />}
          </SidebarLink>
        ))}
      </SidebarNav>
      <SidebarBottom>
        {/* User profile */}
        <SidebarUserSection>
          <SidebarAvatar>{userInitial}</SidebarAvatar>
          <SidebarUserInfo>
            <SidebarUserName>{userName}</SidebarUserName>
            <SidebarUserRole>Người con</SidebarUserRole>
          </SidebarUserInfo>
        </SidebarUserSection>

        <SidebarAction onClick={() => {}}>
          <Settings />
          <span>{t('sidebar.settings')}</span>
        </SidebarAction>
        <SidebarAction style={{ color: 'var(--destructive)' }} onClick={() => signOut({ redirectTo: '/login' })}>
          <LogOut />
          <span>{t('sidebar.logout')}</span>
        </SidebarAction>
      </SidebarBottom>
    </>
  )

  return (
    <Shell>
      {/* Desktop sidebar */}
      <Sidebar $collapsed={collapsed} data-collapsed={collapsed ? 'true' : undefined}>
        <SidebarLogo>
          <SidebarLogoMark>
            <SidebarLogoText>GỐC</SidebarLogoText>
            {!collapsed && <SidebarLogoSub>ROOTS</SidebarLogoSub>}
          </SidebarLogoMark>
          <SidebarCollapseBtn
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeft />}
          </SidebarCollapseBtn>
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
      <MainContent $collapsed={collapsed}>
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
              //viewTransition
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
