import { NextRequest, NextResponse } from 'next/server'
import { createUser, getAuthorizationCode, buildTinkLinkUrl } from '@/lib/bank/tink-client'
import { randomUUID } from 'crypto'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client should open in an iframe.
 *
 * Flow: create Tink user → get authorization code → build Tink Link URL.
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

    // Step 1: Create a Tink user
    const externalUserId = `decouple-${randomUUID()}`
    const { userId } = await createUser(externalUserId)

    // Step 2: Get authorization code for Tink Link
    const authCode = await getAuthorizationCode(userId)

    // Step 3: Build the Tink Link URL
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
