import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MODE } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dev — Decouple',
  robots: { index: false, follow: false },
}

export default function DevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (MODE === 'prod') notFound()
  return children
}
