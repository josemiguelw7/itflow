// lib/integrations/jira.ts
// Jira REST API v3 client
// All methods are fire-and-forget safe — errors are logged, never thrown

const BASE    = () => process.env.JIRA_BASE_URL
const EMAIL   = () => process.env.JIRA_EMAIL
const TOKEN   = () => process.env.JIRA_API_TOKEN
const PROJECT = () => process.env.JIRA_PROJECT_KEY ?? 'IT'

const PRIORITY_MAP: Record<string, string> = {
  LOW: 'Low', NORMAL: 'Medium', HIGH: 'High', URGENT: 'Highest',
}

const TRANSITION_MAP = () => ({
  inprogress: process.env.JIRA_TRANSITION_INPROGRESS ?? '21',
  reject:     process.env.JIRA_TRANSITION_REJECT     ?? '31',
  done:       process.env.JIRA_TRANSITION_DONE       ?? '41',
})

function headers() {
  const creds = Buffer.from(`${EMAIL()}:${TOKEN()}`).toString('base64')
  return { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
}

function isConfigured() {
  return !!(BASE() && EMAIL() && TOKEN())
}

function doc(text: string) {
  return { type:'doc', version:1, content:[{ type:'paragraph', content:[{ type:'text', text }] }] }
}

// ── Create issue ─────────────────────────────────────────────────────────────

export async function createJiraIssue(opts: {
  summary: string
  description: string
  priority?: string
  labels?: string[]
}): Promise<string | null> {
  if (!isConfigured()) { console.warn('[Jira] Not configured — skipping issue create'); return null }
  try {
    const res = await fetch(`${BASE()}/rest/api/3/issue`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({
        fields: {
          project:     { key: PROJECT() },
          summary:     opts.summary,
          description: doc(opts.description),
          issuetype:   { name: 'Task' },
          priority:    { name: PRIORITY_MAP[opts.priority ?? 'NORMAL'] ?? 'Medium' },
          labels:      opts.labels ?? ['itflow'],
        },
      }),
    })
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
    const data = await res.json()
    console.log(`[Jira] Created issue ${data.key}`)
    return data.key as string
  } catch (e) {
    console.error('[Jira] createIssue failed:', e)
    return null
  }
}

// ── Add comment ──────────────────────────────────────────────────────────────

export async function addJiraComment(issueKey: string | null | undefined, body: string): Promise<void> {
  if (!issueKey || !isConfigured()) return
  try {
    const res = await fetch(`${BASE()}/rest/api/3/issue/${issueKey}/comment`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ body: doc(body) }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    console.log(`[Jira] Comment added to ${issueKey}`)
  } catch (e) {
    console.error('[Jira] addComment failed:', e)
  }
}

// ── Transition issue ─────────────────────────────────────────────────────────

export async function transitionJiraIssue(issueKey: string | null | undefined, action: 'inprogress' | 'reject' | 'done'): Promise<void> {
  if (!issueKey || !isConfigured()) return
  const transitionId = TRANSITION_MAP()[action]
  try {
    const res = await fetch(`${BASE()}/rest/api/3/issue/${issueKey}/transitions`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ transition: { id: transitionId } }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    console.log(`[Jira] Transitioned ${issueKey} → ${action}`)
  } catch (e) {
    console.error('[Jira] transition failed:', e)
  }
}

// ── Test connection ──────────────────────────────────────────────────────────

export async function testJiraConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isConfigured()) return { ok: false, message: 'Jira credentials not configured' }
  try {
    const res = await fetch(`${BASE()}/rest/api/3/myself`, { headers: headers() })
    if (!res.ok) return { ok: false, message: `Auth failed: ${res.status}` }
    const data = await res.json()
    return { ok: true, message: `Connected as ${data.emailAddress}` }
  } catch (e) {
    return { ok: false, message: `Connection error: ${e}` }
  }
}
