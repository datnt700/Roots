/**
 * middleware.ts — Route protection via Auth.js session
 *
 * Uses a lightweight JWT-only auth config (no Prisma, no Node.js crypto)
 * so it runs cleanly in the Edge Runtime.
 *
 * Protected:   /app/*  → redirect to /login if not authenticated
 * Public:      /parent/* → QR token flow, no auth needed
 *              /login, /register, /api/auth/* → always accessible
 *              / → landing page, always accessible
 */
import NextAuth from 'next-auth'

// Minimal Edge-compatible config: JWT only, no adapter, no DB, no crypto
const { auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  providers: [],
  callbacks: {
    authorized({ auth }) {
      // auth is null when no JWT session exists
      return !!auth
    },
  },
})

export default auth

export const config = {
  matcher: [
    // Only protect /app/* — all other routes are public
    '/app/:path*',
  ],
}
