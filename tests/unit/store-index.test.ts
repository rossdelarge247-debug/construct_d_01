/**
 * S-F7-α · AC-1 (store types) · AC-2 (mode-conditional exports)
 *
 * Covers `src/lib/store/index.ts` — store import surface.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('lib/store/index — mode-conditional store export', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getStore() returns dev store impl when MODE=dev', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
    const { getStore } = await import('@/lib/store');
    const store = getStore();
    expect(store).toBeTruthy();
    expect(typeof store.read).toBe('function');
    expect(typeof store.write).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  it('getStore() in MODE=prod returns a stub whose methods throw S-F8-not-implemented', async () => {
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'prod');
    vi.stubEnv('NODE_ENV', 'production');
    const { getStore } = await import('@/lib/store');
    const store = getStore();
    await expect(store.read('user-1', 'profile')).rejects.toThrow(/S-F8 not implemented/);
  });
});

describe('lib/store/types — WorkspaceStore type shape (AC-1)', () => {
  it('WorkspaceStore requires read, write, subscribe methods', () => {
    // Compile-time gate: deliberate-mismatch via @ts-expect-error.
    // @ts-expect-error — missing methods
    const _bad: import('@/lib/store').WorkspaceStore = {};
    expect(true).toBe(true);
  });
});
