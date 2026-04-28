'use client'

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@/lib/theme'

const shimmer = keyframes`
  from { background-position: -400px 0; }
  to   { background-position:  400px 0; }
`

const skeletonBase = {
  backgroundColor: theme.colors.muted,
  backgroundImage:
    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
  backgroundSize: '400px 100%',
  backgroundRepeat: 'no-repeat' as const,
  animation: `${shimmer} 1.4s ease-in-out infinite`,
}

const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '52rem',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})

const TitleLine = styled.div({
  width: '9rem',
  height: '1.5rem',
  borderRadius: theme.radius.lg,
  marginBottom: theme.spacing[2],
  ...skeletonBase,
})

const SubtitleLine = styled.div({
  width: '14rem',
  height: '0.875rem',
  borderRadius: theme.radius.md,
  marginBottom: theme.spacing[5],
  ...skeletonBase,
})

const FilterRow = styled.div({
  display: 'flex',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[4],
})

const Chip = styled.div<{ $w: string }>(({ $w }) => ({
  width: $w,
  height: '2rem',
  borderRadius: theme.radius.full,
  ...skeletonBase,
}))

const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  padding: '1.25rem',
  marginBottom: theme.spacing[4],
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

const CardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

const Circle = styled.div({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  flexShrink: 0,
  ...skeletonBase,
})

const Line = styled.div<{ $w?: string; $h?: string; $mb?: string }>(
  ({ $w = '100%', $h = '0.875rem', $mb }) => ({
    width: $w,
    height: $h,
    borderRadius: '0.375rem',
    marginBottom: $mb,
    ...skeletonBase,
  }),
)

const Block = styled.div<{ $h?: string }>(({ $h = '3.5rem' }) => ({
  width: '100%',
  height: $h,
  borderRadius: '0.75rem',
  ...skeletonBase,
}))

export default function StudioLoading() {
  return (
    <Page>
      <TitleLine />
      <SubtitleLine />

      <FilterRow>
        <Chip $w="4rem" />
        <Chip $w="6rem" />
        <Chip $w="5.5rem" />
      </FilterRow>

      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Circle />
            <div style={{ flex: 1 }}>
              <Line $w="40%" $mb="0.5rem" />
              <Line $w="25%" $h="0.75rem" />
            </div>
          </CardHeader>
          <Line $w="80%" />
          <Block />
        </Card>
      ))}
    </Page>
  )
}
