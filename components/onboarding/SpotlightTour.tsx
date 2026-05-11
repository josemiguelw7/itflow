'use client'
import { useState, useEffect, useRef } from 'react'
import type { Role } from '@/lib/permissions'

interface TourStep {
  id:       string
  selector: string
  title:    string
  body:     string
  roles:    Role[]
  tip?:     string
}

const ALL_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    selector: '[data-tour="dashboard"]',
    title: 'Dashboard — your command center',
    body: 'Four live metrics at the top: total assets, available inventory, requests needing attention, and items in transit. The site health bars show stock levels across all 8 locations.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: 'Green = healthy · Amber = getting low · Red = needs action',
  },
  {
    id: 'approval-queue',
    selector: '[data-tour="approval-queue"]',
    title: 'Approval queue',
    body: 'Transfer requests are approved by the Supervisor. Purchase requests — new equipment from vendors — go to the Manager for budget approval.',
    roles: ['SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: 'Approve or reject with one click right here',
  },
  {
    id: 'inventory',
    selector: '[data-tour="inventory"]',
    title: 'Inventory',
    body: 'Every asset and stock item across all eight sites. Filter by site, category, or status. Toggle between serialized assets (tracked by serial number) and quantity stock like chargers and cables.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
  },
  {
    id: 'requests',
    selector: '[data-tour="requests"]',
    title: 'Requests',
    body: 'All transfer and purchase requests in one place. When you submit, the form first asks: transfer of existing inventory, or a new purchase? That determines who approves it.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: 'Transfers → Supervisor approves  ·  Purchases → Manager approves',
  },
  {
    id: 'shipments',
    selector: '[data-tour="shipments"]',
    title: 'Shipments',
    body: 'Once approved, a request becomes a shipment. Enter carrier and tracking number, mark it shipped, and inventory shows in transit. When it arrives, confirm receipt — inventory updates automatically.',
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
  },
  {
    id: 'reports',
    selector: '[data-tour="reports"]',
    title: 'Reports',
    body: 'Stock health across all sites, transfer trends over time, aging inventory sitting idle too long, and a full site summary table with health scores.',
    roles: ['SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
    tip: 'Use this to spot imbalances before they become problems',
  },
  {
    id: 'admin',
    selector: '[data-tour="admin"]',
    title: 'Admin',
    body: 'Manage users and roles, add locations, control the item catalog, and connect integrations. Jira creates tickets automatically, Slack sends notifications, Okta handles enterprise SSO.',
    roles: ['SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
  },
  {
    id: 'demo-bar',
    selector: '[data-tour="demo-bar"]',
    title: 'Demo bar — switch roles instantly',
    body: "You're in demo mode. Use the bar at the bottom to switch between all four roles without logging out. Each role gets its own first-time tour.",
    roles: ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'],
  },
]

interface Props {
  role:       Role
  seenSteps:  string[]
  onComplete: () => void
  onMarkSeen: (step: string) => void
}

export function SpotlightTour({ role, seenSteps, onComplete, onMarkSeen }: Props) {
  const steps = ALL_STEPS.filter(s => s.roles.includes(role))
  const [idx, setIdx]   = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const tooltipRef      = useRef<HTMLDivElement>(null)

  const step = steps[idx]

  useEffect(() => {
    if (!step) return
    const el = document.querySelector(step.selector)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setTimeout(() => setRect(el.getBoundingClientRect()), 250)
    } else {
      setRect(null)
    }
    onMarkSeen(step.id)
  }, [idx, step?.id])

  if (!step) return null

  function next() { if (idx < steps.length - 1) setIdx(i => i + 1); else onComplete() }
  function prev() { if (idx > 0) setIdx(i => i - 1) }

  const PAD       = 8
  const TOOLTIP_W = 300
  const winW = typeof window !== 'undefined' ? window.innerWidth  : 1200
  const winH = typeof window !== 'undefined' ? window.innerHeight : 800

  let tipTop  = rect ? rect.bottom + PAD + 12 : 160
  let tipLeft = rect ? Math.max(12, Math.min(rect.left, winW - TOOLTIP_W - 12)) : 40
  if (rect && tipTop + 220 > winH) tipTop = rect.top - PAD - 230

  return (
    <div style={{ position:'fixed', inset:0, zIndex:900, pointerEvents:'none' }}>
      {/* Dim overlay — non-interactive */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', pointerEvents:'none' }} />

      {/* Spotlight cutout */}
      {rect && (
        <div style={{
          position:'absolute',
          top:    rect.top    - PAD,
          left:   rect.left   - PAD,
          width:  rect.width  + PAD * 2,
          height: rect.height + PAD * 2,
          borderRadius: 10,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          border: '2px solid #2ABFA0',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }} />
      )}

      {/* Tooltip — interactive */}
      <div ref={tooltipRef} style={{
        position:'absolute', top:tipTop, left:tipLeft,
        width: TOOLTIP_W,
        background:'#161b22',
        border:'1px solid rgba(255,255,255,0.12)',
        borderRadius:14, padding:'18px 20px',
        pointerEvents:'all',
        boxShadow:'0 12px 40px rgba(0,0,0,0.5)',
        transition:'top 0.3s ease, left 0.3s ease',
        zIndex: 901,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#2ABFA0', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {step.title}
          </div>
          <div style={{ fontSize:11, color:'#8b949e' }}>{idx + 1} / {steps.length}</div>
        </div>

        <p style={{ fontSize:13, color:'#8b949e', lineHeight:1.65, margin:'0 0 10px' }}>
          {step.body}
        </p>

        {step.tip && (
          <div style={{ background:'rgba(42,191,160,0.08)', border:'1px solid rgba(42,191,160,0.2)', borderRadius:7, padding:'8px 10px', fontSize:11, color:'#2ABFA0', marginBottom:12, lineHeight:1.5 }}>
            💡 {step.tip}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ display:'flex', gap:4, marginBottom:14 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ height:3, borderRadius:2, flex: i === idx ? 2 : 1, background: i <= idx ? '#2ABFA0' : 'rgba(255,255,255,0.12)', transition:'all 0.25s' }} />
          ))}
        </div>

        <div style={{ display:'flex', gap:8, justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={onComplete} style={{ padding:'6px 10px', borderRadius:6, fontSize:11, background:'transparent', color:'#8b949e', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
            Skip tour
          </button>
          <div style={{ display:'flex', gap:7 }}>
            {idx > 0 && (
              <button onClick={prev} style={{ padding:'6px 12px', borderRadius:6, fontSize:11, fontWeight:600, background:'rgba(255,255,255,0.06)', color:'#e6edf3', border:'none', cursor:'pointer' }}>
                ← Back
              </button>
            )}
            <button onClick={next} style={{ padding:'6px 16px', borderRadius:6, fontSize:12, fontWeight:600, background:'#2ABFA0', color:'#0d1117', border:'none', cursor:'pointer' }}>
              {idx < steps.length - 1 ? 'Next →' : 'Done ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
