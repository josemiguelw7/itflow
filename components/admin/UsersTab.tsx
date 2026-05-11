'use client'
import { useState } from 'react'
import { ADMIN_USERS, ROLE_LABELS, ROLE_COLORS, type AdminUser } from '@/lib/data/admin'

export function UsersTab({ canManage = true }: { canManage?: boolean }) {
  const [users, setUsers]   = useState<AdminUser[]>(ADMIN_USERS)
  const [search, setSearch] = useState('')
  const [toast, setToast]   = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }
  function toggleActive(id: string) { if (!canManage) return; setUsers(p => p.map(u => u.id===id ? {...u, active:!u.active} : u)); showToast('User updated') }
  function changeRole(id: string, role: AdminUser['role']) { if (!canManage) return; setUsers(p => p.map(u => u.id===id ? {...u, role} : u)); showToast('Role updated') }

  const filtered = users.filter(u => !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      {toast && <Toast msg={toast} />}
      {!canManage && <ReadOnlyBanner text="You have read-only access to users. Contact Admin to make changes." />}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ fontSize:13, color:'#8b949e' }}>{users.length} users · {users.filter(u=>u.active).length} active</div>
        <div style={{ display:'flex', gap:10 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…" style={inputSt} />
          {canManage && <button style={addBtn}>+ Invite user</button>}
        </div>
      </div>

      <div style={tableSt}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              {['User','Site','Role','Orgs','Last login','Status', canManage ? '' : ''].map((h,i) => (
                <th key={i} style={thSt}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={tdSt}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:`${ROLE_COLORS[u.role]}22`, border:`1px solid ${ROLE_COLORS[u.role]}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:ROLE_COLORS[u.role], flexShrink:0 }}>
                      {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight:500 }}>{u.name}</div>
                      <div style={{ fontSize:11, color:'#8b949e' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={tdSt}><span style={{ background:'rgba(255,255,255,0.06)', padding:'2px 7px', borderRadius:4, fontSize:11, fontWeight:600 }}>{u.siteCode}</span></td>
                <td style={tdSt}>
                  {!canManage
                    ? <span style={{ fontSize:12, fontWeight:600, color:ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</span>
                    : <select value={u.role} onChange={e=>changeRole(u.id, e.target.value as AdminUser['role'])} style={{ background:'transparent', border:'none', fontSize:12, fontWeight:600, color:ROLE_COLORS[u.role], cursor:'pointer', outline:'none' }}>
                        {['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'].map(r=>(
                          <option key={r} value={r} style={{ background:'#1c2128', color:'#e6edf3' }}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                  }
                </td>
                <td style={tdSt}>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {u.orgs.map(o=><span key={o} style={{ fontSize:10, fontWeight:600, padding:'2px 6px', borderRadius:4, background:o==='Demo'?'rgba(245,166,35,0.12)':'rgba(42,191,160,0.12)', color:o==='Demo'?'#F5A623':'#2ABFA0' }}>{o}</span>)}
                  </div>
                </td>
                <td style={{ ...tdSt, color:'#8b949e', fontSize:12 }}>{u.lastLogin}</td>
                <td style={tdSt}>
                  <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:10, background:u.active?'rgba(57,211,83,0.12)':'rgba(139,148,158,0.12)', color:u.active?'#39D353':'#8b949e' }}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                {canManage && (
                  <td style={{ ...tdSt, textAlign:'right' }}>
                    <button onClick={()=>toggleActive(u.id)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'3px 10px', fontSize:11, color:'#8b949e', cursor:'pointer' }}>
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ReadOnlyBanner({ text }: { text: string }) {
  return <div style={{ marginBottom:14, padding:'9px 14px', background:'rgba(59,139,250,0.06)', border:'1px solid rgba(59,139,250,0.15)', borderRadius:8, fontSize:12, color:'#3B8BFA', display:'flex', alignItems:'center', gap:8 }}><span>🔒</span>{text}</div>
}

function Toast({ msg }: { msg: string }) {
  return <div style={{ position:'fixed', bottom:80, right:24, zIndex:500, background:'#161b22', border:'1px solid rgba(42,191,160,0.3)', borderRadius:9, padding:'12px 18px', fontSize:13, color:'var(--teal)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>{msg}</div>
}

const inputSt: React.CSSProperties = { background:'#161b22', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'7px 12px', fontSize:13, color:'#e6edf3', outline:'none', width:200 }
const addBtn:  React.CSSProperties = { background:'var(--teal)', color:'#0d1117', border:'none', borderRadius:7, padding:'7px 14px', fontSize:13, fontWeight:600, cursor:'pointer' }
const tableSt: React.CSSProperties = { background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, overflow:'hidden' }
const thSt:    React.CSSProperties = { padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:600, color:'#8b949e', letterSpacing:'0.5px', textTransform:'uppercase' as const }
const tdSt:    React.CSSProperties = { padding:'12px 16px', verticalAlign:'middle' }
