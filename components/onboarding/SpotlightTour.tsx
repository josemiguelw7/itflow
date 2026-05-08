'use client'
import { useState, useEffect } from 'react'

const STEPS = [
  {
    id: 'dashboard',
    selector: '[data-tour="dashboard"]',
    title: 'Dashboard',
    body: 'Your command center — metrics, approval queue, active shipments, and activity feed all in one view.',
  },
  {
    id: 'inventory',
    selector: '[data-tour="inventory"]',
    title: 'Inventory',
    body: 'Browse all assets and stock across every site. Filter by location, category, or status.',
  },
  {
    id: 'requests',
    selector: '[data-tour="requests"]',
    title: 'Requests',
    body: 'Submit transfer requests, track approvals, and see everything in your queue.',
  },
  {
    id: 'shipments',
    selector: '[data-tour="shipments"]',
    title: 'Shipments',
    body: 'Create shipments, add tracking numbers, and confirm receipt — inventory updates automatically.',
  },
  {
    id: 'reports',
    selector: '[data-tour="reports"]',
    title: 'Reports',
    body: 'Multi-site inventory trends, aging assets, and transfer history across all locations.',
  },
]

interface Props {
  seenSteps: string[]
  onComplete: () => void
  onMarkSeen: (step: string) => void
}

export function SpotlightTour({ seenSteps, onComplete, onMarkSeen }: Props) {
  const [idx, setIdx] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const step = STEPS[idx]

  useEffect(() => {
    const el = document.querySelector(step.selector)
    if (el) setRect(el.getBoundingClientRect())
    onMarkSeen(step.id)
  }, [idx, step])

  function next() {
    if (idx < STEPS.length - 1) setIdx(i => i + 1)
    else onComplete()
  }

  const PAD = 6
  const tooltipTop = rect ? rect.bottom + PAD + 10 : 120
  const tooltipLeft = rect ? Math.min(rect.left, window.innerWidth - 300) : 40

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
      }} />

      {rect && (
        <div style={{
          position: 'absolute',
          top: rect.top - PAD,
          left: rect.left - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
          borderRadius: 10,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
          border: '2px solid var(--teal)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        position: 'absolute',
        top: tooltipTop,
        left: tooltipLeft,
        width: 280,
        background: '#161b22',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: '16px 18px',
        pointerEvents: 'all',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{step.title}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{idx + 1} / {STEPS.length}</div>
        </div>
        <p style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.6, margin: '0 0 14px' }}>{step.body}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === idx ? 'var(--teal)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onComplete}
              style={{
                padding: '5px 10px', borderRadius: 5, fontSize: 11,
                background: 'transparent', color: 'var(--muted)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              Skip
            </button>
            <button
              onClick={next}
              style={{
                padding: '5px 14px', borderRadius: 5, fontSize: 11,
                fontWeight: 600, background: 'var(--teal)',
                color: '#0d1117', border: 'none', cursor: 'pointer',
              }}
            >
              {idx < STEPS.length - 1 ? 'Next →' : 'Done ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
