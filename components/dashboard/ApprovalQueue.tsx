'use client'
import { useState } from 'react'
import { usePermissions } from '@/lib/hooks/usePermissions'

const QUEUE = [
  { id:'1', item:'2× MacBook Pro 14" M3',    route:'Denver → Austin',  priority:'URGENT', requester:'Kira Valdez', icon:'💻', color:'rgba(59,139,250,0.15)',  type:'TRANSFER' },
  { id:'2', item:'4× Dell Monitor P2723QE',  route:'Austin → Chicago', priority:'NORMAL', requester:'Marcus T.',   icon:'🖥',  color:'rgba(0,212,255,0.12)',   type:'TRANSFER' },
  { id:'3', item:'10× Magic Keyboards',      route:'Austin → Seattle', priority:'NORMAL', requester:'Auto',        icon:'⌨',  color:'rgba(57,211,83,0.12)',   type:'TRANSFER' },
  { id:'4', item:'5× MacBook Pro (new)',      route:'Vendor → Miami',   priority:'URGENT', requester:'Alex Rivera', icon:'💻', color:'rgba(176,107,200,0.15)', type:'PURCHASE' },
  { id:'5', item:'8× iPhone 15 Pro (new)',    route:'Vendor → Denver',  priority:'HIGH',   requester:'Kira Valdez', icon:'📱', color:'rgba(176,107,200,0.12)', type:'PURCHASE' },
]

const PRIORITY_STYLE: Record<string, { color: string; bg: string }> = {
  URGENT: { color:'#FF6B2B', bg:'rgba(255,107,43,0.15)'  },
  HIGH:   { color:'#F5A623', bg:'rgba(245,166,35,0.15)'  },
  NORMAL: { color:'#8b949e', bg:'rgba(255,255,255,0.06)' },
  LOW:    { color:'#3B8BFA', bg:'rgba(59,139,250,0.12)'  },
}

export function ApprovalQueue() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const { permissions: p } = usePermissions()

  // Filter queue to only show items this role can approve
  const items = QUEUE.filter(q => {
    if (dismissed.includes(q.id)) return false
    if (q.type === 'TRANSFER') return p.approveTransfer
    if (q.type === 'PURCHASE') return p.approvePurchase
    return false
  })

  return (
    <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10 }} data-tour="approval-queue">
      <div style={{ padding:'16px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:13, fontWeight:600 }}>Approval queue</span>
        {items.length > 0
          ? <span style={{ background:'#FF6B2B', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:10 }}>{items.length}</span>
          : <span style={{ background:'rgba(57,211,83,0.15)', color:'#39D353', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:10 }}>✓</span>
        }
      </div>
      <div style={{ padding:'8px 20px 16px' }}>
        {items.length === 0 && (
          <div style={{ fontSize:13, color:'#8b949e', padding:'20px 0', textAlign:'center' }}>
            {p.approveTransfer || p.approvePurchase ? 'All caught up ✓' : 'No pending approvals for your role'}
          </div>
        )}
        {items.map(item => {
          const ps = PRIORITY_STYLE[item.priority]
          const isTransfer = item.type === 'TRANSFER'
          return (
            <div key={item.id} style={{ padding:'11px 0', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:7, background:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>
                {item.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {item.item}
                </div>
                <div style={{ fontSize:11, color:'#8b949e', display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  {item.route}
                  <span style={{ fontSize:10, fontWeight:600, padding:'1px 6px', borderRadius:4, color:ps.color, background:ps.bg }}>{item.priority}</span>
                  <span style={{ fontSize:10, fontWeight:600, padding:'1px 6px', borderRadius:4, color: isTransfer ? '#3B8BFA' : '#B06BC8', background: isTransfer ? 'rgba(59,139,250,0.1)' : 'rgba(176,107,200,0.1)' }}>
                    {isTransfer ? '↔' : '🛒'}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                <button onClick={() => setDismissed(d => [...d, item.id])} style={{ background:'rgba(57,211,83,0.12)', color:'#39D353', border:'none', borderRadius:5, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>✓</button>
                <button onClick={() => setDismissed(d => [...d, item.id])} style={{ background:'transparent', color:'#8b949e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'4px 8px', fontSize:11, cursor:'pointer' }}>✕</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
