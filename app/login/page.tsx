'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0d1117',
    }}>
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '40px 48px', width: 380,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--teal)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>📦</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>ITFlow</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>IT Inventory Platform</div>
          </div>
        </div>

        {sent ? (
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Check your email</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              We sent a magic link to <strong style={{ color: '#e6edf3' }}>{email}</strong>.<br />
              Click it to sign in — no password needed.
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Work email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com" required
              style={{
                width: '100%', background: '#0d1117',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6, padding: '9px 12px', fontSize: 14,
                color: '#e6edf3', outline: 'none', marginBottom: 12,
              }}
            />
            {error && <div style={{ fontSize: 12, color: 'var(--orange)', marginBottom: 10 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'var(--teal)', color: '#0d1117',
              border: 'none', borderRadius: 6, padding: 10,
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
