// lib/auth-okta.ts
// PRODUCTION AUTH SWAP — replace lib/auth.ts with this when going live with Okta
//
// HOW TO SWITCH:
//   1. Install: npm install next-auth @next-auth/core
//   2. Replace lib/auth.ts with this file (rename to lib/auth.ts)
//   3. Replace app/login/page.tsx with the Okta login page below
//   4. Replace app/auth/callback/route.ts with the Okta callback below
//   5. Add env vars to Vercel (see bottom of this file)
//   6. Remove middleware.ts and replace with the one below
//   7. Deploy — zero changes needed to any workflow, API route, or UI
//
// Your Prisma schema, workflows, API routes, and all UI pages are UNTOUCHED.
// The swap is entirely in the 3 auth files listed above.

// ─────────────────────────────────────────────────────────────────────────────
// app/api/auth/[...nextauth]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
/*
import NextAuth from 'next-auth'
import OktaProvider from 'next-auth/providers/okta'
import { prisma } from '@/lib/db'

const handler = NextAuth({
  providers: [
    OktaProvider({
      clientId:     process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer:       process.env.OKTA_ISSUER!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      // Upsert user into ITFlow DB on every Okta login
      const existing = await (prisma as any).user.findUnique({ where:{ email:user.email! } })
      if (!existing) {
        await (prisma as any).user.create({
          data: {
            oktaId:     profile?.sub ?? user.email!,
            email:      user.email!,
            name:       user.name ?? '',
            role:       'TECHNICIAN',
            locationId: process.env.DEFAULT_LOCATION_ID!,
            orgId:      'org_prod',
            currentOrgId: 'org_prod',
            orgIds:     ['org_prod'],
          },
        })
      }
      return true
    },
    async jwt({ token, account, profile }) {
      if (account) {
        const dbUser = await (prisma as any).user.findUnique({ where:{ email: token.email! } })
        if (dbUser) {
          token.userId     = dbUser.id
          token.role       = dbUser.role
          token.locationId = dbUser.locationId
          token.orgId      = dbUser.currentOrgId
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.userId     = token.userId as string
      session.user.role       = token.role   as string
      session.user.locationId = token.locationId as string
      session.user.orgId      = token.orgId  as string
      return session
    },
  },
  pages: { signIn: '/login' },
})

export { handler as GET, handler as POST }
*/

// ─────────────────────────────────────────────────────────────────────────────
// app/login/page.tsx  (Okta version — replace existing file)
// ─────────────────────────────────────────────────────────────────────────────
/*
'use client'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0d1117' }}>
      <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'40px 48px', width:380 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <div style={{ width:36, height:36, background:'var(--teal)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📦</div>
          <div>
            <div style={{ fontWeight:600, fontSize:16 }}>ITFlow</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>IT Inventory Platform</div>
          </div>
        </div>
        <button
          onClick={() => signIn('okta', { callbackUrl: '/dashboard' })}
          style={{ width:'100%', background:'var(--teal)', color:'#0d1117', border:'none', borderRadius:6, padding:10, fontSize:14, fontWeight:600, cursor:'pointer' }}
        >
          Sign in with Okta SSO
        </button>
      </div>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────────────────────
// Required Vercel env vars for Okta
// ─────────────────────────────────────────────────────────────────────────────
/*
OKTA_CLIENT_ID=           # From Okta app → General → Client credentials
OKTA_CLIENT_SECRET=       # From Okta app → General → Client credentials
OKTA_ISSUER=              # https://yourorg.okta.com/oauth2/default
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # https://your-production-domain.com

# Okta app setup:
# 1. Okta Admin → Applications → Create App Integration
# 2. Sign-in method: OIDC  |  App type: Web Application
# 3. Sign-in redirect URI: https://your-domain.com/api/auth/callback/okta
# 4. Sign-out redirect URI: https://your-domain.com
# 5. Assignments → assign to IT team group
# 6. Copy Client ID + Secret into Vercel env vars above
*/
