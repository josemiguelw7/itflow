'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_ACCOUNTS } from '@/lib/data/demo'

const ROLE_PERMISSIONS: Record<string, string[]> = {
  TECHNICIAN:       ['View inventory','Submit requests','Ship & receive','View dashboard'],
  SITE_MANAGER:     ['All Technician access','Approve/reject requests','Site health alerts','Manage team'],
  REGIONAL_MANAGER: ['All sites visibility','Cross-site reports','Inventory balancing','Transfer trends'],
  ADMIN:            ['Full platform access','User management','Catalog management','Integrations config'],
}

export default function DemoPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(email: string, password: string, role: string) {
    setLoading(role)
    // Store demo session in localStorage — no real auth needed for demo
    localStorage.setItem('itflow_demo_user', JSON.stringify(
      DEMO_ACCOUNTS.find(a => a.email === email)
    ))
    // Small delay for effect
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, background: 'var(--teal)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>ITFlow</div>
            <div style={{ fontSize: 13, color: '#8b949e' }}>IT Inventory Platform</div>
          </div>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.5px' }}>
          Interactive Demo
        </h1>
        <p style={{ fontSize: 15, color: '#8b949e', maxWidth: 480, lineHeight: 1.6 }}>
          Explore ITFlow as different roles. Each account has the same password —
          <strong style={{ color: '#e6edf3' }}> demo1234</strong> — and a fully pre-loaded
          environment with 8 sites and real inventory data.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: 16, padding: '8px 16px',
          background: 'rgba(245,166,35,0.08)',
          border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: 8, fontSize: 13, color: '#F5A623',
        }}>
          <span>⊞</span> You are in the <strong>Demo environment</strong> — no real data affected
        </div>
      </div>

      {/* Role cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
        width: '100%',
        maxWidth: 1100,
        marginBottom: 48,
      }}>
        {DEMO_ACCOUNTS.map(account => {
          const isLoading  = loading === account.role
          const perms      = ROLE_PERMISSIONS[account.role]

          return (
            <div key={account.role} style={{
              background: '#161b22',
              border: `1px solid ${loading === account.role ? account.color + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'all 0.2s',
              cursor: 'default',
            }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `${account.color}22`,
                  border: `2px solid ${account.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: account.color, flexShrink: 0,
                }}>
                  {account.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{account.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: account.color, marginTop: 1 }}>
                    {account.role.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Site badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#8b949e' }}>Home site:</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                  background: `${account.color}18`, color: account.color,
                }}>
                  {account.siteCode} — {account.site}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.5, margin: 0 }}>
                {account.desc}
              </p>

              {/* Permissions */}
              <div style={{ flex: 1 }}>
                {perms.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', fontSize: 12, color: '#8b949e' }}>
                    <span style={{ color: account.color, fontSize: 10 }}>✓</span>
                    {p}
                  </div>
                ))}
              </div>

              {/* Credentials */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, padding: '10px 12px',
                fontSize: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#8b949e' }}>Email</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#e6edf3' }}>{account.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Password</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#e6edf3' }}>demo1234</span>
                </div>
              </div>

              {/* Login button */}
              <button
                onClick={() => handleLogin(account.email, account.password, account.role)}
                disabled={!!loading}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  background: isLoading ? `${account.color}22` : account.color,
                  color: isLoading ? account.color : '#0d1117',
                  border: isLoading ? `1px solid ${account.color}` : 'none',
                  transition: 'all 0.2s',
                  opacity: loading && !isLoading ? 0.5 : 1,
                }}
              >
                {isLoading
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: `2px solid ${account.color}`, borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }} />
                      Logging in…
                    </span>
                  : `Enter as ${account.name.split(' ')[0]} →`
                }
              </button>
            </div>
          )
        })}
      </div>

      {/* Site overview strip */}
      <div style={{
        width: '100%', maxWidth: 1100,
        background: '#161b22',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '24px',
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Demo environment — 8 sites pre-loaded</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { code:'ATX', name:'Austin HQ',     assets:312, color:'#2ABFA0', flag:'HQ'      },
            { code:'CHI', name:'Chicago',        assets:218, color:'#3B8BFA', flag:''        },
            { code:'SEA', name:'Seattle',        assets:248, color:'#39D353', flag:''        },
            { code:'NYC', name:'New York',       assets:168, color:'#E8407A', flag:''        },
            { code:'SFO', name:'San Francisco',  assets:183, color:'#00D4FF', flag:''        },
            { code:'BOS', name:'Boston',         assets:149, color:'#B06BC8', flag:''        },
            { code:'DEN', name:'Denver',         assets:71,  color:'#F5A623', flag:'⚠ Low'  },
            { code:'MIA', name:'Miami',          assets:44,  color:'#FF6B2B', flag:'🔴 Crit' },
          ].map(s => (
            <div key={s.code} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                background: `${s.color}18`,
                border: `1px solid ${s.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: s.color,
              }}>{s.code}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#8b949e' }}>{s.assets} assets</div>
              </div>
              {s.flag && <span style={{ fontSize: 10, fontWeight: 600, color: s.flag.includes('Crit') ? '#FF6B2B' : '#F5A623' }}>{s.flag}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: 12, color: '#8b949e', textAlign: 'center' }}>
        ITFlow Demo · All data is fictional · No real systems are affected
        <br />
        <span style={{ color: '#3B8BFA', cursor: 'pointer', marginTop: 4, display: 'inline-block' }} onClick={() => window.location.href = '/login'}>
          ← Back to real login
        </span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
