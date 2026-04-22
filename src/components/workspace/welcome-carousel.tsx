'use client'

import { useState, useCallback } from 'react'

interface CarouselSlide {
  headline: string
  supporting: string
}

const SLIDES: CarouselSlide[] = [
  {
    headline: 'Connect your bank and be disclosed in minutes',
    supporting:
      'Secure Open Banking reads your transactions — the same technology used by every major UK bank.',
  },
  {
    headline: 'We process and populate your financial disclosure automatically',
    supporting:
      'No typing, no hunting for paperwork. We do the heavy lifting so you can focus on what matters.',
  },
  {
    headline: '80% of bank data is enough to get most people through mediation',
    supporting:
      'You can always add more later. Most people are surprised how far bank data alone gets them.',
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
    <div className="flex items-start justify-center pt-4">
      <div
        className="w-full max-w-[var(--content-narrow)] bg-white overflow-hidden"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Progress indicator — segmented bar */}
        <div className="flex gap-1.5 px-8 pt-8">
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full bg-grey-100 overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: i <= currentStep ? '100%' : '0%',
                  backgroundColor: i <= currentStep ? 'var(--color-red-500)' : 'transparent',
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* Graphic placeholder */}
        <div
          className="mx-8 mt-6 bg-grey-50 flex items-center justify-center h-40 sm:h-[220px]"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <span className="text-ink-tertiary text-sm">Illustration</span>
        </div>

        {/* Content */}
        <div
          className="px-8 pt-8 pb-10 transition-opacity"
          style={{
            opacity: transitioning ? 0 : 1,
            transitionDuration: '200ms',
            transitionTimingFunction: transitioning ? 'ease-out' : 'ease-in',
          }}
        >
          <h2 className="text-[22px] font-bold text-ink leading-snug">
            {slide.headline}
          </h2>
          <p className="mt-3 text-[15px] text-ink-secondary leading-relaxed">
            {slide.supporting}
          </p>

          <button
            onClick={advance}
            className="mt-8 w-full sm:w-auto px-8 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: 'var(--color-red-500)',
              borderRadius: 'var(--radius-card)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
          >
            {currentStep < SLIDES.length - 1 ? 'Next' : 'Get started'}
          </button>
        </div>
      </div>
    </div>
  )
}
