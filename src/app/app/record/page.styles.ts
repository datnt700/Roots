import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

// ─── Animations ───────────────────────────────────────────────────────────────

export const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.08); opacity: 0.85; }
`

export const waveAnim = keyframes`
  0%, 100% { height: 0.5rem; }
  50%       { height: 2.5rem; }
`

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Page = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100dvh - 3.5rem)',
  backgroundColor: theme.colors.background,
  overflowX: 'hidden',
})

export const ScrollArea = styled.div({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
  paddingBottom: theme.spacing[4],
  maxWidth: '48rem',
  margin: '0 auto',
  width: '100%',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

export const PageHeader = styled.div({
  marginBottom: theme.spacing[6],
  animation: `${fadeUp} 0.3s ease both`,
})

export const PageTitle = styled.h1({
  fontFamily: theme.fonts.serif,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.colors.foreground,
  lineHeight: 1.2,
})

export const PageSubtitle = styled.p({
  fontSize: '0.875rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[1],
  lineHeight: 1.5,
})

// ─── Cards / Sections ─────────────────────────────────────────────────────────

export const Card = styled.div({
  // Glass surface — consistent with all other app cards
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
})

export const CardLabel = styled.div({
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[3],
})

// ─── Parent selector ──────────────────────────────────────────────────────────

export const ParentDropdown = styled.div({
  marginTop: theme.spacing[2],
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.card,
  overflow: 'hidden',
  boxShadow: theme.shadows.md,
})

export const ParentOption = styled.button<{ $selected: boolean }>(
  ({ $selected }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    border: 'none',
    backgroundColor: $selected ? 'oklch(0.88 0.06 155 / 0.12)' : 'transparent',
    color: $selected ? theme.colors.primary : theme.colors.foreground,
    fontSize: '0.9375rem',
    fontWeight: $selected ? 600 : 400,
    cursor: 'pointer',
    textAlign: 'left',
    transition: `background-color ${theme.transitions.fast}`,
    '&:hover': { backgroundColor: 'oklch(0.88 0.06 155 / 0.08)' },
  }),
)

export const SelectButton = styled.button({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  borderRadius: theme.radius.xl,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  cursor: 'pointer',
  fontSize: '0.9375rem',
  color: theme.colors.foreground,
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
  },
  '& svg': {
    width: '1rem',
    height: '1rem',
    color: theme.colors.mutedForeground,
  },
})

// ─── Prompt card ──────────────────────────────────────────────────────────────

export const PromptInputField = styled.textarea({
  width: '100%',
  resize: 'none',
  border: `1.5px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  fontSize: '0.9375rem',
  color: theme.colors.foreground,
  backgroundColor: theme.colors.background,
  fontFamily: theme.fonts.sans,
  lineHeight: 1.6,
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': {
    borderColor: theme.colors.primary,
  },
  '&::placeholder': {
    color: theme.colors.mutedForeground,
  },
})

export const SuggestionRow = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  flexWrap: 'wrap',
  marginTop: theme.spacing[3],
  alignItems: 'flex-start',
})

export const SuggestionChip = styled.button<{ $active: boolean }>(
  ({ $active }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    borderRadius: theme.radius.full,
    border: `1.5px solid ${$active ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: $active ? 'oklch(0.88 0.06 155 / 0.12)' : 'transparent',
    color: $active ? theme.colors.primary : theme.colors.mutedForeground,
    fontSize: '0.8125rem',
    fontWeight: $active ? 500 : 400,
    cursor: 'pointer',
    textAlign: 'left',
    lineHeight: 1.4,
    transition: `all ${theme.transitions.fast}`,
    '&:hover': {
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      backgroundColor: 'oklch(0.88 0.06 155 / 0.08)',
    },
  }),
)

export const SuggestionMoreBtn = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.full,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  cursor: 'pointer',
  flexShrink: 0,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    borderColor: theme.colors.foreground,
    color: theme.colors.foreground,
  },
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Photo upload ─────────────────────────────────────────────────────────────

export const PhotoUploadArea = styled.label({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing[2],
  height: '7rem',
  border: `2px dashed ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  cursor: 'pointer',
  color: theme.colors.mutedForeground,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  },
  '& svg': { width: '1.5rem', height: '1.5rem' },
})

export const PhotoPreviewWrapper = styled.div({
  position: 'relative',
  borderRadius: theme.radius.xl,
  overflow: 'hidden',
  height: '10rem',
})

