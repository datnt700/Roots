'use client'

import { useSession } from 'next-auth/react'

/**
 * Returns the authenticated user's ID from the JWT session.
 * Returns null while loading or if not authenticated.
 * Pages under /app/* are protected by middleware, so null is transient only.
 */
export function useUserId(): string | null {
  const { data: session } = useSession()
  return session?.user?.id ?? null
}
