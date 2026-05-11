'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getPermissions, type Permissions, type Role } from '@/lib/permissions'

const DEMO_ROLE_MAP: Record<string, Role> = {
  'tech@itflow-demo.com':     'TECHNICIAN',
  'manager@itflow-demo.com':  'SITE_MANAGER',
  'regional@itflow-demo.com': 'REGIONAL_MANAGER',
  'admin@itflow-demo.com':    'ADMIN',
}

export function usePermissions() {
  const [role, setRole]   = useState<Role>('TECHNICIAN')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        // Demo accounts — role from email map
        const demoRole = DEMO_ROLE_MAP[user.email]
        if (demoRole) { setRole(demoRole); setLoading(false); return }
        // Real accounts — role from user_metadata or DB
        const metaRole = user.user_metadata?.role as Role
        if (metaRole) { setRole(metaRole); setLoading(false); return }
      }
      setLoading(false)
    })
  }, [])

  const permissions: Permissions = getPermissions(role)
  return { role, permissions, loading }
}
