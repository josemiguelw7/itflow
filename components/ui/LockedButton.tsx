'use client'
// components/ui/LockedButton.tsx
// Shows a button that is disabled with a tooltip if the user lacks permission

import { useState } from 'react'

interface Props {
  allowed: boolean
  tooltip?: string        // shown when locked
  onClick?: () => void
  children: React.ReactNode
  style?: React.CSSProperties
  variant?: 'primary' | 'ghost' | 'danger'
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { background: 'var(--teal)', color: '#0d1117', border: 'none', fontWeight: 600 },
  ghost:   { background: 'transparent', color: '#8b949e', border: '1px solid rgba(255,255,255,0.1)' },
  danger:  { background: 'rgba(255,107,43,0.1)', color: '#FF6B2B', border: '1px solid rgba(255,107,43,0.2)' },
}

export function LockedButton({ allowed, tooltip, onClick, children, style, variant = 'primary' }: Props) {
  const [showTip, setShowTip] = useState(false)

  const base: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 7, fontSize: 13,
    cursor: allowed ? 'pointer' : 'not-allowed',
    opacity: allowed ? 1 : 0.45,
    display: 'inline-flex', alignItems: 'center', gap: 7,
    position: 'relative',
    transition: 'opacity 0.15s',
    ...VARIANT_STYLES[variant],
    ...style,
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={allowed ? onClick : undefined}
        onMouseEnter={() => !allowed && setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        style={base}
      >
        {!allowed && <span style={{ fontSize: 12 }}>🔒</span>}
        {children}
      </button>
      {showTip && tooltip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1c2128', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 6, padding: '6px 10px', fontSize: 11,
          color: '#e6edf3', whiteSpace: 'nowrap', zIndex: 1000,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {tooltip}
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(255,255,255,0.12)',
          }} />
        </div>
      )}
    </div>
  )
}
