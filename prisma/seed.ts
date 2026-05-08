import { PrismaClient, ItemType, AssetStatus, AssetCondition } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ITFlow...')

  const locations = await Promise.all([
    prisma.location.upsert({ where: { code: 'ATX' }, update: {}, create: { name: 'Austin HQ', code: 'ATX', address: '1234 Congress Ave, Austin TX 78701', timezone: 'America/Chicago' } }),
    prisma.location.upsert({ where: { code: 'CHI' }, update: {}, create: { name: 'Chicago', code: 'CHI', address: '111 W Wacker Dr, Chicago IL 60601', timezone: 'America/Chicago' } }),
    prisma.location.upsert({ where: { code: 'SEA' }, update: {}, create: { name: 'Seattle', code: 'SEA', address: '400 Broad St, Seattle WA 98109', timezone: 'America/Los_Angeles' } }),
    prisma.location.upsert({ where: { code: 'DEN' }, update: {}, create: { name: 'Denver', code: 'DEN', address: '1700 Lincoln St, Denver CO 80203', timezone: 'America/Denver' } }),
    prisma.location.upsert({ where: { code: 'NYC' }, update: {}, create: { name: 'New York', code: 'NYC', address: '1 World Trade Center, New York NY 10007', timezone: 'America/New_York' } }),
  ])
  const [atx, chi, , den] = locations
  console.log(`✓ ${locations.length} locations`)

  const mbp = await prisma.item.upsert({ where: { id: 'item-mbp14' }, update: {}, create: { id: 'item-mbp14', name: 'MacBook Pro 14"', description: 'M3 Pro chip, 18GB RAM, 512GB SSD', category: 'Laptop', type: ItemType.SERIALIZED, make: 'Apple', model: 'MacBook Pro 14" M3 Pro' } })
  const dell = await prisma.item.upsert({ where: { id: 'item-dell5540' }, update: {}, create: { id: 'item-dell5540', name: 'Dell Latitude 5540', description: 'Intel i7, 16GB RAM, 256GB SSD', category: 'Laptop', type: ItemType.SERIALIZED, make: 'Dell', model: 'Latitude 5540' } })
  const iphone = await prisma.item.upsert({ where: { id: 'item-iphone15pro' }, update: {}, create: { id: 'item-iphone15pro', name: 'iPhone 15 Pro', description: '256GB, Unlocked', category: 'Phone', type: ItemType.SERIALIZED, make: 'Apple', model: 'iPhone 15 Pro' } })
  const keyboard = await prisma.item.upsert({ where: { id: 'item-magickb' }, update: {}, create: { id: 'item-magickb', name: 'Apple Magic Keyboard', description: 'Touch ID, US English', category: 'Accessory', type: ItemType.QUANTITY, make: 'Apple', model: 'Magic Keyboard' } })
  const charger = await prisma.item.upsert({ where: { id: 'item-usbc96w' }, update: {}, create: { id: 'item-usbc96w', name: 'USB-C Charger 96W', description: 'USB-C Power Adapter', category: 'Accessory', type: ItemType.QUANTITY, make: 'Apple', model: '96W USB-C' } })
  console.log('✓ 5 catalog items')

  await Promise.all([
    prisma.asset.upsert({ where: { assetTag: 'ATX-MBP-001' }, update: {}, create: { assetTag: 'ATX-MBP-001', serialNumber: 'C02XK1ABMD6N', itemId: mbp.id, locationId: atx.id, status: AssetStatus.AVAILABLE, condition: AssetCondition.GOOD } }),
    prisma.asset.upsert({ where: { assetTag: 'ATX-MBP-002' }, update: {}, create: { assetTag: 'ATX-MBP-002', serialNumber: 'C02XK1ABMD7N', itemId: mbp.id, locationId: atx.id, status: AssetStatus.AVAILABLE, condition: AssetCondition.NEW } }),
    prisma.asset.upsert({ where: { assetTag: 'CHI-DELL-001' }, update: {}, create: { assetTag: 'CHI-DELL-001', serialNumber: 'DLAT5540CHI001', itemId: dell.id, locationId: chi.id, status: AssetStatus.AVAILABLE, condition: AssetCondition.GOOD } }),
    prisma.asset.upsert({ where: { assetTag: 'ATX-IPH-001' }, update: {}, create: { assetTag: 'ATX-IPH-001', serialNumber: 'F2LXK9ABCDEF', itemId: iphone.id, locationId: atx.id, status: AssetStatus.PENDING_WIPE, condition: AssetCondition.GOOD } }),
    prisma.asset.upsert({ where: { assetTag: 'DEN-MBP-001' }, update: {}, create: { assetTag: 'DEN-MBP-001', serialNumber: 'C02XK1ABDEN1', itemId: mbp.id, locationId: den.id, status: AssetStatus.RESERVED, condition: AssetCondition.FAIR } }),
  ])
  console.log('✓ 5 assets')

  await Promise.all([
    prisma.stockBalance.upsert({ where: { itemId_locationId: { itemId: keyboard.id, locationId: atx.id } }, update: {}, create: { itemId: keyboard.id, locationId: atx.id, total: 42, available: 34, reserved: 4, inTransit: 4 } }),
    prisma.stockBalance.upsert({ where: { itemId_locationId: { itemId: charger.id, locationId: atx.id } }, update: {}, create: { itemId: charger.id, locationId: atx.id, total: 28, available: 20, reserved: 6, inTransit: 2 } }),
    prisma.stockBalance.upsert({ where: { itemId_locationId: { itemId: keyboard.id, locationId: chi.id } }, update: {}, create: { itemId: keyboard.id, locationId: chi.id, total: 15, available: 12, reserved: 3, inTransit: 0 } }),
    prisma.stockBalance.upsert({ where: { itemId_locationId: { itemId: charger.id, locationId: den.id } }, update: {}, create: { itemId: charger.id, locationId: den.id, total: 4, available: 2, reserved: 2, inTransit: 0 } }),
  ])
  console.log('✓ Stock balances')
  console.log('✅ Seed complete')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
