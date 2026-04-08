'use client'

import { useCallback, useEffect } from 'react'
import { EXIT_PAGE_URL } from '@/constants'

export function ExitPageButton() {
  const exitPage = useCallback(() => {
    // Replace current history entry so back button doesn't return here
    window.location.replace(EXIT_PAGE_URL)
  }, [])

  // Keyboard shortcut: press Shift 3 times within 3 seconds
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

  return (
    <button
      onClick={exitPage}
      className="fixed right-4 top-4 z-50 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      aria-label="Exit this page quickly"
    >
      Exit this page
    </button>
  )
}
