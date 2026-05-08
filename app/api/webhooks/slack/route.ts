// app/api/webhooks/slack/route.ts
// Handles Slack interactive button actions (approve/reject from Slack)
// Phase 2 feature — Slack approve/reject buttons in notifications

import { NextRequest, NextResponse } from 'next/server'
import { approveRequest, rejectRequest } from '@/lib/workflows/requests'
import crypto from 'crypto'

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET ?? ''

// Verify request is genuinely from Slack
function verifySlackSignature(req: NextRequest, rawBody: string): boolean {
  const timestamp = req.headers.get('x-slack-request-timestamp')
  const signature = req.headers.get('x-slack-signature')
  if (!timestamp || !signature || !SLACK_SIGNING_SECRET) return false

  // Reject requests older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) return false

  const baseString = `v0:${timestamp}:${rawBody}`
  const hmac = `v0=${crypto.createHmac('sha256', SLACK_SIGNING_SECRET).update(baseString).digest('hex')}`
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifySlackSignature(req, rawBody)) {
    console.warn('[Slack webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const params  = new URLSearchParams(rawBody)
  const payload = JSON.parse(params.get('payload') ?? '{}')

  if (payload.type !== 'block_actions') {
    return NextResponse.json({ ok: true })
  }

  const action    = payload.actions?.[0]
  const actionId  = action?.action_id
  const requestId = action?.value
  // Use a system user ID for Slack-initiated actions
  const slackUserId = `slack:${payload.user?.id ?? 'unknown'}`

  try {
    if (actionId === 'approve_request' && requestId) {
      await approveRequest(requestId, slackUserId, 'Approved via Slack')
      return NextResponse.json({ text: `✅ Request ${requestId} approved via Slack` })
    }

    if (actionId === 'reject_request' && requestId) {
      await rejectRequest(requestId, slackUserId, 'Rejected via Slack')
      return NextResponse.json({ text: `❌ Request ${requestId} rejected via Slack` })
    }
  } catch (e: any) {
    console.error('[Slack webhook] action failed:', e)
    return NextResponse.json({ text: `Error: ${e.message}` })
  }

  return NextResponse.json({ ok: true })
}
