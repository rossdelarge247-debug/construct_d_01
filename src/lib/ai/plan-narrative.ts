import { generateCompletion } from '@/lib/ai/provider'
import type { InterviewSession } from '@/types/interview'

export interface AIPlanNarrative {
  overview: string
  route: string
  children: string | null
  housing: string | null
  finances: string
  confidence_insight: string
  closing: string
}

function buildPlanPrompt(session: InterviewSession, hasSafeguardingConcerns: boolean): string {
  const s = session.situation
  const isMarried = s.relationship_status === 'married' || s.relationship_status === 'civil_partnership'
  const hasChildren = s.has_children === true
  const hasProperty = s.property_status === 'own_jointly' || s.property_status === 'own_one_name'

  // Build confidence summary
  const conf = session.confidence
  const confEntries = Object.entries(conf)
    .filter(([, v]) => v !== null)
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
    .join(', ')

  return `You are generating a personalised plan summary for someone navigating separation in England and Wales. This is the most important output of their first session with our service. It must feel like it was written by someone who listened carefully and genuinely understands their situation.

THEIR SITUATION:
- Relationship: ${s.relationship_status}
- Living together: ${s.living_together}
- Children: ${hasChildren ? 'yes' : 'no'}${s.children_ages ? `, ages: ${s.children_ages}` : ''}
- Property: ${s.property_status}
- Process status: ${s.process_status}
- Relationship quality: ${s.relationship_quality}
- Safeguarding concerns: ${hasSafeguardingConcerns ? 'YES — adjust tone, suppress collaboration language, do not recommend mediation as default' : 'no'}
- Financial control concerns: ${s.financial_control_concerns ? 'YES' : 'no'}

${hasChildren ? `CHILDREN:
- Current arrangements: ${session.children.current_arrangements}
- Desired arrangements: ${session.children.desired_arrangements}
- Confidence: ${session.children.confidence}` : ''}

${hasProperty ? `HOUSING:
- Desired outcome: ${session.home.desired_outcome}
- Property value confidence: ${session.home.value_confidence}
- Mortgage confidence: ${session.home.mortgage_confidence}
- Property value (if provided): ${session.values.property_value ? '£' + session.values.property_value : 'not provided'}
- Mortgage balance (if provided): ${session.values.mortgage ? '£' + session.values.mortgage : 'not provided'}` : ''}

FINANCIAL PRIORITIES: ${session.finances.priorities.join(', ') || 'none selected'}
FINANCIAL WORRIES: ${session.finances.worries.join(', ') || 'none selected'}
COMBINED FINANCIAL AWARENESS: ${session.finances.combined_awareness}

VALUES PROVIDED BY USER (use these to make the plan more specific):
${Object.entries(session.values)
  .filter(([, v]) => v && v.trim() !== '')
  .map(([k, v]) => `- ${k.replace(/_/g, ' ')}: £${v}`)
  .join('\n') || 'No specific values provided'}

CONFIDENCE MAP: ${confEntries}

INSTRUCTIONS:
Generate a JSON object with these fields. Each field should be 2-4 sentences of warm, intelligent, personalised prose. Not bullet points. Not templates. Write as if you are a calm, experienced guide reflecting back what you heard.

{
  "overview": "A 2-3 sentence opening that acknowledges where they are and what they've accomplished by going through this session. Warm but honest.",
  "route": "A clear, personalised explanation of their likely route. ${isMarried ? 'Explain the three processes (divorce, finances, children if applicable). Mention the consent order requirement.' : 'Explain what applies to cohabiting partners.'} ${hasSafeguardingConcerns ? 'Acknowledge safety concerns and note that some routes like mediation may not be appropriate.' : ''}",
  ${hasChildren ? '"children": "Reflect back their children situation and aims. Be child-focused. Acknowledge their confidence level. If unsure, reassure that this becomes clearer over time.",' : '"children": null,'}
  ${hasProperty ? '"housing": "Reflect back their housing aims. Connect to financial picture. Acknowledge what they know and don\'t know about value/mortgage.",' : '"housing": null,'}
  "finances": "Reflect back their financial priorities and worries specifically. Connect to their confidence map — what they know well and where the gaps are. Be specific about which unknowns matter most based on their priorities.",
  "confidence_insight": "A genuinely insightful observation about the pattern in their confidence map. What stands out? What's the most important gap? What should they feel good about knowing? This should feel like a perceptive observation, not a data summary.",
  "closing": "A warm, motivating closing that acknowledges the difficulty and the progress. Point toward what comes next without being salesy. ${hasSafeguardingConcerns ? 'Include support resources reminder.' : ''}"
}

TONE RULES:
- Warm, intelligent, calm. Never clinical, never cheesy.
- This is provisional planning, not legal advice. Never state legal outcomes.
- Use "you" language. Make them feel heard.
- Acknowledge difficulty without dwelling on it.
- Be specific to THEIR situation — reference their actual selections.
- If safeguarding concerns: warmer, more cautious, no collaboration assumptions.
- Maximum 3 sentences per field. Concise but meaningful.

Return ONLY the JSON object, no markdown formatting, no code blocks.`
}

export async function generatePlanNarrative(
  session: InterviewSession,
  hasSafeguardingConcerns: boolean,
): Promise<AIPlanNarrative | null> {
  try {
    const prompt = buildPlanPrompt(session, hasSafeguardingConcerns)

    const response = await generateCompletion(prompt, {
      taskType: 'plan_summarisation',
      temperature: 0.7,
      maxTokens: 1024,
      systemPrompt: 'You are a calm, experienced separation guide. You generate personalised plan summaries in JSON format. You are warm, honest, and intelligent. You never give legal advice. You always return valid JSON.',
    })

    const parsed = JSON.parse(response.content) as AIPlanNarrative
    return parsed
  } catch (error) {
    console.error('[AI Plan] Generation failed, falling back to templates:', error)
    return null
  }
}
