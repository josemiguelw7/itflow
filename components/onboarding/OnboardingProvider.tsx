'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { OnboardingModal } from './OnboardingModal'
import { SpotlightTour } from './SpotlightTour'
import { usePermissions } from '@/lib/hooks/usePermissions'

interface OnboardingCtx {
  showTour:    () => void
  showVideo:   () => void
  markStepSeen: (step: string) => void
  seenSteps:   string[]
}

const Ctx = createContext<OnboardingCtx>({
  showTour:    () => {},
  showVideo:   () => {},
  markStepSeen: () => {},
  seenSteps:   [],
})

export const useOnboarding = () => useContext(Ctx)

export function OnboardingProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [videoOpen, setVideoOpen]   = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [seenSteps, setSeenSteps]   = useState<string[]>([])
  const { role } = usePermissions()

  useEffect(() => {
    const done  = localStorage.getItem(`itflow_onboarding_${userId}`)
    const steps = JSON.parse(localStorage.getItem(`itflow_tour_steps_${userId}`) ?? '[]')
    setSeenSteps(steps)
    if (!done) setTimeout(() => setVideoOpen(true), 800)
  }, [userId])

  function markStepSeen(step: string) {
    const next = [...new Set([...seenSteps, step])]
    setSeenSteps(next)
    localStorage.setItem(`itflow_tour_steps_${userId}`, JSON.stringify(next))
  }

  function completeOnboarding() {
    setVideoOpen(false)
    localStorage.setItem(`itflow_onboarding_${userId}`, 'true')
    setTimeout(() => setTourActive(true), 400)
  }

  return (
    <Ctx.Provider value={{ showTour: () => setTourActive(true), showVideo: () => setVideoOpen(true), markStepSeen, seenSteps }}>
      {children}
      {videoOpen && <OnboardingModal onClose={() => setVideoOpen(false)} onStartTour={completeOnboarding} />}
      {tourActive && (
        <SpotlightTour
          role={role}
          seenSteps={seenSteps}
          onComplete={() => setTourActive(false)}
          onMarkSeen={markStepSeen}
        />
      )}
    </Ctx.Provider>
  )
}
