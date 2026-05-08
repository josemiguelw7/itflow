import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ITFlow — IT Inventory Platform',
  description: 'Multi-site IT inventory and transfer management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
