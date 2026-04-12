import { NextRequest, NextResponse } from 'next/server'
import { createUser, getAuthorizationCode, buildTinkLinkUrl } from '@/lib/bank/tink-client'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open (redirect or popup).
 *
 * Flow: create Tink user (form-encoded) → delegate auth → build Tink Link URL
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

    // Step 1: Create user (form-encoded)
    const sessionId = `decouple-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const { userId, raw: userResponse } = await createUser(sessionId)

    console.log(`[Bank Connect] Created user: ${userId}`, JSON.stringify(userResponse))

    // Step 2: Get authorization code for this user
    const authCode = await getAuthorizationCode(userId)
    const tinkLinkUrl = buildTinkLinkUrl(authCode, redirectUri)

    return NextResponse.json({
      url: tinkLinkUrl,
      sessionId,
      debug: { userId, userResponse },
    })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Bank Connect] Error:', msg)
    return NextResponse.json({
      error: `Failed to start bank connection: ${msg}`,
    }, { status: 500 })
  }
}
