import { redirect }           from 'next/navigation'
import { createClient }        from '@/lib/supabase/server'
import { Sidebar }             from '@/components/layout/Sidebar'
import { Topbar }              from '@/components/layout/Topbar'
import { OnboardingProvider }  from '@/components/onboarding/OnboardingProvider'
import { DemoBar, DEMO_EMAILS } from '@/components/demo/DemoBar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isDemo = DEMO_EMAILS.includes(user.email ?? '')

  return (
    <OnboardingProvider userId={user.id}>
      <div className="app-shell">
        <Sidebar />
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <Topbar user={user} />
          <main style={{ flex:1, overflowY:'auto', padding:'24px', paddingBottom: isDemo ? '72px' : '24px' }}>
            {children}
          </main>
        </div>
      </div>
      {isDemo && <DemoBar currentEmail={user.email ?? ''} />}
    </OnboardingProvider>
  )
}
