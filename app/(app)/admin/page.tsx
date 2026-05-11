'use client'
import { useState } from 'react'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { UsersTab }        from '@/components/admin/UsersTab'
import { LocationsTab }    from '@/components/admin/LocationsTab'
import { CatalogTab }      from '@/components/admin/CatalogTab'
import { IntegrationsTab } from '@/components/admin/IntegrationsTab'

export default function AdminPage() {
  const { perms, role } = usePermissions()

  const TABS = [
    { key:'users',        label:'Users',        icon:'👤', show: perms.canViewUsers        },
    { key:'locations',    label:'Locations',    icon:'📍', show: perms.canViewLocations     },
    { key:'catalog',      label:'Catalog',      icon:'📋', show: perms.canViewCatalog       },
    { key:'integrations', label:'Integrations', icon:'🔗', show: perms.canViewIntegrations  },
  ].filter(t => t.show)

  const [tab, setTab] = useState(TABS[0]?.key ?? 'catalog')

  if (TABS.length === 0) {
    return (
      <div style={{ maxWidth: 600, paddingTop: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Access restricted</div>
        <div style={{ fontSize: 13, color: '#8b949e' }}>You don't have permission to view the Admin panel. Contact your Admin if you think this is a mistake.</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>Admin</h1>
        <p style={{ fontSize: 13, color: '#8b949e' }}>
          {role === 'ADMIN'
            ? 'Manage users, locations, catalog items and integrations'
            : role === 'REGIONAL_MANAGER'
            ? 'View catalog and locations — contact Admin to make changes'
            : 'View catalog and locations — contact Admin to make changes'}
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: tab === t.key ? '#1c2128' : 'transparent',
            color: tab === t.key ? '#e6edf3' : '#8b949e',
            boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
          }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {tab === 'users'        && <UsersTab        readOnly={!perms.canEditUsers}        />}
      {tab === 'locations'    && <LocationsTab    readOnly={!perms.canEditLocations}    />}
      {tab === 'catalog'      && <CatalogTab      readOnly={!perms.canEditCatalog}      />}
      {tab === 'integrations' && <IntegrationsTab readOnly={!perms.canEditIntegrations} />}
    </div>
  )
}
