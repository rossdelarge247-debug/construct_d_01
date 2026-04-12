import { NextRequest, NextResponse } from 'next/server'
import { createUser, getAuthorizationCode, buildTinkLinkUrl } from '@/lib/bank/tink-client'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open (redirect or popup).
 *
 * Flow: create Tink user → delegate auth → build Tink Link URL
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

    // Create a unique user for this session
    const sessionId = `decouple-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const userId = await createUser(sessionId)

    console.log(`[Bank Connect] Created Tink user ${userId} for session ${sessionId}`)

    // Get authorization code and build Tink Link URL
    const authCode = await getAuthorizationCode(userId)
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
