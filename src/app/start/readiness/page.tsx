import { redirect } from 'next/navigation'

// Readiness matrix removed in V1 streamline (session 15).
// Bank data now provides financial details — the 10-domain confidence
// matrix is obsolete. Redirect to finances for anyone with old bookmarks.
export default function ReadinessRedirect() {
  redirect('/start/finances')
}
