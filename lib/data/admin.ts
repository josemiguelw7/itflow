export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'TECHNICIAN' | 'SITE_MANAGER' | 'REGIONAL_MANAGER' | 'ADMIN'
  site: string
  siteCode: string
  active: boolean
  lastLogin: string
  orgs: string[]
}

export interface AdminLocation {
  id: string
  name: string
  code: string
  address: string
  timezone: string
  active: boolean
  totalAssets: number
  activeUsers: number
}

export interface AdminItem {
  id: string
  name: string
  category: string
  type: 'SERIALIZED' | 'QUANTITY'
  make: string
  model: string
  active: boolean
  totalUnits: number
}

export const ADMIN_USERS: AdminUser[] = [
  { id:'u1', name:'Jose Santos',    email:'jose.santos@company.com',   role:'ADMIN',            site:'Austin HQ',     siteCode:'ATX', active:true,  lastLogin:'Just now',   orgs:['Demo','Production'] },
  { id:'u2', name:'Kira Valdez',    email:'kira.valdez@company.com',   role:'SITE_MANAGER',     site:'Denver',        siteCode:'DEN', active:true,  lastLogin:'2 hours ago',orgs:['Demo','Production'] },
  { id:'u3', name:'Marcus Torres',  email:'marcus.t@company.com',      role:'TECHNICIAN',       site:'Chicago',       siteCode:'CHI', active:true,  lastLogin:'1 day ago',  orgs:['Production'] },
  { id:'u4', name:'James Park',     email:'james.p@company.com',       role:'TECHNICIAN',       site:'New York',      siteCode:'NYC', active:true,  lastLogin:'3 hours ago',orgs:['Production'] },
  { id:'u5', name:'Sara Mitchell',  email:'sara.m@company.com',        role:'REGIONAL_MANAGER', site:'Austin HQ',     siteCode:'ATX', active:true,  lastLogin:'5 hours ago',orgs:['Demo','Production'] },
  { id:'u6', name:'Anna Kim',       email:'anna.k@company.com',        role:'SITE_MANAGER',     site:'Boston',        siteCode:'BOS', active:true,  lastLogin:'1 day ago',  orgs:['Production'] },
  { id:'u7', name:'Tom Rivera',     email:'tom.r@company.com',         role:'TECHNICIAN',       site:'San Francisco', siteCode:'SFO', active:false, lastLogin:'2 weeks ago',orgs:['Production'] },
  { id:'u8', name:'Demo User',      email:'demo@company.com',          role:'TECHNICIAN',       site:'Austin HQ',     siteCode:'ATX', active:true,  lastLogin:'1 hour ago', orgs:['Demo'] },
]

export const ADMIN_LOCATIONS: AdminLocation[] = [
  { id:'loc_atx', name:'Austin HQ',     code:'ATX', address:'1234 Congress Ave, Austin TX 78701',         timezone:'America/Chicago',       active:true,  totalAssets:312, activeUsers:14 },
  { id:'loc_chi', name:'Chicago',        code:'CHI', address:'111 W Wacker Dr, Chicago IL 60601',           timezone:'America/Chicago',       active:true,  totalAssets:218, activeUsers:8  },
  { id:'loc_sea', name:'Seattle',        code:'SEA', address:'400 Broad St, Seattle WA 98109',              timezone:'America/Los_Angeles',   active:true,  totalAssets:248, activeUsers:10 },
  { id:'loc_den', name:'Denver',         code:'DEN', address:'1700 Lincoln St, Denver CO 80203',            timezone:'America/Denver',        active:true,  totalAssets:71,  activeUsers:4  },
  { id:'loc_nyc', name:'New York',       code:'NYC', address:'1 World Trade Center, New York NY 10007',     timezone:'America/New_York',      active:true,  totalAssets:168, activeUsers:7  },
  { id:'loc_sfo', name:'San Francisco',  code:'SFO', address:'1 Market St, San Francisco CA 94105',        timezone:'America/Los_Angeles',   active:true,  totalAssets:183, activeUsers:6  },
  { id:'loc_bos', name:'Boston',         code:'BOS', address:'100 Federal St, Boston MA 02110',             timezone:'America/New_York',      active:true,  totalAssets:149, activeUsers:5  },
  { id:'loc_mia', name:'Miami',          code:'MIA', address:'200 S Biscayne Blvd, Miami FL 33131',         timezone:'America/New_York',      active:true,  totalAssets:44,  activeUsers:3  },
]

export const ADMIN_ITEMS: AdminItem[] = [
  { id:'item_mbp14',      name:'MacBook Pro 14" M3',   category:'Laptop',    type:'SERIALIZED', make:'Apple',  model:'MacBook Pro 14" M3 Pro', active:true, totalUnits:52  },
  { id:'item_dell5540',   name:'Dell Latitude 5540',   category:'Laptop',    type:'SERIALIZED', make:'Dell',   model:'Latitude 5540',          active:true, totalUnits:38  },
  { id:'item_iphone15',   name:'iPhone 15 Pro',        category:'Phone',     type:'SERIALIZED', make:'Apple',  model:'iPhone 15 Pro 256GB',    active:true, totalUnits:29  },
  { id:'item_ipadpro',    name:'iPad Pro 12.9"',       category:'Tablet',    type:'SERIALIZED', make:'Apple',  model:'iPad Pro 12.9" M2',      active:true, totalUnits:14  },
  { id:'item_dellmon',    name:'Dell 27" Monitor',     category:'Monitor',   type:'SERIALIZED', make:'Dell',   model:'P2723QE',                active:true, totalUnits:67  },
  { id:'item_magickb',    name:'Apple Magic Keyboard', category:'Accessory', type:'QUANTITY',   make:'Apple',  model:'Magic Keyboard Touch ID', active:true, totalUnits:114 },
  { id:'item_usbc96w',    name:'USB-C Charger 96W',    category:'Accessory', type:'QUANTITY',   make:'Apple',  model:'96W USB-C Power Adapter',active:true, totalUnits:88  },
  { id:'item_usbccable',  name:'USB-C Cable 2m',       category:'Accessory', type:'QUANTITY',   make:'Anker',  model:'Powerline III 2m',       active:true, totalUnits:145 },
  { id:'item_mxkeys',     name:'Logitech MX Keys',     category:'Accessory', type:'QUANTITY',   make:'Logi',   model:'MX Keys for Business',   active:false,totalUnits:12  },
]

export const ROLES = ['TECHNICIAN','SITE_MANAGER','REGIONAL_MANAGER','ADMIN'] as const
export const ROLE_LABELS: Record<string, string> = {
  TECHNICIAN:       'Technician',
  SITE_MANAGER:     'Site Manager',
  REGIONAL_MANAGER: 'Regional Manager',
  ADMIN:            'Admin',
}
export const ROLE_COLORS: Record<string, string> = {
  TECHNICIAN:       '#8b949e',
  SITE_MANAGER:     '#3B8BFA',
  REGIONAL_MANAGER: '#2ABFA0',
  ADMIN:            '#E8407A',
}
export const CATEGORIES = ['Laptop','Phone','Tablet','Monitor','Accessory']
