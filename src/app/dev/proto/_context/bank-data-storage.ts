import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas';

/**
 * Session-scoped store for connected bank data, shaped for useSyncExternalStore.
 *
 * The Tink callback is a full-page redirect, so React state alone would be lost
 * between the callback page and Your Picture. The callback writes its results
 * under PENDING_KEY; the first read here consumes them into SAVED_KEY so a
 * reload does not wipe the connection. The server snapshot is always null, so
 * hydration renders the empty state and the client fills in afterwards.
 */

export const PENDING_KEY = 'pendingBankData';
const SAVED_KEY = 'decoupleBankData';

export type SavedBankData = { name: string; extractions: BankStatementExtraction[] };

type PendingResult = { extraction?: BankStatementExtraction };

let cache: SavedBankData | null | undefined;
const listeners = new Set<() => void>();

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function parsePending(raw: string): SavedBankData | null {
  try {
    const parsed = JSON.parse(raw) as PendingResult[];
    const extractions = parsed.map(r => r.extraction).filter((e): e is BankStatementExtraction => !!e);
    if (extractions.length === 0) return null;
    const providers = [...new Set(extractions.map(e => e.provider))];
    return { name: `${providers.join(', ')} — Live`, extractions };
  } catch {
    return null;
  }
}

function parseSaved(raw: string): SavedBankData | null {
  try {
    const parsed = JSON.parse(raw) as SavedBankData;
    return Array.isArray(parsed.extractions) && parsed.extractions.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function readFromStorage(): SavedBankData | null {
  const store = storage();
  if (!store) return null;
  const pending = store.getItem(PENDING_KEY);
  if (pending) {
    store.removeItem(PENDING_KEY);
    const data = parsePending(pending);
    if (data) {
      store.setItem(SAVED_KEY, JSON.stringify(data));
      return data;
    }
  }
  const saved = store.getItem(SAVED_KEY);
  return saved ? parseSaved(saved) : null;
}

export function getBankDataSnapshot(): SavedBankData | null {
  if (cache === undefined) cache = readFromStorage();
  return cache;
}

export function getBankDataServerSnapshot(): SavedBankData | null {
  return null;
}

export function subscribeBankData(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function writeBankData(data: SavedBankData | null): void {
  cache = data;
  const store = storage();
  if (store) {
    if (data) store.setItem(SAVED_KEY, JSON.stringify(data));
    else store.removeItem(SAVED_KEY);
  }
  listeners.forEach(l => l());
}

/** Test hook: forget the in-memory snapshot so the next read hits storage. */
export function resetBankDataCache(): void {
  cache = undefined;
}
