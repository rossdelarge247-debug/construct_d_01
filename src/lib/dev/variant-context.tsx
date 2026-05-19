'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  isValidVariantId,
  type VariantRegistry,
  type VariantSet,
} from './variant-manifest';

const STORAGE_PREFIX = 'dev:variant:';
const URL_PREFIX = 'variant.';

type ActiveState = Record<string, Record<string, string>>;

type VariantContextValue = {
  registry: VariantRegistry;
  active: ActiveState;
  setVariant: (prototypeId: string, variantKey: string, variantId: string) => void;
  resetVariant: (prototypeId: string, variantKey: string) => void;
};

const VariantContext = createContext<VariantContextValue | null>(null);

function storageKey(prototypeId: string, variantKey: string): string {
  return `${STORAGE_PREFIX}${prototypeId}:${variantKey}`;
}

function urlKey(variantKey: string): string {
  return `${URL_PREFIX}${variantKey}`;
}

function lookupSet(
  registry: VariantRegistry,
  prototypeId: string,
  variantKey: string,
): VariantSet | undefined {
  return registry[prototypeId]?.manifest[variantKey];
}

function readDefault(
  registry: VariantRegistry,
  prototypeId: string,
  variantKey: string,
): string {
  return lookupSet(registry, prototypeId, variantKey)?.default ?? '';
}

function readStored(prototypeId: string, variantKey: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(storageKey(prototypeId, variantKey));
  } catch {
    return null;
  }
}

function readFromURL(variantKey: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(urlKey(variantKey));
  } catch {
    return null;
  }
}

function resolveActive(
  registry: VariantRegistry,
  prototypeId: string,
  variantKey: string,
): string {
  const set = lookupSet(registry, prototypeId, variantKey);
  const fromUrl = readFromURL(variantKey);
  if (isValidVariantId(set, fromUrl)) return fromUrl;
  const fromStorage = readStored(prototypeId, variantKey);
  if (isValidVariantId(set, fromStorage)) return fromStorage;
  return set?.default ?? '';
}

function initialDefaults(registry: VariantRegistry): ActiveState {
  const out: ActiveState = {};
  for (const [prototypeId, entry] of Object.entries(registry)) {
    out[prototypeId] = {};
    for (const [variantKey, set] of Object.entries(entry.manifest)) {
      out[prototypeId][variantKey] = set.default;
    }
  }
  return out;
}

export function VariantProvider({
  registry,
  children,
}: {
  registry: VariantRegistry;
  children: ReactNode;
}) {
  const [active, setActive] = useState<ActiveState>(() => initialDefaults(registry));

  useEffect(() => {
    const next: ActiveState = {};
    for (const [prototypeId, entry] of Object.entries(registry)) {
      next[prototypeId] = {};
      for (const variantKey of Object.keys(entry.manifest)) {
        next[prototypeId][variantKey] = resolveActive(registry, prototypeId, variantKey);
      }
    }
    setActive(next);
  }, [registry]);

  const setVariant = useCallback(
    (prototypeId: string, variantKey: string, variantId: string) => {
      const set = lookupSet(registry, prototypeId, variantKey);
      if (!isValidVariantId(set, variantId)) return;
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey(prototypeId, variantKey), variantId);
        } catch {
          // storage unavailable; state update still proceeds
        }
      }
      setActive((prev) => ({
        ...prev,
        [prototypeId]: { ...(prev[prototypeId] ?? {}), [variantKey]: variantId },
      }));
    },
    [registry],
  );

  const resetVariant = useCallback(
    (prototypeId: string, variantKey: string) => {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(storageKey(prototypeId, variantKey));
        } catch {
          // storage unavailable; state update still proceeds
        }
      }
      setActive((prev) => ({
        ...prev,
        [prototypeId]: {
          ...(prev[prototypeId] ?? {}),
          [variantKey]: readDefault(registry, prototypeId, variantKey),
        },
      }));
    },
    [registry],
  );

  const value = useMemo<VariantContextValue>(
    () => ({ registry, active, setVariant, resetVariant }),
    [registry, active, setVariant, resetVariant],
  );

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

export function useVariant(prototypeId: string, variantKey: string): string {
  const ctx = useContext(VariantContext);
  if (!ctx) return '';
  return ctx.active[prototypeId]?.[variantKey] ?? '';
}

export function useSetVariant(
  prototypeId: string,
  variantKey: string,
): (variantId: string) => void {
  const ctx = useContext(VariantContext);
  return useCallback(
    (variantId: string) => {
      ctx?.setVariant(prototypeId, variantKey, variantId);
    },
    [ctx, prototypeId, variantKey],
  );
}

export function useResetVariant(
  prototypeId: string,
  variantKey: string,
): () => void {
  const ctx = useContext(VariantContext);
  return useCallback(() => {
    ctx?.resetVariant(prototypeId, variantKey);
  }, [ctx, prototypeId, variantKey]);
}

export function useVariantRegistry(): VariantRegistry | null {
  const ctx = useContext(VariantContext);
  return ctx?.registry ?? null;
}
