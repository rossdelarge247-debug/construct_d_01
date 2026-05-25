'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type ProfilingAnswers = {
  propertyStatus?: 'mortgage' | 'rent' | 'own_outright' | 'other';
  mortgageProvider?: string;
  rentLandlord?: string;
  rentAmount?: string;
  selfEmployment?: 'me' | 'both' | 'neither';
  businessName?: string;
  businessType?: string;
  hasPension?: string;
  pensionProvider?: string;
  pensionType?: string;
  cetvStatus?: string;
  [key: string]: string | undefined;
};

type ProfilingContextValue = {
  answers: ProfilingAnswers;
  setAnswer: (key: string, value: string) => void;
  clear: () => void;
};

const ProfilingContext = createContext<ProfilingContextValue | null>(null);

export function ProfilingProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<ProfilingAnswers>({});

  const setAnswer = useCallback((key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const clear = useCallback(() => setAnswers({}), []);

  const value = useMemo(() => ({ answers, setAnswer, clear }), [answers, setAnswer, clear]);

  return <ProfilingContext.Provider value={value}>{children}</ProfilingContext.Provider>;
}

export function useProfiling(): ProfilingContextValue {
  const ctx = useContext(ProfilingContext);
  if (!ctx) return { answers: {}, setAnswer: () => {}, clear: () => {} };
  return ctx;
}
