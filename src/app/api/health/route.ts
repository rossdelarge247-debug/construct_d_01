import { NextResponse } from 'next/server'

export const maxDuration = 30

/**
 * Health check endpoint that tests the Anthropic API connection
 * independently of the full document pipeline.
 *
 * GET /api/health — tests API key validity and model availability
 */
export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    apiKeySet: !!process.env.ANTHROPIC_API_KEY,
    apiKeyPrefix: process.env.ANTHROPIC_API_KEY
      ? `${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...`
      : null,
    models: {} as Record<string, unknown>,
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...results, error: 'ANTHROPIC_API_KEY not set' }, { status: 503 })
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: 15_000,
  })

  // Test each model with a trivial prompt
  const modelsToTest = [
    'claude-haiku-4-5-20251001',
    'claude-sonnet-4-5-20241022',
    'claude-sonnet-4-6-20250514',
  ]

  for (const model of modelsToTest) {
    const start = Date.now()
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Reply with just the word "ok".' }],
      })
      const elapsed = Date.now() - start
      const text = response.content.find(b => b.type === 'text')?.text ?? ''
      ;(results.models as Record<string, unknown>)[model] = {
        status: 'ok',
        response: text.trim(),
        timeMs: elapsed,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      }
    } catch (error) {
      const elapsed = Date.now() - start
      const msg = error instanceof Error ? error.message : 'Unknown error'
      ;(results.models as Record<string, unknown>)[model] = {
        status: 'error',
        error: msg,
        timeMs: elapsed,
      }
    }
  }

  return NextResponse.json(results)
}
