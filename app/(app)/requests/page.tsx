'use client'
import { useState, useMemo } from 'react'
import { REQUESTS, type TransferRequest, type RequestStatus, type RequestType } from '@/lib/data/requests'
import { RequestStatusBadge, PriorityBadge, RequestTypeBadge } from '@/components/requests/RequestBadges'
import { NewRequestModal } from '@/components/requests/NewRequestModal'
import { RequestDrawer } from '@/components/requests/RequestDrawer'
import { usePermissions } from '@/lib/hooks/usePermissions'

const STATUS_TABS: { key: RequestStatus | 'ALL'; label: string }[] = [
  { key:'ALL',       label:'All'       },
  { key:'SUBMITTED', label:'Pending'   },
  { key:'APPROVED',  label:'Approved'  },
  { key:'RESERVED',  label:'Reserved'  },
  { key:'SHIPPED',   label:'Shipped'   },
  { key:'COMPLETED', label:'Completed' },
  { key:'REJECTED',  label:'Rejected'  },
]

export default function RequestsPage() {
  const [requests, setRequests]   = useState<TransferRequest[]>(REQUESTS)
  const [tab, setTab]             = useState<RequestStatus | 'ALL'>('ALL')
  const [typeFilter, setTypeFilter] = useState<RequestType | 'ALL'>('ALL')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<TransferRequest | null>(null)
  const [showNew, setShowNew]     = useState(false)
  const [toast, setToast]         = useState('')
  const { permissions: p }        = usePermissions()

  const filtered = useMemo(() =>
    requests.filter(r => {
      if (tab !== 'ALL' && r.status !== tab) return false
      if (typeFilter !== 'ALL' && r.requestType !== typeFilter) return false
      if (search && !r.itemName.toLowerCase().includes(search.toLowerCase()) &&
          !r.id.toLowerCase().includes(search.toLowerCase()) &&
          !r.requester.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }), [requests, tab, typeFilter, search])

  const pendingTransfers = requests.filter(r => r.status === 'SUBMITTED' && r.requestType === 'TRANSFER').length
  const pendingPurchases = requests.filter(r => r.status === 'SUBMITTED' && r.requestType === 'PURCHASE').length

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function handleApprove(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as RequestStatus, updatedAt: 'just now' } : r))
    showToast('✓ Request approved')
  }

  function handleReject(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' as RequestStatus, updatedAt: 'just now' } : r))
    showToast('Request rejected')
  }

  function handleNew(data: Record<string, unknown>) {
    const newReq: TransferRequest = {
      id: `REQ-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      requestType: (data.requestType as RequestType) ?? 'TRANSFER',
      itemName: (data.item as { name: string }).name,
      itemIcon: (data.item as { icon: string }).icon,
      quantity: data.quantity as number,
      sourcesite: data.source as string,
      sourceSiteCode: (data.source as string).slice(0, 3).toUpperCase(),
      destSite: data.dest as string,
      destSiteCode: (data.dest as string).slice(0, 3).toUpperCase(),
      status: 'SUBMITTED',
      priority: data.priority as TransferRequest['priority'],
      requester: 'You',
      jiraKey: data.jiraKey as string || undefined,
      notes: data.notes as string || undefined,
      neededBy: data.neededBy as string || undefined,
      createdAt: 'just now',
      updatedAt: 'just now',
    }
    setRequests(prev => [newReq, ...prev])
    showToast('✓ Request submitted successfully')
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {toast && (
        <div style={{ position:'fixed', bottom:80, right:24, zIndex:500, background:'#161b22', border:'1px solid rgba(42,191,160,0.3)', borderRadius:9, padding:'12px 18px', fontSize:13, color:'var(--teal)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:600, marginBottom:2 }}>Requests</h1>
          <p style={{ fontSize:13, color:'#8b949e' }}>{requests.length} total · {pendingTransfers} transfers pending · {pendingPurchases} purchases pending</p>
        </div>
        <button onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--teal)', color:'#0d1117', border:'none', borderRadius:7, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          + New request
        </button>
      </div>

      {/* Approval authority info strip — only show to roles that can approve */}
      {(p.approveTransfer || p.approvePurchase) && (
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        {p.approveTransfer && (
        <div style={{ flex:1, padding:'10px 14px', background:'rgba(59,139,250,0.06)', border:'1px solid rgba(59,139,250,0.15)', borderRadius:8, fontSize:12, color:'#3B8BFA', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:16 }}>↔</span>
          <div>
            <div style={{ fontWeight:600 }}>Transfers — Dave approves</div>
            <div style={{ color:'#8b949e', marginTop:1 }}>Moving existing inventory between sites</div>
          </div>
          {pendingTransfers > 0 && <span style={{ marginLeft:'auto', background:'rgba(59,139,250,0.15)', color:'#3B8BFA', borderRadius:10, padding:'2px 8px', fontWeight:700, fontSize:11 }}>{pendingTransfers} pending</span>}
        </div>
        )}
        {p.approvePurchase && (
        <div style={{ flex:1, padding:'10px 14px', background:'rgba(176,107,200,0.06)', border:'1px solid rgba(176,107,200,0.15)', borderRadius:8, fontSize:12, color:'#B06BC8', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:16 }}>🛒</span>
          <div>
            <div style={{ fontWeight:600 }}>Purchases — Abe approves</div>
            <div style={{ color:'#8b949e', marginTop:1 }}>New equipment from vendors</div>
          </div>
          {pendingPurchases > 0 && <span style={{ marginLeft:'auto', background:'rgba(176,107,200,0.15)', color:'#B06BC8', borderRadius:10, padding:'2px 8px', fontWeight:700, fontSize:11 }}>{pendingPurchases} pending</span>}
        </div>
        )}
      </div>
      )}

      {/* Tabs + type toggle + search */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:0, background:'rgba(255,255,255,0.04)', borderRadius:8, padding:3 }}>
          {STATUS_TABS.map(t => {
            const count = t.key === 'ALL' ? requests.length : requests.filter(r => r.status === t.key).length
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'5px 11px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer',
                background: tab === t.key ? '#1c2128' : 'transparent',
                color: tab === t.key ? '#e6edf3' : '#8b949e',
                border:'none', display:'flex', alignItems:'center', gap:4,
              }}>
                {t.label}
                {count > 0 && <span style={{ fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:8, background: tab === t.key && t.key === 'SUBMITTED' ? 'var(--orange)' : 'rgba(255,255,255,0.1)', color: tab === t.key && t.key === 'SUBMITTED' ? '#fff' : '#8b949e' }}>{count}</span>}
              </button>
            )
          })}
        </div>

        {/* Type filter */}
        <div style={{ display:'flex', gap:0 }}>
          {(['ALL','TRANSFER','PURCHASE'] as const).map((t,i) => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer',
              background: typeFilter === t ? (t === 'PURCHASE' ? 'rgba(176,107,200,0.15)' : t === 'TRANSFER' ? 'rgba(59,139,250,0.15)' : 'rgba(42,191,160,0.15)') : 'transparent',
              color: typeFilter === t ? (t === 'PURCHASE' ? '#B06BC8' : t === 'TRANSFER' ? '#3B8BFA' : 'var(--teal)') : '#8b949e',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : '0',
              marginLeft: i > 0 ? -1 : 0,
            }}>
              {t === 'ALL' ? 'All types' : t === 'TRANSFER' ? '↔ Transfer' : '🛒 Purchase'}
            </button>
          ))}
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests…"
          style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'7px 12px', fontSize:13, color:'#e6edf3', outline:'none', width:200, marginLeft:'auto' }} />
      </div>

      {/* Table */}
      <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              {['Request','Type','Item','Route','Status','Priority',''].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:600, color:'#8b949e', letterSpacing:'0.5px', textTransform:'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding:'48px 16px', textAlign:'center', color:'#8b949e' }}>No requests match your filters</td></tr>
            )}
            {filtered.map(req => (
              <tr key={req.id} onClick={() => setSelected(req)}
                style={{ borderTop:'1px solid rgba(255,255,255,0.05)', cursor:'pointer', transition:'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ fontFamily:'monospace', fontSize:12, color:'var(--teal)' }}>{req.id}</div>
                  <div style={{ fontSize:11, color:'#8b949e', marginTop:2 }}>{req.createdAt}</div>
                </td>
                <td style={{ padding:'12px 16px' }}><RequestTypeBadge type={req.requestType} /></td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16 }}>{req.itemIcon}</span>
                    <div>
                      <div style={{ fontWeight:500 }}>{req.itemName}</div>
                      <div style={{ fontSize:11, color:'#8b949e' }}>Qty: {req.quantity} · by {req.requester}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
                    <span style={{ background: req.requestType === 'PURCHASE' ? 'rgba(176,107,200,0.1)' : 'rgba(255,255,255,0.06)', padding:'2px 6px', borderRadius:4, color: req.requestType === 'PURCHASE' ? '#B06BC8' : '#e6edf3' }}>
                      {req.sourceSiteCode}
                    </span>
                    <span style={{ color:'#8b949e' }}>→</span>
                    <span style={{ background:'rgba(255,255,255,0.06)', padding:'2px 6px', borderRadius:4 }}>{req.destSiteCode}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}><RequestStatusBadge status={req.status} /></td>
                <td style={{ padding:'12px 16px' }}><PriorityBadge priority={req.priority} /></td>
                <td style={{ padding:'12px 16px', textAlign:'right' }}>
                  {req.status === 'SUBMITTED' && (
                    // Only show approve/reject if user has permission for this request type
                    (req.requestType === 'TRANSFER' ? p.approveTransfer : p.approvePurchase) ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
                      <div style={{ fontSize:10, color: req.requestType === 'PURCHASE' ? '#B06BC8' : '#3B8BFA', marginBottom:2 }}>
                        {req.requestType === 'PURCHASE' ? 'Abe approves' : 'Dave approves'}
                      </div>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={e => { e.stopPropagation(); handleApprove(req.id) }} style={{ background:'rgba(57,211,83,0.12)', color:'#39D353', border:'none', borderRadius:5, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>✓</button>
                        <button onClick={e => { e.stopPropagation(); handleReject(req.id) }} style={{ background:'transparent', color:'#8b949e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'4px 8px', fontSize:11, cursor:'pointer' }}>✕</button>
                      </div>
                    </div>
                    ) : (
                    <span style={{ fontSize:11, color:'#8b949e', fontStyle:'italic' }}>
                      {req.requestType === 'PURCHASE' ? 'Awaiting Abe' : 'Awaiting Dave'}
                    </span>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <RequestDrawer req={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} />}
      {showNew && <NewRequestModal onClose={() => setShowNew(false)} onSubmit={handleNew} />}
    </div>
  )
}
