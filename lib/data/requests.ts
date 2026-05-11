export type RequestStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RESERVED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
export type RequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
export type RequestType = 'TRANSFER' | 'PURCHASE'

export interface TransferRequest {
  id: string
  requestType: RequestType
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
  // TRANSFER requests — Dave (Supervisor) approves
  { id:'REQ-0041', requestType:'TRANSFER', itemName:'MacBook Pro 14" M3',   itemIcon:'💻', quantity:2,  sourcesite:'Denver',        sourceSiteCode:'DEN', destSite:'Austin HQ',     destSiteCode:'ATX', status:'SUBMITTED', priority:'URGENT', requester:'Kira Valdez',  jiraKey:'IT-441', createdAt:'2 hours ago',  updatedAt:'2 hours ago'  },
  { id:'REQ-0040', requestType:'TRANSFER', itemName:'Dell 27" Monitor',      itemIcon:'🖥',  quantity:4,  sourcesite:'Austin HQ',     sourceSiteCode:'ATX', destSite:'Chicago',        destSiteCode:'CHI', status:'APPROVED',  priority:'NORMAL', requester:'Marcus T.',    jiraKey:'IT-440', createdAt:'5 hours ago',  updatedAt:'1 hour ago'   },
  { id:'REQ-0039', requestType:'TRANSFER', itemName:'Magic Keyboard ×10',    itemIcon:'⌨',  quantity:10, sourcesite:'Austin HQ',     sourceSiteCode:'ATX', destSite:'Seattle',        destSiteCode:'SEA', status:'RESERVED',  priority:'NORMAL', requester:'Auto',         jiraKey:'IT-439', createdAt:'6 hours ago',  updatedAt:'3 hours ago'  },
  { id:'REQ-0038', requestType:'TRANSFER', itemName:'iPhone 15 Pro',         itemIcon:'📱', quantity:1,  sourcesite:'New York',      sourceSiteCode:'NYC', destSite:'Austin HQ',     destSiteCode:'ATX', status:'SHIPPED',   priority:'NORMAL', requester:'James P.',     jiraKey:'IT-438', createdAt:'1 day ago',    updatedAt:'4 hours ago'  },
  { id:'REQ-0037', requestType:'TRANSFER', itemName:'USB-C Charger ×6',      itemIcon:'🔌', quantity:6,  sourcesite:'Austin HQ',     sourceSiteCode:'ATX', destSite:'Miami',          destSiteCode:'MIA', status:'SUBMITTED', priority:'LOW',    requester:'Auto',         jiraKey:'IT-437', createdAt:'1 day ago',    updatedAt:'1 day ago'    },
  { id:'REQ-0036', requestType:'TRANSFER', itemName:'Dell Latitude 5540',    itemIcon:'💻', quantity:3,  sourcesite:'Chicago',       sourceSiteCode:'CHI', destSite:'Boston',         destSiteCode:'BOS', status:'COMPLETED', priority:'HIGH',   requester:'Anna K.',      jiraKey:'IT-436', createdAt:'2 days ago',   updatedAt:'1 day ago'    },
  { id:'REQ-0035', requestType:'TRANSFER', itemName:'iPad Pro 12.9"',        itemIcon:'⊞',  quantity:2,  sourcesite:'San Francisco', sourceSiteCode:'SFO', destSite:'Denver',         destSiteCode:'DEN', status:'REJECTED',  priority:'NORMAL', requester:'Tom R.',       jiraKey:'IT-435', createdAt:'3 days ago',   updatedAt:'2 days ago'   },
  { id:'REQ-0034', requestType:'TRANSFER', itemName:'MacBook Pro 14" M3',   itemIcon:'💻', quantity:1,  sourcesite:'Seattle',       sourceSiteCode:'SEA', destSite:'New York',       destSiteCode:'NYC', status:'COMPLETED', priority:'HIGH',   requester:'Sara M.',      jiraKey:'IT-434', createdAt:'4 days ago',   updatedAt:'3 days ago'   },
  // PURCHASE requests — Abe (Manager) approves
  { id:'REQ-0033', requestType:'PURCHASE', itemName:'MacBook Pro 14" M3 ×5', itemIcon:'💻', quantity:5,  sourcesite:'Vendor',        sourceSiteCode:'VND', destSite:'Miami',          destSiteCode:'MIA', status:'SUBMITTED', priority:'URGENT', requester:'Alex Rivera',  jiraKey:'IT-433', createdAt:'3 hours ago',  updatedAt:'3 hours ago', notes:'Miami is critically low — need 5 units urgently' },
  { id:'REQ-0032', requestType:'PURCHASE', itemName:'Dell 27" Monitor ×10',  itemIcon:'🖥',  quantity:10, sourcesite:'Vendor',        sourceSiteCode:'VND', destSite:'Austin HQ',     destSiteCode:'ATX', status:'APPROVED',  priority:'NORMAL', requester:'Dave',         jiraKey:'IT-432', createdAt:'2 days ago',   updatedAt:'1 day ago'    },
  { id:'REQ-0031', requestType:'PURCHASE', itemName:'iPhone 15 Pro ×8',      itemIcon:'📱', quantity:8,  sourcesite:'Vendor',        sourceSiteCode:'VND', destSite:'Denver',         destSiteCode:'DEN', status:'SUBMITTED', priority:'HIGH',   requester:'Kira Valdez',  jiraKey:'IT-431', createdAt:'1 day ago',    updatedAt:'1 day ago',   notes:'Replacing aging iPhone 13 fleet' },
  { id:'REQ-0030', requestType:'PURCHASE', itemName:'USB-C Charger ×50',     itemIcon:'🔌', quantity:50, sourcesite:'Vendor',        sourceSiteCode:'VND', destSite:'Austin HQ',     destSiteCode:'ATX', status:'COMPLETED', priority:'LOW',    requester:'Dave',         jiraKey:'IT-430', createdAt:'5 days ago',   updatedAt:'3 days ago'   },
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
