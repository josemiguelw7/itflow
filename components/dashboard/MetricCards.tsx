const METRICS = [
  { label: 'Total assets',      value: '1,847', delta: '↑ 12 added this week',   color: '#2ABFA0', accent: 'rgba(42,191,160,0.15)'  },
  { label: 'Available now',     value: '634',   delta: 'across 8 active sites',   color: '#3B8BFA', accent: 'rgba(59,139,250,0.15)'  },
  { label: 'Pending requests',  value: '23',    delta: '↑ 5 need your approval',  color: '#F5A623', accent: 'rgba(245,166,35,0.15)'  },
  { label: 'In transit',        value: '41',    delta: '7 arriving today',         color: '#39D353', accent: 'rgba(57,211,83,0.15)'   },
]

export function MetricCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginBottom: 20,
    }}>
      {METRICS.map(m => (
        <div key={m.label} style={{
          background: '#161b22',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '18px 20px',
          borderTop: `2px solid ${m.color}`,
        }}>
          <div style={{ fontSize: 10, color: '#8b949e', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            {m.label}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: m.color, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
            {m.value}
          </div>
          <div style={{ fontSize: 11, color: '#8b949e', marginTop: 6 }}>{m.delta}</div>
        </div>
      ))}
    </div>
  )
}
