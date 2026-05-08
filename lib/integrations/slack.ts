// lib/integrations/slack.ts
// Slack Incoming Webhooks + Block Kit messages

const WEBHOOK = () => process.env.SLACK_WEBHOOK_URL
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? ''

function isConfigured() { return !!WEBHOOK() }

export type SlackEvent =
  | 'request.submitted'
  | 'request.approved'
  | 'request.rejected'
  | 'request.cancelled'
  | 'shipment.shipped'
  | 'shipment.received'
  | 'shipment.exception'
  | 'stock.low'

interface SlackPayload {
  event:     SlackEvent
  title:     string
  body:      string
  requestId?: string
  shipmentId?: string
  priority?:  string
  urgent?:    boolean
  link?:      string
}

const EVENT_EMOJI: Record<SlackEvent, string> = {
  'request.submitted':  '📋',
  'request.approved':   '✅',
  'request.rejected':   '❌',
  'request.cancelled':  '🚫',
  'shipment.shipped':   '📦',
  'shipment.received':  '✓',
  'shipment.exception': '⚠️',
  'stock.low':          '🔴',
}

const EVENT_COLOR: Record<SlackEvent, string> = {
  'request.submitted':  '#3B8BFA',
  'request.approved':   '#39D353',
  'request.rejected':   '#FF6B2B',
  'request.cancelled':  '#8b949e',
  'shipment.shipped':   '#00D4FF',
  'shipment.received':  '#2ABFA0',
  'shipment.exception': '#F5A623',
  'stock.low':          '#FF6B2B',
}

export async function notifySlack(payload: SlackPayload): Promise<void> {
  if (!isConfigured()) { console.warn('[Slack] Not configured — skipping notification'); return }

  const emoji = EVENT_EMOJI[payload.event]
  const color = EVENT_COLOR[payload.event]
  const link  = payload.link ??
    (payload.requestId  ? `${APP_URL()}/requests?id=${payload.requestId}` : null) ??
    (payload.shipmentId ? `${APP_URL()}/shipments?id=${payload.shipmentId}` : null)

  const blocks: object[] = [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `${emoji} *${payload.title}*\n${payload.body}` },
      ...(link && {
        accessory: {
          type: 'button',
          text: { type: 'plain_text', text: 'View in ITFlow' },
          url: link,
          style: payload.urgent ? 'danger' : 'primary',
        },
      }),
    },
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        { type: 'plain_text', text: `ITFlow · ${new Date().toLocaleString('en-US', { timeZone:'America/Chicago' })}` },
      ],
    },
  ]

  // Urgent requests get an extra action block for inline approve/reject (Phase 2 Slack)
  if (payload.urgent && payload.requestId) {
    blocks.splice(1, 0, {
      type: 'actions',
      elements: [
        { type:'button', text:{ type:'plain_text', text:'✓ Approve' }, style:'primary', action_id:'approve_request', value: payload.requestId },
        { type:'button', text:{ type:'plain_text', text:'✕ Reject'  }, style:'danger',  action_id:'reject_request',  value: payload.requestId },
      ],
    })
  }

  try {
    const res = await fetch(WEBHOOK()!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attachments: [{ color, blocks }] }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    console.log(`[Slack] Sent ${payload.event}`)
  } catch (e) {
    console.error('[Slack] notify failed:', e)
  }
}

// ── Test connection ───────────────────────────────────────────────────────────

export async function testSlackConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isConfigured()) return { ok: false, message: 'Slack webhook URL not configured' }
  try {
    await notifySlack({
      event: 'request.submitted',
      title: 'ITFlow connected ✓',
      body:  'Slack notifications are working correctly.',
    })
    return { ok: true, message: 'Test message sent to Slack' }
  } catch (e) {
    return { ok: false, message: `Failed: ${e}` }
  }
}
