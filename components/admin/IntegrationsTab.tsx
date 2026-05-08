'use client'
import { useState } from 'react'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
  phase?: string
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'jira',
    name: 'Jira',
    description: 'Automatically create and update Jira tickets for every transfer request.',
    icon: '🔵',
    connected: false,
    fields: [
      { key:'JIRA_BASE_URL',   label:'Jira base URL',   placeholder:'https://yourorg.atlassian.net' },
      { key:'JIRA_EMAIL',      label:'Account email',   placeholder:'itflow-bot@yourorg.com' },
      { key:'JIRA_API_TOKEN',  label:'API token',       placeholder:'Enter Jira API token', secret:true },
      { key:'JIRA_PROJECT_KEY',label:'Project key',     placeholder:'IT' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications to Slack when requests are submitted, approved, or shipped.',
    icon: '💬',
    connected: false,
    fields: [
      { key:'SLACK_WEBHOOK_URL', label:'Webhook URL', placeholder:'https://hooks.slack.com/services/...', secret:true },
    ],
  },
  {
    id: 'okta',
    name: 'Okta SSO',
    description: 'Replace magic link auth with enterprise Okta SSO for production deployments.',
    icon: '🔐',
    connected: false,
    phase: 'Phase 4 — Production',
    fields: [
      { key:'OKTA_ISSUER',        label:'Issuer URL',     placeholder:'https://yourorg.okta.com/oauth2/default' },
      { key:'OKTA_CLIENT_ID',     label:'Client ID',      placeholder:'Enter Okta client ID' },
      { key:'OKTA_CLIENT_SECRET', label:'Client secret',  placeholder:'Enter Okta client secret', secret:true },
    ],
  },
]

export function IntegrationsTab() {
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({})
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function setField(integId: string, key: string, val: string) {
    setConfigs(prev => ({ ...prev, [integId]: { ...(prev[integId] ?? {}), [key]: val } }))
  }

  async function handleTest(id: string) {
    setTesting(t => ({ ...t, [id]: true }))
    await new Promise(r => setTimeout(r, 1200))
    setTesting(t => ({ ...t, [id]: false }))
    setConnected(c => ({ ...c, [id]: true }))
    showToast(`✓ ${INTEGRATIONS.find(i=>i.id===id)?.name} connected successfully`)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {toast && <div style={{ position:'fixed', bottom:24, right:24, zIndex:500, background:'#161b22', border:'1px solid rgba(42,191,160,0.3)', borderRadius:9, padding:'12px 18px', fontSize:13, color:'var(--teal)' }}>{toast}</div>}

      {INTEGRATIONS.map(integ => {
        const isConnected = connected[integ.id] ?? integ.connected
        const isTesting   = testing[integ.id]
        const cfg         = configs[integ.id] ?? {}

        return (
          <div key={integ.id} style={{ background:'#161b22', border:`1px solid ${isConnected ? 'rgba(42,191,160,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius:10, overflow:'hidden' }}>
            {/* Header row */}
            <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width:40, height:40, borderRadius:9, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                {integ.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontWeight:600, fontSize:14 }}>{integ.name}</span>
                  {integ.phase && (
                    <span style={{ fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:4, background:'rgba(245,166,35,0.12)', color:'#F5A623' }}>
                      {integ.phase}
                    </span>
                  )}
                </div>
                <div style={{ fontSize:12, color:'#8b949e', marginTop:2 }}>{integ.description}</div>
              </div>
              <span style={{
                fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:10, flexShrink:0,
                background: isConnected ? 'rgba(57,211,83,0.12)' : 'rgba(139,148,158,0.12)',
                color: isConnected ? '#39D353' : '#8b949e',
              }}>
                {isConnected ? '● Connected' : '○ Not connected'}
              </span>
            </div>

            {/* Config fields */}
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'grid', gridTemplateColumns: integ.fields.length > 2 ? '1fr 1fr' : '1fr', gap:10 }}>
                {integ.fields.map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize:11, fontWeight:600, color:'#8b949e', textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:5 }}>{f.label}</div>
                    <input
                      type={f.secret ? 'password' : 'text'}
                      value={cfg[f.key] ?? ''}
                      onChange={e => setField(integ.id, f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ width:'100%', background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'8px 12px', fontSize:13, color:'#e6edf3', outline:'none' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:8, marginTop:4 }}>
                <button
                  onClick={() => handleTest(integ.id)}
                  disabled={isTesting}
                  style={{
                    padding:'8px 18px', borderRadius:7, fontSize:13, fontWeight:600,
                    background: isConnected ? 'rgba(57,211,83,0.12)' : 'var(--teal)',
                    color: isConnected ? '#39D353' : '#0d1117',
                    border: isConnected ? '1px solid rgba(57,211,83,0.2)' : 'none',
                    cursor:'pointer', opacity: isTesting ? 0.7 : 1,
                  }}
                >
                  {isTesting ? 'Testing…' : isConnected ? '✓ Re-test connection' : 'Save & test connection'}
                </button>
                {isConnected && (
                  <button
                    onClick={() => setConnected(c => ({ ...c, [integ.id]: false }))}
                    style={{ padding:'8px 14px', borderRadius:7, fontSize:13, background:'transparent', color:'#FF6B2B', border:'1px solid rgba(255,107,43,0.2)', cursor:'pointer' }}
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
