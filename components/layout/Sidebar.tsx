'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePermissions } from '@/lib/hooks/usePermissions'

const NAV = [
  { href:'/dashboard', label:'Dashboard', icon:'⊞', tour:'dashboard' },
  { href:'/inventory',  label:'Inventory', icon:'📋', tour:'inventory' },
  { href:'/requests',   label:'Requests',  icon:'↗',  tour:'requests'  },
  { href:'/shipments',  label:'Shipments', icon:'📦', tour:'shipments' },
  { href:'/reports',    label:'Reports',   icon:'📊', tour:'reports'   },
  { href:'/admin',      label:'Admin',     icon:'⚙',  tour:'admin'     },
]

const ROLE_COLOR: Record<string, string> = {
  TECHNICIAN:       '#8b949e',
  SITE_MANAGER:     '#3B8BFA',
  REGIONAL_MANAGER: '#2ABFA0',
  ADMIN:            '#E8407A',
}

const ROLE_LABEL: Record<string, string> = {
  TECHNICIAN:       'Technician',
  SITE_MANAGER:     'Supervisor',
  REGIONAL_MANAGER: 'Manager',
  ADMIN:            'Admin',
}

export function Sidebar() {
  const path = usePathname()
  const { permissions: p, role } = usePermissions()

  // Determine which nav items to show based on permissions
  const visibleNav = NAV.filter(item => {
    if (item.href === '/reports') return p.viewReports
    if (item.href === '/admin')   return p.viewUsers || p.viewLocations || p.viewCatalog || p.manageIntegrations
    return true // dashboard, inventory, requests, shipments always visible
  })

  const color = ROLE_COLOR[role] ?? 'var(--teal)'

  return (
    <aside style={{ width:'var(--sidebar-w)', background:'#161b22', borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'var(--teal)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>📦</div>
          <div>
            <div style={{ fontWeight:600, fontSize:15, letterSpacing:'-0.3px' }}>ITFlow</div>
            <div style={{ fontSize:11, color:'var(--muted)' }}>Inventory Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding:'12px 0', flex:1 }}>
        {visibleNav.map(item => {
          const active = path.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} data-tour={item.tour} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'8px 20px', fontSize:13,
              color: active ? 'var(--teal)' : 'var(--muted)',
              background: active ? 'rgba(42,191,160,0.08)' : 'transparent',
              borderLeft:`2px solid ${active ? 'var(--teal)' : 'transparent'}`,
              textDecoration:'none', transition:'all 0.15s',
            }}>
              <span style={{ fontSize:16, width:18, textAlign:'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Role indicator */}
      <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:color, flexShrink:0 }} />
          <div style={{ fontSize:11, color, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.5px' }}>
            {ROLE_LABEL[role] ?? role}
          </div>
        </div>
        <div style={{ fontSize:10, color:'var(--muted)', marginTop:3 }}>v1.0</div>
      </div>
    </aside>
  )
}
