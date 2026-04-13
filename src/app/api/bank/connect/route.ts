import { NextRequest, NextResponse } from 'next/server'
import { buildTinkLinkUrl } from '@/lib/bank/tink-client'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open in an iframe or popup.
 *
 * Uses client_id-only mode: Tink Link handles user creation internally.
 * No authorization_code needed — simpler and avoids the
 * REQUEST_FAILED_FETCH_EXISTING_USER error in iframe context.
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.TINK_CLIENT_ID || !process.env.TINK_CLIENT_SECRET) {
      return NextResponse.json({
        error: 'Open Banking not configured. Tink credentials required.',
      }, { status: 503 })
    }

    // Determine callback URL from request origin
    const origin = request.headers.get('origin') || request.nextUrl.origin
    const redirectUri = `${origin}/api/bank/callback`

    // Let Tink Link handle user creation — no auth code needed
    const tinkLinkUrl = buildTinkLinkUrl(null, redirectUri)

    console.log(`[Bank Connect] Tink Link URL built, redirect: ${redirectUri}`)

    return NextResponse.json({ url: tinkLinkUrl, debug: { redirectUri } })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Bank Connect] Error:', msg)
    return NextResponse.json({
      error: `Failed to start bank connection: ${msg}`,
    }, { status: 500 })
  }
}
