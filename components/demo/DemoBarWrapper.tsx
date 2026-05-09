'use client'
import dynamic from 'next/dynamic'

const DemoBar = dynamic(() => import('./DemoBar').then(m => m.DemoBar), { ssr: false })

export function DemoBarWrapper({ currentEmail }: { currentEmail: string }) {
  return <DemoBar currentEmail={currentEmail} />
}
