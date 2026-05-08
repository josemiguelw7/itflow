'use client'
import type { TransferRequest } from '@/lib/data/requests'
import { RequestStatusBadge, PriorityBadge } from './RequestBadges'

const WORKFLOW_STEPS: { status: string; label: string }[] = [
  { status: 'SUBMITTED', label: 'Submitted'  },
  { status: 'APPROVED',  label: 'Approved'   },
  { status: 'RESERVED',  label: 'Reserved'   },
  { status: 'SHIPPED',   label: 'Shipped'    },
  { status: 'COMPLETED', label: 'Completed'  },
]

const STATUS_ORDER = ['SUBMITTED','APPROVED','RESERVED','SHIPPED','COMPLETED']

export function RequestDrawer({ req, onClose, onApprove, onReject }: {
  req: TransferRequest
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const currentIdx = STATUS_ORDER.indexOf(req.status)
  const canApprove = req.status === 'SUBMITTED'
  const canReject  = req.status === 'SUBMITTED' || req.status === 'APPROVED'

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:420,
        background:'#161b22', borderLeft:'1px solid rgba(255,255,255,0.1)',
        zIndex:201, display:'flex', flexDirection:'column', overflowY:'auto',
      }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontFamily:'monospace', fontSize:13, color:'var(--teal)', marginBottom:4 }}>{req.id}</div>
              <div style={{ fontWeight:600, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
                <span>{req.itemIcon}</span> {req.itemName}
              </div>
              <div style={{ fontSize:12, color:'#8b949e', marginTop:2 }}>Qty: {req.quantity} · by {req.requester}</div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, width:28, height:28, color:'#8b949e', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <RequestStatusBadge status={req.status} />
            <PriorityBadge priority={req.priority} />
            {req.jiraKey && (
              <span style={{ padding:'2px 8px', borderRadius:12, fontSize:11, background:'rgba(59,139,250,0.12)', color:'#3B8BFA' }}>
                🔗 {req.jiraKey}
              </span>
            )}
          </div>
        </div>

        {/* Workflow progress */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:14 }}>Progress</div>
          <div style={{ display:'flex', alignItems:'center' }}>
            {WORKFLOW_STEPS.map((s, i) => {
              const done    = i < currentIdx || req.status === 'COMPLETED'
              const active  = STATUS_ORDER[currentIdx] === s.status
              const rejected = req.status === 'REJECTED' && i === 0
              return (
                <div key={s.status} style={{ display:'flex', alignItems:'center', flex: i < WORKFLOW_STEPS.length-1 ? 1 : 0 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <div style={{
                      width:22, height:22, borderRadius:'50%', flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontWeight:700,
                      background: done || active ? 'var(--teal)' : rejected ? '#FF6B2B22' : 'rgba(255,255,255,0.06)',
                      color: done || active ? '#0d1117' : rejected ? '#FF6B2B' : '#8b949e',
                      border: active ? '2px solid var(--teal)' : '2px solid transparent',
                    }}>
                      {done ? '✓' : i+1}
                    </div>
                    <div style={{ fontSize:9, color: done || active ? 'var(--teal)' : '#8b949e', whiteSpace:'nowrap' }}>{s.label}</div>
                  </div>
                  {i < WORKFLOW_STEPS.length-1 && (
                    <div style={{ flex:1, height:1, background: i < currentIdx ? 'var(--teal)' : 'rgba(255,255,255,0.1)', margin:'0 4px', marginBottom:14 }} />
                  )}
                </div>
              )
            })}
          </div>
          {req.status === 'REJECTED' && (
            <div style={{ marginTop:10, padding:'8px 12px', background:'rgba(255,107,43,0.08)', border:'1px solid rgba(255,107,43,0.2)', borderRadius:7, fontSize:12, color:'#FF6B2B' }}>
              ✕ This request was rejected
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding:'20px 24px', flex:1 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Details</div>
          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:9, overflow:'hidden', marginBottom:20 }}>
            {[
              ['Route',       `${req.sourcesite} → ${req.destSite}`],
              ['Quantity',    String(req.quantity)],
              ['Requester',   req.requester],
              ['Needed by',   req.neededBy  ?? '—'],
              ['Created',     req.createdAt],
              ['Last updated',req.updatedAt],
              ['Notes',       req.notes     ?? '—'],
            ].map(([label, val], i) => (
              <div key={label} style={{
                display:'flex', justifyContent:'space-between',
                padding:'9px 14px', fontSize:13,
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <span style={{ color:'#8b949e' }}>{label}</span>
                <span style={{ maxWidth:200, textAlign:'right', wordBreak:'break-word' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          {(canApprove || canReject) && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Actions</div>
              <div style={{ display:'flex', gap:8 }}>
                {canApprove && (
                  <button onClick={() => { onApprove(req.id); onClose() }} style={{
                    flex:1, padding:'9px', borderRadius:7, fontSize:13, fontWeight:600,
                    background:'rgba(57,211,83,0.12)', color:'#39D353',
                    border:'1px solid rgba(57,211,83,0.2)', cursor:'pointer',
                  }}>✓ Approve</button>
                )}
                {canReject && (
                  <button onClick={() => { onReject(req.id); onClose() }} style={{
                    flex:1, padding:'9px', borderRadius:7, fontSize:13, fontWeight:600,
                    background:'rgba(255,107,43,0.08)', color:'#FF6B2B',
                    border:'1px solid rgba(255,107,43,0.2)', cursor:'pointer',
                  }}>✕ Reject</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
