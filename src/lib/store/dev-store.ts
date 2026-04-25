import type { WorkspaceStore } from './types';

// v1 = first localStorage layout for dev workspace store; v2 will require migration.
const KEY_PREFIX = 'decouple:dev:store:v1';

const memoryFallback = new Map<string, unknown>();
let degraded = false;
let warned = false;

function key(userId: string, scope: string): string {
  return `${KEY_PREFIX}:${userId}:${scope}`;
}

function warnOnce(reason: string): void {
  if (warned) return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(`[dev-store] localStorage unavailable (${reason}); falling back to in-memory.`);
}

function degrade(reason: string): void {
  degraded = true;
  warnOnce(reason);
}

export const devStore: WorkspaceStore = {
  async read<T>(userId: string, scope: string): Promise<T | null> {
    const k = key(userId, scope);
    if (degraded || typeof localStorage === 'undefined') {
      return (memoryFallback.get(k) as T | undefined) ?? null;
    }
    try {
      const raw = localStorage.getItem(k);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch (err) {
      degrade(err instanceof Error ? err.message : 'unknown read error');
      return (memoryFallback.get(k) as T | undefined) ?? null;
    }
  },

  async write<T>(userId: string, scope: string, data: T): Promise<void> {
    const k = key(userId, scope);
    memoryFallback.set(k, data);
    if (degraded || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(k, JSON.stringify(data));
    } catch (err) {
      degrade(err instanceof Error ? err.message : 'unknown write error');
    }
  },

  subscribe<T>(_userId: string, _scope: string, _callback: (data: T) => void): () => void {
    // α stub — real cross-tab + same-tab subscribe lands in β per spec 71 §4 line 242.
    return () => {};
  },
};
