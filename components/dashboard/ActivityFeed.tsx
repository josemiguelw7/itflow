const FEED = [
  { dot: '#39D353', text: 'SHP-0435 received at Austin',         sub: '2× Dell Latitude awaiting confirmation', time: '2m'  },
  { dot: '#3B8BFA', text: 'Marcus T. submitted request',         sub: '4× Monitors → Chicago',                  time: '14m' },
  { dot: '#2ABFA0', text: 'SHP-0441 picked up by FedEx',         sub: 'Chicago site',                           time: '38m' },
  { dot: '#F5A623', text: 'Denver stock alert',                  sub: 'iPhone 15 Pro below threshold (1 left)',  time: '1h'  },
  { dot: '#FF6B2B', text: 'Kira V. escalated to URGENT',         sub: 'MacBook Pro request',                    time: '2h'  },
  { dot: '#39D353', text: '12× USB-C Chargers wipe complete',    sub: 'Status → Available',                     time: '3h'  },
  { dot: '#3B8BFA', text: 'James P. approved transfer',          sub: '1× iPhone 15 Pro NY → Austin',           time: '4h'  },
  { dot: '#E8407A', text: 'SHP-0432 delivered to Miami',         sub: 'Inventory updated',                      time: '5h'  },
]

export function ActivityFeed() {
  return (
    <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Activity feed</span>
        <span style={{ fontSize: 12, color: '#2ABFA0', cursor: 'pointer' }}>Full log →</span>
      </div>
      <div style={{ padding: '8px 20px 16px' }}>
        {FEED.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '9px 0',
            borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: item.dot, marginTop: 4, flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{item.text}</div>
              <div style={{ fontSize: 11, color: '#8b949e', marginTop: 1 }}>{item.sub}</div>
            </div>
            <div style={{
              fontSize: 10, color: '#8b949e', flexShrink: 0,
              fontFamily: 'monospace', marginTop: 2,
            }}>{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
