import type { RequestStatus, RequestPriority } from '@/lib/data/requests'

export const STATUS_MAP: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  SUBMITTED: { label: 'Submitted', color: '#3B8BFA', bg: 'rgba(59,139,250,0.12)'  },
  APPROVED:  { label: 'Approved',  color: '#2ABFA0', bg: 'rgba(42,191,160,0.12)'  },
  REJECTED:  { label: 'Rejected',  color: '#FF6B2B', bg: 'rgba(255,107,43,0.12)'  },
  RESERVED:  { label: 'Reserved',  color: '#F5A623', bg: 'rgba(245,166,35,0.12)'  },
  SHIPPED:   { label: 'Shipped',   color: '#00D4FF', bg: 'rgba(0,212,255,0.12)'   },
  COMPLETED: { label: 'Completed', color: '#39D353', bg: 'rgba(57,211,83,0.12)'   },
  CANCELLED: { label: 'Cancelled', color: '#8b949e', bg: 'rgba(139,148,158,0.12)' },
}

export const PRIORITY_MAP: Record<RequestPriority, { label: string; color: string; bg: string }> = {
  LOW:    { label: 'Low',    color: '#8b949e', bg: 'rgba(255,255,255,0.06)'  },
  NORMAL: { label: 'Normal', color: '#8b949e', bg: 'rgba(255,255,255,0.06)'  },
  HIGH:   { label: 'High',   color: '#F5A623', bg: 'rgba(245,166,35,0.12)'  },
  URGENT: { label: 'Urgent', color: '#FF6B2B', bg: 'rgba(255,107,43,0.12)'  },
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS_MAP[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 12,
      fontSize: 11, fontWeight: 500,
      color: s.color, background: s.bg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const p = PRIORITY_MAP[priority]
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 7px', borderRadius: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
      color: p.color, background: p.bg,
    }}>
      {p.label.toUpperCase()}
    </span>
  )
}
