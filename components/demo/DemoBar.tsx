'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding } from '@/components/onboarding/OnboardingProvider'

const DEMO_ROLES = [
  { name:'Alex Rivera', initials:'AR', role:'TECHNICIAN',       roleLabel:'Technician', site:'ATX', email:'tech@itflow-demo.com',     password:'Demo1234!', color:'#8b949e' },
  { name:'Dave',        initials:'DV', role:'SITE_MANAGER',     roleLabel:'Supervisor', site:'CHI', email:'manager@itflow-demo.com',   password:'Demo1234!', color:'#3B8BFA' },
  { name:'Abe',         initials:'AB', role:'REGIONAL_MANAGER', roleLabel:'Manager',    site:'ATX', email:'regional@itflow-demo.com',  password:'Demo1234!', color:'#2ABFA0' },
  { name:'Morgan Chen', initials:'MC', role:'ADMIN',            roleLabel:'Admin',      site:'ATX', email:'admin@itflow-demo.com',     password:'Demo1234!', color:'#E8407A' },
]

export const DEMO_EMAILS = DEMO_ROLES.map(r => r.email)

interface Props { currentEmail: string }

export function DemoBar({ currentEmail }: Props) {
  const [switching, setSwitching] = useState<string | null>(null)
  const supabase  = createClient()
  const { showTour } = useOnboarding()

  const current = DEMO_ROLES.find(r => r.email === currentEmail)
  if (!current) return null

  async function switchRole(role: typeof DEMO_ROLES[0]) {
    if (role.email === currentEmail || switching) return
    setSwitching(role.role)
    await supabase.auth.signOut()
    const { error } = await supabase.auth.signInWithPassword({ email: role.email, password: role.password })
    if (error) { console.error('Demo switch failed:', error); setSwitching(null); return }
    localStorage.removeItem(`itflow_onboarding_${role.email}`)
    // Hard reload so server layout picks up the new session
    window.location.href = '/dashboard'
  }

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:999,
      padding:'10px 16px',
      background:'rgba(13,17,23,0.96)',
      borderTop:'1px solid rgba(255,255,255,0.08)',
    }} data-tour="demo-bar">
      <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', gap:14 }}>

        <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#F5A623', animation:'dp 2s ease-in-out infinite' }} />
          <span style={{ fontSize:11, fontWeight:700, color:'#F5A623', letterSpacing:'0.6px', textTransform:'uppercase' as const }}>Demo</span>
        </div>

        <div style={{ width:1, height:22, background:'rgba(255,255,255,0.1)', flexShrink:0 }} />

        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:`${current.color}22`, border:`1.5px solid ${current.color}66`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:current.color }}>
            {current.initials}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:'#e6edf3', lineHeight:1.2 }}>{current.name}</div>
            <div style={{ fontSize:10, fontWeight:600, color:current.color }}>{current.roleLabel} · {current.site}</div>
          </div>
        </div>

        <div style={{ width:1, height:22, background:'rgba(255,255,255,0.1)', flexShrink:0 }} />

        <span style={{ fontSize:11, color:'#8b949e', flexShrink:0 }}>Switch role:</span>

        <div style={{ display:'flex', gap:6, flex:1 }}>
          {DEMO_ROLES.map(role => {
            const isActive  = role.email === currentEmail
            const isLoading = switching === role.role
            return (
              <button key={role.role} onClick={() => switchRole(role)} disabled={!!switching}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'5px 10px', borderRadius:7,
                  cursor: isActive ? 'default' : switching ? 'not-allowed' : 'pointer',
                  fontSize:11, fontWeight:600, flex:1, justifyContent:'center',
                  border:`1px solid ${isActive ? role.color + '80' : role.color + '30'}`,
                  background: isActive ? `${role.color}18` : `${role.color}08`,
                  color: isActive ? role.color : role.color + '99',
                  opacity: switching && !isActive ? 0.4 : 1,
                  transition:'all 0.15s',
                }}
              >
                {isLoading
                  ? <span style={{ width:10, height:10, borderRadius:'50%', border:`1.5px solid ${role.color}`, borderTopColor:'transparent', display:'inline-block', animation:'ds 0.5s linear infinite' }} />
                  : <div style={{ width:18, height:18, borderRadius:'50%', background:`${role.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700, flexShrink:0 }}>{role.initials}</div>
                }
                {role.roleLabel}{isActive ? ' ✓' : ''}
              </button>
            )
          })}
        </div>

        <div style={{ width:1, height:22, background:'rgba(255,255,255,0.1)', flexShrink:0 }} />

        <button onClick={() => showTour()}
          style={{ background:'transparent', border:'1px solid rgba(42,191,160,0.25)', borderRadius:6, padding:'4px 10px', fontSize:11, color:'#2ABFA0', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' as const }}>
          ↺ Tour
        </button>

        <button onClick={() => supabase.auth.signOut().then(() => { window.location.href = '/demo' })}
          style={{ background:'transparent', border:'none', fontSize:11, color:'#8b949e', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' as const }}>
          Exit ✕
        </button>
      </div>
      <style>{`@keyframes dp{0%,100%{opacity:1}50%{opacity:.3}} @keyframes ds{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
