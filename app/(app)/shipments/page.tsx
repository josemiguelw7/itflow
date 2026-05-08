'use client'
import { useState, useMemo } from 'react'
import { SHIPMENTS, type Shipment, type ShipmentStatus } from '@/lib/data/shipments'
import { ShipmentBadge, ShipmentProgress } from '@/components/shipments/ShipmentBadge'
import { ShipmentDrawer } from '@/components/shipments/ShipmentDrawer'
import { NewShipmentModal } from '@/components/shipments/NewShipmentModal'

const TABS: { key: ShipmentStatus | 'ALL'; label: string }[] = [
  { key:'ALL',        label:'All'        },
  { key:'PREPARING',  label:'Preparing'  },
  { key:'SHIPPED',    label:'Shipped'    },
  { key:'IN_TRANSIT', label:'In transit' },
  { key:'DELIVERED',  label:'Delivered'  },
  { key:'EXCEPTION',  label:'Exception'  },
  { key:'RECEIVED',   label:'Received'   },
]

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(SHIPMENTS)
  const [tab, setTab]             = useState<ShipmentStatus | 'ALL'>('ALL')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Shipment | null>(null)
  const [showNew, setShowNew]     = useState(false)
  const [toast, setToast]         = useState('')

  const filtered = useMemo(() =>
    shipments.filter(s => {
      if (tab !== 'ALL' && s.status !== tab) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.id.toLowerCase().includes(q) &&
            !s.origin.toLowerCase().includes(q) &&
            !s.destination.toLowerCase().includes(q) &&
            !(s.trackingNumber?.toLowerCase().includes(q))) return false
      }
      return true
    }), [shipments, tab, search])

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function handleMarkShipped(id: string, carrier: string, tracking: string) {
    setShipments(p => p.map(s => s.id === id ? { ...s, status:'SHIPPED' as ShipmentStatus, carrier, trackingNumber:tracking, shippedAt:'just now', updatedAt:'just now' } : s))
    showToast('📦 Shipment marked as shipped')
  }

  function handleMarkReceived(id: string, notes: string) {
    setShipments(p => p.map(s => s.id === id ? { ...s, status:'RECEIVED' as ShipmentStatus, receivedAt:'just now', receiverNotes:notes||undefined, updatedAt:'just now' } : s))
    showToast('✓ Receipt confirmed — inventory updated')
  }

  function handleFlagException(id: string, notes: string) {
    setShipments(p => p.map(s => s.id === id ? { ...s, status:'EXCEPTION' as ShipmentStatus, receiverNotes:notes, updatedAt:'just now' } : s))
    showToast('⚠ Exception flagged')
  }

  function handleNewShipment(data: Record<string, unknown>) {
    const newShip: Shipment = {
      id: `SHP-${String(Math.floor(Math.random()*9000)+1000)}`,
      origin: data.origin as string,
      originCode: (data.origin as string).slice(0,3).toUpperCase(),
      destination: data.dest as string,
      destinationCode: (data.dest as string).slice(0,3).toUpperCase(),
      status: 'PREPARING',
      carrier: data.carrier as string || undefined,
      trackingNumber: data.tracking as string || undefined,
      estimatedArrival: data.eta as string || undefined,
      items: [], // in real app: from selected items
      createdAt: 'just now', updatedAt: 'just now',
    }
    setShipments(p => [newShip, ...p])
    showToast('✓ Shipment created')
  }

  const awaitingReceipt  = shipments.filter(s => s.status === 'DELIVERED').length
  const inTransitCount   = shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'SHIPPED').length
  const exceptionCount   = shipments.filter(s => s.status === 'EXCEPTION').length

  return (
    <div style={{ maxWidth:1200 }}>
      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:500, background:'#161b22', border:'1px solid rgba(42,191,160,0.3)', borderRadius:9, padding:'12px 18px', fontSize:13, color:'var(--teal)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:600, marginBottom:2 }}>Shipments</h1>
          <p style={{ fontSize:13, color:'#8b949e' }}>
            {inTransitCount} in transit · {awaitingReceipt} awaiting receipt
            {exceptionCount > 0 && <span style={{ color:'#FF6B2B' }}> · {exceptionCount} exception{exceptionCount > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <button onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--teal)', color:'#0d1117', border:'none', borderRadius:7, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          + New shipment
        </button>
      </div>

      {/* Alert for awaiting receipt */}
      {awaitingReceipt > 0 && (
        <div style={{ background:'rgba(42,191,160,0.06)', border:'1px solid rgba(42,191,160,0.2)', borderRadius:8, padding:'10px 16px', marginBottom:16, fontSize:13, color:'var(--teal)', display:'flex', alignItems:'center', gap:8 }}>
          <span>📬</span>
          <span>{awaitingReceipt} shipment{awaitingReceipt > 1 ? 's' : ''} delivered and awaiting receipt confirmation — <strong>click to confirm</strong></span>
        </div>
      )}

      {/* Tabs + search */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:0, background:'rgba(255,255,255,0.04)', borderRadius:8, padding:3 }}>
          {TABS.map(t => {
            const count = t.key === 'ALL' ? shipments.length : shipments.filter(s => s.status === t.key).length
            const isException = t.key === 'EXCEPTION'
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'5px 12px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer',
                background: tab === t.key ? '#1c2128' : 'transparent',
                color: tab === t.key ? (isException ? '#FF6B2B' : '#e6edf3') : '#8b949e',
                border:'none', display:'flex', alignItems:'center', gap:5,
              }}>
                {t.label}
                {count > 0 && (
                  <span style={{
                    fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:8,
                    background: isException && count > 0 ? 'rgba(255,107,43,0.2)' : 'rgba(255,255,255,0.1)',
                    color: isException && count > 0 ? '#FF6B2B' : '#8b949e',
                  }}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, site, tracking…"
          style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'7px 12px', fontSize:13, color:'#e6edf3', outline:'none', width:240, marginLeft:'auto' }} />
      </div>

      {/* Cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:14 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', padding:'48px', textAlign:'center', color:'#8b949e', background:'#161b22', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)' }}>
            No shipments match your filters
          </div>
        )}
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => setSelected(s)}
            style={{
              background:'#161b22', border:`1px solid ${s.status === 'EXCEPTION' ? 'rgba(255,107,43,0.3)' : s.status === 'DELIVERED' ? 'rgba(42,191,160,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:10, padding:'16px 18px', cursor:'pointer',
              transition:'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(42,191,160,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = s.status === 'EXCEPTION' ? 'rgba(255,107,43,0.3)' : s.status === 'DELIVERED' ? 'rgba(42,191,160,0.2)' : 'rgba(255,255,255,0.08)')}
          >
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
              <div>
                <div style={{ fontFamily:'monospace', fontSize:12, color:'var(--teal)', marginBottom:3 }}>{s.id}</div>
                <div style={{ fontWeight:600, fontSize:14 }}>{s.origin} → {s.destination}</div>
              </div>
              <ShipmentBadge status={s.status} />
            </div>

            <div style={{ fontSize:12, color:'#8b949e', marginBottom:12 }}>
              {s.items.length > 0 ? s.items.map(i => `${i.quantity}× ${i.name}`).join(' · ') : 'Items pending'}
            </div>

            <ShipmentProgress status={s.status} />

            {s.trackingNumber && (
              <div style={{ marginTop:10, fontSize:11, color:'#8b949e', fontFamily:'monospace' }}>
                🚚 {s.carrier} · {s.trackingNumber}
              </div>
            )}

            {s.status === 'DELIVERED' && (
              <button
                onClick={e => { e.stopPropagation(); handleMarkReceived(s.id, '') }}
                style={{ marginTop:12, width:'100%', padding:'7px', borderRadius:7, fontSize:12, fontWeight:600, background:'rgba(57,211,83,0.12)', color:'#39D353', border:'1px solid rgba(57,211,83,0.2)', cursor:'pointer' }}
              >
                ✓ Confirm receipt
              </button>
            )}

            {s.status === 'EXCEPTION' && s.receiverNotes && (
              <div style={{ marginTop:10, padding:'7px 10px', background:'rgba(255,107,43,0.08)', borderRadius:6, fontSize:11, color:'#FF6B2B' }}>
                ⚠ {s.receiverNotes}
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <ShipmentDrawer
          shipment={selected}
          onClose={() => setSelected(null)}
          onMarkShipped={handleMarkShipped}
          onMarkReceived={handleMarkReceived}
          onFlagException={handleFlagException}
        />
      )}
      {showNew && (
        <NewShipmentModal
          onClose={() => setShowNew(false)}
          onSubmit={handleNewShipment}
        />
      )}
    </div>
  )
}
