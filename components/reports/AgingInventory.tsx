'use client'

const AGING = [
  { name:'MacBook Pro 14" M3',   site:'Denver',        siteCode:'DEN', days:47, status:'RESERVED',     condition:'FAIR',  color:'#F5A623' },
  { name:'Dell 27" Monitor',     site:'San Francisco', siteCode:'SFO', days:38, status:'DAMAGED',      condition:'POOR',  color:'#FF6B2B' },
  { name:'iPad Pro 12.9"',       site:'Boston',        siteCode:'BOS', days:31, status:'PENDING_WIPE', condition:'GOOD',  color:'#3B8BFA' },
  { name:'Dell Latitude 5540',   site:'Miami',         siteCode:'MIA', days:28, status:'READY',        condition:'GOOD',  color:'#2ABFA0' },
  { name:'iPhone 15 Pro',        site:'Austin HQ',     siteCode:'ATX', days:22, status:'PENDING_WIPE', condition:'GOOD',  color:'#E8407A' },
  { name:'Logitech MX Keys ×4',  site:'Miami',         siteCode:'MIA', days:19, status:'AVAILABLE',    condition:'GOOD',  color:'#8b949e' },
]

const STATUS_COLOR: Record<string, string> = {
  RESERVED:'#FF6B2B', DAMAGED:'#E8407A', PENDING_WIPE:'#3B8BFA',
  READY:'#2ABFA0', AVAILABLE:'#39D353',
}

function agingColor(days: number) {
  if (days > 40) return '#FF6B2B'
  if (days > 25) return '#F5A623'
  return '#8b949e'
}

export function AgingInventory() {
  return (
    <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'20px' }}>
      <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>Aging inventory</div>
      <div style={{ fontSize:12, color:'#8b949e', marginBottom:16 }}>Items sitting idle longest — may need attention</div>

      <div style={{ display:'flex', flexDirection:'column' }}>
        {AGING.map((item, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:10, padding:'10px 0',
            borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            {/* Age bar */}
            <div style={{ width:36, textAlign:'right', flexShrink:0 }}>
              <span style={{ fontSize:13, fontWeight:700, color:agingColor(item.days) }}>{item.days}</span>
              <span style={{ fontSize:10, color:'#8b949e' }}>d</span>
            </div>

            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
              <div style={{ fontSize:11, color:'#8b949e', marginTop:1, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ background:'rgba(255,255,255,0.06)', padding:'1px 5px', borderRadius:3, fontSize:10, fontWeight:600 }}>{item.siteCode}</span>
                {item.site}
              </div>
            </div>

            <div style={{ flexShrink:0 }}>
              <span style={{
                fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:8,
                color: STATUS_COLOR[item.status] ?? '#8b949e',
                background: `${STATUS_COLOR[item.status] ?? '#8b949e'}18`,
              }}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:14, padding:'10px 12px', background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:7, fontSize:12, color:'#F5A623' }}>
        ⚠ 2 items have been idle for 30+ days — consider redeploying or retiring
      </div>
    </div>
  )
}