export const PhotoPreviewImg = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const RemovePhoto = styled.button({
  position: 'absolute',
  top: theme.spacing[2],
  right: theme.spacing[2],
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: theme.radius.full,
  backgroundColor: 'rgba(0,0,0,0.5)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  '& svg': { width: '0.875rem', height: '0.875rem' },
})

// ─── Recording controls ───────────────────────────────────────────────────────

export const RecordingSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing[6],
  padding: `${theme.spacing[6]} 0 ${theme.spacing[4]}`,
})

export const RecordButton = styled.button<{ $recording: boolean }>(
  ({ $recording }) => ({
    width: '5rem',
    height: '5rem',
    borderRadius: theme.radius.full,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $recording ? '#dc2626' : theme.colors.primary,
    color: '#fff',
    boxShadow: $recording
      ? '0 0 0 0.5rem rgba(220, 38, 38, 0.2)'
      : `0 0 0 0.5rem oklch(0.88 0.06 155 / 0.2)`,
    animation: $recording ? `${pulse} 1.5s ease-in-out infinite` : 'none',
    transition: `background-color ${theme.transitions.fast}`,
    willChange: 'transform',
    transform: 'translateZ(0)',
    '& svg': { width: '1.75rem', height: '1.75rem' },
  }),
)

export const RecordingTimer = styled.div({
  fontSize: '2rem',
  fontFamily: theme.fonts.mono,
  fontWeight: 600,
  color: theme.colors.foreground,
  letterSpacing: '0.05em',
})

export const WaveformRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.2rem',
  height: '3rem',
})

export const WaveBar = styled.div<{ $delay: number; $active: boolean }>(
  ({ $delay, $active }) => ({
    width: '0.2rem',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    opacity: $active ? 1 : 0.2,
    animation: $active
      ? `${waveAnim} ${0.8 + $delay * 0.1}s ease-in-out infinite`
      : 'none',
    height: '0.5rem',
    alignSelf: 'center',
    willChange: 'transform',
    transform: 'translateZ(0)',
  }),
)

// ─── Playback ─────────────────────────────────────────────────────────────────

export const PlaybackBar = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
})

export const PlaybackBtn = styled.button({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: theme.radius.full,
  // Mild clay for playback controls
  background: 'linear-gradient(145deg, oklch(0.52 0.12 155), oklch(0.40 0.12 155))',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexShrink: 0,
  boxShadow: [
    '3px 3px 8px var(--clay-depth)',
    '-2px -2px 5px var(--clay-highlight)',
    'inset 1px 1px 3px var(--clay-highlight)',
    'inset -2px -2px 4px var(--clay-depth)',
  ].join(', '),
  transition: `all ${theme.transitions.fast}`,
  '&:active': {
    transform: 'scale(0.94)',
    boxShadow: [
      '1px 1px 4px rgba(0,0,0,0.12)',
      'inset 3px 3px 6px var(--clay-depth)',
      'inset -1px -1px 3px var(--clay-highlight)',
    ].join(', '),
  },
  '& svg': { width: '1rem', height: '1rem' },
})

export const ProgressTrack = styled.div({
  flex: 1,
  height: '0.25rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.muted,
  position: 'relative',
  cursor: 'pointer',
})

export const ProgressFill = styled.div<{ $pct: number }>(({ $pct }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: `${$pct}%`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  transition: 'width 0.1s linear',
}))

export const PlaybackTime = styled.span({
  fontSize: '0.75rem',
  fontFamily: theme.fonts.mono,
  color: theme.colors.mutedForeground,
  flexShrink: 0,
})

// ─── Decade selector ─────────────────────────────────────────────────────────

export const DecadeGrid = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[2],
})

