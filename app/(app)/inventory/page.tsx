'use client'
import { useState, useMemo } from 'react'
import { INVENTORY, SITES, CATS, type InventoryItem, type AssetStatus } from '@/lib/data/inventory'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AssetDrawer } from '@/components/inventory/AssetDrawer'

const CATEGORY_ICON: Record<string, string> = {
  Laptop: '💻', Phone: '📱', Tablet: '⊞', Monitor: '🖥', Accessory: '🔌',
}

const CONDITION_COLOR: Record<string, string> = {
  NEW: '#39D353', GOOD: '#2ABFA0', FAIR: '#F5A623', POOR: '#FF6B2B',
}

export default function InventoryPage() {
  const [search, setSearch]     = useState('')
  const [site, setSite]         = useState('All sites')
  const [cat, setCat]           = useState('All categories')
  const [status, setStatus]     = useState<AssetStatus | 'ALL'>('ALL')
  const [typeFilter, setType]   = useState<'ALL' | 'SERIALIZED' | 'QUANTITY'>('ALL')
  const [selected, setSelected] = useState<InventoryItem | null>(null)
  const [sortBy, setSortBy]     = useState<'name' | 'site' | 'status'>('name')

  const filtered = useMemo(() => {
    return INVENTORY
      .filter(i => {
        if (search && !i.name.toLowerCase().includes(search.toLowerCase()) &&
            !i.assetTag?.toLowerCase().includes(search.toLowerCase()) &&
            !i.serialNumber?.toLowerCase().includes(search.toLowerCase())) return false
        if (site !== 'All sites' && i.site !== site) return false
        if (cat !== 'All categories' && i.category !== cat) return false
        if (status !== 'ALL' && i.status !== status) return false
        if (typeFilter !== 'ALL' && i.type !== typeFilter) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'name')   return a.name.localeCompare(b.name)
        if (sortBy === 'site')   return a.site.localeCompare(b.site)
        if (sortBy === 'status') return a.status.localeCompare(b.status)
        return 0
      })
  }, [search, site, cat, status, typeFilter, sortBy])

  const serialCount   = filtered.filter(i => i.type === 'SERIALIZED').length
  const quantityCount = filtered.filter(i => i.type === 'QUANTITY').length
  const availableCount = filtered.filter(i => i.status === 'AVAILABLE').length

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>Inventory</h1>
          <p style={{ fontSize: 13, color: '#8b949e' }}>
            {filtered.length} items · {availableCount} available · {serialCount} serialized · {quantityCount} quantity
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--teal)', color: '#0d1117',
          border: 'none', borderRadius: 7, padding: '8px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          + Add asset
        </button>
      </div>

      {/* Filter bar */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 16,
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, tag, serial…"
          style={{
            background: '#161b22', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 7, padding: '7px 12px', fontSize: 13,
            color: '#e6edf3', outline: 'none', width: 240,
          }}
        />
        <Select value={site} onChange={setSite} options={SITES} />
        <Select value={cat} onChange={setCat} options={CATS} />
        <Select
          value={status}
          onChange={v => setStatus(v as AssetStatus | 'ALL')}
          options={['ALL', 'AVAILABLE', 'RESERVED', 'IN_TRANSIT', 'PENDING_WIPE', 'READY', 'DAMAGED', 'RETIRED']}
          labels={{ ALL: 'All statuses', AVAILABLE: 'Available', RESERVED: 'Reserved', IN_TRANSIT: 'In transit', PENDING_WIPE: 'Pending wipe', READY: 'Ready', DAMAGED: 'Damaged', RETIRED: 'Retired' }}
        />
        <div style={{ display: 'flex', gap: 0, marginLeft: 'auto' }}>
          {(['ALL', 'SERIALIZED', 'QUANTITY'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: typeFilter === t ? 'rgba(42,191,160,0.15)' : 'transparent',
              color: typeFilter === t ? 'var(--teal)' : '#8b949e',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: t === 'ALL' ? '6px 0 0 6px' : t === 'QUANTITY' ? '0 6px 6px 0' : '0',
              marginLeft: t === 'ALL' ? 0 : -1,
            }}>
              {t === 'ALL' ? 'All' : t === 'SERIALIZED' ? 'Serialized' : 'Quantity'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { key: 'name',   label: 'Item'     },
                { key: 'site',   label: 'Site'     },
                { key: null,     label: 'Available'},
                { key: 'status', label: 'Status'   },
                { key: null,     label: 'Condition'},
                { key: null,     label: ''         },
              ].map(col => (
                <th
                  key={col.label}
                  onClick={() => col.key && setSortBy(col.key as typeof sortBy)}
                  style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                    cursor: col.key ? 'pointer' : 'default',
                    color: col.key === sortBy ? 'var(--teal)' : '#8b949e',
                    userSelect: 'none',
                  }}
                >
                  {col.label}{col.key === sortBy ? ' ↑' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#8b949e', fontSize: 13 }}>
                  No items match your filters
                </td>
              </tr>
            )}
            {filtered.map(item => (
              <tr
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                      background: 'rgba(42,191,160,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 15,
                    }}>
                      {CATEGORY_ICON[item.category] ?? '📦'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 1 }}>
                        {item.type === 'SERIALIZED'
                          ? item.assetTag
                          : `${item.make} · Quantity`}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.05)', borderRadius: 5,
                    padding: '3px 8px', fontSize: 12,
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#8b949e' }}>{item.siteCode}</span>
                    <span>{item.site}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {item.type === 'SERIALIZED' ? (
                    <span style={{ color: item.status === 'AVAILABLE' || item.status === 'READY' ? '#39D353' : '#8b949e', fontWeight: 600 }}>
                      {item.status === 'AVAILABLE' || item.status === 'READY' ? '1' : '0'}
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{
                        fontWeight: 600,
                        color: (item.available ?? 0) <= 2 ? '#FF6B2B' : (item.available ?? 0) <= 5 ? '#F5A623' : '#39D353',
                      }}>
                        {item.available}
                      </span>
                      <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <div style={{
                          width: `${Math.round(((item.available ?? 0) / (item.total ?? 1)) * 100)}%`,
                          height: '100%', borderRadius: 2,
                          background: (item.available ?? 0) <= 2 ? '#FF6B2B' : '#39D353',
                        }} />
                      </div>
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={item.status} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {item.condition ? (
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: CONDITION_COLOR[item.condition],
                    }}>
                      {item.condition}
                    </span>
                  ) : (
                    <span style={{ color: '#8b949e', fontSize: 11 }}>—</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(item) }}
                    style={{
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 5, padding: '4px 10px', fontSize: 11,
                      color: '#8b949e', cursor: 'pointer',
                    }}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <AssetDrawer item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function Select({ value, onChange, options, labels }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  labels?: Record<string, string>
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#161b22', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 7, padding: '7px 10px', fontSize: 13,
        color: '#e6edf3', outline: 'none', cursor: 'pointer',
      }}
    >
      {options.map(o => (
        <option key={o} value={o}>{labels?.[o] ?? o}</option>
      ))}
    </select>
  )
}
