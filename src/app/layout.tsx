import type { Metadata } from 'next'
import './globals.css'
import { EnvBanner } from '@/components/layout/env-banner'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-900">
        <EnvBanner />
        {children}
      </body>
    </html>
  )
}
