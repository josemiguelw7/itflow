'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { OnboardingModal } from './OnboardingModal'
import { SpotlightTour } from './SpotlightTour'

interface OnboardingCtx {
  showTour: () => void
  showVideo: () => void
  markStepSeen: (step: string) => void
  seenSteps: string[]
}

const Ctx = createContext<OnboardingCtx>({
  showTour: () => {},
  showVideo: () => {},
  markStepSeen: () => {},
  seenSteps: [],
})

export const useOnboarding = () => useContext(Ctx)

export function OnboardingProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [videoOpen, setVideoOpen] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [seenSteps, setSeenSteps] = useState<string[]>([])
  const [onboardingDone, setOnboardingDone] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(`itflow_onboarding_${userId}`)
    const steps = JSON.parse(localStorage.getItem(`itflow_tour_steps_${userId}`) ?? '[]')
    setSeenSteps(steps)
    if (!done) {
      setTimeout(() => setVideoOpen(true), 800)
    } else {
      setOnboardingDone(true)
    }
  }, [userId])

  function markStepSeen(step: string) {
    const next = [...new Set([...seenSteps, step])]
    setSeenSteps(next)
    localStorage.setItem(`itflow_tour_steps_${userId}`, JSON.stringify(next))
  }

  function completeOnboarding() {
    setVideoOpen(false)
    localStorage.setItem(`itflow_onboarding_${userId}`, 'true')
    setOnboardingDone(true)
    setTimeout(() => setTourActive(true), 400)
  }

  return (
    <Ctx.Provider value={{
      showTour: () => setTourActive(true),
      showVideo: () => setVideoOpen(true),
      markStepSeen,
      seenSteps,
    }}>
      {children}
      {videoOpen && (
        <OnboardingModal
          onClose={() => setVideoOpen(false)}
          onStartTour={completeOnboarding}
        />
      )}
      {tourActive && (
        <SpotlightTour
          seenSteps={seenSteps}
          onComplete={() => setTourActive(false)}
          onMarkSeen={markStepSeen}
        />
      )}
    </Ctx.Provider>
  )
}
