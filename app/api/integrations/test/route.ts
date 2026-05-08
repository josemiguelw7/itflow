// app/api/integrations/test/route.ts
// Called by Admin → Integrations tab "Save & test connection" button

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { testJiraConnection }        from '@/lib/integrations/jira'
import { testSlackConnection }       from '@/lib/integrations/slack'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { integration } = await req.json()

  if (integration === 'jira') {
    const result = await testJiraConnection()
    return NextResponse.json(result, { status: result.ok ? 200 : 400 })
  }

  if (integration === 'slack') {
    const result = await testSlackConnection()
    return NextResponse.json(result, { status: result.ok ? 200 : 400 })
  }

  return NextResponse.json({ error: 'Unknown integration' }, { status: 400 })
}
