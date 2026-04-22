import { NextResponse } from 'next/server'
import { getClientToken } from '@/lib/bank/tink-client'

/**
 * POST /api/bank/test
 *
 * Tests Tink credentials by requesting a client access token.
 * Returns diagnostic info: whether credentials are valid, token scopes, timing.
 */
export async function POST() {
  const clientId = process.env.TINK_CLIENT_ID
  const clientSecret = process.env.TINK_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'TINK_CLIENT_ID and/or TINK_CLIENT_SECRET not set in environment variables.',
      clientIdPresent: !!clientId,
      clientSecretPresent: !!clientSecret,
    })
  }

  const start = Date.now()

  try {
    const token = await getClientToken('user:create')
    const elapsed = Date.now() - start

    return NextResponse.json({
      status: 'ok',
      message: 'Tink credentials valid. Client token obtained successfully.',
      clientIdPrefix: clientId.substring(0, 8) + '...',
      tokenObtained: true,
      responseTimeMs: elapsed,
    })
  } catch (error) {
    const elapsed = Date.now() - start
    const msg = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({
      status: 'error',
      message: msg,
      clientIdPrefix: clientId.substring(0, 8) + '...',
      tokenObtained: false,
      responseTimeMs: elapsed,
    })
  }
}
