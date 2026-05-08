'use client'
import { useState } from 'react'
import { SITES_LIST, CARRIERS } from '@/lib/data/shipments'
import { ITEMS_LIST } from '@/lib/data/requests'

interface Props { onClose: () => void; onSubmit: (s: Record<string, unknown>) => void }

export function NewShipmentModal({ onClose, onSubmit }: Props) {
  const [origin, setOrigin]       = useState(SITES_LIST[0])
  const [dest, setDest]           = useState(SITES_LIST[1])
  const [carrier, setCarrier]     = useState('FedEx')
  const [tracking, setTracking]   = useState('')
  const [eta, setEta]             = useState('')
  const [selectedItems, setItems] = useState<{ id: string; qty: number }[]>([])
  const [submitting, setSub]      = useState(false)

  function toggleItem(id: string) {
    setItems(prev =>
      prev.find(i => i.id === id)
        ? prev.filter(i => i.id !== id)
        : [...prev, { id, qty: 1 }]
    )
  }

  function setQty(id: string, qty: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
  }

  async function handleSubmit() {
    setSub(true)
    await new Promise(r => setTimeout(r, 600))
    onSubmit({ origin, dest, carrier, tracking, eta, items: selectedItems })
    setSub(false)
    onClose()
  }

  const canSubmit = origin !== dest && selectedItems.length > 0

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:300 }} />
      <div style={{
        position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:520, background:'#161b22', border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:14, zIndex:301, display:'flex', flexDirection:'column', maxHeight:'90vh',
      }}>
        <div style={{ padding:'22px 28px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontWeight:600, fontSize:16 }}>New shipment</div>
              <div style={{ fontSize:12, color:'#8b949e', marginTop:2 }}>Create a manual shipment between sites</div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, width:28, height:28, color:'#8b949e', cursor:'pointer', fontSize:16 }}>✕</button>
          </div>
        </div>

        <div style={{ padding:'20px 28px', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:16 }}>
          {/* Route */}
          <div>
            <Label>Route</Label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:10, alignItems:'center' }}>
              <SiteSelect value={origin} onChange={setOrigin} exclude={dest} />
              <span style={{ color:'#8b949e', fontSize:20 }}>→</span>
              <SiteSelect value={dest} onChange={setDest} exclude={origin} />
            </div>
            {origin === dest && <div style={{ fontSize:11, color:'#FF6B2B', marginTop:4 }}>Sites must be different</div>}
          </div>

          {/* Items */}
          <div>
            <Label>Items to ship</Label>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {ITEMS_LIST.map(item => {
                const sel = selectedItems.find(i => i.id === item.id)
                return (
                  <div key={item.id} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'10px 12px', borderRadius:8, cursor:'pointer',
                    background: sel ? 'rgba(42,191,160,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sel ? 'rgba(42,191,160,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }} onClick={() => toggleItem(item.id)}>
                    <span style={{ fontSize:18 }}>{item.icon}</span>
                    <span style={{ flex:1, fontSize:13, fontWeight:500 }}>{item.name}</span>
                    {item.type === 'QUANTITY' && sel && (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setQty(item.id, sel.qty - 1)} style={qBtnSt}>−</button>
                        <span style={{ fontSize:13, fontWeight:700, width:24, textAlign:'center' }}>{sel.qty}</span>
                        <button onClick={() => setQty(item.id, sel.qty + 1)} style={qBtnSt}>+</button>
                      </div>
                    )}
                    <div style={{
                      width:18, height:18, borderRadius:4, flexShrink:0,
                      background: sel ? 'var(--teal)' : 'rgba(255,255,255,0.06)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:11, color: sel ? '#0d1117' : '#8b949e', fontWeight:700,
                    }}>{sel ? '✓' : ''}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Carrier + tracking */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <Label>Carrier</Label>
              <select value={carrier} onChange={e => setCarrier(e.target.value)} style={inputSt}>
                {CARRIERS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Tracking # (optional)</Label>
              <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Enter tracking number" style={inputSt} />
            </div>
          </div>

          <div>
            <Label>Estimated arrival (optional)</Label>
            <input type="date" value={eta} onChange={e => setEta(e.target.value)} style={inputSt} />
          </div>
        </div>

        <div style={{ padding:'16px 28px', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'8px 18px', borderRadius:7, fontSize:13, background:'transparent', color:'#8b949e', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            style={{
              padding:'8px 22px', borderRadius:7, fontSize:13, fontWeight:600,
              background: canSubmit ? 'var(--teal)' : 'rgba(255,255,255,0.06)',
              color: canSubmit ? '#0d1117' : '#8b949e',
              border:'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Creating…' : 'Create shipment →'}
          </button>
        </div>
      </div>
    </>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:6 }}>{children}</div>
}

function SiteSelect({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputSt, cursor:'pointer' }}>
      {SITES_LIST.filter(s => s !== exclude).map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}

const inputSt: React.CSSProperties = {
  width:'100%', background:'#0d1117',
  border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:7, padding:'8px 12px', fontSize:13,
  color:'#e6edf3', outline:'none',
}

const qBtnSt: React.CSSProperties = {
  width:24, height:24, borderRadius:4,
  border:'1px solid rgba(255,255,255,0.1)',
  background:'rgba(255,255,255,0.04)',
  color:'#e6edf3', fontSize:14, cursor:'pointer',
  display:'flex', alignItems:'center', justifyContent:'center',
}
