'use client'

import { useState, useCallback } from 'react'

interface CarouselSlide {
  headline: string
  supporting: string
}

const SLIDES: CarouselSlide[] = [
  {
    headline: 'Connect to your bank and be financially disclosed in minutes',
    supporting:
      'We use secure Open Banking to read your transactions — the same technology used by every major bank in the UK.',
  },
  {
    headline:
      'Once you have connected to your bank account we will process and populate your financial disclosure (Form E)',
    supporting:
      'No typing, no hunting for paperwork. We do the heavy lifting so you can focus on what matters.',
  },
  {
    headline:
      'About 80% of the data in your bank account is enough to get most people through mediation',
    supporting:
      'You can always add more later. But most people are surprised how far bank data alone gets them.',
  },
]

const TOTAL_SEGMENTS = SLIDES.length

interface WelcomeCarouselProps {
  onComplete: () => void
}

export function WelcomeCarousel({ onComplete }: WelcomeCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const advance = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)

    // Fade out, then swap content and fade in (spec 26: 200ms each, 50ms overlap)
    setTimeout(() => {
      if (currentStep < SLIDES.length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        onComplete()
      }
      setTransitioning(false)
    }, 200)
  }, [currentStep, transitioning, onComplete])

  const slide = SLIDES[currentStep]

  return (
    <div className="flex items-start justify-center pt-12 px-6">
      <div className="w-full max-w-[560px] bg-white rounded-lg border border-grey-100 shadow-sm overflow-hidden">
        {/* Progress indicator — segmented bar */}
        <div className="flex gap-1.5 px-6 pt-6">
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full bg-grey-100 overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: i <= currentStep ? '100%' : '0%',
                  backgroundColor: i <= currentStep ? 'var(--color-ink)' : 'transparent',
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* Graphic placeholder — shorter on mobile */}
        <div className="mx-6 mt-6 rounded-md bg-grey-50 flex items-center justify-center h-40 sm:h-[220px]">
          <span className="text-ink-tertiary text-sm">Illustration</span>
        </div>

        {/* Content — fades per spec 26 */}
        <div
          className="px-6 pt-6 pb-8 transition-opacity"
          style={{
            opacity: transitioning ? 0 : 1,
            transitionDuration: '200ms',
            transitionTimingFunction: transitioning ? 'ease-out' : 'ease-in',
          }}
        >
          <h2 className="text-xl font-bold text-ink leading-snug">
            {slide.headline}
          </h2>
          <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
            {slide.supporting}
          </p>

          <button
            onClick={advance}
            className="mt-6 px-6 py-3 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98] transition-transform"
          >
            {currentStep < SLIDES.length - 1 ? 'Next' : 'Get started'}
          </button>
        </div>
      </div>
    </div>
  )
}
