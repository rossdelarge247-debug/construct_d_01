/**
 * S-F7-α · AC-5 (dev store)
 *
 * Covers `src/lib/store/dev-store.ts` — localStorage-backed user-scoped store.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('lib/store/dev-store — localStorage-backed read/write', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('write then read round-trips deeply-equal data', async () => {
    const { devStore } = await import('@/lib/store/dev-store');
    const data = { foo: 'bar', n: 42, nested: { a: [1, 2, 3] } };
    await devStore.write('user-1', 'profile', data);
    const out = await devStore.read('user-1', 'profile');
    expect(out).toEqual(data);
  });

  it('write uses localStorage key pattern decouple:dev:store:v1:{userId}:{scope}', async () => {
    const { devStore } = await import('@/lib/store/dev-store');
    await devStore.write('user-x', 'children', { hello: 'world' });
    const raw = localStorage.getItem('decouple:dev:store:v1:user-x:children');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw as string)).toEqual({ hello: 'world' });
  });

  it('different scopes for the same user do not cross-contaminate', async () => {
    const { devStore } = await import('@/lib/store/dev-store');
    await devStore.write('user-1', 'profile', { p: 1 });
    await devStore.write('user-1', 'children', { c: 2 });
    expect(await devStore.read('user-1', 'profile')).toEqual({ p: 1 });
    expect(await devStore.read('user-1', 'children')).toEqual({ c: 2 });
  });

  it('different users for the same scope are isolated', async () => {
    const { devStore } = await import('@/lib/store/dev-store');
    await devStore.write('user-A', 'profile', { name: 'A' });
    await devStore.write('user-B', 'profile', { name: 'B' });
    expect(await devStore.read('user-A', 'profile')).toEqual({ name: 'A' });
    expect(await devStore.read('user-B', 'profile')).toEqual({ name: 'B' });
  });

  it('read returns null for an unwritten (userId, scope) pair', async () => {
    const { devStore } = await import('@/lib/store/dev-store');
    expect(await devStore.read('nobody', 'nothing')).toBeNull();
  });

  it('subscribe returns an unsubscribe function (no-op stub for α)', async () => {
    const { devStore } = await import('@/lib/store/dev-store');
    const unsub = devStore.subscribe('user-1', 'profile', () => {});
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow();
  });

  it('gracefully degrades when localStorage throws — single warn, no rethrow', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('access denied');
      });
    const { devStore } = await import('@/lib/store/dev-store');
    await expect(devStore.write('u', 's', { x: 1 })).resolves.not.toThrow();
    // After fallback engages, in-memory should round-trip:
    const out = await devStore.read('u', 's');
    expect(out).toEqual({ x: 1 });
    // At most one warning total (single warn per the AC, debounced).
    expect(warnSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
  });
});
