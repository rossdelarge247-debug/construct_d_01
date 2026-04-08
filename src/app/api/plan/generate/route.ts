import { NextRequest, NextResponse } from 'next/server'
import { generatePlanNarrative } from '@/lib/ai/plan-narrative'
import type { InterviewSession } from '@/types/interview'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session, hasSafeguardingConcerns } = body as {
      session: InterviewSession
      hasSafeguardingConcerns: boolean
    }

    const narrative = await generatePlanNarrative(session, hasSafeguardingConcerns)

    if (!narrative) {
      return NextResponse.json({ narrative: null }, { status: 200 })
    }

    return NextResponse.json({ narrative })
  } catch (error) {
    console.error('[API /plan/generate] Error:', error)
    return NextResponse.json({ narrative: null }, { status: 200 })
  }
}
