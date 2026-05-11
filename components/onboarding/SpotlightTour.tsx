'use client'
import { useState, useEffect } from 'react'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { ROLE_LABELS } from '@/lib/permissions'

interface TourStep {
  id:       string
  selector: string
  title:    string
  body:     string
  roles:    string[]   // which roles see this step
  tip?:     string     // role-specific tip line
}

const ALL_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    selector: '[data-tour="dashboard"]',
    title: 'Dashboard',
    body: 'Your command center. Four live metrics at the top, site health bars below, and your approval queue on the right.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'site-health',
    selector: '[data-tour="site-health"]',
    title: 'Site health',
    body: 'Each bar shows available inventory at that location. Green is healthy, amber is getting low, red needs attention.',
    roles: ['SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'approval-queue',
    selector: '[data-tour="approval-queue"]',
    title: 'Approval queue',
    body: 'Requests waiting for action appear here. Transfer requests go to Supervisors — purchase requests go to Managers.',
    roles: ['SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'inventory',
    selector: '[data-tour="inventory"]',
    title: 'Inventory',
    body: 'Every asset and stock item across all sites. Filter by site, category, or status. Toggle between serialized assets and quantity stock.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'request-transfer',
    selector: '[data-tour="requests"]',
    title: 'Requests',
    body: 'Submit a transfer (moving existing inventory) or a purchase (new equipment from a vendor). Each goes to the right approver automatically.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'approve-transfer',
    selector: '[data-tour="requests"]',
    title: 'Transfer approvals',
    body: 'Transfer requests land in your queue. Review the route, check stock levels, and approve or reject with one click. Requester is notified automatically.',
    roles: ['SITE_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'approve-purchase',
    selector: '[data-tour="requests"]',
    title: 'Purchase approvals',
    body: 'Purchase requests require your sign-off. You review the item, quantity, and justification before committing budget. Approved purchases trigger a Jira ticket.',
    roles: ['REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'shipments',
    selector: '[data-tour="shipments"]',
    title: 'Shipments',
    body: 'Track every package through 5 stages — Preparing, Shipped, In Transit, Delivered, Received. Confirm receipt here and inventory updates automatically.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'reports',
    selector: '[data-tour="reports"]',
    title: 'Reports',
    body: 'Stock health trends, transfer activity over time, aging inventory, and a full cross-site summary. Read-only visibility for everyone.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: '',
  },
  {
    id: 'admin',
    selector: '[data-tour="admin"]',
    title: 'Admin',
    body: 'Manage users, locations, item catalog, and integrations. Connect Jira, Slack, and Okta here — each takes just an API key.',
    roles: ['ADMIN'],
    tip: '',
  },
]

interface Props {
  seenSteps: string[]
  onComplete: () => void
  onMarkSeen: (step: string) => void
}

export function SpotlightTour({ seenSteps, onComplete, onMarkSeen }: Props) {
  const { role } = usePermissions()
  const [idx, setIdx]   = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  // Filter steps to only those relevant for this role
  const steps = ALL_STEPS.filter(s => s.roles.includes(role))

  const step = steps[idx]

  useEffect(() => {
    if (!step) return
    const el = document.querySelector(step.selector)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setTimeout(() => setRect(el.getBoundingClientRect()), 200)
    } else {
      setRect(null)
    }
    onMarkSeen(step.id)
  }, [idx, step?.id])

  if (!step) { onComplete(); return null }

  function next() {
    if (idx < steps.length - 1) setIdx(i => i + 1)
    else onComplete()
  }
  function prev() { if (idx > 0) setIdx(i => i - 1) }

  const PAD = 6
  const winW = typeof window !== 'undefined' ? window.innerWidth : 1200
  const winH = typeof window !== 'undefined' ? window.innerHeight : 800

  // Smart tooltip placement — prefer below, flip above if too close to bottom
  let tooltipTop  = rect ? rect.bottom + PAD + 12 : 120
  let tooltipLeft = rect ? Math.max(16, Math.min(rect.left, winW - 316)) : 40
  if (rect && tooltipTop + 200 > winH) tooltipTop = rect.top - 200 - PAD

  const roleColor: Record<string, string> = {
    TECHNICIAN: '#8b949e', SITE_MANAGER: '#3B8BFA',
    REGIONAL_MANAGER: '#2ABFA0', ADMIN: '#E8407A',
  }
  const color = roleColor[role] ?? 'var(--teal)'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, pointerEvents: 'none' }}>
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />

      {/* Spotlight cutout */}
      {rect && (
        <div style={{
          position: 'absolute',
          top: rect.top - PAD, left: rect.left - PAD,
          width: rect.width + PAD * 2, height: rect.height + PAD * 2,
          borderRadius: 10,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          border: `2px solid ${color}`,
          transition: 'all 0.25s ease',
          pointerEvents: 'none',
        }} />
      )}

      {/* Tooltip card */}
      <div style={{
        position: 'absolute', top: tooltipTop, left: tooltipLeft,
        width: 300,
        background: '#161b22', border: `1px solid ${color}40`,
        borderRadius: 14, padding: '18px 20px',
        pointerEvents: 'all',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        transition: 'top 0.25s ease, left 0.25s ease',
      }}>
        {/* Role badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#8b949e' }}>{idx + 1} / {steps.length}</span>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{step.title}</div>
        <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.65, margin: '0 0 16px' }}>{step.body}</p>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 2,
              background: i <= idx ? color : 'rgba(255,255,255,0.12)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onComplete} style={{
            padding: '6px 12px', borderRadius: 6, fontSize: 11,
            background: 'transparent', color: '#8b949e',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          }}>
            Skip tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {idx > 0 && (
              <button onClick={prev} style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 11,
                background: 'rgba(255,255,255,0.06)', color: '#e6edf3',
                border: 'none', cursor: 'pointer',
              }}>← Back</button>
            )}
            <button onClick={next} style={{
              padding: '6px 18px', borderRadius: 6, fontSize: 11,
              fontWeight: 600, background: color,
              color: '#0d1117', border: 'none', cursor: 'pointer',
            }}>
              {idx < steps.length - 1 ? 'Next →' : 'Done ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
