// lib/workflows/shipments.ts
// Shipment lifecycle — ship, receive, exception all fire Jira + Slack + audit

import { prisma }           from '@/lib/db'
import { addJiraComment, transitionJiraIssue } from '@/lib/integrations/jira'
import { notifySlack }      from '@/lib/integrations/slack'
import { audit }            from '@/lib/integrations/audit'

// ── Mark shipped ──────────────────────────────────────────────────────────────

export async function markShipped(shipmentId: string, userId: string, opts?: { carrier?: string; trackingNumber?: string }) {
  const db       = prisma as any
  const shipment = await db.shipment.findUniqueOrThrow({
    where:   { id: shipmentId },
    include: { request: { include:{ lines:{ include:{ item:true } } } }, origin:true, destination:true },
  })
  if (shipment.status !== 'PREPARING') throw new Error(`Shipment not in PREPARING (is ${shipment.status})`)

  await db.$transaction(async (tx: any) => {
    await tx.shipment.update({
      where: { id: shipmentId },
      data:  { status:'SHIPPED', shippedAt:new Date(), carrier:opts?.carrier ?? shipment.carrier, trackingNumber:opts?.trackingNumber ?? shipment.trackingNumber },
    })

    if (shipment.request) {
      for (const line of shipment.request.lines) {
        if (line.item.type === 'SERIALIZED' && line.assetId) {
          await tx.asset.update({ where:{ id:line.assetId }, data:{ status:'IN_TRANSIT' } })
        } else if (line.item.type === 'QUANTITY' && shipment.request.sourceLocationId) {
          await tx.stockBalance.update({
            where: { itemId_locationId:{ itemId:line.itemId, locationId:shipment.request.sourceLocationId } },
            data:  { reserved:{ decrement:line.quantity }, inTransit:{ increment:line.quantity }, total:{ decrement:line.quantity } },
          })
        }
      }
      await tx.request.update({ where:{ id:shipment.requestId }, data:{ status:'SHIPPED' } })
    }
  })

  const tracking = opts?.trackingNumber ?? shipment.trackingNumber
  const carrier  = opts?.carrier ?? shipment.carrier ?? 'carrier'

  await addJiraComment(shipment.request?.jiraIssueKey, `📦 Shipped via ${carrier}${tracking ? `. Tracking: ${tracking}` : ''}`)
  await notifySlack({
    event:      'shipment.shipped',
    title:      'Shipment on its way',
    body:       `${shipment.origin.name} → ${shipment.destination.name}\n${carrier}${tracking ? ` · ${tracking}` : ''}`,
    shipmentId,
    requestId:  shipment.requestId ?? undefined,
  })
  await audit({ action:'shipment.shipped', entityType:'shipment', entityId:shipmentId, userId, after:{ status:'SHIPPED', carrier, tracking } })

  return db.shipment.findUnique({ where:{ id:shipmentId } })
}

// ── Mark received ─────────────────────────────────────────────────────────────

export async function markReceived(shipmentId: string, userId: string, opts?: { notes?: string }) {
  const db       = prisma as any
  const shipment = await db.shipment.findUniqueOrThrow({
    where:   { id: shipmentId },
    include: { request:{ include:{ lines:{ include:{ item:true } } } }, destination:true },
  })
  if (!['SHIPPED','IN_TRANSIT','DELIVERED'].includes(shipment.status)) throw new Error(`Cannot receive: status is ${shipment.status}`)

  await db.$transaction(async (tx: any) => {
    await tx.shipment.update({ where:{ id:shipmentId }, data:{ status:'RECEIVED', receivedAt:new Date(), receiverNotes:opts?.notes } })

    if (shipment.request) {
      for (const line of shipment.request.lines) {
        if (line.item.type === 'SERIALIZED' && line.assetId) {
          await tx.asset.update({ where:{ id:line.assetId }, data:{ status:'AVAILABLE', locationId:shipment.destinationId } })
        } else if (line.item.type === 'QUANTITY') {
          if (shipment.request.sourceLocationId) {
            await tx.stockBalance.updateMany({
              where: { itemId:line.itemId, locationId:shipment.request.sourceLocationId },
              data:  { inTransit:{ decrement:line.quantity } },
            })
          }
          await tx.stockBalance.upsert({
            where:  { itemId_locationId:{ itemId:line.itemId, locationId:shipment.destinationId } },
            update: { available:{ increment:line.quantity }, total:{ increment:line.quantity } },
            create: { itemId:line.itemId, locationId:shipment.destinationId, total:line.quantity, available:line.quantity, reserved:0, inTransit:0 },
          })
        }
      }
      await tx.request.update({ where:{ id:shipment.requestId }, data:{ status:'COMPLETED' } })
    }
  })

  await addJiraComment(shipment.request?.jiraIssueKey, `✅ Received at ${shipment.destination.name}. Transfer complete.${opts?.notes ? ` Notes: ${opts.notes}` : ''}`)
  await transitionJiraIssue(shipment.request?.jiraIssueKey, 'done')
  await notifySlack({
    event:     'shipment.received',
    title:     'Shipment received ✓',
    body:      `Delivered to ${shipment.destination.name}. Inventory updated automatically.`,
    shipmentId,
    requestId: shipment.requestId ?? undefined,
  })
  await audit({ action:'shipment.received', entityType:'shipment', entityId:shipmentId, userId, after:{ status:'RECEIVED', notes:opts?.notes } })

  return db.shipment.findUnique({ where:{ id:shipmentId } })
}

// ── Flag exception ────────────────────────────────────────────────────────────

export async function flagException(shipmentId: string, userId: string, notes: string) {
  const db       = prisma as any
  const shipment = await db.shipment.findUniqueOrThrow({ where:{ id:shipmentId }, include:{ request:true, origin:true, destination:true } })

  await db.shipment.update({ where:{ id:shipmentId }, data:{ status:'EXCEPTION', receiverNotes:notes } })

  await addJiraComment(shipment.request?.jiraIssueKey, `⚠️ Shipment exception flagged: ${notes}`)
  await notifySlack({
    event:     'shipment.exception',
    title:     '⚠️ Shipment exception',
    body:      `${shipment.origin.name} → ${shipment.destination.name}\n${notes}`,
    shipmentId,
    requestId: shipment.requestId ?? undefined,
    urgent:    true,
  })
  await audit({ action:'shipment.exception', entityType:'shipment', entityId:shipmentId, userId, after:{ status:'EXCEPTION', notes } })

  return db.shipment.findUnique({ where:{ id:shipmentId } })
}
