'use client'
import { useState } from 'react'
import type { InventoryItem } from '@/lib/data/inventory'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { NewRequestModal } from '@/components/requests/NewRequestModal'

const TABS = ['Overview', 'History', 'Requests', 'Audit']

const HISTORY = [
  { date: 'May 6 2026',  action: 'Transferred',  from: 'Chicago',  to: 'Austin HQ', by: 'Marcus T.'  },
  { date: 'Apr 18 2026', action: 'Received',      from: 'Vendor',   to: 'Chicago',   by: 'System'     },
  { date: 'Apr 18 2026', action: 'Status → GOOD', from: '',         to: '',          by: 'Kira V.'    },
]

const CONDITION_COLOR: Record<string, string> = {
  NEW: '#39D353', GOOD: '#2ABFA0', FAIR: '#F5A623', POOR: '#FF6B2B',
}

export function AssetDrawer({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [tab, setTab]           = useState('Overview')
  const [showRequest, setShowRequest] = useState(false)
  const [toast, setToast]       = useState('')

  function handleRequestSubmit(data: Record<string, unknown>) {
    setToast(`✓ Request submitted for ${item.name}`)
    setTimeout(() => setToast(''), 3000)
  }

  // Map InventoryItem to the item format NewRequestModal expects
  const preselectedItem = {
    id:   item.id,
    name: item.name,
    icon: item.category === 'Laptop' ? '💻'
        : item.category === 'Phone'   ? '📱'
        : item.category === 'Monitor' ? '🖥'
        : item.category === 'Tablet'  ? '⊞'
        : '🔌',
    type: item.type,
  }

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 600,
          background: '#161b22', border: '1px solid rgba(42,191,160,0.3)',
          borderRadius: 9, padding: '12px 18px', fontSize: 13,
          color: 'var(--teal)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>{toast}</div>
      )}

      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 420, background: '#161b22',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(42,191,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {preselectedItem.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>
                  {item.type === 'SERIALIZED' ? item.assetTag : `${item.make} · Quantity stock`}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 28, height: 28, color: '#8b949e', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={item.status} />
            {item.condition && (
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 500, color: CONDITION_COLOR[item.condition], background: `${CONDITION_COLOR[item.condition]}22` }}>
                {item.condition}
              </span>
            )}
            <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, color: '#8b949e', background: 'rgba(255,255,255,0.06)' }}>
              {item.site}
            </span>
          </div>

          <div style={{ display: 'flex', marginTop: 14, borderBottom: '1px solid rgba(255,255,255,0.08)', marginLeft: -24, marginRight: -24, paddingLeft: 24 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 14px', fontSize: 12, fontWeight: 500,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: tab === t ? 'var(--teal)' : '#8b949e',
                borderBottom: `2px solid ${tab === t ? 'var(--teal)' : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ padding: 24, flex: 1 }}>
          {tab === 'Overview' && (
            <div>
              <Section title="Details">
                <Row label="Category"   value={item.category} />
                <Row label="Make"       value={item.make} />
                <Row label="Site"       value={`${item.site} (${item.siteCode})`} />
                <Row label="Type"       value={item.type === 'SERIALIZED' ? 'Serialized asset' : 'Quantity stock'} />
                {item.assetTag     && <Row label="Asset tag"  value={item.assetTag}     mono />}
                {item.serialNumber && <Row label="Serial no." value={item.serialNumber} mono />}
                {item.total !== undefined && (
                  <>
                    <Row label="Total stock" value={String(item.total)} />
                    <Row label="Available"   value={String(item.available)} />
                    <Row label="Reserved"    value={String(item.reserved)} />
                  </>
                )}
                <Row label="Last updated" value={item.lastUpdated} />
              </Section>

              {/* Availability note */}
              {item.status !== 'AVAILABLE' && item.status !== 'READY' && (
                <div style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#F5A623', marginBottom: 16 }}>
                  ⚠ This item is currently <strong>{item.status.replace(/_/g, ' ').toLowerCase()}</strong> and may not be available for transfer
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => setShowRequest(true)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 7, fontSize: 13,
                    fontWeight: 600, background: 'var(--teal)', color: '#0d1117',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  Request transfer →
                </button>
                <button style={{
                  padding: '10px 14px', borderRadius: 7, fontSize: 13,
                  background: 'transparent', color: '#8b949e',
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                }}>Edit</button>
              </div>
            </div>
          )}

          {tab === 'History' && (
            <div>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 16 }}>Movement history</div>
              {HISTORY.map((h, i) => (
                <div key={i} style={{ padding: '12px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{h.action}</div>
                    {h.from && <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>{h.from} → {h.to}</div>}
                    <div style={{ fontSize: 11, color: '#8b949e' }}>by {h.by}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#8b949e', flexShrink: 0 }}>{h.date}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Requests' && (
            <div>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 16 }}>Active requests for this asset</div>
              <div style={{ fontSize: 13, color: '#8b949e', textAlign: 'center', padding: '32px 0' }}>
                No active requests
              </div>
              <button onClick={() => setShowRequest(true)} style={{ width: '100%', padding: '9px', borderRadius: 7, fontSize: 13, fontWeight: 600, background: 'rgba(42,191,160,0.1)', color: 'var(--teal)', border: '1px solid rgba(42,191,160,0.2)', cursor: 'pointer', marginTop: 8 }}>
                + Create new request
              </button>
            </div>
          )}

          {tab === 'Audit' && (
            <div style={{ fontSize: 13, color: '#8b949e', textAlign: 'center', padding: '40px 0' }}>
              Full audit log — coming in Phase 3
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal — pre-populated with this item */}
      {showRequest && (
        <NewRequestModal
          onClose={() => setShowRequest(false)}
          onSubmit={handleRequestSubmit}
          preselectedItem={preselectedItem}
          preselectedSource={item.site}
        />
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>{title}</div>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
      <span style={{ color: '#8b949e' }}>{label}</span>
      <span style={{ fontFamily: mono ? 'monospace' : 'inherit', color: '#e6edf3' }}>{value}</span>
    </div>
  )
}
