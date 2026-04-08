'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useInterview } from '@/hooks/use-interview'

type InterviewContextType = ReturnType<typeof useInterview>

const InterviewContext = createContext<InterviewContextType | null>(null)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const interview = useInterview()
  return (
    <InterviewContext.Provider value={interview}>
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterviewContext() {
  const context = useContext(InterviewContext)
  if (!context) {
    throw new Error('useInterviewContext must be used within an InterviewProvider')
  }
  return context
}
