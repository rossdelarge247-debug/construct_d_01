// API route: POST /api/ntropy/enrich
// Proxies transaction data to Ntropy for enrichment.
// Keeps the API key server-side (env var NTROPY_API_KEY).

import { NextRequest, NextResponse } from 'next/server'
import { enrichTransactions, type NtropyTransactionInput } from '@/lib/bank/ntropy-client'

export async function POST(req: NextRequest) {
  const apiKey = process.env.NTROPY_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'NTROPY_API_KEY not configured' },
      { status: 500 },
    )
  }

  try {
    const transactions: NtropyTransactionInput[] = await req.json()

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: 'Request body must be a non-empty array of transactions' },
        { status: 400 },
      )
    }

    if (transactions.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 transactions per request (preserve free tier credits)' },
        { status: 400 },
      )
    }

    const result = await enrichTransactions(transactions, apiKey)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: `Request error: ${(err as Error).message}` },
      { status: 500 },
    )
  }
}
