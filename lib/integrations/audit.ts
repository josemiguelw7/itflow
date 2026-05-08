// lib/integrations/audit.ts
// Append-only audit log writer — never throws

import { prisma } from '@/lib/db'

export interface AuditEntry {
  action:     string        // e.g. 'request.approved'
  entityType: string        // 'request' | 'shipment' | 'asset'
  entityId:   string
  userId?:    string
  orgId?:     string
  before?:    object
  after?:     object
  meta?:      object        // jira key, slack ts, etc.
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await (prisma as any).auditLog.create({
      data: {
        action:     entry.action,
        entityType: entry.entityType,
        entityId:   entry.entityId,
        userId:     entry.userId,
        orgId:      entry.orgId,
        before:     entry.before as any,
        after:      entry.after  as any,
        meta:       entry.meta   as any,
      },
    })
  } catch (e) {
    // Never let audit logging break a workflow
    console.error('[Audit] write failed:', e)
  }
}
