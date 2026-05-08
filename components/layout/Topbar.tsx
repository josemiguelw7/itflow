'use client'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

const ORGS = [
  { id: 'org_demo', name: 'Demo Environment', is_demo: true },
  { id: 'org_prod', name: 'Production',        is_demo: false },
]

export function Topbar({ user }: { user: User }) {
  const [org, setOrg] = useState(ORGS[0])
  const [open, setOpen] = useState(false)
  const initials = (user.email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <header style={{
      height: 56,
      background: '#161b22',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      flexShrink: 0,
      position: 'relative',
    }}>
      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: org.is_demo ? 'rgba(245,166,35,0.12)' : 'rgba(42,191,160,0.12)',
            border: `1px solid ${org.is_demo ? 'rgba(245,166,35,0.3)' : 'rgba(42,191,160,0.3)'}`,
            borderRadius: 6,
            padding: '5px 10px',
            fontSize: 12,
            fontWeight: 600,
            color: org.is_demo ? 'var(--amber)' : 'var(--teal)',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          {org.name}
          <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: '#1c2128',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 4,
            zIndex: 100,
            minWidth: 180,
          }}>
            {ORGS.map(o => (
              <button
                key={o.id}
                onClick={() => { setOrg(o); setOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 12px',
                  background: o.id === org.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#e6edf3',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: o.is_demo ? 'var(--amber)' : 'var(--teal)',
                  flexShrink: 0,
                }} />
                {o.name}
                {o.id === org.id && <span style={{ marginLeft: 'auto', color: 'var(--teal)', fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--teal), var(--blue))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, cursor: 'pointer',
      }}>
        {initials}
      </div>
    </header>
  )
}
