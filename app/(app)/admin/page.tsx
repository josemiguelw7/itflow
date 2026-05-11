'use client'
import { useState } from 'react'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { UsersTab }        from '@/components/admin/UsersTab'
import { LocationsTab }    from '@/components/admin/LocationsTab'
import { CatalogTab }      from '@/components/admin/CatalogTab'
import { IntegrationsTab } from '@/components/admin/IntegrationsTab'

const TABS = [
  { key:'users',        label:'Users',        icon:'👤', permKey:'viewUsers'          },
  { key:'locations',    label:'Locations',    icon:'📍', permKey:'viewLocations'      },
  { key:'catalog',      label:'Catalog',      icon:'📋', permKey:'viewCatalog'        },
  { key:'integrations', label:'Integrations', icon:'🔗', permKey:'manageIntegrations' },
]

export default function AdminPage() {
  const { permissions: p, role } = usePermissions()
  const [tab, setTab] = useState(() => {
    // Start on first accessible tab
    if (p.viewUsers) return 'users'
    if (p.viewLocations) return 'locations'
    if (p.viewCatalog) return 'catalog'
    return 'integrations'
  })

  return (
    <div style={{ maxWidth:1200 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:20, fontWeight:600, marginBottom:2 }}>Admin</h1>
        <p style={{ fontSize:13, color:'#8b949e' }}>Manage users, locations, catalog items and integrations</p>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:2, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:4, marginBottom:24, width:'fit-content' }}>
        {TABS.map(t => {
          const hasAccess = p[t.permKey as keyof typeof p]
          const isActive  = tab === t.key
          return (
            <div key={t.key} style={{ position:'relative' }}>
              <button
                onClick={() => hasAccess && setTab(t.key)}
                title={!hasAccess ? 'Your role does not have access to this section' : undefined}
                style={{
                  display:'flex', alignItems:'center', gap:7,
                  padding:'8px 18px', borderRadius:7, fontSize:13, fontWeight:500,
                  cursor: hasAccess ? 'pointer' : 'not-allowed',
                  border:'none', transition:'all 0.15s',
                  background: isActive ? '#1c2128' : 'transparent',
                  color: !hasAccess ? 'rgba(139,148,158,0.4)' : isActive ? '#e6edf3' : '#8b949e',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                  opacity: hasAccess ? 1 : 0.5,
                }}
              >
                <span>{t.icon}</span>
                {t.label}
                {!hasAccess && <span style={{ fontSize:10, marginLeft:2 }}>🔒</span>}
              </button>
            </div>
          )
        })}
      </div>

      {/* Tab content */}
      {tab === 'users'        && <UsersTab        canManage={p.manageUsers}     />}
      {tab === 'locations'    && <LocationsTab    canManage={p.manageLocations} />}
      {tab === 'catalog'      && <CatalogTab      canManage={p.manageCatalog}   />}
      {tab === 'integrations' && <IntegrationsTab />}
    </div>
  )
}
