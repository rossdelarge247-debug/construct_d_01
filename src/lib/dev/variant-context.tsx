'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  isValidVariantId,
  type VariantRegistry,
  type VariantSet,
} from './variant-manifest';

const STORAGE_PREFIX = 'dev:variant:';
const URL_PREFIX = 'variant.';

type VariantContextValue = {
  registry: VariantRegistry;
};

const VariantContext = createContext<VariantContextValue | null>(null);

const subscribers = new Set<() => void>();

function notifyAll(): void {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      // subscriber threw; continue notifying others
    }
  });
}

function subscribe(callback: () => void): () => void {
  subscribers.add(callback);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
  }
  return () => {
    subscribers.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

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

export function VariantProvider({
  registry,
  children,
}: {
  registry: VariantRegistry;
  children: ReactNode;
}) {
  const value = useMemo<VariantContextValue>(() => ({ registry }), [registry]);
  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

export function useVariant(prototypeId: string, variantKey: string): string {
  const ctx = useContext(VariantContext);
  const getSnapshot = useCallback(() => {
    if (!ctx) return '';
    return resolveActive(ctx.registry, prototypeId, variantKey);
  }, [ctx, prototypeId, variantKey]);
  const getServerSnapshot = useCallback(() => {
    if (!ctx) return '';
    return lookupSet(ctx.registry, prototypeId, variantKey)?.default ?? '';
  }, [ctx, prototypeId, variantKey]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSetVariant(
  prototypeId: string,
  variantKey: string,
): (variantId: string) => void {
  const ctx = useContext(VariantContext);
  return useCallback(
    (variantId: string) => {
      if (!ctx) return;
      const set = lookupSet(ctx.registry, prototypeId, variantKey);
      if (!isValidVariantId(set, variantId)) return;
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey(prototypeId, variantKey), variantId);
        } catch {
          // storage unavailable; notify subscribers anyway in case they re-resolve from URL
        }
      }
      notifyAll();
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
    if (!ctx) return;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(storageKey(prototypeId, variantKey));
      } catch {
        // storage unavailable
      }
    }
    notifyAll();
  }, [ctx, prototypeId, variantKey]);
}

