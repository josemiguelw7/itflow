'use client'

const SITES = ['ATX','CHI','SEA','DEN','NYC','SFO','BOS','MIA']
const DATA = [
  { site:'ATX', available:312, reserved:48, inTransit:12, total:400, color:'#2ABFA0' },
  { site:'CHI', available:218, reserved:22, inTransit:8,  total:280, color:'#3B8BFA' },
  { site:'SEA', available:248, reserved:31, inTransit:14, total:320, color:'#39D353' },
  { site:'DEN', available:71,  reserved:18, inTransit:4,  total:180, color:'#F5A623' },
  { site:'NYC', available:168, reserved:27, inTransit:6,  total:240, color:'#E8407A' },
  { site:'SFO', available:183, reserved:19, inTransit:9,  total:250, color:'#00D4FF' },
  { site:'BOS', available:149, reserved:14, inTransit:3,  total:200, color:'#B06BC8' },
  { site:'MIA', available:44,  reserved:12, inTransit:2,  total:160, color:'#FF6B2B' },
]

export function StockHealthChart() {
  const maxTotal = Math.max(...DATA.map(d => d.total))

  return (
    <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
        <div style={{ fontWeight:600, fontSize:13 }}>Stock health by site</div>
        <div style={{ display:'flex', gap:12, fontSize:11, color:'#8b949e' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#2ABFA0', display:'inline-block' }} />Available</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#F5A623', display:'inline-block' }} />Reserved</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#3B8BFA', display:'inline-block' }} />In transit</span>
        </div>
      </div>
      <div style={{ fontSize:12, color:'#8b949e', marginBottom:20 }}>Available inventory across all 8 locations</div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {DATA.map(d => {
          const availPct  = (d.available  / maxTotal) * 100
          const resvPct   = (d.reserved   / maxTotal) * 100
          const transPct  = (d.inTransit  / maxTotal) * 100
          const healthPct = d.available / d.total
          const healthColor = healthPct > 0.4 ? '#39D353' : healthPct > 0.2 ? '#F5A623' : '#FF6B2B'

          return (
            <div key={d.site} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, fontSize:10, fontWeight:700, color:d.color, textAlign:'right', flexShrink:0 }}>{d.site}</div>
              <div style={{ flex:1, height:18, background:'rgba(255,255,255,0.04)', borderRadius:4, overflow:'hidden', position:'relative' }}>
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${availPct}%`, background:'#2ABFA0', opacity:0.85 }} />
                <div style={{ position:'absolute', left:`${availPct}%`, top:0, bottom:0, width:`${resvPct}%`, background:'#F5A623', opacity:0.7 }} />
                <div style={{ position:'absolute', left:`${availPct + resvPct}%`, top:0, bottom:0, width:`${transPct}%`, background:'#3B8BFA', opacity:0.7 }} />
              </div>
              <div style={{ width:28, fontSize:12, fontWeight:700, color:healthColor, textAlign:'right', flexShrink:0 }}>
                {Math.round(healthPct * 100)}%
              </div>
              <div style={{ width:36, fontSize:11, color:'#8b949e', textAlign:'right', flexShrink:0 }}>{d.available}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
