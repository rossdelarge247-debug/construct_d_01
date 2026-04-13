import { NextRequest } from 'next/server'
import { getUserToken, getAccounts, getTransactions } from '@/lib/bank/tink-client'
import { transformTinkAccount } from '@/lib/bank/tink-transformer'
import { transformExtractionResult } from '@/lib/ai/result-transformer'
import type { DocumentClassification } from '@/lib/ai/extraction-schemas'

/**
 * GET /api/bank/callback?code=...
 *
 * Tink Link redirects here after user connects their bank.
 * Fetches account + transaction data, transforms it through the existing pipeline,
 * and returns an HTML page that stores the result and redirects to the hub.
 *
 * The data flows: Tink API → tink-transformer → transformExtractionResult → hub Q&A
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const credentialsId = request.nextUrl.searchParams.get('credentialsId')

  if (!code && !credentialsId) {
    return redirectWithError('No authorization code received from bank connection.')
  }

  try {
    // Exchange code for user access token
    const tokenCode = code || credentialsId!
    const userToken = await getUserToken(tokenCode)

    // Fetch all accounts
    const accounts = await getAccounts(userToken)
    if (accounts.length === 0) {
      return redirectWithError('No bank accounts found. Please try connecting again.')
    }

    console.log(`[Bank Callback] Found ${accounts.length} account(s)`)

    // Process each account: fetch transactions → transform → pass through pipeline
    const results = []

    for (const account of accounts) {
      const transactions = await getTransactions(userToken, account.id)
      console.log(`[Bank Callback] Account ${account.id}: ${transactions.length} transactions`)

      // Transform Tink data → BankStatementExtraction shape
      const extraction = transformTinkAccount(account, transactions)

      // Build classification (we know the type — no AI classification needed)
      const classification: DocumentClassification = {
        document_type: 'bank_statement',
        confidence: 1.0,
        provider: extraction.provider,
        description: `${extraction.provider} ${extraction.account_type} account via Open Banking`,
      }

      // Pass through the SAME transformer pipeline as PDF uploads
      const transformed = transformExtractionResult(classification, extraction)

      results.push({
        result: {
          classification,
          rawText: `Open Banking: ${extraction.provider} account`,
          stepTimings: { classify: 0, extract: 0 },
          error: null,
        },
        transformed,
        extraction,
      })
    }

    // Return HTML page that either:
    // 1. Posts message to parent (iframe/drop-in mode)
    // 2. Stores in sessionStorage and redirects (legacy redirect mode)
    const html = `<!DOCTYPE html>
<html><head><title>Connecting your bank...</title></head>
<body>
<p>Bank connected successfully. Redirecting...</p>
<script>
  try {
    var data = ${JSON.stringify(results)};
    if (window.parent !== window) {
      // Iframe mode — post results to parent window
      window.parent.postMessage({ type: 'tink-complete', results: data }, '*');
    } else {
      // Redirect mode (legacy) — store in sessionStorage
      sessionStorage.setItem('pendingBankData', JSON.stringify(data));
      window.location.href = '/workspace?source=openbanking';
    }
  } catch (e) {
    document.body.innerHTML = '<p>Something went wrong storing your bank data. Please try again.</p>';
  }
</script>
</body></html>`

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Bank Callback] Error:', msg, error instanceof Error ? error.stack : '')
    return redirectWithError(`Bank connection failed: ${msg}`)
  }
}

function redirectWithError(message: string) {
  const safeMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const html = `<!DOCTYPE html>
<html><head><title>Bank connection error</title>
<style>body{font-family:system-ui;max-width:600px;margin:80px auto;padding:0 20px}
pre{background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;font-size:13px}
a{color:#2563eb}</style>
</head>
<body>
<h2>Bank connection error</h2>
<pre>${safeMessage}</pre>
<p><a href="/workspace">Back to workspace</a></p>
</body></html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
