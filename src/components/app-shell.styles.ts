import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { theme } from '@/lib/theme'

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOTTOM_NAV_HEIGHT = '4.5rem'
export const TOP_HEADER_HEIGHT = '3.5rem'
export const SIDEBAR_WIDTH = '15rem'
export const SIDEBAR_WIDTH_COLLAPSED = '4.5rem'

// ─── Animations ───────────────────────────────────────────────────────────────

export const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`

export const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
`

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

// ─── Styled — Layout shell ────────────────────────────────────────────────────

export const Shell = styled.div({
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
export const Sidebar = styled('aside', { shouldForwardProp: (p) => p !== '$collapsed' })<{ $collapsed?: boolean }>(({ $collapsed }) => ({
  display: 'none',
  '@media (min-width: 1024px)': {
    display: 'flex',
    flexDirection: 'column',
    width: $collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
    minHeight: '100dvh',
    // Glass surface
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(16px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
    borderRight: `1px solid ${theme.colors.border}`,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 30,
    padding: `${theme.spacing[6]} 0`,
    transition: `width 350ms cubic-bezier(0.4, 0, 0.2, 1)`,
    overflow: 'hidden',
  },
}))

export const SidebarLogo = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `0 ${theme.spacing[4]} ${theme.spacing[5]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  marginBottom: theme.spacing[4],
  flexShrink: 0,
})

export const SidebarLogoMark = styled.div({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
})

export const SidebarLogoText = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '-0.025em',
})

export const SidebarLogoSub = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginLeft: theme.spacing[1],
})

export const BrandName = styled.span({
  fontFamily: theme.fonts.serif,
  fontWeight: 700,
  fontSize: '1.125rem',
})

export const NavChevron = styled(ChevronRight)({
  marginLeft: 'auto',
  width: '0.875rem',
  height: '0.875rem',
  opacity: 0.5,
})

export const SidebarNav = styled.nav({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  padding: `0 ${theme.spacing[3]}`,
})

export const SidebarLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$active' && prop !== 'viewTransition',
})<{ $active: boolean }>(({ $active }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  paddingLeft: `calc(${theme.spacing[3]} + 8px)`, // space for left indicator
  borderRadius: theme.radius.xl,
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: $active ? 600 : 400,
  color: $active ? theme.colors.primary : theme.colors.mutedForeground,
  backgroundColor: 'transparent',
  whiteSpace: 'nowrap',
  transition: `color ${theme.transitions.fast}`,
  // Left accent indicator
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '4px',
    top: '22%',
    height: '56%',
    width: '3px',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    opacity: $active ? 1 : 0,
    transform: $active ? 'scaleY(1)' : 'scaleY(0.3)',
    transition: `opacity ${theme.transitions.fast}, transform ${theme.transitions.normal}`,
  },
  // Hover: lift icon
  '&:hover': {
    color: $active ? theme.colors.primary : theme.colors.foreground,
    '& svg': { transform: 'translateY(-1.5px)' },
  },
  '& svg': {
    flexShrink: 0,
    width: '1.125rem',
    height: '1.125rem',
    transition: `transform ${theme.transitions.fast}`,
  },
  // Collapsed: center icons, hide text
  '[data-collapsed="true"] &': {
    justifyContent: 'center',
    padding: `${theme.spacing[2]}`,
    paddingLeft: theme.spacing[2],
    '&::before': { display: 'none' },
    '& > span': { display: 'none' },
  },
}))

export const SidebarBottom = styled.div({
  padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
  borderTop: `1px solid ${theme.colors.border}`,
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  flexShrink: 0,
})

export const SidebarAction = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  paddingLeft: `calc(${theme.spacing[3]} + 8px)`,
  borderRadius: theme.radius.xl,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  width: '100%',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  transition: `color ${theme.transitions.fast}, background ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: theme.colors.muted,
    color: theme.colors.foreground,
    '& svg': { transform: 'translateY(-1.5px)' },
  },
  '& svg': {
    flexShrink: 0,
    width: '1.125rem',
    height: '1.125rem',
    transition: `transform ${theme.transitions.fast}`,
  },
  // Collapsed: center icons
  '[data-collapsed="true"] &': {
    justifyContent: 'center',
    padding: `${theme.spacing[2]}`,
    paddingLeft: theme.spacing[2],
    '& > span': { display: 'none' },
  },
})

