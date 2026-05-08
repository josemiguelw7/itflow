export function AlertStrip() {
  return (
    <div style={{
      background: 'rgba(245,166,35,0.08)',
      border: '1px solid rgba(245,166,35,0.2)',
      borderRadius: 8,
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 20,
      fontSize: 13,
    }}>
      <span style={{ fontSize: 16 }}>⚠</span>
      <span style={{ color: '#F5A623', flex: 1 }}>
        3 items at critical stock level at Denver · <strong>2 incoming shipments</strong> pending receipt confirmation
      </span>
      <button style={{
        background: 'transparent', border: 'none',
        color: '#8b949e', cursor: 'pointer', fontSize: 16, padding: 0,
      }}>✕</button>
    </div>
  )
}
