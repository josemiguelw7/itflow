// lib/permissions.ts
// Single source of truth for all role-based access control
// Every UI component and page reads from here

export type Role = 'TECHNICIAN' | 'SITE_MANAGER' | 'REGIONAL_MANAGER' | 'ADMIN'

export interface Permissions {
  // Inventory
  viewInventory:        boolean
  editAsset:            boolean   // edit details, condition, notes
  createAsset:          boolean   // add new asset to catalog
  deleteAsset:          boolean   // retire/remove asset

  // Requests
  submitRequest:        boolean   // submit transfer or purchase
  approveTransfer:      boolean   // approve TRANSFER type requests
  approvePurchase:      boolean   // approve PURCHASE type requests
  rejectRequest:        boolean   // reject any request

  // Shipments
  createShipment:       boolean
  markShipped:          boolean
  markReceived:         boolean
  flagException:        boolean

  // Reports
  viewReports:          boolean   // read-only for lower roles

  // Admin — Users
  viewUsers:            boolean
  manageUsers:          boolean   // add, edit, deactivate users

  // Admin — Locations
  viewLocations:        boolean
  manageLocations:      boolean   // add, edit, deactivate sites

  // Admin — Catalog
  viewCatalog:          boolean
  manageCatalog:        boolean   // add, edit, disable catalog items

  // Admin — Integrations
  manageIntegrations:   boolean   // Jira, Slack, Okta config
}

const TECHNICIAN: Permissions = {
  viewInventory:      true,
  editAsset:          true,
  createAsset:        false,
  deleteAsset:        false,

  submitRequest:      true,
  approveTransfer:    false,
  approvePurchase:    false,
  rejectRequest:      false,

  createShipment:     true,
  markShipped:        true,
  markReceived:       true,
  flagException:      true,

  viewReports:        true,   // read-only

  viewUsers:          false,
  manageUsers:        false,
  viewLocations:      false,
  manageLocations:    false,
  viewCatalog:        false,
  manageCatalog:      false,
  manageIntegrations: false,
}

const SITE_MANAGER: Permissions = {
  viewInventory:      true,
  editAsset:          true,
  createAsset:        false,
  deleteAsset:        false,

  submitRequest:      true,
  approveTransfer:    true,   // Dave approves transfers
  approvePurchase:    false,
  rejectRequest:      true,

  createShipment:     true,
  markShipped:        true,
  markReceived:       true,
  flagException:      true,

  viewReports:        true,

  viewUsers:          true,
  manageUsers:        true,
  viewLocations:      true,
  manageLocations:    true,
  viewCatalog:        true,
  manageCatalog:      true,   // read + edit catalog
  manageIntegrations: false,
}

const REGIONAL_MANAGER: Permissions = {
  viewInventory:      true,
  editAsset:          true,
  createAsset:        false,
  deleteAsset:        false,

  submitRequest:      true,
  approveTransfer:    true,
  approvePurchase:    true,   // Abe approves purchases
  rejectRequest:      true,

  createShipment:     true,
  markShipped:        true,
  markReceived:       true,
  flagException:      true,

  viewReports:        true,

  viewUsers:          true,
  manageUsers:        true,
  viewLocations:      true,
  manageLocations:    true,
  viewCatalog:        true,
  manageCatalog:      true,
  manageIntegrations: false,
}

const ADMIN: Permissions = {
  viewInventory:      true,
  editAsset:          true,
  createAsset:        true,
  deleteAsset:        true,

  submitRequest:      true,
  approveTransfer:    true,
  approvePurchase:    true,
  rejectRequest:      true,

  createShipment:     true,
  markShipped:        true,
  markReceived:       true,
  flagException:      true,

  viewReports:        true,

  viewUsers:          true,
  manageUsers:        true,
  viewLocations:      true,
  manageLocations:    true,
  viewCatalog:        true,
  manageCatalog:      true,
  manageIntegrations: true,
}

export const ROLE_PERMISSIONS: Record<Role, Permissions> = {
  TECHNICIAN:       TECHNICIAN,
  SITE_MANAGER:     SITE_MANAGER,
  REGIONAL_MANAGER: REGIONAL_MANAGER,
  ADMIN:            ADMIN,
}

export function getPermissions(role: string): Permissions {
  return ROLE_PERMISSIONS[role as Role] ?? TECHNICIAN
}

// Role display info
export const ROLE_META: Record<Role, { label: string; color: string; name: string }> = {
  TECHNICIAN:       { label: 'Technician', color: '#8b949e', name: 'Alex Rivera' },
  SITE_MANAGER:     { label: 'Supervisor', color: '#3B8BFA', name: 'Dave'        },
  REGIONAL_MANAGER: { label: 'Manager',    color: '#2ABFA0', name: 'Abe'         },
  ADMIN:            { label: 'Admin',      color: '#E8407A', name: 'Morgan Chen' },
}
