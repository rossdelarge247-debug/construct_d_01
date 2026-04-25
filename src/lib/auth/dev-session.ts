import type { UserSession } from './types';

// v1 = first localStorage layout for dev session; v2 will require migration.
const SESSION_KEY = 'decouple:dev:session:v1';

const FIXTURE: UserSession = {
  id: 'sarah-dev',
  email: 'sarah@dev.decouple.local',
  role: 'participant',
  twoFactorVerified: true,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  lastActiveAt: new Date('2026-01-01T00:00:00.000Z'),
  deviceFingerprint: 'dev-fixture-device',
};

function reviveDates(raw: Record<string, unknown>): UserSession {
  return {
    ...(raw as unknown as UserSession),
    createdAt: new Date(raw.createdAt as string),
    lastActiveAt: new Date(raw.lastActiveAt as string),
  };
}

export async function getSession(): Promise<UserSession> {
  if (typeof localStorage === 'undefined') {
    return FIXTURE;
  }
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    try {
      return reviveDates(JSON.parse(existing));
    } catch {
      // corrupt — fall through to re-seed
    }
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(FIXTURE));
  return FIXTURE;
}
