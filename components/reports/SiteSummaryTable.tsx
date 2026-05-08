'use client'

const SITES = [
  { name:'Austin HQ',     code:'ATX', assets:400, available:312, transfers:34, pending:3,  health:78, color:'#2ABFA0' },
  { name:'Seattle',       code:'SEA', assets:320, available:248, transfers:28, pending:2,  health:77, color:'#3B8BFA' },
  { name:'Chicago',       code:'CHI', assets:280, available:218, transfers:22, pending:4,  health:78, color:'#39D353' },
  { name:'New York',      code:'NYC', assets:240, available:168, transfers:19, pending:1,  health:70, color:'#E8407A' },
  { name:'San Francisco', code:'SFO', assets:250, available:183, transfers:16, pending:2,  health:73, color:'#00D4FF' },
  { name:'Boston',        code:'BOS', assets:200, available:149, transfers:14, pending:1,  health:75, color:'#B06BC8' },
  { name:'Denver',        code:'DEN', assets:180, available:71,  transfers:11, pending:5,  health:39, color:'#F5A623' },
  { name:'Miami',         code:'MIA', assets:160, available:44,  transfers:8,  pending:2,  health:28, color:'#FF6B2B' },
]

function healthColor(h: number) {
  if (h >= 60) return '#39D353'
  if (h >= 35) return '#F5A623'
  return '#FF6B2B'
}

export function SiteSummaryTable() {
  return (
    <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, overflow:'hidden' }}>
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>Site summary</div>
        <div style={{ fontSize:12, color:'#8b949e', marginBottom:14 }}>Cross-site performance snapshot</div>
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
        <thead>
          <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            {['Site','Assets','Avail','Transfers','Pending','Health'].map(h => (
              <th key={h} style={{ padding:'8px 14px', textAlign: h === 'Site' ? 'left' : 'right', fontSize:10, fontWeight:600, color:'#8b949e', letterSpacing:'0.5px', textTransform:'uppercase' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SITES.map((s, i) => {
            const hc = healthColor(s.health)
            return (
              <tr key={s.code} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding:'10px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:24, height:24, borderRadius:5, background:`${s.color}18`, border:`1px solid ${s.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:s.color, flexShrink:0 }}>{s.code}</div>
                    <span style={{ fontWeight:500 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding:'10px 14px', textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{s.assets}</td>
                <td style={{ padding:'10px 14px', textAlign:'right', fontWeight:600, color: s.available/s.assets > 0.4 ? '#39D353' : s.available/s.assets > 0.2 ? '#F5A623' : '#FF6B2B', fontVariantNumeric:'tabular-nums' }}>{s.available}</td>
                <td style={{ padding:'10px 14px', textAlign:'right', color:'#8b949e', fontVariantNumeric:'tabular-nums' }}>{s.transfers}</td>
                <td style={{ padding:'10px 14px', textAlign:'right' }}>
                  <span style={{ fontSize:11, fontWeight:600, color: s.pending > 3 ? '#FF6B2B' : '#8b949e' }}>{s.pending}</span>
                </td>
                <td style={{ padding:'10px 14px', textAlign:'right' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end' }}>
                    <div style={{ width:48, height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ width:`${s.health}%`, height:'100%', background:hc, borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:hc, width:32, textAlign:'right' }}>{s.health}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
