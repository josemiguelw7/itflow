import { MetricCards } from '@/components/dashboard/MetricCards'
import { InventorySites } from '@/components/dashboard/InventorySites'
import { ApprovalQueue } from '@/components/dashboard/ApprovalQueue'
import { ActiveShipments } from '@/components/dashboard/ActiveShipments'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { AlertStrip } from '@/components/dashboard/AlertStrip'

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#8b949e' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Austin HQ
        </p>
      </div>

      <AlertStrip />
      <MetricCards />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16 }}>
        <InventorySites />
        <ApprovalQueue />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ActiveShipments />
        <ActivityFeed />
      </div>
    </div>
  )
}
