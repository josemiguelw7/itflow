'use client'
import { useState } from 'react'
import { ADMIN_ITEMS, CATEGORIES, type AdminItem } from '@/lib/data/admin'

const CATEGORY_ICON: Record<string, string> = { Laptop:'💻', Phone:'📱', Tablet:'⊞', Monitor:'🖥', Accessory:'🔌' }
const TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  SERIALIZED: { color:'#3B8BFA', bg:'rgba(59,139,250,0.12)' },
  QUANTITY:   { color:'#2ABFA0', bg:'rgba(42,191,160,0.12)' },
}

export function CatalogTab() {
  const [items, setItems]   = useState<AdminItem[]>(ADMIN_ITEMS)
  const [cat, setCat]       = useState('All')
  const [search, setSearch] = useState('')
  const [toast, setToast]   = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }
  function toggleActive(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i))
    showToast('Catalog item updated')
  }

  const filtered = items.filter(i => {
    if (cat !== 'All' && i.category !== cat) return false
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.make.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      {toast && <div style={{ position:'fixed', bottom:24, right:24, zIndex:500, background:'#161b22', border:'1px solid rgba(42,191,160,0.3)', borderRadius:9, padding:'12px 18px', fontSize:13, color:'var(--teal)' }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:6 }}>
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding:'5px 12px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border:'none',
              background: cat === c ? 'rgba(42,191,160,0.15)' : 'rgba(255,255,255,0.04)',
              color: cat === c ? 'var(--teal)' : '#8b949e',
            }}>{c}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search catalog…" style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'7px 12px', fontSize:13, color:'#e6edf3', outline:'none', width:200 }} />
          <button style={{ background:'var(--teal)', color:'#0d1117', border:'none', borderRadius:7, padding:'7px 14px', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Add item</button>
        </div>
      </div>

      <div style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              {['Item','Category','Type','Make / Model','Units','Status',''].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:600, color:'#8b949e', letterSpacing:'0.5px', textTransform:'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const tc = TYPE_COLOR[item.type]
              return (
                <tr key={item.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)', opacity: item.active ? 1 : 0.5 }}>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:7, background:'rgba(42,191,160,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>
                        {CATEGORY_ICON[item.category] ?? '📦'}
                      </div>
                      <div style={{ fontWeight:500 }}>{item.name}</div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#8b949e' }}>{item.category}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:10, color:tc.color, background:tc.bg }}>
                      {item.type === 'SERIALIZED' ? 'Serialized' : 'Quantity'}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ fontWeight:500 }}>{item.make}</div>
                    <div style={{ fontSize:11, color:'#8b949e' }}>{item.model}</div>
                  </td>
                  <td style={{ padding:'12px 16px', fontWeight:600, color:'var(--teal)', fontVariantNumeric:'tabular-nums' }}>{item.totalUnits}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:10, background: item.active ? 'rgba(57,211,83,0.12)' : 'rgba(139,148,158,0.12)', color: item.active ? '#39D353' : '#8b949e' }}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px', textAlign:'right' }}>
                    <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                      <button style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'3px 10px', fontSize:11, color:'#8b949e', cursor:'pointer' }}>Edit</button>
                      <button onClick={() => toggleActive(item.id)} style={{ background:'transparent', border:`1px solid ${item.active ? 'rgba(255,107,43,0.2)' : 'rgba(57,211,83,0.2)'}`, borderRadius:5, padding:'3px 10px', fontSize:11, color: item.active ? '#FF6B2B' : '#39D353', cursor:'pointer' }}>
                        {item.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
