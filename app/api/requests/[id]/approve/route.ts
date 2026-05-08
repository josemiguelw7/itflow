// app/api/requests/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { approveRequest }            from '@/lib/workflows/requests'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { notes } = await req.json().catch(() => ({}))

  try {
    const request = await approveRequest(params.id, user.id, notes)
    return NextResponse.json(request)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 422 })
  }
}
