import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { rejectRequest }             from '@/lib/workflows/requests'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { notes } = await req.json().catch(() => ({}))

  try {
    const request = await rejectRequest(id, user.id, notes)
    return NextResponse.json(request)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 422 })
  }
}
