const SITES = [
  { name: 'Austin HQ',     code: 'ATX', available: 312, total: 400, color: '#2ABFA0' },
  { name: 'Seattle',       code: 'SEA', available: 248, total: 390, color: '#3B8BFA' },
  { name: 'Chicago',       code: 'CHI', available: 218, total: 350, color: '#39D353' },
  { name: 'New York',      code: 'NYC', available: 168, total: 290, color: '#E8407A' },
  { name: 'San Francisco', code: 'SFO', available: 183, total: 310, color: '#00D4FF' },
  { name: 'Boston',        code: 'BOS', available: 149, total: 260, color: '#B06BC8' },
  { name: 'Denver',        code: 'DEN', available: 71,  total: 280, color: '#F5A623' },
  { name: 'Miami',         code: 'MIA', available: 44,  total: 250, color: '#FF6B2B' },
]

function stockColor(available: number, total: number) {
  const pct = available / total
  if (pct > 0.4) return '#39D353'
  if (pct > 0.2) return '#F5A623'
  return '#FF6B2B'
}

export function InventorySites() {
  return (
    <div style={{
      background: '#161b22',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
    }}>
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Multi-site inventory</span>
        <span style={{ fontSize: 12, color: '#2ABFA0', cursor: 'pointer' }}>Map view →</span>
      </div>
      <div style={{ padding: '12px 20px 16px' }}>
        {SITES.map(site => {
          const pct = Math.round((site.available / site.total) * 100)
          const color = stockColor(site.available, site.total)
          return (
            <div key={site.code} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 0',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: `${site.color}22`,
                border: `1px solid ${site.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: site.color, flexShrink: 0,
              }}>
                {site.code}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, width: 120, flexShrink: 0 }}>{site.name}</div>
              <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, color,
                width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0,
              }}>
                {site.available}
              </div>
              <div style={{ fontSize: 11, color: '#8b949e', width: 44, flexShrink: 0 }}>/ {site.total}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
