import { NextRequest, NextResponse } from 'next/server'
import { createUser, createTinkLinkAuthCode, buildTinkLinkUrl } from '@/lib/bank/tink-client'
import { randomUUID } from 'crypto'

/**
 * POST /api/bank/connect
 *
 * Initiates a Tink Link session for Open Banking bank connection.
 * Returns a URL that the client opens in a popup window (not iframe —
 * Tink blocks iframe embedding with INVALID_STATE_EMBED_NOT_ALLOWED).
 *
 * Flow: create Tink user → get auth code → build Tink Link URL.
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.TINK_CLIENT_ID || !process.env.TINK_CLIENT_SECRET) {
      return NextResponse.json({
        error: 'Open Banking not configured. Tink credentials required.',
      }, { status: 503 })
    }

    const origin = request.headers.get('origin') || request.nextUrl.origin
    const redirectUri = `${origin}/api/bank/callback`

    const externalUserId = `decouple-${randomUUID()}`
    const { userId } = await createUser(externalUserId)
    const authCode = await createTinkLinkAuthCode(userId)
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
