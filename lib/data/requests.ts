export type RequestStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RESERVED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
export type RequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

export interface TransferRequest {
  id: string
  itemName: string
  itemIcon: string
  quantity: number
  sourcesite: string
  sourceSiteCode: string
  destSite: string
  destSiteCode: string
  status: RequestStatus
  priority: RequestPriority
  requester: string
  jiraKey?: string
  notes?: string
  neededBy?: string
  createdAt: string
  updatedAt: string
}

export const REQUESTS: TransferRequest[] = [
  { id:'REQ-0041', itemName:'MacBook Pro 14" M3',   itemIcon:'💻', quantity:2,  sourcesite:'Denver',        sourceSiteCode:'DEN', destSite:'Austin HQ',     destSiteCode:'ATX', status:'SUBMITTED', priority:'URGENT', requester:'Kira Valdez',  jiraKey:'IT-441', createdAt:'2 hours ago',  updatedAt:'2 hours ago'  },
  { id:'REQ-0040', itemName:'Dell 27" Monitor',      itemIcon:'🖥',  quantity:4,  sourcesite:'Austin HQ',     sourceSiteCode:'ATX', destSite:'Chicago',        destSiteCode:'CHI', status:'APPROVED',  priority:'NORMAL', requester:'Marcus T.',    jiraKey:'IT-440', createdAt:'5 hours ago',  updatedAt:'1 hour ago'   },
  { id:'REQ-0039', itemName:'Magic Keyboard',         itemIcon:'⌨',  quantity:10, sourcesite:'Austin HQ',     sourceSiteCode:'ATX', destSite:'Seattle',        destSiteCode:'SEA', status:'RESERVED',  priority:'NORMAL', requester:'Auto',         jiraKey:'IT-439', createdAt:'6 hours ago',  updatedAt:'3 hours ago'  },
  { id:'REQ-0038', itemName:'iPhone 15 Pro',          itemIcon:'📱', quantity:1,  sourcesite:'New York',      sourceSiteCode:'NYC', destSite:'Austin HQ',     destSiteCode:'ATX', status:'SHIPPED',   priority:'NORMAL', requester:'James P.',     jiraKey:'IT-438', createdAt:'1 day ago',    updatedAt:'4 hours ago'  },
  { id:'REQ-0037', itemName:'USB-C Charger 96W',      itemIcon:'🔌', quantity:6,  sourcesite:'Austin HQ',     sourceSiteCode:'ATX', destSite:'Miami',          destSiteCode:'MIA', status:'SUBMITTED', priority:'LOW',    requester:'Auto',         jiraKey:'IT-437', createdAt:'1 day ago',    updatedAt:'1 day ago'    },
  { id:'REQ-0036', itemName:'Dell Latitude 5540',     itemIcon:'💻', quantity:3,  sourcesite:'Chicago',       sourceSiteCode:'CHI', destSite:'Boston',         destSiteCode:'BOS', status:'COMPLETED', priority:'HIGH',   requester:'Anna K.',      jiraKey:'IT-436', createdAt:'2 days ago',   updatedAt:'1 day ago'    },
  { id:'REQ-0035', itemName:'iPad Pro 12.9"',         itemIcon:'⊞',  quantity:2,  sourcesite:'San Francisco', sourceSiteCode:'SFO', destSite:'Denver',         destSiteCode:'DEN', status:'REJECTED',  priority:'NORMAL', requester:'Tom R.',       jiraKey:'IT-435', createdAt:'3 days ago',   updatedAt:'2 days ago'   },
  { id:'REQ-0034', itemName:'MacBook Pro 14" M3',    itemIcon:'💻', quantity:1,  sourcesite:'Seattle',       sourceSiteCode:'SEA', destSite:'New York',       destSiteCode:'NYC', status:'COMPLETED', priority:'HIGH',   requester:'Sara M.',      jiraKey:'IT-434', createdAt:'4 days ago',   updatedAt:'3 days ago'   },
]

export const SITES_LIST = ['Austin HQ','Chicago','Seattle','Denver','New York','San Francisco','Boston','Miami']

export const ITEMS_LIST = [
  { id:'item_mbp14',      name:'MacBook Pro 14" M3',   icon:'💻', type:'SERIALIZED' },
  { id:'item_dell5540',   name:'Dell Latitude 5540',   icon:'💻', type:'SERIALIZED' },
  { id:'item_iphone15',   name:'iPhone 15 Pro',        icon:'📱', type:'SERIALIZED' },
  { id:'item_dellmon27',  name:'Dell 27" Monitor',     icon:'🖥',  type:'SERIALIZED' },
  { id:'item_ipadpro',    name:'iPad Pro 12.9"',       icon:'⊞',  type:'SERIALIZED' },
  { id:'item_magickb',    name:'Apple Magic Keyboard', icon:'⌨',  type:'QUANTITY'   },
  { id:'item_usbc96w',    name:'USB-C Charger 96W',    icon:'🔌', type:'QUANTITY'   },
  { id:'item_usbccable',  name:'USB-C Cable 2m',       icon:'🔌', type:'QUANTITY'   },
]
