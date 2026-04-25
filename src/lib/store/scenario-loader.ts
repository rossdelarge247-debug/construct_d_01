import coldSarah from './scenarios/cold-sarah.json';
import sarahMidBuild from './scenarios/sarah-mid-build.json';

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
  'sarah-mid-build': sarahMidBuild as Scenario,
};

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
  const scenario = SCENARIOS[name];
  if (!scenario) {
    throw new Error(`Unknown scenario: "${name}". Available: ${Object.keys(SCENARIOS).join(', ')}`);
  }
  wipeDevState();
  installScenario(scenario);
}

export async function applyScenarioFromUrl(): Promise<void> {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const name = params.get('scenario');
  if (!name) return;

  await loadScenario(name);

  // Consume the param so a reload doesn't re-trigger the scenario load.
  params.delete('scenario');
  const remaining = params.toString();
  const newUrl =
    window.location.pathname + (remaining ? `?${remaining}` : '') + window.location.hash;
  window.history.replaceState({}, '', newUrl);
}
