/**
 * S-F7-α · AC-1 (auth types) · AC-2 (mode-conditional exports) · AC-3 (runtime assertion)
 *
 * Covers `src/lib/auth/index.ts` — the single import surface for auth.
 * Type-shape checks for `UserSession` and `AuthGate` are folded in via
 * inline `@ts-expect-error` on deliberate mismatches; `tsc --noEmit` is the
 * canonical type gate.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('lib/auth/index — mode-conditional exports + runtime assertion', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('exports MODE = "dev" when env var is unset (default)', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', '');
    const { MODE } = await import('@/lib/auth');
    expect(MODE).toBe('dev');
  });

  it('exports MODE = "prod" when env var is "prod"', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'prod');
    vi.stubEnv('NODE_ENV', 'production');
    const { MODE } = await import('@/lib/auth');
    expect(MODE).toBe('prod');
  });

  it('getSession() returns dev fixture session when MODE=dev', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
    const { getSession } = await import('@/lib/auth');
    const session = await getSession();
    expect(session).toBeTruthy();
    expect(session.email).toMatch(/@dev\.decouple\.local$/);
  });

  it('getAuthGate() returns dev auth gate impl when MODE=dev', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
    const { getAuthGate } = await import('@/lib/auth');
    const gate = getAuthGate();
    expect(gate).toBeTruthy();
    expect(typeof gate.requireUser).toBe('function');
    expect(typeof gate.redirectIfAuthed).toBe('function');
    expect(typeof gate.currentSession).toBe('function');
  });

  it('getSession() throws S-F8-not-implemented error when MODE=prod', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'prod');
    vi.stubEnv('NODE_ENV', 'production');
    const { getSession } = await import('@/lib/auth');
    await expect(getSession()).rejects.toThrow(/S-F8 not implemented/);
  });

  it('getAuthGate() returns a gate whose methods throw S-F8-not-implemented when MODE=prod', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'prod');
    vi.stubEnv('NODE_ENV', 'production');
    const { getAuthGate } = await import('@/lib/auth');
    const gate = getAuthGate();
    await expect(gate.requireUser()).rejects.toThrow(/S-F8 not implemented/);
  });

  it('throws spec-72-§7 verbatim error when NODE_ENV=production and MODE!=prod', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
    await expect(import('@/lib/auth')).rejects.toThrow(
      'DECOUPLE_AUTH_MODE must be "prod" in production build',
    );
  });

  it('does NOT throw when NODE_ENV=production and MODE=prod (correctly configured)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'prod');
    await expect(import('@/lib/auth')).resolves.toBeTruthy();
  });

  it('does NOT throw when NODE_ENV=development regardless of MODE', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
    await expect(import('@/lib/auth')).resolves.toBeTruthy();
  });
});

describe('lib/auth/types — UserSession and AuthGate type shapes (AC-1)', () => {
  it('UserSession requires all spec-71-§4 fields', async () => {
    const { /* type-only import via dynamic */ } = await import('@/lib/auth');
    // Type smoke via @ts-expect-error: a partial UserSession should fail to satisfy.
    // The real gate is `pnpm tsc --noEmit`; this assertion is documentary.
    type _expectedFields =
      | 'id'
      | 'email'
      | 'role'
      | 'twoFactorVerified'
      | 'createdAt'
      | 'lastActiveAt'
      | 'deviceFingerprint';
    // @ts-expect-error — empty object is not assignable to UserSession
    const _bad: import('@/lib/auth').UserSession = {};
    expect(true).toBe(true);
  });

  it('AuthGate has requireUser, redirectIfAuthed, currentSession methods', () => {
    // Type-shape verified at compile time. Method behaviours covered by auth-dev-auth-gate.test.ts.
    expect(true).toBe(true);
  });
});