// Main content wrapper
export const MainContent = styled('div', { shouldForwardProp: (p) => p !== '$collapsed' })<{ $collapsed?: boolean }>(({ $collapsed }) => ({
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
    marginLeft: $collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
    minHeight: '100dvh',
    overflowY: 'visible',
    bottom: 'auto',
    top: 'auto',
    transition: `margin-left 350ms cubic-bezier(0.4, 0, 0.2, 1)`,
  },
}))

// Top header — mobile only
export const TopHeader = styled.header({
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

export const TopHeaderLogo = styled.span({
  fontFamily: theme.fonts.serif,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  letterSpacing: '-0.02em',
})

export const HeaderActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
})

export const IconButton = styled.button({
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

export const NotifBadgeWrap = styled.div({
  position: 'relative',
  display: 'flex',
})

export const NotifBadge = styled.div({
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

export const PageContent = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

export const NotifDropdown = styled.div({
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

export const NotifDropdownHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
})

export const NotifDropdownTitle = styled.span({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.colors.foreground,
})

export const NotifDropdownSeeAll = styled(Link)({
  fontSize: '0.75rem',
  color: theme.colors.primary,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': { textDecoration: 'underline' },
})

export const NotifDropdownList = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

export const NotifDropdownItem = styled.div<{ $unread: boolean }>(
  ({ $unread }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    backgroundColor: $unread ? 'oklch(0.88 0.06 155 / 0.07)' : 'transparent',
    borderBottom: `1px solid ${theme.colors.border}`,
    '&:last-child': { borderBottom: 'none' },
  }),
)

export const NotifDropdownDot = styled.div({
  width: '0.45rem',
  height: '0.45rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  flexShrink: 0,
  marginTop: '0.375rem',
})

export const NotifDropdownDotPlaceholder = styled.div({
  width: '0.45rem',
  flexShrink: 0,
})

export const NotifDropdownBody = styled.div({
  flex: 1,
  minWidth: 0,
})

export const NotifDropdownItemTitle = styled.div({
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: theme.colors.foreground,
  lineHeight: 1.4,
})

export const NotifDropdownItemMeta = styled.div({
  fontSize: '0.7rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

// ─── Bottom Nav — mobile only ─────────────────────────────────────────────────

export const BottomNav = styled.nav({
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

export const BottomNavItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$active' && prop !== 'viewTransition',
})<{ $active: boolean }>(({ $active }) => ({
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

export const BottomNavDot = styled.div<{ $active: boolean }>(({ $active }) => ({
  position: 'absolute',
  top: '0.3rem',
  width: '0.3rem',
  height: '0.3rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  opacity: $active ? 1 : 0,
  transition: `opacity ${theme.transitions.fast}`,
}))

export const NavIcon = styled.div<{ $active: boolean }>(({ $active }) => ({
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

export const NavLabel = styled.span({
  fontSize: '0.625rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  lineHeight: 1,
})

// ─── Mobile Sidebar Overlay ───────────────────────────────────────────────────

export const Overlay = styled.div({
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

export const MobileSidebarPanel = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: '80vw',
  maxWidth: '18rem',
  zIndex: 51,
  // Glass surface (same as desktop sidebar)
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(20px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
  borderRight: `1px solid ${theme.colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing[6]} 0`,
  animation: `${slideIn} 0.25s ease`,
  willChange: 'transform',
})

export const MobileSidebarHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing[5]} ${theme.spacing[5]}`,
  borderBottom: `1px solid ${theme.colors.border}`,
  marginBottom: theme.spacing[4],
})

export const CloseButton = styled.button({
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

// ─── Record FAB ───────────────────────────────────────────────────────────────

export const RecordFAB = styled(Link)({
  position: 'fixed',
  bottom: `calc(${BOTTOM_NAV_HEIGHT} + ${theme.spacing[4]})`,
  right: theme.spacing[4],
  zIndex: 35,
  width: '3.25rem',
  height: '3.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 16px oklch(0.65 0.18 155 / 0.4)',
  transition: `all ${theme.transitions.fast}`,
  textDecoration: 'none',
  '&:hover': {
    transform: 'scale(1.07)',
    boxShadow: '0 6px 20px oklch(0.65 0.18 155 / 0.5)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& svg': {
    width: '1.375rem',
    height: '1.375rem',
    strokeWidth: 2,
  },
  '@media (min-width: 1024px)': {
    bottom: theme.spacing[6],
    right: theme.spacing[6],
  },
})

// ─── Sidebar additions ────────────────────────────────────────────────────────

// Clay-style Record button — most prominent item in sidebar
export const SidebarRecordLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  borderRadius: theme.radius['2xl'],
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#fff',
  whiteSpace: 'nowrap',
  // Clay surface
  background: 'linear-gradient(145deg, oklch(0.52 0.12 155), oklch(0.38 0.12 155))',
  boxShadow: [
    '4px 4px 10px var(--clay-depth)',
    '-2px -2px 6px var(--clay-highlight)',
    'inset 1px 1px 4px var(--clay-highlight)',
    'inset -2px -2px 5px var(--clay-depth)',
  ].join(', '),
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    '& svg': { transform: 'translateY(-1.5px)' },
  },
  '&:active': {
    transform: 'scale(0.97)',
    boxShadow: [
      '1px 1px 4px rgba(0,0,0,0.14)',
      'inset 3px 3px 8px var(--clay-depth)',
      'inset -1px -1px 4px var(--clay-highlight)',
    ].join(', '),
  },
  '& svg': {
    flexShrink: 0,
    width: '1.125rem',
    height: '1.125rem',
    transition: `transform ${theme.transitions.fast}`,
  },
  // Collapsed: icon only, centered
  '[data-collapsed="true"] &': {
    justifyContent: 'center',
    padding: `${theme.spacing[2]}`,
    '& > span': { display: 'none' },
  },
})

// Notification dot on sidebar nav items
export const SidebarNotifDot = styled.span({
  marginLeft: 'auto',
  width: '0.4rem',
  height: '0.4rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.destructive,
  flexShrink: 0,
  '[data-collapsed="true"] &': { display: 'none' },
})

// Thin separator between sections
export const SidebarSeparator = styled.div({
  height: '1px',
  backgroundColor: theme.colors.border,
  margin: `${theme.spacing[2]} ${theme.spacing[3]}`,
  flexShrink: 0,
})

// Collapse toggle button in logo area
export const SidebarCollapseBtn = styled.button({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.625rem',
  height: '1.625rem',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    backgroundColor: theme.colors.muted,
    color: theme.colors.foreground,
  },
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// User profile row at bottom
export const SidebarUserSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  paddingLeft: `calc(${theme.spacing[3]} + 8px)`,
  borderRadius: theme.radius.xl,
  cursor: 'default',
  whiteSpace: 'nowrap',
  marginBottom: theme.spacing[1],
  '[data-collapsed="true"] &': {
    justifyContent: 'center',
    padding: `${theme.spacing[2]}`,
    paddingLeft: theme.spacing[2],
  },
})

export const SidebarAvatar = styled.div({
  width: '1.875rem',
  height: '1.875rem',
  borderRadius: theme.radius.full,
  background: 'linear-gradient(145deg, oklch(0.52 0.12 155), oklch(0.40 0.12 155))',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.6875rem',
  fontWeight: 700,
  flexShrink: 0,
})

export const SidebarUserInfo = styled.div({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  '[data-collapsed="true"] &': { display: 'none' },
})

export const SidebarUserName = styled.div({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.colors.foreground,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 1.3,
})

export const SidebarUserRole = styled.div({
  fontSize: '0.7rem',
  color: theme.colors.mutedForeground,
  lineHeight: 1.3,
})
