'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Answers } from './types';
import { TOTAL_STEPS } from './types';

interface ProtoState {
  answers: Answers;
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  step: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
}

const ProtoContext = createContext<ProtoState | null>(null);

export function ProtoProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<number>(1);

  const setAnswer = useCallback(<K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => setStep((s) => Math.min(TOTAL_STEPS, s + 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);
  const goTo = useCallback((s: number) => setStep(Math.max(1, Math.min(TOTAL_STEPS, s))), []);

  const value = useMemo<ProtoState>(
    () => ({ answers, setAnswer, step, next, back, goTo }),
    [answers, setAnswer, step, next, back, goTo],
  );

  return <ProtoContext.Provider value={value}>{children}</ProtoContext.Provider>;
}

export function useProto(): ProtoState {
  const ctx = useContext(ProtoContext);
  if (!ctx) throw new Error('useProto must be used within ProtoProvider');
  return ctx;
}
