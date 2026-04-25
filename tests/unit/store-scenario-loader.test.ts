/**
 * S-F7-α · AC-7 (scenarios + loader) · AC-8 (URL query-param scenario switching)
 *
 * Covers `src/lib/store/scenario-loader.ts` and the 2 fixture scenarios
 * (`cold-sarah`, `sarah-mid-build`).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('lib/store/scenario-loader — load + wipe + URL trigger', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_DECOUPLE_AUTH_MODE', 'dev');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('loadScenario("cold-sarah") seeds a session and a clean workspace', async () => {
    const { loadScenario } = await import('@/lib/store/scenario-loader');
    await loadScenario('cold-sarah');
    const session = localStorage.getItem('decouple:dev:session:v1');
    expect(session).toBeTruthy();
    // Sample expectation: cold-sarah has no bank state stored
    const bank = localStorage.getItem('decouple:dev:store:v1:sarah:bank');
    expect(bank).toBeNull();
  });

  it('loadScenario("sarah-mid-build") seeds session + partial workspace state', async () => {
    const { loadScenario } = await import('@/lib/store/scenario-loader');
    await loadScenario('sarah-mid-build');
    const session = localStorage.getItem('decouple:dev:session:v1');
    expect(session).toBeTruthy();
    // sarah-mid-build implies SOME populated scope under sarah's userId.
    // Loose smoke: at least one decouple:dev:store:v1:* key exists.
    const allKeys = Object.keys(localStorage);
    const storeKeys = allKeys.filter((k) => k.startsWith('decouple:dev:store:v1:'));
    expect(storeKeys.length).toBeGreaterThanOrEqual(1);
  });

  it('switching scenarios wipes the previous one before installing the new', async () => {
    const { loadScenario } = await import('@/lib/store/scenario-loader');
    await loadScenario('sarah-mid-build');
    const beforeSwitch = Object.keys(localStorage).filter((k) =>
      k.startsWith('decouple:dev:store:v1:'),
    );
    expect(beforeSwitch.length).toBeGreaterThanOrEqual(1);

    await loadScenario('cold-sarah');
    const afterSwitch = Object.keys(localStorage).filter((k) =>
      k.startsWith('decouple:dev:store:v1:'),
    );
    // cold-sarah is blank — no store keys.
    expect(afterSwitch.length).toBe(0);
  });

  it('loadScenario rejects an unknown scenario name with a clear error', async () => {
    const { loadScenario } = await import('@/lib/store/scenario-loader');
    await expect(loadScenario('not-a-real-scenario')).rejects.toThrow(
      /scenario|unknown|not found/i,
    );
  });

  it.each(['__proto__', 'constructor', 'toString', 'hasOwnProperty'])(
    'loadScenario rejects prototype-chain key %s WITHOUT wiping state (regression: prototype-key bypass)',
    async (badName) => {
      const { loadScenario } = await import('@/lib/store/scenario-loader');
      // Seed some state first so we can detect any wipe.
      await loadScenario('sarah-mid-build');
      const beforeKeys = Object.keys(localStorage)
        .filter((k) => k.startsWith('decouple:dev:'))
        .sort();
      expect(beforeKeys.length).toBeGreaterThanOrEqual(1);

      await expect(loadScenario(badName)).rejects.toThrow(/unknown|not found|scenario/i);

      // State must be untouched — the wipe should NOT have run.
      const afterKeys = Object.keys(localStorage)
        .filter((k) => k.startsWith('decouple:dev:'))
        .sort();
      expect(afterKeys).toEqual(beforeKeys);
    },
  );

  it('AC-8: applyScenarioFromUrl detects ?scenario= query param and triggers load', async () => {
    // Stub URL to include scenario param.
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        search: '?scenario=sarah-mid-build',
        href: 'http://localhost/test?scenario=sarah-mid-build',
        reload: vi.fn(),
        replace: vi.fn(),
      },
    });
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

    const { applyScenarioFromUrl } = await import('@/lib/store/scenario-loader');
    await applyScenarioFromUrl();

    // Scenario state installed:
    const session = localStorage.getItem('decouple:dev:session:v1');
    expect(session).toBeTruthy();

    // Query-param consumed (replaceState called with a URL lacking ?scenario=):
    expect(replaceStateSpy).toHaveBeenCalled();
    const replacedTo = String(replaceStateSpy.mock.calls[0]?.[2] ?? '');
    expect(replacedTo).not.toMatch(/scenario=/);

    // Reload triggered (or replaceState — implementation may pick one):
    // Lenient: at least the effect of "scenario installed + URL cleaned" must hold.

    // Restore:
    Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
  });

  it('AC-8: applyScenarioFromUrl is a no-op when no scenario param is present', async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        search: '',
        href: 'http://localhost/test',
        reload: vi.fn(),
      },
    });
    const { applyScenarioFromUrl } = await import('@/lib/store/scenario-loader');
    await applyScenarioFromUrl();
    expect(localStorage.getItem('decouple:dev:session:v1')).toBeNull();
    Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
  });
});
