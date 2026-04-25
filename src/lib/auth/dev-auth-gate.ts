import type { AuthGate } from './types';
import { getSession } from './dev-session';

export const devAuthGate: AuthGate = {
  async requireUser() {
    return getSession();
  },
  async redirectIfAuthed(_to: string) {
    // no-op in dev — we want to see every page regardless of session
  },
  async currentSession() {
    return getSession();
  },
};
