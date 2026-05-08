// app/api/requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { submitRequest }             from '@/lib/workflows/requests'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { destinationLocationId, sourceLocationId, priority, neededByDate, notes, lines, orgId } = body

  if (!destinationLocationId || !lines?.length) {
    return NextResponse.json({ error: 'destinationLocationId and lines are required' }, { status: 400 })
  }

  try {
    const request = await submitRequest({
      requesterId:           user.id,
      destinationLocationId,
      sourceLocationId,
      priority,
      neededByDate:          neededByDate ? new Date(neededByDate) : undefined,
      notes,
      orgId,
      lines,
    })
    return NextResponse.json(request, { status: 201 })
  } catch (e: any) {
    console.error('[API] POST /requests:', e)
    return NextResponse.json({ error: e.message }, { status: 422 })
  }
}
