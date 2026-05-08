'use client'
import { useState } from 'react'
import type { Shipment } from '@/lib/data/shipments'
import { ShipmentBadge, ShipmentProgress } from './ShipmentBadge'
import { CARRIERS } from '@/lib/data/shipments'

interface Props {
  shipment: Shipment
  onClose: () => void
  onMarkShipped: (id: string, carrier: string, tracking: string) => void
  onMarkReceived: (id: string, notes: string) => void
  onFlagException: (id: string, notes: string) => void
}

export function ShipmentDrawer({ shipment, onClose, onMarkShipped, onMarkReceived, onFlagException }: Props) {
  const [carrier, setCarrier]     = useState(shipment.carrier ?? 'FedEx')
  const [tracking, setTracking]   = useState(shipment.trackingNumber ?? '')
  const [notes, setNotes]         = useState('')
  const [showShipForm, setShipForm] = useState(false)
  const [showReceiveForm, setRcvForm] = useState(false)
  const [showExcForm, setExcForm]   = useState(false)

  const canShip    = shipment.status === 'PREPARING'
  const canReceive = shipment.status === 'DELIVERED' || shipment.status === 'IN_TRANSIT' || shipment.status === 'SHIPPED'
  const canFlag    = !['RECEIVED','EXCEPTION'].includes(shipment.status)

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:440,
        background:'#161b22', borderLeft:'1px solid rgba(255,255,255,0.1)',
        zIndex:201, overflowY:'auto', display:'flex', flexDirection:'column',
      }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontFamily:'monospace', fontSize:13, color:'var(--teal)', marginBottom:4 }}>{shipment.id}</div>
              <div style={{ fontWeight:600, fontSize:15 }}>{shipment.origin} → {shipment.destination}</div>
              <div style={{ fontSize:12, color:'#8b949e', marginTop:2 }}>
                {shipment.items.map(i => `${i.quantity}× ${i.name}`).join(' · ')}
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, width:28, height:28, color:'#8b949e', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
          <ShipmentBadge status={shipment.status} />
        </div>

        {/* Progress */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:14 }}>Progress</div>
          <ShipmentProgress status={shipment.status} />
          {shipment.status === 'EXCEPTION' && (
            <div style={{ marginTop:12, padding:'8px 12px', background:'rgba(255,107,43,0.08)', border:'1px solid rgba(255,107,43,0.2)', borderRadius:7, fontSize:12, color:'#FF6B2B' }}>
              ⚠ {shipment.receiverNotes}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding:'20px 24px', flex:1 }}>
          <InfoSection>
            <Row label="From"             value={`${shipment.origin} (${shipment.originCode})`} />
            <Row label="To"               value={`${shipment.destination} (${shipment.destinationCode})`} />
            <Row label="Carrier"          value={shipment.carrier ?? '—'} />
            <Row label="Tracking"         value={shipment.trackingNumber ?? '—'} mono />
            {shipment.requestId && <Row label="Request"  value={shipment.requestId} mono />}
            <Row label="Shipped"          value={shipment.shippedAt ?? '—'} />
            <Row label="Est. arrival"     value={shipment.estimatedArrival ?? '—'} />
            {shipment.receivedAt && <Row label="Received" value={shipment.receivedAt} />}
            <Row label="Created"          value={shipment.createdAt} />
          </InfoSection>

          {/* Items */}
          <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.5px', margin:'16px 0 8px' }}>Items</div>
          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:9, overflow:'hidden', marginBottom:20 }}>
            {shipment.items.map((item, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                fontSize:13,
              }}>
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.name}</span>
                <span style={{ fontWeight:600, color:'var(--teal)' }}>×{item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Action: Mark shipped */}
          {canShip && (
            <ActionSection title="Mark as shipped" color="var(--blue)">
              {!showShipForm ? (
                <button onClick={() => setShipForm(true)} style={primaryBtn('#3B8BFA','rgba(59,139,250,0.12)')}>
                  📦 Add tracking & ship
                </button>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <select value={carrier} onChange={e => setCarrier(e.target.value)} style={inputSt}>
                    {CARRIERS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Tracking number" style={inputSt} />
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setShipForm(false)} style={ghostBtn}>Cancel</button>
                    <button onClick={() => { onMarkShipped(shipment.id, carrier, tracking); onClose() }} style={primaryBtn('var(--teal)','rgba(42,191,160,0.12)')}>
                      Confirm shipped →
                    </button>
                  </div>
                </div>
              )}
            </ActionSection>
          )}

          {/* Action: Mark received */}
          {canReceive && (
            <ActionSection title="Confirm receipt" color="var(--green)">
              {!showReceiveForm ? (
                <button onClick={() => setRcvForm(true)} style={primaryBtn('#39D353','rgba(57,211,83,0.12)')}>
                  ✓ Mark as received
                </button>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Condition notes (optional)…" style={{ ...inputSt, resize:'none' }} />
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setRcvForm(false)} style={ghostBtn}>Cancel</button>
                    <button onClick={() => { onMarkReceived(shipment.id, notes); onClose() }} style={primaryBtn('#39D353','rgba(57,211,83,0.12)')}>
                      Confirm receipt →
                    </button>
                  </div>
                </div>
              )}
            </ActionSection>
          )}

          {/* Action: Flag exception */}
          {canFlag && (
            <ActionSection title="Flag exception" color="var(--orange)">
              {!showExcForm ? (
                <button onClick={() => setExcForm(true)} style={primaryBtn('#FF6B2B','rgba(255,107,43,0.08)')}>
                  ⚠ Flag issue
                </button>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Describe the issue…" style={{ ...inputSt, resize:'none' }} />
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setExcForm(false)} style={ghostBtn}>Cancel</button>
                    <button onClick={() => { onFlagException(shipment.id, notes); onClose() }} style={primaryBtn('#FF6B2B','rgba(255,107,43,0.08)')}>
                      Submit exception →
                    </button>
                  </div>
                </div>
              )}
            </ActionSection>
          )}
        </div>
      </div>
    </>
  )
}

function InfoSection({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:9, overflow:'hidden' }}>
      {children}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'9px 14px', fontSize:13, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ color:'#8b949e' }}>{label}</span>
      <span style={{ fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? 12 : 13 }}>{value}</span>
    </div>
  )
}

function ActionSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:600, color, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>{title}</div>
      {children}
    </div>
  )
}

const inputSt: React.CSSProperties = {
  width:'100%', background:'#0d1117',
  border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:7, padding:'8px 12px', fontSize:13,
  color:'#e6edf3', outline:'none',
}

function primaryBtn(color: string, bg: string): React.CSSProperties {
  return { width:'100%', padding:'9px', borderRadius:7, fontSize:13, fontWeight:600, background:bg, color, border:`1px solid ${color}40`, cursor:'pointer' }
}

const ghostBtn: React.CSSProperties = {
  flex:1, padding:'8px', borderRadius:7, fontSize:13,
  background:'transparent', color:'#8b949e',
  border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer',
}
