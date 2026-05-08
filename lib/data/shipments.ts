export type ShipmentStatus = 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'EXCEPTION' | 'DELIVERED' | 'RECEIVED'

export interface Shipment {
  id: string
  requestId?: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  status: ShipmentStatus
  carrier?: string
  trackingNumber?: string
  items: { name: string; icon: string; quantity: number }[]
  shippedAt?: string
  estimatedArrival?: string
  receivedAt?: string
  receiverNotes?: string
  createdAt: string
  updatedAt: string
}

export const SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-0441', requestId: 'REQ-0038',
    origin: 'Chicago', originCode: 'CHI',
    destination: 'Austin HQ', destinationCode: 'ATX',
    status: 'IN_TRANSIT', carrier: 'FedEx', trackingNumber: '784912345678',
    items: [{ name: 'MacBook Pro 14"', icon: '💻', quantity: 3 }],
    shippedAt: '2 days ago', estimatedArrival: 'Tomorrow',
    createdAt: '3 days ago', updatedAt: '2 days ago',
  },
  {
    id: 'SHP-0440', requestId: 'REQ-0039',
    origin: 'Austin HQ', originCode: 'ATX',
    destination: 'Seattle', destinationCode: 'SEA',
    status: 'SHIPPED', carrier: 'UPS', trackingNumber: '1Z999AA10123456784',
    items: [
      { name: 'Magic Keyboard', icon: '⌨', quantity: 10 },
      { name: 'USB-C Charger', icon: '🔌', quantity: 5 },
    ],
    shippedAt: '1 day ago', estimatedArrival: 'In 2 days',
    createdAt: '2 days ago', updatedAt: '1 day ago',
  },
  {
    id: 'SHP-0439', requestId: 'REQ-0040',
    origin: 'Austin HQ', originCode: 'ATX',
    destination: 'Denver', destinationCode: 'DEN',
    status: 'PREPARING',
    items: [
      { name: 'iPhone 15 Pro', icon: '📱', quantity: 1 },
      { name: 'Magic Keyboard', icon: '⌨', quantity: 4 },
    ],
    createdAt: '5 hours ago', updatedAt: '5 hours ago',
  },
  {
    id: 'SHP-0438', requestId: 'REQ-0036',
    origin: 'Seattle', originCode: 'SEA',
    destination: 'Austin HQ', destinationCode: 'ATX',
    status: 'DELIVERED', carrier: 'FedEx', trackingNumber: '784956781234',
    items: [{ name: 'Dell Latitude 5540', icon: '💻', quantity: 2 }],
    shippedAt: '3 days ago', estimatedArrival: 'Yesterday',
    createdAt: '4 days ago', updatedAt: '1 day ago',
  },
  {
    id: 'SHP-0437',
    origin: 'New York', originCode: 'NYC',
    destination: 'Miami', destinationCode: 'MIA',
    status: 'EXCEPTION', carrier: 'USPS', trackingNumber: '9400111899223456789',
    items: [{ name: 'Dell 27" Monitor', icon: '🖥', quantity: 2 }],
    shippedAt: '4 days ago',
    receiverNotes: 'Package damaged in transit — filed claim with carrier',
    createdAt: '5 days ago', updatedAt: '2 days ago',
  },
  {
    id: 'SHP-0436', requestId: 'REQ-0034',
    origin: 'Boston', originCode: 'BOS',
    destination: 'Chicago', destinationCode: 'CHI',
    status: 'RECEIVED', carrier: 'UPS', trackingNumber: '1Z999AA10987654321',
    items: [{ name: 'iPad Pro 12.9"', icon: '⊞', quantity: 3 }],
    shippedAt: '5 days ago', receivedAt: '2 days ago',
    receiverNotes: 'All items received in good condition',
    createdAt: '6 days ago', updatedAt: '2 days ago',
  },
]

export const STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: string; bg: string; step: number }> = {
  PREPARING:  { label: 'Preparing',    color: '#F5A623', bg: 'rgba(245,166,35,0.12)',  step: 0 },
  SHIPPED:    { label: 'Shipped',      color: '#3B8BFA', bg: 'rgba(59,139,250,0.12)',  step: 1 },
  IN_TRANSIT: { label: 'In transit',   color: '#00D4FF', bg: 'rgba(0,212,255,0.12)',   step: 2 },
  EXCEPTION:  { label: 'Exception',    color: '#FF6B2B', bg: 'rgba(255,107,43,0.12)',  step: 2 },
  DELIVERED:  { label: 'Delivered',    color: '#2ABFA0', bg: 'rgba(42,191,160,0.12)',  step: 3 },
  RECEIVED:   { label: 'Received',     color: '#39D353', bg: 'rgba(57,211,83,0.12)',   step: 4 },
}

export const CARRIERS = ['FedEx', 'UPS', 'USPS', 'DHL', 'OnTrac', 'Other']
export const SITES_LIST = ['Austin HQ','Chicago','Seattle','Denver','New York','San Francisco','Boston','Miami']
