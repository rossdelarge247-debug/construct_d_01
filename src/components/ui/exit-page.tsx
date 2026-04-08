'use client'

import { useCallback, useEffect, useState } from 'react'
import { EXIT_PAGE_URL } from '@/constants'

export function ExitPageButton() {
  const [exiting, setExiting] = useState(false)

  const exitPage = useCallback(() => {
    // Immediately blank the screen before redirect
    setExiting(true)
    // Small delay to ensure the overlay renders before navigation
    setTimeout(() => {
      window.location.replace(EXIT_PAGE_URL)
    }, 50)
  }, [])

  // Keyboard shortcut: press Shift 3 times within 3 seconds (GOV.UK pattern)
  useEffect(() => {
    let shiftCount = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Shift') {
        shiftCount++
        if (shiftCount >= 3) {
          exitPage()
          return
        }
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          shiftCount = 0
        }, 3000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timer) clearTimeout(timer)
    }
  }, [exitPage])

  // Full-screen overlay that immediately hides all content
  if (exiting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white" aria-hidden="true" />
    )
  }

  return (
    <button
      onClick={exitPage}
      className="fixed right-4 top-3 z-50 rounded-[var(--radius-sm)] bg-depth px-3.5 py-1.5 text-xs font-medium text-cream shadow-[var(--shadow-sm)] transition-colors hover:bg-ink focus:outline-none focus:ring-2 focus:ring-depth focus:ring-offset-2"
      aria-label="Exit this page quickly — redirects to BBC Weather"
    >
      Exit this page
    </button>
  )
}
