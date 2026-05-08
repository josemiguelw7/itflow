// lib/data/demo.ts
// Complete demo dataset — 8 locations, full inventory, requests, shipments

export const DEMO_ACCOUNTS = [
  {
    role:     'TECHNICIAN' as const,
    name:     'Alex Rivera',
    email:    'tech@itflow-demo.com',
    password: 'Demo1234!',
    site:     'Austin HQ',
    siteCode: 'ATX',
    avatar:   'AR',
    color:    '#8b949e',
    desc:     'Search inventory, submit requests, ship & receive',
  },
  {
    role:     'SITE_MANAGER' as const,
    name:     'Jordan Kim',
    email:    'manager@itflow-demo.com',
    password: 'Demo1234!',
    site:     'Chicago',
    siteCode: 'CHI',
    avatar:   'JK',
    color:    '#3B8BFA',
    desc:     'Approve requests, monitor site health, manage team',
  },
  {
    role:     'REGIONAL_MANAGER' as const,
    name:     'Sam Torres',
    email:    'regional@itflow-demo.com',
    password: 'Demo1234!',
    site:     'Austin HQ',
    siteCode: 'ATX',
    avatar:   'ST',
    color:    '#2ABFA0',
    desc:     'Cross-site visibility, balance inventory, view trends',
  },
  {
    role:     'ADMIN' as const,
    name:     'Morgan Chen',
    email:    'admin@itflow-demo.com',
    password: 'Demo1234!',
    site:     'Austin HQ',
    siteCode: 'ATX',
    avatar:   'MC',
    color:    '#E8407A',
    desc:     'Full access — users, catalog, integrations, all sites',
  },
]

export const DEMO_LOCATIONS = [
  { id:'loc_atx', name:'Austin HQ',     code:'ATX', address:'1234 Congress Ave, Austin TX 78701',              timezone:'America/Chicago',     region:'South',     employees:142, itStaff:6  },
  { id:'loc_chi', name:'Chicago',        code:'CHI', address:'111 W Wacker Dr, Chicago IL 60601',               timezone:'America/Chicago',     region:'Midwest',   employees:98,  itStaff:4  },
  { id:'loc_sea', name:'Seattle',        code:'SEA', address:'400 Broad St, Seattle WA 98109',                  timezone:'America/Los_Angeles', region:'Northwest', employees:87,  itStaff:4  },
  { id:'loc_den', name:'Denver',         code:'DEN', address:'1700 Lincoln St, Denver CO 80203',                timezone:'America/Denver',      region:'Mountain',  employees:54,  itStaff:2  },
  { id:'loc_nyc', name:'New York',       code:'NYC', address:'1 World Trade Center, New York NY 10007',         timezone:'America/New_York',    region:'Northeast', employees:116, itStaff:5  },
  { id:'loc_sfo', name:'San Francisco',  code:'SFO', address:'1 Market St, San Francisco CA 94105',            timezone:'America/Los_Angeles', region:'West',      employees:73,  itStaff:3  },
  { id:'loc_bos', name:'Boston',         code:'BOS', address:'100 Federal St, Boston MA 02110',                 timezone:'America/New_York',    region:'Northeast', employees:61,  itStaff:3  },
  { id:'loc_mia', name:'Miami',          code:'MIA', address:'200 S Biscayne Blvd, Miami FL 33131',             timezone:'America/New_York',    region:'South',     employees:48,  itStaff:2  },
]

