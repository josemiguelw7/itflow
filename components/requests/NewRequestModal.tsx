'use client'
import { useState } from 'react'
import { SITES_LIST, ITEMS_LIST } from '@/lib/data/requests'

interface Props {
  onClose: () => void
  onSubmit: (req: Record<string, unknown>) => void
  preselectedItem?: { id: string; name: string; icon: string; type: string }
  preselectedSource?: string
}

const STEPS = ['Type', 'Item', 'Route', 'Details', 'Review']

const PRIORITY_OPTS = [
  { value: 'LOW',    label: 'Low',    desc: 'No rush',           color: '#8b949e' },
  { value: 'NORMAL', label: 'Normal', desc: 'Standard timeline', color: '#8b949e' },
  { value: 'HIGH',   label: 'High',   desc: 'Within 2 days',     color: '#F5A623' },
  { value: 'URGENT', label: 'Urgent', desc: 'Needed ASAP',       color: '#FF6B2B' },
]

export function NewRequestModal({ onClose, onSubmit, preselectedItem, preselectedSource }: Props) {
  const [step, setStep]               = useState(0)  // always start at Type step
  const [requestType, setRequestType] = useState<'TRANSFER' | 'PURCHASE'>('TRANSFER')
  const [item, setItem]               = useState(preselectedItem ?? ITEMS_LIST[0])
  const [quantity, setQuantity]       = useState(1)
  const [source, setSource]           = useState(preselectedSource ?? SITES_LIST[0])
  const [dest, setDest]               = useState(SITES_LIST.find(s => s !== (preselectedSource ?? SITES_LIST[0])) ?? SITES_LIST[1])
  const [priority, setPriority]       = useState('NORMAL')
  const [neededBy, setNeededBy]       = useState('')
  const [jiraKey, setJiraKey]         = useState('')
  const [notes, setNotes]             = useState('')
  const [submitting, setSubmitting]   = useState(false)

  function next() {
    // When item is preselected, skip the Item step (step 1)
    if (preselectedItem && step === 0) { setStep(2); return }
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  function back() {
    // When item is preselected, skip back over the Item step
    if (preselectedItem && step === 2) { setStep(0); return }
    if (step > 0) setStep(s => s - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    onSubmit({ requestType, item, quantity, source: requestType === 'PURCHASE' ? 'Vendor' : source, dest, priority, neededBy, jiraKey, notes })
    setSubmitting(false)
    onClose()
  }

  const canNext = step === 2 && requestType === 'TRANSFER' ? source !== dest : true

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:300 }} />
      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:540, background:'#161b22',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:14, zIndex:301,
        display:'flex', flexDirection:'column',
        maxHeight:'90vh', overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{ padding:'22px 28px 0' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <div style={{ fontWeight:600, fontSize:16 }}>New request</div>
              <div style={{ fontSize:12, color:'#8b949e', marginTop:2 }}>
                {preselectedItem && step === 0 && `Step 1 of 4 — Type`}
                {preselectedItem && step === 2 && `Step 2 of 4 — Route · ${item.icon} ${item.name}`}
                {preselectedItem && step === 3 && `Step 3 of 4 — Details`}
                {preselectedItem && step === 4 && `Step 4 of 4 — Review`}
                {!preselectedItem && `Step ${step+1} of ${STEPS.length} — ${STEPS[step]}`}
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, width:28, height:28, color:'#8b949e', cursor:'pointer', fontSize:16 }}>✕</button>
          </div>
          {/* Step dots */}
          <div style={{ display:'flex', gap:0, marginBottom:24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 0 }}>
                <div style={{
                  width:26, height:26, borderRadius:'50%', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:700,
                  background: i < step ? 'var(--teal)' : i === step ? 'rgba(42,191,160,0.2)' : 'rgba(255,255,255,0.06)',
                  color: i <= step ? 'var(--teal)' : '#8b949e',
                  border: i === step ? '2px solid var(--teal)' : '2px solid transparent',
                }}>
                  {i < step ? '✓' : i+1}
                </div>
                {i < STEPS.length-1 && (
                  <div style={{ flex:1, height:1, background: i < step ? 'var(--teal)' : 'rgba(255,255,255,0.1)', margin:'0 6px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'0 28px', overflowY:'auto', flex:1 }}>

          {/* Step 0: Request type */}
          {step === 0 && (
            <div>
              <div style={{ fontSize:12, color:'#8b949e', marginBottom:16 }}>What kind of request is this?</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
                <button onClick={() => setRequestType('TRANSFER')} style={{
                  padding:'16px 18px', borderRadius:10, cursor:'pointer', textAlign:'left',
                  background: requestType === 'TRANSFER' ? 'rgba(59,139,250,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${requestType === 'TRANSFER' ? 'rgba(59,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <span style={{ fontSize:20 }}>↔</span>
                    <div style={{ fontWeight:600, fontSize:14, color: requestType === 'TRANSFER' ? '#3B8BFA' : '#e6edf3' }}>Transfer existing inventory</div>
                    <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'rgba(59,139,250,0.12)', color:'#3B8BFA' }}>SUPERVISOR APPROVES</span>
                  </div>
                  <div style={{ fontSize:12, color:'#8b949e', paddingLeft:30 }}>Move an item that already exists in ITFlow from one site to another. Dave (Supervisor) reviews and approves.</div>
                </button>

                <button onClick={() => setRequestType('PURCHASE')} style={{
                  padding:'16px 18px', borderRadius:10, cursor:'pointer', textAlign:'left',
                  background: requestType === 'PURCHASE' ? 'rgba(176,107,200,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${requestType === 'PURCHASE' ? 'rgba(176,107,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <span style={{ fontSize:20 }}>🛒</span>
                    <div style={{ fontWeight:600, fontSize:14, color: requestType === 'PURCHASE' ? '#B06BC8' : '#e6edf3' }}>New purchase</div>
                    <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'rgba(176,107,200,0.12)', color:'#B06BC8' }}>MANAGER APPROVES</span>
                  </div>
                  <div style={{ fontSize:12, color:'#8b949e', paddingLeft:30 }}>Request new equipment to be purchased from a vendor. Abe (Manager) reviews budget and approves procurement.</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Item */}
          {step === 1 && (
            <div>
              <div style={{ fontSize:12, color:'#8b949e', marginBottom:12 }}>
                {requestType === 'TRANSFER' ? 'Select the item to transfer' : 'Select the item to purchase'}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                {ITEMS_LIST.map(it => (
                  <button key={it.id} onClick={() => setItem(it)} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'12px 14px', borderRadius:8, cursor:'pointer', textAlign:'left',
                    background: item.id === it.id ? 'rgba(42,191,160,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.id === it.id ? 'rgba(42,191,160,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    <span style={{ fontSize:20 }}>{it.icon}</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:500, color:'#e6edf3' }}>{it.name}</div>
                      <div style={{ fontSize:10, color:'#8b949e' }}>{it.type}</div>
                    </div>
                  </button>
                ))}
              </div>
              {item.type === 'QUANTITY' && (
                <div style={{ marginBottom:16 }}>
                  <Label>Quantity</Label>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={qBtn}>−</button>
                    <span style={{ fontSize:18, fontWeight:700, width:32, textAlign:'center' }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} style={qBtn}>+</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Route */}
          {step === 2 && (
            <div>
              {/* Show pre-selected item as confirmed banner */}
              {preselectedItem && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(42,191,160,0.08)', border:'1px solid rgba(42,191,160,0.2)', borderRadius:8, marginBottom:16 }}>
                  <span style={{ fontSize:20 }}>{preselectedItem.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--teal)' }}>{preselectedItem.name}</div>
                    <div style={{ fontSize:11, color:'#8b949e' }}>Item confirmed from inventory</div>
                  </div>
                  <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background: requestType === 'TRANSFER' ? 'rgba(59,139,250,0.12)' : 'rgba(176,107,200,0.12)', color: requestType === 'TRANSFER' ? '#3B8BFA' : '#B06BC8' }}>
                    {requestType === 'TRANSFER' ? '↔ TRANSFER' : '🛒 PURCHASE'}
                  </span>
                </div>
              )}
              {requestType === 'TRANSFER' ? (
                <>
                  <div style={{ fontSize:12, color:'#8b949e', marginBottom:16 }}>Where should the item come from and go to?</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'center', marginBottom:8 }}>
                    <div>
                      <Label>Source site</Label>
                      <SiteSelect value={source} onChange={setSource} exclude={dest} />
                    </div>
                    <div style={{ color:'#8b949e', fontSize:18, marginTop:20 }}>→</div>
                    <div>
                      <Label>Destination site</Label>
                      <SiteSelect value={dest} onChange={setDest} exclude={source} />
                    </div>
                  </div>
                  {source === dest && <div style={{ fontSize:12, color:'#FF6B2B', marginTop:6 }}>Source and destination must be different</div>}
                </>
              ) : (
                <>
                  <div style={{ fontSize:12, color:'#8b949e', marginBottom:16 }}>Where should the new equipment be delivered?</div>
                  <div style={{ marginBottom:16 }}>
                    <Label>Deliver to site</Label>
                    <SiteSelect value={dest} onChange={setDest} />
                  </div>
                  <div style={{ background:'rgba(176,107,200,0.06)', border:'1px solid rgba(176,107,200,0.2)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#B06BC8' }}>
                    🛒 This is a new purchase from a vendor. Abe (Manager) will review the budget and approve procurement.
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom:14 }}>
                <Label>Priority</Label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {PRIORITY_OPTS.map(p => (
                    <button key={p.value} onClick={() => setPriority(p.value)} style={{
                      padding:'10px 12px', borderRadius:7, cursor:'pointer', textAlign:'left',
                      background: priority === p.value ? `${p.color}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${priority === p.value ? `${p.color}60` : 'rgba(255,255,255,0.08)'}`,
                    }}>
                      <div style={{ fontSize:12, fontWeight:600, color: priority === p.value ? p.color : '#e6edf3' }}>{p.label}</div>
                      <div style={{ fontSize:11, color:'#8b949e', marginTop:1 }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <Label>Needed by (optional)</Label>
                <input type="date" value={neededBy} onChange={e => setNeededBy(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom:14 }}>
                <Label>Jira ticket (optional)</Label>
                <input placeholder="e.g. IT-442" value={jiraKey} onChange={e => setJiraKey(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom:16 }}>
                <Label>Notes (optional)</Label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any additional context…" style={{ ...inputStyle, resize:'none', lineHeight:1.5 }} />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:12, color:'#8b949e', marginBottom:14 }}>Review your request before submitting</div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:9, overflow:'hidden', marginBottom:16 }}>
                {[
                  ['Type',        requestType === 'TRANSFER' ? '↔ Transfer' : '🛒 New purchase'],
                  ['Item',        `${item.icon} ${item.name}`],
                  ['Quantity',    item.type === 'QUANTITY' ? String(quantity) : '1 (serialized)'],
                  ['From',        requestType === 'PURCHASE' ? 'Vendor' : source],
                  ['To',          dest],
                  ['Priority',    priority],
                  ['Needed by',   neededBy || '—'],
                  ['Jira ticket', jiraKey  || '—'],
                  ['Notes',       notes    || '—'],
                ].map(([label, val], i) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', fontSize:13, borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ color:'#8b949e' }}>{label}</span>
                    <span style={{ fontWeight: label === 'Priority' ? 600 : 400 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{
                background: requestType === 'PURCHASE' ? 'rgba(176,107,200,0.06)' : 'rgba(42,191,160,0.06)',
                border: `1px solid ${requestType === 'PURCHASE' ? 'rgba(176,107,200,0.2)' : 'rgba(42,191,160,0.2)'}`,
                borderRadius:8, padding:'10px 14px', fontSize:12,
                color: requestType === 'PURCHASE' ? '#B06BC8' : '#8b949e',
              }}>
                {requestType === 'PURCHASE'
                  ? '🛒 Purchase request — Abe (Manager) will be notified to review and approve budget.'
                  : '↔ Transfer request — Dave (Supervisor) will be notified to approve. A Jira ticket will be created automatically.'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'18px 28px', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', gap:10 }}>
          <button onClick={step === 0 ? onClose : back} style={{ padding:'8px 18px', borderRadius:7, fontSize:13, background:'transparent', color:'#8b949e', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <button
            onClick={step === STEPS.length - 1 ? handleSubmit : next}
            disabled={!canNext || submitting}
            style={{
              padding:'8px 24px', borderRadius:7, fontSize:13, fontWeight:600,
              background: canNext ? 'var(--teal)' : 'rgba(255,255,255,0.06)',
              color: canNext ? '#0d1117' : '#8b949e',
              border:'none', cursor: canNext ? 'pointer' : 'not-allowed',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Submitting…' : step === STEPS.length - 1 ? 'Submit request' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:6 }}>{children}</div>
}

function SiteSelect({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude?: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
      {SITES_LIST.filter(s => s !== exclude).map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}

const qBtn: React.CSSProperties = { width:32, height:32, borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'#e6edf3', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }
const inputStyle: React.CSSProperties = { width:'100%', background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'8px 12px', fontSize:13, color:'#e6edf3', outline:'none' }
