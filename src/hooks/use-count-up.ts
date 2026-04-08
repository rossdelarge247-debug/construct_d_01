'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Smoothly counts up from previous value to target value.
 */
export function useCountUp(target: number, duration: number = 600) {
  const [display, setDisplay] = useState(target)
  const prevTarget = useRef(target)

  useEffect(() => {
    const from = prevTarget.current
    const to = target
    prevTarget.current = target

    if (from === to) return

    const startTime = Date.now()

    function tick() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return display
}
