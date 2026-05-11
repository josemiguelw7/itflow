// lib/permissions.ts
// Single source of truth for role-based access control
// Import this anywhere in the app to check permissions

export type UserRole = 'TECHNICIAN' | 'SITE_MANAGER' | 'REGIONAL_MANAGER' | 'ADMIN'

export interface Permission {
  // Requests
  canSubmitRequest:      boolean
  canApproveTransfer:    boolean  // Dave (Supervisor) and up
  canApprovePurchase:    boolean  // Abe (Manager) and up
  canRejectRequest:      boolean
  // Inventory
  canViewInventory:      boolean
  canEditAsset:          boolean  // Technician and up — no create/delete
  canCreateAsset:        boolean  // Admin only
  canDeleteAsset:        boolean  // Admin only
  // Shipments
  canCreateShipment:     boolean
  canMarkShipped:        boolean
  canMarkReceived:       boolean
  canFlagException:      boolean
  // Reports — read only for all
  canViewReports:        boolean
  // Admin panel
  canViewCatalog:        boolean  // Dave, Abe, Admin
  canEditCatalog:        boolean  // Admin only
  canViewUsers:          boolean  // Admin only
  canEditUsers:          boolean  // Admin only
  canViewLocations:      boolean  // Dave, Abe, Admin
  canEditLocations:      boolean  // Admin only
  canViewIntegrations:   boolean  // Admin only
  canEditIntegrations:   boolean  // Admin only
}

export const PERMISSIONS: Record<UserRole, Permission> = {
  TECHNICIAN: {
    canSubmitRequest:    true,
    canApproveTransfer:  false,
    canApprovePurchase:  false,
    canRejectRequest:    false,
    canViewInventory:    true,
    canEditAsset:        true,
    canCreateAsset:      false,
    canDeleteAsset:      false,
    canCreateShipment:   true,
    canMarkShipped:      true,
    canMarkReceived:     true,
    canFlagException:    true,
    canViewReports:      true,   // read-only
    canViewCatalog:      false,
    canEditCatalog:      false,
    canViewUsers:        false,
    canEditUsers:        false,
    canViewLocations:    false,
    canEditLocations:    false,
    canViewIntegrations: false,
    canEditIntegrations: false,
  },
  SITE_MANAGER: {
    canSubmitRequest:    true,
    canApproveTransfer:  true,
    canApprovePurchase:  false,
    canRejectRequest:    true,
    canViewInventory:    true,
    canEditAsset:        true,
    canCreateAsset:      false,
    canDeleteAsset:      false,
    canCreateShipment:   true,
    canMarkShipped:      true,
    canMarkReceived:     true,
    canFlagException:    true,
    canViewReports:      true,
    canViewCatalog:      true,   // read-only
    canEditCatalog:      false,
    canViewUsers:        false,
    canEditUsers:        false,
    canViewLocations:    true,   // read-only
    canEditLocations:    false,
    canViewIntegrations: false,
    canEditIntegrations: false,
  },
  REGIONAL_MANAGER: {
    canSubmitRequest:    true,
    canApproveTransfer:  true,
    canApprovePurchase:  true,
    canRejectRequest:    true,
    canViewInventory:    true,
    canEditAsset:        true,
    canCreateAsset:      false,
    canDeleteAsset:      false,
    canCreateShipment:   true,
    canMarkShipped:      true,
    canMarkReceived:     true,
    canFlagException:    true,
    canViewReports:      true,
    canViewCatalog:      true,   // read-only
    canEditCatalog:      false,
    canViewUsers:        false,
    canEditUsers:        false,
    canViewLocations:    true,   // read-only
    canEditLocations:    false,
    canViewIntegrations: false,
    canEditIntegrations: false,
  },
  ADMIN: {
    canSubmitRequest:    true,
    canApproveTransfer:  true,
    canApprovePurchase:  true,
    canRejectRequest:    true,
    canViewInventory:    true,
    canEditAsset:        true,
    canCreateAsset:      true,
    canDeleteAsset:      true,
    canCreateShipment:   true,
    canMarkShipped:      true,
    canMarkReceived:     true,
    canFlagException:    true,
    canViewReports:      true,
    canViewCatalog:      true,
    canEditCatalog:      true,
    canViewUsers:        true,
    canEditUsers:        true,
    canViewLocations:    true,
    canEditLocations:    true,
    canViewIntegrations: true,
    canEditIntegrations: true,
  },
}

export function getPermissions(role: UserRole): Permission {
  return PERMISSIONS[role]
}

// Role lookup from demo email
export const ROLE_BY_EMAIL: Record<string, UserRole> = {
  'tech@itflow-demo.com':     'TECHNICIAN',
  'manager@itflow-demo.com':  'SITE_MANAGER',
  'regional@itflow-demo.com': 'REGIONAL_MANAGER',
  'admin@itflow-demo.com':    'ADMIN',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  TECHNICIAN:       'Technician',
  SITE_MANAGER:     'Supervisor',
  REGIONAL_MANAGER: 'Manager',
  ADMIN:            'Admin',
}