export const DecadeChip = styled.button<{ $selected: boolean }>(
  ({ $selected }) => ({
    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
    borderRadius: theme.radius.full,
    border: `1.5px solid ${$selected ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: $selected ? 'oklch(0.88 0.06 155 / 0.15)' : 'transparent',
    color: $selected ? theme.colors.primary : theme.colors.mutedForeground,
    fontSize: '0.8125rem',
    fontWeight: $selected ? 600 : 400,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
  }),
)

// ─── Save button ──────────────────────────────────────────────────────────────

export const SaveBtn = styled.button<{ $disabled: boolean }>(
  ({ $disabled }) => ({
    width: '100%',
    padding: `${theme.spacing[4]}`,
    borderRadius: theme.radius.xl,
    backgroundColor: $disabled ? theme.colors.muted : theme.colors.primary,
    color: $disabled ? theme.colors.mutedForeground : '#fff',
    border: 'none',
    cursor: $disabled ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    transition: `all ${theme.transitions.fast}`,
    '& svg': { width: '1.125rem', height: '1.125rem' },
  }),
)

export const SecondaryBtn = styled.button({
  width: '100%',
  padding: `${theme.spacing[3]}`,
  borderRadius: theme.radius.xl,
  backgroundColor: 'transparent',
  color: theme.colors.mutedForeground,
  border: `1.5px solid ${theme.colors.border}`,
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[2],
  marginTop: theme.spacing[2],
  '& svg': { width: '1rem', height: '1rem' },
})

export const SuccessBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  padding: theme.spacing[4],
  backgroundColor: 'oklch(0.88 0.06 155 / 0.12)',
  border: `1px solid oklch(0.88 0.06 155 / 0.3)`,
  borderRadius: theme.radius.xl,
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
})

export const SuccessIcon = styled.div({
  width: '2rem',
  height: '2rem',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& svg': { width: '1rem', height: '1rem', color: '#fff' },
})

export const SuccessTitle = styled.div({
  fontWeight: 600,
  fontSize: '0.9375rem',
  color: theme.colors.foreground,
})

export const SuccessSubtitle = styled.div({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  marginTop: '0.125rem',
})

export const HiddenAudio = styled.audio({
  display: 'none',
})

export const HiddenFileInput = styled.input({
  display: 'none',
})

export const PhotoUploadLabel = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 500,
})

export const ParentRelationshipHint = styled.span({
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
})

export const RecordStatus = styled.div({
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
})

export const SaveSection = styled.div({
  paddingBottom: theme.spacing[4],
})

export const SpinnerIcon = styled.div({
  display: 'contents',
  '& svg': {
    animation: `${spin} 1s linear infinite`,
    width: '1.125rem',
    height: '1.125rem',
  },
})

export const SkeletonInput = styled.div({
  height: '2.75rem',
  borderRadius: '0.875rem',
})

// ─── Pause / Resume button ────────────────────────────────────────────────────

export const RecordControls = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[4],
})

export const PauseResumeBtn = styled.button({
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: theme.radius.full,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: 'transparent',
  color: theme.colors.foreground,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  transition: `all ${theme.transitions.fast}`,
  '&:hover': {
    borderColor: theme.colors.foreground,
    backgroundColor: theme.colors.muted,
  },
  '& svg': { width: '1.125rem', height: '1.125rem' },
})

// ─── Quick Title input ────────────────────────────────────────────────────────

export const TitleInput = styled.input({
  width: '100%',
  border: `1.5px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  fontSize: '0.9375rem',
  color: theme.colors.foreground,
  backgroundColor: theme.colors.background,
  fontFamily: theme.fonts.sans,
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': { borderColor: theme.colors.primary },
  '&::placeholder': { color: theme.colors.mutedForeground },
})

// ─── Private Reflection ───────────────────────────────────────────────────────

export const ReflectionTextarea = styled.textarea({
  width: '100%',
  resize: 'none',
  border: `1.5px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  fontSize: '0.875rem',
  color: theme.colors.foreground,
  backgroundColor: theme.colors.background,
  fontFamily: theme.fonts.sans,
  lineHeight: 1.6,
  outline: 'none',
  transition: `border-color ${theme.transitions.fast}`,
  '&:focus': { borderColor: theme.colors.primary },
  '&::placeholder': { color: theme.colors.mutedForeground },
  '&:disabled': { opacity: 0.6, cursor: 'default' },
})

export const ReflectionHint = styled.p({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: '0.75rem',
  color: theme.colors.mutedForeground,
  marginTop: theme.spacing[2],
  '& svg': { width: '0.75rem', height: '0.75rem', flexShrink: 0 },
})

// ─── Draft restored banner ────────────────────────────────────────────────────

export const DraftBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  backgroundColor: 'oklch(0.95 0.03 80)',
  border: `1px solid oklch(0.85 0.05 80)`,
  borderRadius: theme.radius.xl,
  fontSize: '0.8125rem',
  color: theme.colors.mutedForeground,
  marginBottom: theme.spacing[4],
  animation: `${fadeUp} 0.3s ease both`,
  '& svg': { width: '0.875rem', height: '0.875rem', flexShrink: 0, color: theme.colors.primary },
})
