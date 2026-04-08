// Stripe integration — test/stub mode until credentials provided

const stripeKey = process.env.STRIPE_SECRET_KEY
const isTestMode = !stripeKey || process.env.STRIPE_MODE === 'test'

export function getStripeStatus(): { mode: 'live' | 'test' | 'stub'; configured: boolean } {
  if (!stripeKey) {
    return { mode: 'stub', configured: false }
  }
  if (isTestMode || stripeKey.startsWith('sk_test_')) {
    return { mode: 'test', configured: true }
  }
  return { mode: 'live', configured: true }
}

export async function getStripeClient() {
  const status = getStripeStatus()

  if (status.mode === 'stub') {
    console.log('[Stripe] Stub mode — no credentials configured')
    return null
  }

  const Stripe = (await import('stripe')).default
  return new Stripe(stripeKey!, { apiVersion: '2025-03-31.basil' })
}
