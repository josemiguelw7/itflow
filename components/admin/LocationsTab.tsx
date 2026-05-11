'use client'
import { useState } from 'react'
import { ADMIN_LOCATIONS, type AdminLocation } from '@/lib/data/admin'

export function LocationsTab({ canManage = true }: { canManage?: boolean }) {
  const [locs, setLocs] = useState<AdminLocation[]>(ADMIN_LOCATIONS)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }
  function toggleActive(id: string) {
    if (!canManage) return
    setLocs(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l))
    showToast('Location updated')
  }

  return (
    <div>
      {toast && <div style={{ position:'fixed', bottom:24, right:24, zIndex:500, background:'#161b22', border:'1px solid rgba(42,191,160,0.3)', borderRadius:9, padding:'12px 18px', fontSize:13, color:'var(--teal)' }}>{toast}</div>}

      {!canManage && <div style={{ marginBottom:14, padding:'9px 14px', background:'rgba(59,139,250,0.06)', border:'1px solid rgba(59,139,250,0.15)', borderRadius:8, fontSize:12, color:'#3B8BFA', display:'flex', alignItems:'center', gap:8 }}>🔒 Read-only — contact Admin to add or deactivate locations</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ fontSize:13, color:'#8b949e' }}>{locs.length} sites · {locs.filter(l=>l.active).length} active</div>
        {canManage && <button style={{ background:'var(--teal)', color:'#0d1117', border:'none', borderRadius:7, padding:'7px 14px', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Add site</button>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:12 }}>
        {locs.map(loc => (
          <div key={loc.id} style={{
            background:'#161b22',
            border:`1px solid ${loc.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
            borderRadius:10, padding:'16px 18px',
            opacity: loc.active ? 1 : 0.6,
          }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{
                  width:36, height:36, borderRadius:8, flexShrink:0,
                  background:'rgba(42,191,160,0.1)',
                  border:'1px solid rgba(42,191,160,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:700, color:'var(--teal)',
                }}>{loc.code}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{loc.name}</div>
                  <div style={{ fontSize:11, color:'#8b949e', marginTop:1 }}>{loc.timezone}</div>
                </div>
              </div>
              <span style={{
                fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:10,
                background: loc.active ? 'rgba(57,211,83,0.12)' : 'rgba(139,148,158,0.12)',
                color: loc.active ? '#39D353' : '#8b949e',
              }}>{loc.active ? 'Active' : 'Inactive'}</span>
            </div>

            <div style={{ fontSize:12, color:'#8b949e', marginBottom:12, lineHeight:1.4 }}>{loc.address}</div>

            <div style={{ display:'flex', gap:16, marginBottom:14 }}>
              <div style={{ flex:1, background:'rgba(255,255,255,0.03)', borderRadius:7, padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--teal)' }}>{loc.totalAssets}</div>
                <div style={{ fontSize:10, color:'#8b949e' }}>Assets</div>
              </div>
              <div style={{ flex:1, background:'rgba(255,255,255,0.03)', borderRadius:7, padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#3B8BFA' }}>{loc.activeUsers}</div>
                <div style={{ fontSize:10, color:'#8b949e' }}>Users</div>
              </div>
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <button style={{ flex:1, padding:'6px', borderRadius:6, fontSize:11, background:'transparent', color:'#8b949e', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
                Edit
              </button>
              <button onClick={() => toggleActive(loc.id)} style={{ flex:1, padding:'6px', borderRadius:6, fontSize:11, background:'transparent', color: loc.active ? '#FF6B2B' : '#39D353', border:`1px solid ${loc.active ? 'rgba(255,107,43,0.2)' : 'rgba(57,211,83,0.2)'}`, cursor:'pointer' }}>
                {loc.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
