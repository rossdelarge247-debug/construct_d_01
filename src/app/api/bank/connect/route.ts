import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizationCode, buildTinkLinkUrl } from '@/lib/bank/tink-client'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open (redirect or popup).
 *
 * Flow: get authorization code (creates user implicitly) → build Tink Link URL
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

    // Get authorization code — this also creates a Tink user implicitly
    const sessionId = `decouple-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const authCode = await getAuthorizationCode(sessionId)

    console.log(`[Bank Connect] Auth code obtained for session ${sessionId}`)

    const tinkLinkUrl = buildTinkLinkUrl(authCode, redirectUri)

    return NextResponse.json({
      url: tinkLinkUrl,
      sessionId,
    })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Bank Connect] Error:', msg)
    return NextResponse.json({
      error: `Failed to start bank connection: ${msg}`,
    }, { status: 500 })
  }
}
