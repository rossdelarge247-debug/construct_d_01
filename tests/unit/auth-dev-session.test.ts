/**
 * S-F7-α · AC-4 (dev session) · AC-10 (no cookies invariant) · AC-11 (key versioning comment — manual)
 *
 * Covers `src/lib/auth/dev-session.ts`.
 * jsdom env provides localStorage + document.cookie.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('lib/auth/dev-session — fixture session resolution', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    // jsdom: clear cookies by setting expired
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0]?.trim();
      if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns a UserSession with synthetic email on @dev.decouple.local domain', async () => {
    const { getSession } = await import('@/lib/auth/dev-session');
    const session = await getSession();
    expect(session.email).toMatch(/@dev\.decouple\.local$/);
  });

  it('sets twoFactorVerified to true (dev bypass per spec 72 §3 line 129)', async () => {
    const { getSession } = await import('@/lib/auth/dev-session');
    const session = await getSession();
    expect(session.twoFactorVerified).toBe(true);
  });

  it('persists session under localStorage key "decouple:dev:session:v1"', async () => {
    const { getSession } = await import('@/lib/auth/dev-session');
    await getSession();
    const raw = localStorage.getItem('decouple:dev:session:v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.email).toMatch(/@dev\.decouple\.local$/);
  });

  it('returned session has all spec-71-§4 fields', async () => {
    const { getSession } = await import('@/lib/auth/dev-session');
    const session = await getSession();
    expect(session.id).toBeTruthy();
    expect(typeof session.email).toBe('string');
    expect(['participant', 'admin', 'support']).toContain(session.role);
    expect(typeof session.twoFactorVerified).toBe('boolean');
    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.lastActiveAt).toBeInstanceOf(Date);
    expect(typeof session.deviceFingerprint).toBe('string');
  });

  it('AC-10 invariant: getSession() never sets cookies (spec 72 §3 line 129)', async () => {
    const cookieBefore = document.cookie;
    const { getSession } = await import('@/lib/auth/dev-session');
    await getSession();
    expect(document.cookie).toBe(cookieBefore);
  });

  it('returns the same session on repeat calls within a session (idempotent fixture)', async () => {
    const { getSession } = await import('@/lib/auth/dev-session');
    const a = await getSession();
    const b = await getSession();
    expect(a.id).toBe(b.id);
    expect(a.email).toBe(b.email);
  });
});
