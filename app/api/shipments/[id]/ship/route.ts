import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { markShipped }               from '@/lib/workflows/shipments'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { carrier, trackingNumber } = await req.json().catch(() => ({}))

  try {
    const shipment = await markShipped(id, user.id, { carrier, trackingNumber })
    return NextResponse.json(shipment)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 422 })
  }
}
