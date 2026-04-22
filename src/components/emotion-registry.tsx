'use client'

import { useRef, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache, Options as CacheOptions } from '@emotion/cache'

interface Props {
  options?: Partial<CacheOptions>
  children: React.ReactNode
}

/**
 * Emotion registry for Next.js App Router.
 * Collects styles on the server and flushes them into <head> via
 * useServerInsertedHTML so the client sees className attrs, not inline <style>.
 * This eliminates the SSR/hydration mismatch.
 */
export function EmotionRegistry({ options, children }: Props) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options ?? { key: 'css' })
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null
    let styles = ''
    for (const name of names) {
      styles += cache.inserted[name]
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: required for Emotion SSR
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
