'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePermissions } from '@/lib/hooks/usePermissions'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞', tour: 'dashboard',  always: true  },
  { href: '/inventory', label: 'Inventory', icon: '📋', tour: 'inventory',  always: true  },
  { href: '/requests',  label: 'Requests',  icon: '↗',  tour: 'requests',   always: true  },
  { href: '/shipments', label: 'Shipments', icon: '📦', tour: 'shipments',  always: true  },
  { href: '/reports',   label: 'Reports',   icon: '📊', tour: 'reports',    always: true  },
  { href: '/admin',     label: 'Admin',     icon: '⚙',  tour: 'admin',      always: false }, // only shown to roles with catalog/users/integrations access
]

export function Sidebar() {
  const path  = usePathname()
  const { perms, role } = usePermissions()

  const visibleNav = NAV.filter(item => {
    if (item.always) return true
    // Admin tab: show if they can view catalog, locations, users, or integrations
    if (item.href === '/admin') return perms.canViewCatalog || perms.canViewUsers || perms.canViewIntegrations
    return true
  })

  const roleColor: Record<string, string> = {
    TECHNICIAN: '#8b949e', SITE_MANAGER: '#3B8BFA',
    REGIONAL_MANAGER: '#2ABFA0', ADMIN: '#E8407A',
  }
  const color = roleColor[role] ?? 'var(--teal)'

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: '#161b22',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--teal)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📦</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.3px' }}>ITFlow</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Inventory Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {visibleNav.map(item => {
          const active = path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour={item.tour}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 20px', fontSize: 13,
                color: active ? 'var(--teal)' : 'var(--muted)',
                background: active ? 'rgba(42,191,160,0.08)' : 'transparent',
                borderLeft: `2px solid ${active ? 'var(--teal)' : 'transparent'}`,
                textDecoration: 'none', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Role indicator at bottom */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <div style={{ fontSize: 11, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {role.replace('_', ' ')}
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>v1.0</div>
      </div>
    </aside>
  )
}
