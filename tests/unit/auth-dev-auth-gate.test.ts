/**
 * S-F7-α · AC-6 (dev auth gate)
 *
 * Covers `src/lib/auth/dev-auth-gate.ts`.
 * Dev mode: requireUser always succeeds, redirectIfAuthed is a no-op,
 * currentSession returns the fixture.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('lib/auth/dev-auth-gate — never blocks in dev', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('requireUser() resolves to the fixture session (never throws in dev)', async () => {
    const { devAuthGate } = await import('@/lib/auth/dev-auth-gate');
    const session = await devAuthGate.requireUser();
    expect(session).toBeTruthy();
    expect(session.email).toMatch(/@dev\.decouple\.local$/);
  });

  it('redirectIfAuthed() is a no-op (does not navigate)', async () => {
    // Amended in session 33: original used `vi.spyOn(window.location, 'assign')`,
    // which fails in jsdom 26+ because `assign` is non-configurable. The contract
    // is "no navigation"; verify via observable outcome (href unchanged) instead.
    const { devAuthGate } = await import('@/lib/auth/dev-auth-gate');
    const hrefBefore = window.location.href;
    await expect(devAuthGate.redirectIfAuthed('/somewhere')).resolves.toBeUndefined();
    expect(window.location.href).toBe(hrefBefore);
  });

  it('currentSession() returns the fixture session matching getSession()', async () => {
    const { devAuthGate } = await import('@/lib/auth/dev-auth-gate');
    const { getSession } = await import('@/lib/auth/dev-session');
    const fromGate = await devAuthGate.currentSession();
    const direct = await getSession();
    expect(fromGate).not.toBeNull();
    expect(fromGate?.id).toBe(direct.id);
  });
});
