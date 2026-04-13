import { NextRequest, NextResponse } from 'next/server'
import { createTinkLinkAuthCode, buildTinkLinkUrl } from '@/lib/bank/tink-client'
import { randomUUID } from 'crypto'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open in an iframe.
 *
 * Uses the authorization grant endpoint which creates the Tink user
 * automatically via external_user_id — no separate user creation step.
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

    // Single-step: authorization grant creates the user and returns an auth code
    const externalUserId = `decouple-${randomUUID()}`
    const authCode = await createTinkLinkAuthCode(externalUserId)

    const tinkLinkUrl = buildTinkLinkUrl(authCode, redirectUri)

    return NextResponse.json({ url: tinkLinkUrl })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Bank Connect] Error:', msg)
    return NextResponse.json({
      error: `Failed to start bank connection: ${msg}`,
    }, { status: 500 })
  }
}
