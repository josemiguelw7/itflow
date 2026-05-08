'use client'

const WEEKLY_DATA = [
  { week:'Apr 7',  submitted:12, completed:9,  rejected:1 },
  { week:'Apr 14', submitted:18, completed:14, rejected:2 },
  { week:'Apr 21', submitted:15, completed:13, rejected:1 },
  { week:'Apr 28', submitted:22, completed:19, rejected:3 },
  { week:'May 5',  submitted:28, completed:21, rejected:2 },
  { week:'May 12', submitted:19, completed:16, rejected:1 },
]

const MONTHLY_DATA = [
  { week:'Jan', submitted:38, completed:31, rejected:4 },
  { week:'Feb', submitted:44, completed:39, rejected:3 },
  { week:'Mar', submitted:52, completed:46, rejected:5 },
  { week:'Apr', submitted:67, completed:55, rejected:7 },
  { week:'May', submitted:28, completed:21, rejected:2 },
]

export function TransferTrends({ range }: { range: string }) {
  const data = range.includes('7') || range.includes('30') ? WEEKLY_DATA : MONTHLY_DATA
  const maxVal = Math.max(...data.flatMap(d => [d.submitted, d.completed]))
  const BAR_H = 120

  return (
    <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
        <div style={{ fontWeight:600, fontSize:13 }}>Transfer activity</div>
        <div style={{ display:'flex', gap:12, fontSize:11, color:'#8b949e' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#3B8BFA', display:'inline-block' }} />Submitted</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#39D353', display:'inline-block' }} />Completed</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#FF6B2B', display:'inline-block' }} />Rejected</span>
        </div>
      </div>
      <div style={{ fontSize:12, color:'#8b949e', marginBottom:20 }}>Request volume over time · {range}</div>

      <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:BAR_H + 30 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:BAR_H }}>
              <div style={{ width:12, background:'#3B8BFA', borderRadius:'3px 3px 0 0', opacity:0.85, height:`${(d.submitted/maxVal)*BAR_H}px`, transition:'height 0.4s' }} />
              <div style={{ width:12, background:'#39D353', borderRadius:'3px 3px 0 0', opacity:0.85, height:`${(d.completed/maxVal)*BAR_H}px`, transition:'height 0.4s' }} />
              <div style={{ width:8,  background:'#FF6B2B', borderRadius:'3px 3px 0 0', opacity:0.7,  height:`${(d.rejected/maxVal)*BAR_H}px`, transition:'height 0.4s' }} />
            </div>
            <div style={{ fontSize:10, color:'#8b949e', textAlign:'center', whiteSpace:'nowrap' }}>{d.week}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16 }}>
        {[
          { label:'Total submitted', value: data.reduce((s,d)=>s+d.submitted,0), color:'#3B8BFA' },
          { label:'Completed',       value: data.reduce((s,d)=>s+d.completed,0), color:'#39D353' },
          { label:'Rejected',        value: data.reduce((s,d)=>s+d.rejected,0),  color:'#FF6B2B' },
        ].map(m => (
          <div key={m.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:7, padding:'8px 10px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:700, color:m.color }}>{m.value}</div>
            <div style={{ fontSize:10, color:'#8b949e', marginTop:2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
