// PostHog analytics integration
// Dev mode: logs to console, doesn't send to PostHog

import posthog from 'posthog-js'

const isServer = typeof window === 'undefined'
const isDev = process.env.NODE_ENV === 'development'
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

let initialized = false

export function initAnalytics() {
  if (isServer || initialized) return

  if (!posthogKey || isDev) {
    console.log('[Analytics] Dev mode — events logged to console')
    initialized = true
    return
  }

  posthog.init(posthogKey, {
    api_host: posthogHost ?? 'https://eu.i.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
  })
  initialized = true
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (isDev || !posthogKey) {
    console.log(`[Analytics] ${event}`, properties ?? '')
    return
  }

  posthog.capture(event, properties)
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (isDev || !posthogKey) {
    console.log(`[Analytics] Identify: ${userId}`, traits ?? '')
    return
  }

  posthog.identify(userId, traits)
}

export function resetUser() {
  if (isDev || !posthogKey) {
    console.log('[Analytics] Reset user')
    return
  }

  posthog.reset()
}
