'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',  icon: '⊞', tour: 'dashboard' },
  { href: '/inventory',  label: 'Inventory',  icon: '📋', tour: 'inventory' },
  { href: '/requests',   label: 'Requests',   icon: '↗',  tour: 'requests',  badge: true },
  { href: '/shipments',  label: 'Shipments',  icon: '📦', tour: 'shipments' },
  { href: '/reports',    label: 'Reports',    icon: '📊', tour: 'reports' },
  { href: '/admin',      label: 'Admin',      icon: '⚙',  tour: 'admin' },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: '#161b22',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--teal)',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16, flexShrink: 0,
          }}>📦</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.3px' }}>ITFlow</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Inventory Platform</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '12px 0', flex: 1 }}>
        {NAV.map(item => {
          const active = path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour={item.tour}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 20px',
                fontSize: 13,
                color: active ? 'var(--teal)' : 'var(--muted)',
                background: active ? 'rgba(42,191,160,0.08)' : 'transparent',
                borderLeft: `2px solid ${active ? 'var(--teal)' : 'transparent'}`,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Version 1.0
        </div>
      </div>
    </aside>
  )
}
