import type { ShipmentStatus } from '@/lib/data/shipments'
import { STATUS_CONFIG } from '@/lib/data/shipments'

export function ShipmentBadge({ status }: { status: ShipmentStatus }) {
  const s = STATUS_CONFIG[status]
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

const STEPS = ['Preparing', 'Shipped', 'In transit', 'Delivered', 'Received']

export function ShipmentProgress({ status }: { status: ShipmentStatus }) {
  const currentStep = STATUS_CONFIG[status].step
  const isException = status === 'EXCEPTION'

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {STEPS.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
              background: isException && i === 2
                ? 'rgba(255,107,43,0.2)'
                : i < currentStep
                  ? 'var(--teal)'
                  : i === currentStep
                    ? 'rgba(42,191,160,0.2)'
                    : 'rgba(255,255,255,0.06)',
              color: isException && i === 2
                ? '#FF6B2B'
                : i <= currentStep ? 'var(--teal)' : '#8b949e',
              border: i === currentStep ? `2px solid ${isException ? '#FF6B2B' : 'var(--teal)'}` : '2px solid transparent',
            }}>
              {i < currentStep ? '✓' : isException && i === 2 ? '!' : i + 1}
            </div>
            <span style={{ fontSize: 9, color: i <= currentStep ? (isException && i === 2 ? '#FF6B2B' : 'var(--teal)') : '#8b949e', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 1, margin: '0 4px', marginBottom: 14,
              background: i < currentStep ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}