export const DEMO_ITEMS = [
  { id:'i1',  name:'MacBook Pro 14" M3',       category:'Laptop',    type:'SERIALIZED', make:'Apple',     model:'MacBook Pro 14" M3 Pro', icon:'💻' },
  { id:'i2',  name:'MacBook Air 15" M2',        category:'Laptop',    type:'SERIALIZED', make:'Apple',     model:'MacBook Air 15" M2',     icon:'💻' },
  { id:'i3',  name:'Dell Latitude 5540',        category:'Laptop',    type:'SERIALIZED', make:'Dell',      model:'Latitude 5540',          icon:'💻' },
  { id:'i4',  name:'Lenovo ThinkPad X1',        category:'Laptop',    type:'SERIALIZED', make:'Lenovo',    model:'ThinkPad X1 Carbon',     icon:'💻' },
  { id:'i5',  name:'iPhone 15 Pro',             category:'Phone',     type:'SERIALIZED', make:'Apple',     model:'iPhone 15 Pro 256GB',    icon:'📱' },
  { id:'i6',  name:'iPhone 15',                 category:'Phone',     type:'SERIALIZED', make:'Apple',     model:'iPhone 15 128GB',        icon:'📱' },
  { id:'i7',  name:'iPad Pro 12.9"',            category:'Tablet',    type:'SERIALIZED', make:'Apple',     model:'iPad Pro 12.9" M2',      icon:'⊞' },
  { id:'i8',  name:'Dell 27" Monitor',          category:'Monitor',   type:'SERIALIZED', make:'Dell',      model:'P2723QE 4K',             icon:'🖥' },
  { id:'i9',  name:'LG 32" Monitor',            category:'Monitor',   type:'SERIALIZED', make:'LG',        model:'32UN880-B',              icon:'🖥' },
  { id:'i10', name:'Apple Magic Keyboard',      category:'Accessory', type:'QUANTITY',   make:'Apple',     model:'Magic Keyboard Touch ID', icon:'⌨' },
  { id:'i11', name:'Logitech MX Keys',          category:'Accessory', type:'QUANTITY',   make:'Logitech',  model:'MX Keys for Business',   icon:'⌨' },
  { id:'i12', name:'USB-C Charger 96W',         category:'Accessory', type:'QUANTITY',   make:'Apple',     model:'96W USB-C Power Adapter', icon:'🔌' },
  { id:'i13', name:'USB-C Cable 2m',            category:'Accessory', type:'QUANTITY',   make:'Anker',     model:'Powerline III 2m',       icon:'🔌' },
  { id:'i14', name:'Apple Magic Mouse',         category:'Accessory', type:'QUANTITY',   make:'Apple',     model:'Magic Mouse',            icon:'🖱' },
  { id:'i15', name:'Logitech MX Master 3',      category:'Accessory', type:'QUANTITY',   make:'Logitech',  model:'MX Master 3 for Business', icon:'🖱' },
]

