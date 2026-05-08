'use client'
import { useState } from 'react'

const QUEUE = [
  { id: '1', item: '2× MacBook Pro 14" M3',    route: 'Denver → Austin',  priority: 'URGENT',  requester: 'Kira Valdez',  icon: '💻', color: 'rgba(59,139,250,0.15)' },
  { id: '2', item: '4× Dell Monitor P2723QE',   route: 'Austin → Chicago', priority: 'NORMAL',  requester: 'Marcus T.',    icon: '🖥',  color: 'rgba(0,212,255,0.12)'  },
  { id: '3', item: '10× Magic Keyboards',       route: 'Austin → Seattle', priority: 'NORMAL',  requester: 'Auto-approve', icon: '⌨',  color: 'rgba(57,211,83,0.12)'  },
  { id: '4', item: '1× iPhone 15 Pro 256GB',    route: 'NY → Austin',      priority: 'NORMAL',  requester: 'James P.',     icon: '📱', color: 'rgba(232,64,122,0.12)' },
  { id: '5', item: '6× USB-C Charger 96W',      route: 'Austin → Miami',   priority: 'LOW',     requester: 'Auto-approve', icon: '🔌', color: 'rgba(245,166,35,0.12)' },
]

const PRIORITY_STYLE: Record<string, { color: string; bg: string }> = {
  URGENT: { color: '#FF6B2B', bg: 'rgba(255,107,43,0.15)' },
  HIGH:   { color: '#F5A623', bg: 'rgba(245,166,35,0.15)' },
  NORMAL: { color: '#8b949e', bg: 'rgba(255,255,255,0.06)' },
  LOW:    { color: '#3B8BFA', bg: 'rgba(59,139,250,0.12)' },
}

export function ApprovalQueue() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const items = QUEUE.filter(q => !dismissed.includes(q.id))

  return (
    <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Approval queue</span>
        <span style={{
          background: '#FF6B2B', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
        }}>{items.length}</span>
      </div>
      <div style={{ padding: '8px 20px 16px' }}>
        {items.length === 0 && (
          <div style={{ fontSize: 13, color: '#8b949e', padding: '20px 0', textAlign: 'center' }}>
            All caught up ✓
          </div>
        )}
        {items.map(item => {
          const p = PRIORITY_STYLE[item.priority]
          return (
            <div key={item.id} style={{
              padding: '11px 0',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: item.color, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 15, flexShrink: 0,
              }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.item}
                </div>
                <div style={{ fontSize: 11, color: '#8b949e', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.route}
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '1px 6px', borderRadius: 4,
                    color: p.color, background: p.bg,
                  }}>{item.priority}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                <button
                  onClick={() => setDismissed(d => [...d, item.id])}
                  style={{
                    background: 'rgba(57,211,83,0.12)', color: '#39D353',
                    border: 'none', borderRadius: 5, padding: '4px 10px',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>✓</button>
                <button
                  onClick={() => setDismissed(d => [...d, item.id])}
                  style={{
                    background: 'transparent', color: '#8b949e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 5, padding: '4px 8px',
                    fontSize: 11, cursor: 'pointer',
                  }}>✕</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
