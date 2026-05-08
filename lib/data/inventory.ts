export type AssetStatus = 'AVAILABLE' | 'RESERVED' | 'IN_TRANSIT' | 'PENDING_WIPE' | 'READY' | 'DAMAGED' | 'RETIRED'
export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR'
export type ItemType = 'SERIALIZED' | 'QUANTITY'

export interface InventoryItem {
  id: string
  type: ItemType
  name: string
  category: string
  make: string
  assetTag?: string
  serialNumber?: string
  site: string
  siteCode: string
  status: AssetStatus
  condition?: AssetCondition
  available?: number
  reserved?: number
  total?: number
  lastUpdated: string
}

export const INVENTORY: InventoryItem[] = [
  { id:'a1',  type:'SERIALIZED', name:'MacBook Pro 14" M3',   category:'Laptop',    make:'Apple', assetTag:'ATX-MBP-001', serialNumber:'C02XK1ABMD6N',  site:'Austin HQ',     siteCode:'ATX', status:'AVAILABLE',    condition:'GOOD', lastUpdated:'2 hours ago' },
  { id:'a2',  type:'SERIALIZED', name:'MacBook Pro 14" M3',   category:'Laptop',    make:'Apple', assetTag:'ATX-MBP-002', serialNumber:'C02XK1ABMD7N',  site:'Austin HQ',     siteCode:'ATX', status:'AVAILABLE',    condition:'NEW',  lastUpdated:'2 hours ago' },
  { id:'a3',  type:'SERIALIZED', name:'MacBook Pro 14" M3',   category:'Laptop',    make:'Apple', assetTag:'DEN-MBP-001', serialNumber:'C02XK1ABDEN1',  site:'Denver',        siteCode:'DEN', status:'RESERVED',     condition:'FAIR', lastUpdated:'5 hours ago' },
  { id:'a4',  type:'SERIALIZED', name:'Dell Latitude 5540',   category:'Laptop',    make:'Dell',  assetTag:'CHI-DELL-001',serialNumber:'DLAT5540CHI01', site:'Chicago',       siteCode:'CHI', status:'AVAILABLE',    condition:'GOOD', lastUpdated:'1 day ago'   },
  { id:'a5',  type:'SERIALIZED', name:'Dell Latitude 5540',   category:'Laptop',    make:'Dell',  assetTag:'SEA-DELL-001',serialNumber:'DLAT5540SEA01', site:'Seattle',       siteCode:'SEA', status:'IN_TRANSIT',   condition:'GOOD', lastUpdated:'3 hours ago' },
  { id:'a6',  type:'SERIALIZED', name:'iPhone 15 Pro',        category:'Phone',     make:'Apple', assetTag:'ATX-IPH-001', serialNumber:'F2LXK9ABCDEF',  site:'Austin HQ',     siteCode:'ATX', status:'PENDING_WIPE', condition:'GOOD', lastUpdated:'1 hour ago'  },
  { id:'a7',  type:'SERIALIZED', name:'iPhone 15 Pro',        category:'Phone',     make:'Apple', assetTag:'NYC-IPH-001', serialNumber:'F2LXK9ABXYZA',  site:'New York',      siteCode:'NYC', status:'AVAILABLE',    condition:'NEW',  lastUpdated:'6 hours ago' },
  { id:'a8',  type:'SERIALIZED', name:'Dell 27" Monitor',     category:'Monitor',   make:'Dell',  assetTag:'ATX-MON-001', serialNumber:'DMON27ATX001',  site:'Austin HQ',     siteCode:'ATX', status:'AVAILABLE',    condition:'GOOD', lastUpdated:'2 days ago'  },
  { id:'a9',  type:'SERIALIZED', name:'Dell 27" Monitor',     category:'Monitor',   make:'Dell',  assetTag:'SFO-MON-001', serialNumber:'DMON27SFO001',  site:'San Francisco', siteCode:'SFO', status:'DAMAGED',      condition:'POOR', lastUpdated:'1 day ago'   },
  { id:'a10', type:'SERIALIZED', name:'iPad Pro 12.9"',       category:'Tablet',    make:'Apple', assetTag:'BOS-TAB-001', serialNumber:'DMKX3LLABOS1',  site:'Boston',        siteCode:'BOS', status:'READY',        condition:'GOOD', lastUpdated:'4 hours ago' },
  { id:'q1',  type:'QUANTITY',   name:'Apple Magic Keyboard', category:'Accessory', make:'Apple', site:'Austin HQ',     siteCode:'ATX', status:'AVAILABLE', available:34, reserved:4,  total:42, lastUpdated:'1 hour ago'  },
  { id:'q2',  type:'QUANTITY',   name:'Apple Magic Keyboard', category:'Accessory', make:'Apple', site:'Chicago',       siteCode:'CHI', status:'AVAILABLE', available:12, reserved:3,  total:15, lastUpdated:'2 hours ago' },
  { id:'q3',  type:'QUANTITY',   name:'USB-C Charger 96W',    category:'Accessory', make:'Apple', site:'Austin HQ',     siteCode:'ATX', status:'AVAILABLE', available:20, reserved:6,  total:28, lastUpdated:'30 min ago'  },
  { id:'q4',  type:'QUANTITY',   name:'USB-C Charger 96W',    category:'Accessory', make:'Apple', site:'Denver',        siteCode:'DEN', status:'AVAILABLE', available:2,  reserved:2,  total:4,  lastUpdated:'5 hours ago' },
  { id:'q5',  type:'QUANTITY',   name:'USB-C Cable 2m',       category:'Accessory', make:'Anker', site:'Seattle',       siteCode:'SEA', status:'AVAILABLE', available:45, reserved:0,  total:45, lastUpdated:'1 day ago'   },
  { id:'q6',  type:'QUANTITY',   name:'Logitech MX Keys',     category:'Accessory', make:'Logi',  site:'Miami',         siteCode:'MIA', status:'AVAILABLE', available:3,  reserved:1,  total:4,  lastUpdated:'3 days ago'  },
]

export const SITES    = ['All sites','Austin HQ','Chicago','Seattle','Denver','New York','San Francisco','Boston','Miami']
export const CATS     = ['All categories','Laptop','Phone','Tablet','Monitor','Accessory']
export const STATUSES: AssetStatus[] = ['AVAILABLE','RESERVED','IN_TRANSIT','PENDING_WIPE','READY','DAMAGED','RETIRED']
