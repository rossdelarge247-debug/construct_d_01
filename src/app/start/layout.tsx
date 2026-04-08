import { InterviewProvider } from '@/components/interview/interview-provider'

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <InterviewProvider>{children}</InterviewProvider>
}
