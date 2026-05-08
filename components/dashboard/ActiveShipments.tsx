const SHIPMENTS = [
  {
    id: 'SHP-0441', route: 'Chicago → Austin HQ',
    items: '3× MacBook Pro · FedEx 7849…',
    status: 'IN_TRANSIT', steps: 3,
    badge: { label: 'In transit', color: '#3B8BFA', bg: 'rgba(59,139,250,0.15)' },
  },
  {
    id: 'SHP-0438', route: 'Austin HQ → Denver',
    items: '1× iPhone 15 · 4× Keyboards',
    status: 'PREPARING', steps: 1,
    badge: { label: 'Preparing', color: '#F5A623', bg: 'rgba(245,166,35,0.15)' },
  },
  {
    id: 'SHP-0435', route: 'Seattle → Austin HQ',
    items: '2× Dell Latitude',
    status: 'DELIVERED', steps: 4,
    badge: { label: 'Awaiting receipt', color: '#39D353', bg: 'rgba(57,211,83,0.12)' },
    alert: true,
  },
]

const STEP_LABELS = ['Packed', 'Picked up', 'In transit', 'Delivered']

export function ActiveShipments() {
  return (
    <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Active shipments</span>
        <span style={{ fontSize: 12, color: '#2ABFA0', cursor: 'pointer' }}>All →</span>
      </div>
      <div style={{ padding: '8px 20px 16px' }}>
        {SHIPMENTS.map(s => (
          <div key={s.id} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#2ABFA0' }}>{s.id}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                color: s.badge.color, background: s.badge.bg,
              }}>{s.badge.label}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{s.route}</div>
            <div style={{ fontSize: 11, color: s.alert ? '#F5A623' : '#8b949e', marginBottom: 10 }}>{s.items}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STEP_LABELS.map((label, i) => {
                const done = i < s.steps
                const active = i === s.steps - 1
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                        background: done ? '#2ABFA0' : 'rgba(255,255,255,0.15)',
                        border: active ? '2px solid #2ABFA0' : 'none',
                        boxSizing: 'border-box',
                      }} />
                      <span style={{
                        fontSize: 10,
                        color: done ? '#2ABFA0' : '#8b949e',
                        whiteSpace: 'nowrap',
                      }}>{label}</span>
                    </div>
                    {i < 3 && (
                      <div style={{
                        flex: 1, height: 1, margin: '0 6px',
                        background: i < s.steps - 1 ? '#2ABFA0' : 'rgba(255,255,255,0.1)',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
