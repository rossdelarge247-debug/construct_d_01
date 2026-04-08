'use client'

import { useState, useEffect } from 'react'

/**
 * Reveals items one at a time with a staggered delay.
 * Returns the count of currently visible items.
 */
export function useStaggeredReveal(totalItems: number, options?: {
  initialDelay?: number
  staggerDelay?: number
}) {
  const { initialDelay = 300, staggerDelay = 150 } = options ?? {}
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (totalItems === 0) return

    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 0; i < totalItems; i++) {
      timers.push(setTimeout(() => setVisibleCount(i + 1), initialDelay + i * staggerDelay))
    }

    return () => timers.forEach(clearTimeout)
  }, [totalItems, initialDelay, staggerDelay])

  return visibleCount
}
