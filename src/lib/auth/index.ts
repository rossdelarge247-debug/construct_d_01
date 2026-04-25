import type { AuthGate, UserSession } from './types';
import { devAuthGate } from './dev-auth-gate';
import { getSession as devGetSession } from './dev-session';

export type { AuthGate, UserSession } from './types';

export const MODE: 'dev' | 'prod' =
  process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE === 'prod' ? 'prod' : 'dev';

if (process.env.NODE_ENV === 'production' && MODE !== 'prod') {
  throw new Error('DECOUPLE_AUTH_MODE must be "prod" in production build');
}

const NOT_IMPLEMENTED = 'S-F8 not implemented — prod auth requires S-F7-δ';

async function prodGetSession(): Promise<UserSession> {
  throw new Error(NOT_IMPLEMENTED);
}

const prodAuthGate: AuthGate = {
  async requireUser() {
    throw new Error(NOT_IMPLEMENTED);
  },
  async redirectIfAuthed() {
    throw new Error(NOT_IMPLEMENTED);
  },
  async currentSession() {
    throw new Error(NOT_IMPLEMENTED);
  },
};

export const getSession: () => Promise<UserSession> =
  MODE === 'prod' ? prodGetSession : devGetSession;

export function getAuthGate(): AuthGate {
  return MODE === 'prod' ? prodAuthGate : devAuthGate;
}
