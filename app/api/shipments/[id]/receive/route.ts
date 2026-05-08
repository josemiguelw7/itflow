// app/api/shipments/[id]/receive/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { markReceived }              from '@/lib/workflows/shipments'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { notes } = await req.json().catch(() => ({}))

  try {
    const shipment = await markReceived(params.id, user.id, { notes })
    return NextResponse.json(shipment)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 422 })
  }
}
