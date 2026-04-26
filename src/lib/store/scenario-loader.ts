import coldSarah from './scenarios/cold-sarah.json';
import sarahMidBuild from './scenarios/sarah-mid-build.json';
import sarahConnected from './scenarios/sarah-connected.json';
import sarahComplete from './scenarios/sarah-complete.json';
import sarahSharedMarkInvited from './scenarios/sarah-shared-mark-invited.json';
import sarahReconcileInProgress from './scenarios/sarah-reconcile-in-progress.json';
import sarahSettle from './scenarios/sarah-settle.json';
import sarahFinalise from './scenarios/sarah-finalise.json';

interface ScenarioStoreEntry {
  userId: string;
  scope: string;
  data: unknown;
}

interface Scenario {
  session: Record<string, unknown> | null;
  store: ScenarioStoreEntry[];
}

const SCENARIOS: Record<string, Scenario> = {
  'cold-sarah': coldSarah as Scenario,
  'sarah-connected': sarahConnected as Scenario,
  'sarah-mid-build': sarahMidBuild as Scenario,
  'sarah-complete': sarahComplete as Scenario,
  'sarah-shared-mark-invited': sarahSharedMarkInvited as Scenario,
  'sarah-reconcile-in-progress': sarahReconcileInProgress as Scenario,
  'sarah-settle': sarahSettle as Scenario,
  'sarah-finalise': sarahFinalise as Scenario,
};

export const SCENARIO_NAMES = Object.keys(SCENARIOS);

const SESSION_KEY = 'decouple:dev:session:v1';
const DEV_KEY_PREFIX = 'decouple:dev:';

function wipeDevState(): void {
  if (typeof localStorage === 'undefined') return;
  const toRemove = Object.keys(localStorage).filter((k) => k.startsWith(DEV_KEY_PREFIX));
  toRemove.forEach((k) => localStorage.removeItem(k));
}

function installScenario(scenario: Scenario): void {
  if (typeof localStorage === 'undefined') return;
  if (scenario.session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(scenario.session));
  }
  for (const entry of scenario.store) {
    const key = `decouple:dev:store:v1:${entry.userId}:${entry.scope}`;
    localStorage.setItem(key, JSON.stringify(entry.data));
  }
}

export async function loadScenario(name: string): Promise<void> {
  // Object.hasOwn rejects prototype keys (`__proto__`, `constructor`, `toString`, …)
  // — without it, `SCENARIOS["__proto__"]` returns `Object.prototype` (truthy)
  // and bypasses the guard, allowing a wipe-then-crash via attacker-controlled URL.
  if (!Object.hasOwn(SCENARIOS, name)) {
    throw new Error(`Unknown scenario: "${name}". Available: ${Object.keys(SCENARIOS).join(', ')}`);
  }
  wipeDevState();
  installScenario(SCENARIOS[name]);
}

export async function applyScenarioFromUrl(): Promise<void> {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const name = params.get('scenario');
  if (!name) return;

  // try/finally: even if loadScenario throws (unknown scenario, bad fixture),
  // the URL param must be consumed so a reload doesn't replay the failure.
  try {
    await loadScenario(name);
  } finally {
    params.delete('scenario');
    const remaining = params.toString();
    const newUrl =
      window.location.pathname + (remaining ? `?${remaining}` : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }
}
