import type { AssetStatus } from '@/lib/data/inventory'

const STATUS_MAP: Record<AssetStatus, { label: string; color: string; bg: string }> = {
  AVAILABLE:    { label: 'Available',     color: '#39D353', bg: 'rgba(57,211,83,0.12)'   },
  RESERVED:     { label: 'Reserved',      color: '#FF6B2B', bg: 'rgba(255,107,43,0.12)'  },
  IN_TRANSIT:   { label: 'In transit',    color: '#3B8BFA', bg: 'rgba(59,139,250,0.12)'  },
  PENDING_WIPE: { label: 'Pending wipe',  color: '#E8407A', bg: 'rgba(232,64,122,0.12)'  },
  READY:        { label: 'Ready',         color: '#2ABFA0', bg: 'rgba(42,191,160,0.12)'  },
  DAMAGED:      { label: 'Damaged',       color: '#F5A623', bg: 'rgba(245,166,35,0.12)'  },
  RETIRED:      { label: 'Retired',       color: '#8b949e', bg: 'rgba(139,148,158,0.12)' },
}

export function StatusBadge({ status }: { status: AssetStatus }) {
  const s = STATUS_MAP[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 12,
      fontSize: 11, fontWeight: 500,
      color: s.color, background: s.bg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}
