'use client'
// lib/hooks/usePermissions.ts
// Use this hook anywhere to get the current user's permissions

import { useEffect, useState } from 'react'
import { PERMISSIONS, ROLE_BY_EMAIL, type UserRole, type Permission } from '@/lib/permissions'
import { createClient } from '@/lib/supabase/client'

const DEFAULT: Permission = PERMISSIONS['TECHNICIAN']

export function usePermissions() {
  const [role, setRole]   = useState<UserRole>('TECHNICIAN')
  const [perms, setPerms] = useState<Permission>(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email ?? ''
      const r = ROLE_BY_EMAIL[email] ?? 'TECHNICIAN'
      setRole(r)
      setPerms(PERMISSIONS[r])
      setLoading(false)
    })
  }, [])

  return { role, perms, loading }
}
