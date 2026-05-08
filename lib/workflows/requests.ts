// lib/workflows/requests.ts
// Request lifecycle — every transition fires Jira + Slack + audit

import { prisma }              from '@/lib/db'
import { createJiraIssue, addJiraComment, transitionJiraIssue } from '@/lib/integrations/jira'
import { notifySlack }         from '@/lib/integrations/slack'
import { audit }               from '@/lib/integrations/audit'

// ── Submit ────────────────────────────────────────────────────────────────────

export async function submitRequest(input: {
  requesterId:            string
  destinationLocationId:  string
  sourceLocationId?:      string
  priority?:              string
  neededByDate?:          Date
  notes?:                 string
  orgId?:                 string
  lines: { itemId: string; quantity?: number; assetId?: string }[]
}) {
  const db = prisma as any

  const request = await db.$transaction(async (tx: any) => {
    const req = await tx.request.create({
      data: {
        requesterId:            input.requesterId,
        destinationLocationId:  input.destinationLocationId,
        sourceLocationId:       input.sourceLocationId,
        priority:               (input.priority as any) ?? 'NORMAL',
        neededByDate:           input.neededByDate,
        notes:                  input.notes,
        orgId:                  input.orgId,
        status:                 'SUBMITTED',
        lines: {
          create: input.lines.map(l => ({
            itemId:   l.itemId,
            assetId:  l.assetId,
            quantity: l.quantity ?? 1,
          })),
        },
      },
      include: { lines: { include: { item: true } }, requester: true },
    })
    return req
  })

  const itemNames = request.lines.map((l: any) => l.item.name).join(', ')
  const isUrgent  = request.priority === 'URGENT'

  // Jira — create issue
  const jiraKey = await createJiraIssue({
    summary:     `[ITFlow] Transfer Request — ${itemNames}`,
    description: `Requester: ${request.requester.name}\nDestination: ${input.destinationLocationId}\nPriority: ${request.priority}\nItems: ${itemNames}`,
    priority:    request.priority,
    labels:      ['itflow', 'transfer-request'],
  })

  if (jiraKey) {
    await (prisma as any).request.update({ where: { id: request.id }, data: { jiraIssueKey: jiraKey } })
  }

  // Slack
  await notifySlack({
    event:     'request.submitted',
    title:     `New transfer request${isUrgent ? ' 🚨 URGENT' : ''}`,
    body:      `*${itemNames}*\n${input.sourceLocationId ?? '?'} → ${input.destinationLocationId}\nRequested by ${request.requester.name}${jiraKey ? `  |  Jira: ${jiraKey}` : ''}`,
    requestId: request.id,
    priority:  request.priority,
    urgent:    isUrgent,
  })

  // Audit
  await audit({ action:'request.submitted', entityType:'request', entityId:request.id, userId:input.requesterId, orgId:input.orgId, after:{ status:'SUBMITTED', jiraKey } })

  return request
}

// ── Approve ───────────────────────────────────────────────────────────────────

export async function approveRequest(requestId: string, approverId: string, notes?: string) {
  const db  = prisma as any
  const req = await db.request.findUniqueOrThrow({ where:{ id:requestId } })
  if (req.status !== 'SUBMITTED') throw new Error(`Cannot approve: status is ${req.status}`)

  await db.$transaction(async (tx: any) => {
    await tx.request.update({ where:{ id:requestId }, data:{ status:'APPROVED' } })
    await tx.approval.create({ data:{ requestId, approverId, decision:'APPROVED', notes, decidedAt:new Date() } })
  })

  await addJiraComment(req.jiraIssueKey, `✅ Request approved by approver. Ready to reserve inventory.`)
  await transitionJiraIssue(req.jiraIssueKey, 'inprogress')
  await notifySlack({ event:'request.approved', title:'Request approved', body:`Request ${requestId} has been approved and is ready to ship.`, requestId })
  await audit({ action:'request.approved', entityType:'request', entityId:requestId, userId:approverId, before:{ status:'SUBMITTED' }, after:{ status:'APPROVED' } })

  return db.request.findUnique({ where:{ id:requestId } })
}

// ── Reject ────────────────────────────────────────────────────────────────────

export async function rejectRequest(requestId: string, approverId: string, notes?: string) {
  const db  = prisma as any
  const req = await db.request.findUniqueOrThrow({ where:{ id:requestId } })
  if (!['SUBMITTED','APPROVED'].includes(req.status)) throw new Error(`Cannot reject: status is ${req.status}`)

  await db.$transaction(async (tx: any) => {
    await tx.request.update({ where:{ id:requestId }, data:{ status:'REJECTED' } })
    await tx.approval.create({ data:{ requestId, approverId, decision:'REJECTED', notes, decidedAt:new Date() } })
  })

  await addJiraComment(req.jiraIssueKey, `❌ Request rejected. Reason: ${notes ?? 'No reason provided'}`)
  await transitionJiraIssue(req.jiraIssueKey, 'reject')
  await notifySlack({ event:'request.rejected', title:'Request rejected', body:`Request ${requestId} was rejected${notes ? `: ${notes}` : '.'}`, requestId })
  await audit({ action:'request.rejected', entityType:'request', entityId:requestId, userId:approverId, before:{ status:req.status }, after:{ status:'REJECTED', notes } })

  return db.request.findUnique({ where:{ id:requestId } })
}

// ── Cancel ────────────────────────────────────────────────────────────────────

export async function cancelRequest(requestId: string, userId: string) {
  const db  = prisma as any
  const req = await db.request.findUniqueOrThrow({ where:{ id:requestId }, include:{ lines:{ include:{ item:true } } } })
  if (!['SUBMITTED','APPROVED','RESERVED'].includes(req.status)) throw new Error(`Cannot cancel: status is ${req.status}`)

  await db.$transaction(async (tx: any) => {
    // Release reserved inventory
    for (const line of req.lines) {
      if (line.item.type === 'SERIALIZED' && line.assetId) {
        await tx.asset.update({ where:{ id:line.assetId }, data:{ status:'AVAILABLE' } })
      } else if (line.item.type === 'QUANTITY' && req.status === 'RESERVED' && req.sourceLocationId) {
        await tx.stockBalance.update({
          where:{ itemId_locationId:{ itemId:line.itemId, locationId:req.sourceLocationId } },
          data:{ available:{ increment:line.quantity }, reserved:{ decrement:line.quantity } },
        })
      }
    }
    await tx.request.update({ where:{ id:requestId }, data:{ status:'CANCELLED' } })
  })

  await addJiraComment(req.jiraIssueKey, '🚫 Request cancelled. Reserved inventory released.')
  await notifySlack({ event:'request.cancelled', title:'Request cancelled', body:`Request ${requestId} was cancelled by ${userId}.`, requestId })
  await audit({ action:'request.cancelled', entityType:'request', entityId:requestId, userId, before:{ status:req.status }, after:{ status:'CANCELLED' } })

  return db.request.findUnique({ where:{ id:requestId } })
}
