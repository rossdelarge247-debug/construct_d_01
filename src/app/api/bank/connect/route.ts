import { NextRequest, NextResponse } from 'next/server'
import { buildTinkLinkUrl } from '@/lib/bank/tink-client'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open (redirect or popup).
 *
 * Uses Tink Link without pre-created user — Tink handles user creation
 * internally. The callback receives a code to exchange for data access.
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

    const tinkLinkUrl = buildTinkLinkUrl(null, redirectUri)

    return NextResponse.json({
      url: tinkLinkUrl,
      debug: { mode: 'no-auth-code', redirectUri },
    })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Bank Connect] Error:', msg)
    return NextResponse.json({
      error: `Failed to start bank connection: ${msg}`,
    }, { status: 500 })
  }
}