// Serialized assets — spread across 8 sites
export const DEMO_ASSETS = [
  // Austin HQ — well stocked
  { id:'a001', tag:'ATX-MBP-001', serial:'C02XK1ATX01', item:'i1', site:'loc_atx', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a002', tag:'ATX-MBP-002', serial:'C02XK1ATX02', item:'i1', site:'loc_atx', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a003', tag:'ATX-MBP-003', serial:'C02XK1ATX03', item:'i1', site:'loc_atx', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a004', tag:'ATX-MBP-004', serial:'C02XK1ATX04', item:'i1', site:'loc_atx', status:'RESERVED',     condition:'GOOD' },
  { id:'a005', tag:'ATX-MBA-001', serial:'C02M1BATX01', item:'i2', site:'loc_atx', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a006', tag:'ATX-MBA-002', serial:'C02M1BATX02', item:'i2', site:'loc_atx', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a007', tag:'ATX-IPH-001', serial:'F2LATX00001', item:'i5', site:'loc_atx', status:'PENDING_WIPE', condition:'GOOD' },
  { id:'a008', tag:'ATX-IPH-002', serial:'F2LATX00002', item:'i5', site:'loc_atx', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a009', tag:'ATX-IPH-003', serial:'F2LATX00003', item:'i6', site:'loc_atx', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a010', tag:'ATX-TAB-001', serial:'DMPRATX0001', item:'i7', site:'loc_atx', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a011', tag:'ATX-MON-001', serial:'DMON27ATX01', item:'i8', site:'loc_atx', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a012', tag:'ATX-MON-002', serial:'DMON27ATX02', item:'i8', site:'loc_atx', status:'AVAILABLE',    condition:'NEW'  },
  // Chicago
  { id:'a013', tag:'CHI-MBP-001', serial:'C02XK1CHI01', item:'i1', site:'loc_chi', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a014', tag:'CHI-MBP-002', serial:'C02XK1CHI02', item:'i1', site:'loc_chi', status:'RESERVED',     condition:'GOOD' },
  { id:'a015', tag:'CHI-DEL-001', serial:'DLAT55CHI01', item:'i3', site:'loc_chi', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a016', tag:'CHI-DEL-002', serial:'DLAT55CHI02', item:'i3', site:'loc_chi', status:'AVAILABLE',    condition:'FAIR' },
  { id:'a017', tag:'CHI-IPH-001', serial:'F2LCHI00001', item:'i5', site:'loc_chi', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a018', tag:'CHI-MON-001', serial:'DMON27CHI01', item:'i8', site:'loc_chi', status:'IN_TRANSIT',   condition:'NEW'  },
  // Seattle
  { id:'a019', tag:'SEA-MBP-001', serial:'C02XK1SEA01', item:'i1', site:'loc_sea', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a020', tag:'SEA-MBA-001', serial:'C02M1BSEA01', item:'i2', site:'loc_sea', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a021', tag:'SEA-LTP-001', serial:'TPXCSEA0001', item:'i4', site:'loc_sea', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a022', tag:'SEA-IPH-001', serial:'F2LSEA00001', item:'i6', site:'loc_sea', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a023', tag:'SEA-MON-001', serial:'LG32BSEA001', item:'i9', site:'loc_sea', status:'AVAILABLE',    condition:'GOOD' },
  // Denver — low stock (needs restocking)
  { id:'a024', tag:'DEN-MBP-001', serial:'C02XK1DEN01', item:'i1', site:'loc_den', status:'RESERVED',     condition:'FAIR' },
  { id:'a025', tag:'DEN-DEL-001', serial:'DLAT55DEN01', item:'i3', site:'loc_den', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a026', tag:'DEN-IPH-001', serial:'F2LDEN00001', item:'i5', site:'loc_den', status:'AVAILABLE',    condition:'POOR' },
  // New York
  { id:'a027', tag:'NYC-MBP-001', serial:'C02XK1NYC01', item:'i1', site:'loc_nyc', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a028', tag:'NYC-MBP-002', serial:'C02XK1NYC02', item:'i1', site:'loc_nyc', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a029', tag:'NYC-LTP-001', serial:'TPXCNYC0001', item:'i4', site:'loc_nyc', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a030', tag:'NYC-IPH-001', serial:'F2LNYC00001', item:'i5', site:'loc_nyc', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a031', tag:'NYC-TAB-001', serial:'DMPANYC0001', item:'i7', site:'loc_nyc', status:'PENDING_WIPE', condition:'GOOD' },
  { id:'a032', tag:'NYC-MON-001', serial:'DMON27NYC01', item:'i8', site:'loc_nyc', status:'AVAILABLE',    condition:'GOOD' },
  // San Francisco
  { id:'a033', tag:'SFO-MBA-001', serial:'C02M1BSFO01', item:'i2', site:'loc_sfo', status:'AVAILABLE',    condition:'NEW'  },
  { id:'a034', tag:'SFO-MBA-002', serial:'C02M1BSFO02', item:'i2', site:'loc_sfo', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a035', tag:'SFO-IPH-001', serial:'F2LSFO00001', item:'i6', site:'loc_sfo', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a036', tag:'SFO-MON-001', serial:'DMON27SFO01', item:'i8', site:'loc_sfo', status:'DAMAGED',      condition:'POOR' },
  { id:'a037', tag:'SFO-MON-002', serial:'LG32BSFO001', item:'i9', site:'loc_sfo', status:'AVAILABLE',    condition:'GOOD' },
  // Boston
  { id:'a038', tag:'BOS-MBP-001', serial:'C02XK1BOS01', item:'i1', site:'loc_bos', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a039', tag:'BOS-DEL-001', serial:'DLAT55BOS01', item:'i3', site:'loc_bos', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a040', tag:'BOS-TAB-001', serial:'DMPABOS0001', item:'i7', site:'loc_bos', status:'READY',        condition:'GOOD' },
  { id:'a041', tag:'BOS-IPH-001', serial:'F2LBOS00001', item:'i5', site:'loc_bos', status:'AVAILABLE',    condition:'NEW'  },
  // Miami — critically low
  { id:'a042', tag:'MIA-MBA-001', serial:'C02M1BMIA01', item:'i2', site:'loc_mia', status:'AVAILABLE',    condition:'FAIR' },
  { id:'a043', tag:'MIA-IPH-001', serial:'F2LMIA00001', item:'i6', site:'loc_mia', status:'AVAILABLE',    condition:'GOOD' },
  { id:'a044', tag:'MIA-MON-001', serial:'DMON27MIA01', item:'i8', site:'loc_mia', status:'RESERVED',     condition:'GOOD' },
]

// Quantity stock per location
export const DEMO_STOCK = [
  // Austin HQ
  { item:'i10', site:'loc_atx', total:42, available:34, reserved:4, inTransit:4 },
  { item:'i11', site:'loc_atx', total:18, available:14, reserved:2, inTransit:2 },
  { item:'i12', site:'loc_atx', total:55, available:40, reserved:8, inTransit:7 },
  { item:'i13', site:'loc_atx', total:80, available:68, reserved:6, inTransit:6 },
  { item:'i14', site:'loc_atx', total:30, available:24, reserved:4, inTransit:2 },
  { item:'i15', site:'loc_atx', total:22, available:18, reserved:2, inTransit:2 },
  // Chicago
  { item:'i10', site:'loc_chi', total:20, available:14, reserved:4, inTransit:2  },
  { item:'i12', site:'loc_chi', total:28, available:22, reserved:4, inTransit:2  },
  { item:'i13', site:'loc_chi', total:35, available:28, reserved:5, inTransit:2  },
  { item:'i15', site:'loc_chi', total:12, available:9,  reserved:2, inTransit:1  },
  // Seattle
  { item:'i10', site:'loc_sea', total:16, available:13, reserved:2, inTransit:1  },
  { item:'i12', site:'loc_sea', total:24, available:19, reserved:3, inTransit:2  },
  { item:'i13', site:'loc_sea', total:45, available:40, reserved:3, inTransit:2  },
  // Denver — low
  { item:'i10', site:'loc_den', total:6,  available:2,  reserved:2, inTransit:2  },
  { item:'i12', site:'loc_den', total:8,  available:3,  reserved:3, inTransit:2  },
  { item:'i13', site:'loc_den', total:12, available:8,  reserved:3, inTransit:1  },
  // New York
  { item:'i10', site:'loc_nyc', total:24, available:18, reserved:4, inTransit:2  },
  { item:'i11', site:'loc_nyc', total:14, available:10, reserved:3, inTransit:1  },
  { item:'i12', site:'loc_nyc', total:32, available:25, reserved:5, inTransit:2  },
  { item:'i14', site:'loc_nyc', total:18, available:14, reserved:3, inTransit:1  },
  // San Francisco
  { item:'i10', site:'loc_sfo', total:14, available:11, reserved:2, inTransit:1  },
  { item:'i12', site:'loc_sfo', total:20, available:15, reserved:3, inTransit:2  },
  { item:'i15', site:'loc_sfo', total:10, available:8,  reserved:1, inTransit:1  },
  // Boston
  { item:'i10', site:'loc_bos', total:12, available:9,  reserved:2, inTransit:1  },
  { item:'i12', site:'loc_bos', total:16, available:12, reserved:3, inTransit:1  },
  { item:'i13', site:'loc_bos', total:20, available:16, reserved:3, inTransit:1  },
  // Miami — critically low
  { item:'i10', site:'loc_mia', total:4,  available:1,  reserved:2, inTransit:1  },
  { item:'i12', site:'loc_mia', total:6,  available:2,  reserved:2, inTransit:2  },
  { item:'i13', site:'loc_mia', total:8,  available:4,  reserved:3, inTransit:1  },
]

export const DEMO_REQUESTS = [
  { id:'REQ-0041', item:'MacBook Pro 14" M3', icon:'💻', qty:2,  from:'Denver',        fromCode:'DEN', to:'Austin HQ',     toCode:'ATX', status:'SUBMITTED', priority:'URGENT', requester:'Kira V.',   jira:'IT-441', created:'2 hours ago',  updated:'2 hours ago'  },
  { id:'REQ-0040', item:'Dell 27" Monitor',   icon:'🖥',  qty:4,  from:'Austin HQ',     fromCode:'ATX', to:'Chicago',       toCode:'CHI', status:'APPROVED',  priority:'NORMAL', requester:'Marcus T.', jira:'IT-440', created:'5 hours ago',  updated:'1 hour ago'   },
  { id:'REQ-0039', item:'Magic Keyboard ×10', icon:'⌨',  qty:10, from:'Austin HQ',     fromCode:'ATX', to:'Seattle',       toCode:'SEA', status:'RESERVED',  priority:'NORMAL', requester:'Auto',      jira:'IT-439', created:'6 hours ago',  updated:'3 hours ago'  },
  { id:'REQ-0038', item:'iPhone 15 Pro',      icon:'📱', qty:1,  from:'New York',       fromCode:'NYC', to:'Austin HQ',    toCode:'ATX', status:'SHIPPED',   priority:'NORMAL', requester:'James P.',  jira:'IT-438', created:'1 day ago',    updated:'4 hours ago'  },
  { id:'REQ-0037', item:'USB-C Charger ×6',   icon:'🔌', qty:6,  from:'Austin HQ',     fromCode:'ATX', to:'Miami',         toCode:'MIA', status:'SUBMITTED', priority:'LOW',    requester:'Auto',      jira:'IT-437', created:'1 day ago',    updated:'1 day ago'    },
  { id:'REQ-0036', item:'MacBook Air 15" M2', icon:'💻', qty:3,  from:'Chicago',        fromCode:'CHI', to:'Boston',        toCode:'BOS', status:'COMPLETED', priority:'HIGH',   requester:'Anna K.',   jira:'IT-436', created:'2 days ago',   updated:'1 day ago'    },
  { id:'REQ-0035', item:'iPad Pro 12.9"',     icon:'⊞',  qty:2,  from:'San Francisco', fromCode:'SFO', to:'Denver',        toCode:'DEN', status:'REJECTED',  priority:'NORMAL', requester:'Tom R.',    jira:'IT-435', created:'3 days ago',   updated:'2 days ago'   },
  { id:'REQ-0034', item:'ThinkPad X1',        icon:'💻', qty:1,  from:'Seattle',        fromCode:'SEA', to:'New York',      toCode:'NYC', status:'COMPLETED', priority:'HIGH',   requester:'Sara M.',   jira:'IT-434', created:'4 days ago',   updated:'3 days ago'   },
  { id:'REQ-0033', item:'LG 32" Monitor',     icon:'🖥',  qty:2,  from:'Boston',         fromCode:'BOS', to:'Chicago',       toCode:'CHI', status:'SHIPPED',   priority:'NORMAL', requester:'Lee H.',    jira:'IT-433', created:'5 days ago',   updated:'2 days ago'   },
  { id:'REQ-0032', item:'Magic Mouse ×8',     icon:'🖱',  qty:8,  from:'Austin HQ',     fromCode:'ATX', to:'San Francisco', toCode:'SFO', status:'COMPLETED', priority:'LOW',    requester:'Auto',      jira:'IT-432', created:'6 days ago',   updated:'4 days ago'   },
]

export const DEMO_SHIPMENTS = [
  { id:'SHP-0441', reqId:'REQ-0038', from:'Chicago',       fromCode:'CHI', to:'Austin HQ',    toCode:'ATX', status:'IN_TRANSIT', carrier:'FedEx', tracking:'784912345678',     items:[{name:'MacBook Pro 14"',icon:'💻',qty:3}], shipped:'2 days ago',  eta:'Tomorrow',   steps:3 },
  { id:'SHP-0440', reqId:'REQ-0039', from:'Austin HQ',    fromCode:'ATX', to:'Seattle',       toCode:'SEA', status:'SHIPPED',    carrier:'UPS',   tracking:'1Z999AA101234567', items:[{name:'Magic Keyboard',icon:'⌨',qty:10},{name:'USB-C Charger',icon:'🔌',qty:5}], shipped:'1 day ago',   eta:'In 2 days', steps:2 },
  { id:'SHP-0439', reqId:'REQ-0040', from:'Austin HQ',    fromCode:'ATX', to:'Denver',        toCode:'DEN', status:'PREPARING',  carrier:'FedEx', tracking:'',                items:[{name:'iPhone 15 Pro',icon:'📱',qty:1},{name:'Magic Keyboard',icon:'⌨',qty:4}], shipped:'',            eta:'',          steps:0 },
  { id:'SHP-0438', reqId:'REQ-0033', from:'Seattle',       fromCode:'SEA', to:'Austin HQ',    toCode:'ATX', status:'DELIVERED',  carrier:'FedEx', tracking:'784956781234',     items:[{name:'Dell Latitude',icon:'💻',qty:2}], shipped:'3 days ago',  eta:'Yesterday',  steps:4 },
  { id:'SHP-0437', reqId:null,       from:'New York',      fromCode:'NYC', to:'Miami',         toCode:'MIA', status:'EXCEPTION',  carrier:'USPS',  tracking:'94001118992234567',items:[{name:'Dell Monitor',icon:'🖥',qty:2}],  shipped:'4 days ago',  eta:'',           steps:2, note:'Package damaged — carrier claim filed' },
  { id:'SHP-0436', reqId:'REQ-0032', from:'Boston',        fromCode:'BOS', to:'Chicago',       toCode:'CHI', status:'RECEIVED',   carrier:'UPS',   tracking:'1Z999AA109876543', items:[{name:'iPad Pro',icon:'⊞',qty:3}],       shipped:'5 days ago',  eta:'',           steps:5, received:'2 days ago' },
]

export const DEMO_ACTIVITY = [
  { dot:'#39D353', text:'SHP-0438 delivered to Austin HQ',         sub:'2× Dell Latitude — awaiting receipt',      time:'2m'  },
  { dot:'#3B8BFA', text:'Marcus T. submitted REQ-0040',            sub:'4× Dell Monitor → Chicago',                time:'14m' },
  { dot:'#2ABFA0', text:'SHP-0441 picked up by FedEx',             sub:'Chicago depot',                            time:'38m' },
  { dot:'#F5A623', text:'Denver stock alert — Magic Keyboard',     sub:'2 units remaining (threshold: 5)',          time:'1h'  },
  { dot:'#FF6B2B', text:'Kira V. escalated REQ-0041 to URGENT',    sub:'MacBook Pro needed by Friday',              time:'2h'  },
  { dot:'#39D353', text:'12× USB-C Chargers wipe complete at ATX', sub:'Status updated → Available',               time:'3h'  },
  { dot:'#3B8BFA', text:'James P. approved REQ-0038',              sub:'iPhone 15 Pro NYC → Austin HQ',            time:'4h'  },
  { dot:'#E8407A', text:'SHP-0432 received at Miami',              sub:'Inventory updated',                        time:'5h'  },
  { dot:'#2ABFA0', text:'Anna K. created REQ-0036',                sub:'MacBook Air 15" CHI → Boston',             time:'6h'  },
  { dot:'#B06BC8', text:'BOS-TAB-001 wipe complete',               sub:'iPad Pro → Ready',                         time:'7h'  },
]
