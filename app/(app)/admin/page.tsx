'use client'
import { useState } from 'react'
import { UsersTab } from '@/components/admin/UsersTab'
import { LocationsTab } from '@/components/admin/LocationsTab'
import { CatalogTab } from '@/components/admin/CatalogTab'
import { IntegrationsTab } from '@/components/admin/IntegrationsTab'

const TABS = [
  { key:'users',        label:'Users',        icon:'👤' },
  { key:'locations',    label:'Locations',    icon:'📍' },
  { key:'catalog',      label:'Catalog',      icon:'📋' },
  { key:'integrations', label:'Integrations', icon:'🔗' },
]

export default function AdminPage() {
  const [tab, setTab] = useState('users')

  return (
    <div style={{ maxWidth:1200 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:20, fontWeight:600, marginBottom:2 }}>Admin</h1>
        <p style={{ fontSize:13, color:'#8b949e' }}>Manage users, locations, catalog items and integrations</p>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:2, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:4, marginBottom:24, width:'fit-content' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display:'flex', alignItems:'center', gap:7,
            padding:'8px 18px', borderRadius:7, fontSize:13, fontWeight:500,
            cursor:'pointer', border:'none', transition:'all 0.15s',
            background: tab === t.key ? '#1c2128' : 'transparent',
            color: tab === t.key ? '#e6edf3' : '#8b949e',
            boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
          }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {tab === 'users'        && <UsersTab />}
      {tab === 'locations'    && <LocationsTab />}
      {tab === 'catalog'      && <CatalogTab />}
      {tab === 'integrations' && <IntegrationsTab />}
    </div>
  )
}
