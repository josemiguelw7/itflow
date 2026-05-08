// lib/data/inventory.ts — pulls from demo dataset
import { DEMO_ASSETS, DEMO_STOCK, DEMO_ITEMS, DEMO_LOCATIONS } from './demo'

export type AssetStatus   = 'AVAILABLE' | 'RESERVED' | 'IN_TRANSIT' | 'PENDING_WIPE' | 'READY' | 'DAMAGED' | 'RETIRED'
export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR'
export type ItemType      = 'SERIALIZED' | 'QUANTITY'

export interface InventoryItem {
  id:           string
  type:         ItemType
  name:         string
  category:     string
  make:         string
  assetTag?:    string
  serialNumber?: string
  site:         string
  siteCode:     string
  status:       AssetStatus
  condition?:   AssetCondition
  available?:   number
  reserved?:    number
  total?:       number
  lastUpdated:  string
}

// Build inventory from demo data
const itemMap    = Object.fromEntries(DEMO_ITEMS.map(i => [i.id, i]))
const siteMap    = Object.fromEntries(DEMO_LOCATIONS.map(l => [l.id, l]))

const serialized: InventoryItem[] = DEMO_ASSETS.map(a => {
  const item = itemMap[a.item]
  const site = siteMap[a.site]
  return {
    id:           a.id,
    type:         'SERIALIZED',
    name:         item?.name ?? '',
    category:     item?.category ?? '',
    make:         item?.make ?? '',
    assetTag:     a.tag,
    serialNumber: a.serial,
    site:         site?.name ?? '',
    siteCode:     site?.code ?? '',
    status:       a.status as AssetStatus,
    condition:    a.condition as AssetCondition,
    lastUpdated:  '1 day ago',
  }
})

const quantity: InventoryItem[] = DEMO_STOCK.map((s, idx) => {
  const item = itemMap[s.item]
  const site = siteMap[s.site]
  return {
    id:          `q${idx}`,
    type:        'QUANTITY',
    name:        item?.name ?? '',
    category:    item?.category ?? '',
    make:        item?.make ?? '',
    site:        site?.name ?? '',
    siteCode:    site?.code ?? '',
    status:      'AVAILABLE' as AssetStatus,
    available:   s.available,
    reserved:    s.reserved,
    total:       s.total,
    lastUpdated: '1 hour ago',
  }
})

export const INVENTORY: InventoryItem[] = [...serialized, ...quantity]

export const SITES    = ['All sites', ...DEMO_LOCATIONS.map(l => l.name)]
export const CATS     = ['All categories', 'Laptop', 'Phone', 'Tablet', 'Monitor', 'Accessory']
export const STATUSES: AssetStatus[] = ['AVAILABLE','RESERVED','IN_TRANSIT','PENDING_WIPE','READY','DAMAGED','RETIRED']
