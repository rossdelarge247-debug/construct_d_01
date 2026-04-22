import { redirect } from 'next/navigation'

// Next-steps page replaced by /start/choose (Goldilocks pricing) in session 15.
export default function NextStepsRedirect() {
  redirect('/start/choose')
}
