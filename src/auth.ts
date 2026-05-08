/**
 * auth.ts — NextAuth v5 (Auth.js) configuration
 *
 * OAuth provider priority: Google → Facebook → Apple → Credentials (email/password)
 *
 * Security notes:
 * - OAuth tokens are NOT stored in plaintext — @auth/prisma-adapter handles them
 * - Passwords are hashed with scrypt (N=32768, salt=16B) before storage
 * - User email is stored encrypted in DB; emailHash for lookups
 * - NEVER store raw tokens or plaintext passwords
 *
 * Required env vars:
 *   AUTH_SECRET             — openssl rand -hex 32
 *   AUTH_GOOGLE_ID          — Google Cloud Console → OAuth 2.0
 *   AUTH_GOOGLE_SECRET
 *   AUTH_FACEBOOK_ID        — Meta for Developers
 *   AUTH_FACEBOOK_SECRET
 *   AUTH_APPLE_ID           — Apple Developer → Services → Sign in with Apple
 *   AUTH_APPLE_SECRET       — Generated private key (PEM format)
 *   DATABASE_URL            — Neon PostgreSQL connection string
 */

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Apple from 'next-auth/providers/apple'
import Credentials from 'next-auth/providers/credentials'
import { scryptSync, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { encrypt, hashEmail, decrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'

const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
const facebookClientId = process.env.AUTH_FACEBOOK_ID
const facebookClientSecret = process.env.AUTH_FACEBOOK_SECRET
const appleClientId = process.env.AUTH_APPLE_ID
const appleClientSecret = process.env.AUTH_APPLE_SECRET

const oauthProviders = [
  googleClientId && googleClientSecret
    ? Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        allowDangerousEmailAccountLinking: true,
      })
    : null,
  facebookClientId && facebookClientSecret
    ? Facebook({
        clientId: facebookClientId,
        clientSecret: facebookClientSecret,
        allowDangerousEmailAccountLinking: true,
      })
    : null,
  appleClientId && appleClientSecret
    ? Apple({
        clientId: appleClientId,
        clientSecret: appleClientSecret,
        allowDangerousEmailAccountLinking: true,
      })
    : null,
].filter(Boolean)

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use Prisma adapter for persistent sessions + OAuth account linking
  adapter: PrismaAdapter(db),

  secret: process.env.AUTH_SECRET,

  // Use JWT strategy so client-side session works without extra DB round-trips
  session: { strategy: 'jwt' },

  // Custom pages
  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    ...oauthProviders,

    // ── Email + Password (fallback) ─────────────────────────────────────
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)
          ?.toLowerCase()
          .trim()
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        try {
          // Lookup by hashed email (never decrypt-then-compare)
          const emailHash = hashEmail(email)
          const user = await db.user.findUnique({ where: { emailHash } })

          if (!user || !user.passwordHash) {
            logger.warn('auth', 'authorize: user not found or no password', {
              email,
            })
            return null
          }

          const [saltHex, hashHex] = user.passwordHash.split(':')
          const derived = scryptSync(password, Buffer.from(saltHex, 'hex'), 32)
          const valid = timingSafeEqual(derived, Buffer.from(hashHex, 'hex'))
          if (!valid) {
            logger.warn('auth', 'authorize: password mismatch', {
              userId: user.id,
            })
            return null
          }

          logger.info('auth', 'authorize: success', { userId: user.id })
          return {
            id: user.id,
            email: decrypt(user.email),
            name: decrypt(user.displayName),
            image: user.image ?? null,
          }
        } catch (err) {
          logger.error('auth', 'authorize: unexpected error', { email }, err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    // Persist user.id into the JWT so we can access it in server components
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
        token.provider = account?.provider ?? 'credentials'
      }
      return token
    },

    // Expose userId and provider in the session object
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string
        session.user.provider = token.provider as string
      }
      return session
    },

    // On OAuth sign-in: create or link the User record with encrypted fields
    async signIn({ user, account }) {
      // Credentials flow is handled entirely in authorize() above
      if (account?.provider === 'credentials') return true

      const email = user.email
      if (!email) return false

      const emailHash = hashEmail(email)
      const existing = await db.user.findUnique({ where: { emailHash } })

      if (!existing) {
        // Create a new User with encrypted personal data
        const name = user.name ?? email.split('@')[0]
        await db.user.create({
          data: {
            email: encrypt(email),
            emailHash,
            displayName: encrypt(name),
            image: user.image ?? null,
            emailVerified: new Date(),
          },
        })
      }

      return true
    },
  },
})

// ─── Type augmentation ────────────────────────────────────────────────────────
// Makes session.user.id and session.user.provider available without casting.

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      provider: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
