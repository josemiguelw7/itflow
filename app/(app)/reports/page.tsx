'use client'
import { useState } from 'react'
import { StockHealthChart }    from '@/components/reports/StockHealthChart'
import { TransferTrends }      from '@/components/reports/TransferTrends'
import { AgingInventory }      from '@/components/reports/AgingInventory'
import { SiteSummaryTable }    from '@/components/reports/SiteSummaryTable'

const RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']

export default function ReportsPage() {
  const [range, setRange] = useState('Last 30 days')

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:600, marginBottom:2 }}>Reports</h1>
          <p style={{ fontSize:13, color:'#8b949e' }}>Inventory trends, transfer activity and site health</p>
        </div>
        <div style={{ display:'flex', gap:0, background:'rgba(255,255,255,0.04)', borderRadius:8, padding:3 }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding:'5px 14px', borderRadius:6, fontSize:12, fontWeight:500,
              cursor:'pointer', border:'none',
              background: range === r ? '#1c2128' : 'transparent',
              color: range === r ? '#e6edf3' : '#8b949e',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Top metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Transfers completed', value:'147',  delta:'↑ 23% vs prev period', color:'#2ABFA0' },
          { label:'Avg approval time',   value:'4.2h', delta:'↓ 1.1h faster',        color:'#3B8BFA' },
          { label:'Items transferred',   value:'834',  delta:'across 8 sites',        color:'#39D353' },
          { label:'Exception rate',      value:'2.1%', delta:'↓ 0.4% improvement',   color:'#F5A623' },
        ].map(m => (
          <div key={m.label} style={{ background:'#161b22', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'16px 20px', borderTop:`2px solid ${m.color}` }}>
            <div style={{ fontSize:10, color:'#8b949e', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{m.label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:m.color, letterSpacing:'-1px' }}>{m.value}</div>
            <div style={{ fontSize:11, color:'#8b949e', marginTop:6 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <StockHealthChart />
        <TransferTrends range={range} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <AgingInventory />
        <SiteSummaryTable />
      </div>
    </div>
  )
}
