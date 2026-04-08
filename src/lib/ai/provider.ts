// AI orchestration layer — provider-agnostic interface
// Supports Claude (primary), Gemini, and OpenAI
// Includes dry-run mode for dev/testing

export type AIProvider = 'claude' | 'gemini' | 'openai'

export type AITaskType =
  | 'route_generation'
  | 'plan_summarisation'
  | 'document_classification'
  | 'field_extraction'
  | 'safeguarding_assessment'
  | 'next_step_generation'
  | 'mediation_summary'
  | 'proposal_comparison'
  | 'general'

interface AIRequestOptions {
  taskType: AITaskType
  provider?: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

interface AIResponse {
  content: string
  provider: AIProvider
  model: string
  tokenUsage: { input: number; output: number }
  dryRun: boolean
  durationMs: number
}

const isDryRun = process.env.AI_DRY_RUN === 'true'

// Default provider routing by task type
const DEFAULT_ROUTING: Record<AITaskType, { provider: AIProvider; model: string }> = {
  route_generation: { provider: 'claude', model: 'claude-sonnet-4-6' },
  plan_summarisation: { provider: 'claude', model: 'claude-sonnet-4-6' },
  document_classification: { provider: 'claude', model: 'claude-haiku-4-5-20251001' },
  field_extraction: { provider: 'claude', model: 'claude-haiku-4-5-20251001' },
  safeguarding_assessment: { provider: 'claude', model: 'claude-sonnet-4-6' },
  next_step_generation: { provider: 'claude', model: 'claude-sonnet-4-6' },
  mediation_summary: { provider: 'claude', model: 'claude-sonnet-4-6' },
  proposal_comparison: { provider: 'claude', model: 'claude-sonnet-4-6' },
  general: { provider: 'claude', model: 'claude-sonnet-4-6' },
}

export async function generateCompletion(
  prompt: string,
  options: AIRequestOptions,
): Promise<AIResponse> {
  const start = Date.now()
  const routing = DEFAULT_ROUTING[options.taskType]
  const provider = options.provider ?? routing.provider
  const model = options.model ?? routing.model

  if (isDryRun) {
    console.log(`[AI DRY RUN] Provider: ${provider}, Model: ${model}, Task: ${options.taskType}`)
    console.log(`[AI DRY RUN] Prompt: ${prompt.substring(0, 200)}...`)
    return {
      content: `[DRY RUN] Response for ${options.taskType}`,
      provider,
      model,
      tokenUsage: { input: 0, output: 0 },
      dryRun: true,
      durationMs: Date.now() - start,
    }
  }

  switch (provider) {
    case 'claude':
      return callClaude(prompt, model, options, start)
    case 'gemini':
    case 'openai':
      // Stub — implement when needed
      throw new Error(`Provider ${provider} not yet implemented`)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

async function callClaude(
  prompt: string,
  model: string,
  options: AIRequestOptions,
  start: number,
): Promise<AIResponse> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model,
    max_tokens: options.maxTokens ?? 2048,
    ...(options.systemPrompt ? { system: options.systemPrompt } : {}),
    messages: [{ role: 'user', content: prompt }],
  })

  const textContent = response.content.find(block => block.type === 'text')

  return {
    content: textContent?.text ?? '',
    provider: 'claude',
    model,
    tokenUsage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
    dryRun: false,
    durationMs: Date.now() - start,
  }
}
