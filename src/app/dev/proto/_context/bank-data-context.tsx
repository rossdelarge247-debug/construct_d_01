'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { getAllTestScenarios, type TestScenario } from '@/lib/bank/test-scenarios';
import { createDemoExtractions } from '@/lib/bank/bank-data-utils';
import {
  CONFIRMATION_SECTIONS,
  generateSectionSteps,
  generateSectionSummary,
  type ConfirmationStep,
  type SectionSummaryData,
  type ConfirmationSectionKey,
} from '@/lib/bank/confirmation-questions';
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas';
import { useProfiling } from './profiling-context';
import { getBankDataServerSnapshot, getBankDataSnapshot, subscribeBankData, writeBankData } from './bank-data-storage';

const SCENARIO_TO_PERSONA: Record<string, string | undefined> = {
  'sarah-employed-homeowner': undefined,
  'marcus-self-employed-renter': 'self-employed',
  'jean-retired-outright': 'retired',
  'aisha-part-time-benefits': 'part-time',
  'david-high-earner-investments': undefined,
};

type BankDataContextValue = {
  scenario: TestScenario | null;
  extractions: BankStatementExtraction[];
  sectionSteps: Record<ConfirmationSectionKey, ConfirmationStep[]>;
  sectionSummaries: SectionSummaryData[];
  profilingAnswers: Record<string, string | undefined>;
  allScenarios: TestScenario[];
  loadScenario: (id: string) => void;
  loadExtractions: (name: string, exts: BankStatementExtraction[]) => void;
  clear: () => void;
};

const BankDataContext = createContext<BankDataContextValue | null>(null);

export function BankDataProvider({ children }: { children: ReactNode }) {
  const persisted = useSyncExternalStore(subscribeBankData, getBankDataSnapshot, getBankDataServerSnapshot);
  const extractions = useMemo(() => persisted?.extractions ?? [], [persisted]);
  const [demoScenario, setDemoScenario] = useState<TestScenario | null>(null);
  const scenario = useMemo<TestScenario | null>(() => {
    if (!persisted) return null;
    if (demoScenario) return demoScenario;
    return {
      id: 'live-connected', name: persisted.name, description: 'Connected via Open Banking',
      provider: persisted.extractions[0]?.provider ?? 'Unknown', accountType: 'current', isJoint: false,
      transactions: [], expectedIncomes: [], expectedPayments: [],
      expectedQuestions: [], expectedGaps: [], expectedClassifiedRate: 0,
    };
  }, [persisted, demoScenario]);
  const { answers: profilingAnswers } = useProfiling();

  const allScenarios = useMemo(() => getAllTestScenarios(), []);

  const sectionSteps = useMemo(() => {
    const result = {} as Record<ConfirmationSectionKey, ConfirmationStep[]>;
    for (const key of CONFIRMATION_SECTIONS) {
      if (key === 'business' && profilingAnswers.selfEmployment === 'neither') {
        result[key] = [];
        continue;
      }
      result[key] = extractions.length > 0 ? generateSectionSteps(key, extractions) : [];
    }
    return result;
  }, [extractions, profilingAnswers.selfEmployment]);

  const sectionSummaries = useMemo(() => {
    if (extractions.length === 0) return [];
    const emptyAnswers: Record<string, string> = {};
    return CONFIRMATION_SECTIONS.map(key => generateSectionSummary(key, emptyAnswers, extractions));
  }, [extractions]);

  const loadScenario = useCallback((id: string) => {
    const found = allScenarios.find(s => s.id === id);
    if (!found) return;
    setDemoScenario(found);
    writeBankData({ name: found.name, extractions: createDemoExtractions(SCENARIO_TO_PERSONA[id]) });
  }, [allScenarios]);

  const loadExtractions = useCallback((name: string, exts: BankStatementExtraction[]) => {
    setDemoScenario(null);
    writeBankData({ name, extractions: exts });
  }, []);

  const clear = useCallback(() => {
    setDemoScenario(null);
    writeBankData(null);
  }, []);

  const value = useMemo<BankDataContextValue>(() => ({
    scenario, extractions, sectionSteps, sectionSummaries, profilingAnswers, allScenarios, loadScenario, loadExtractions, clear,
  }), [scenario, extractions, sectionSteps, sectionSummaries, profilingAnswers, allScenarios, loadScenario, loadExtractions, clear]);

  return <BankDataContext.Provider value={value}>{children}</BankDataContext.Provider>;
}

export function useBankData(): BankDataContextValue {
  const ctx = useContext(BankDataContext);
  if (!ctx) {
    return {
      scenario: null, extractions: [], sectionSteps: {} as Record<ConfirmationSectionKey, ConfirmationStep[]>,
      sectionSummaries: [], profilingAnswers: {}, allScenarios: [], loadScenario: () => {}, loadExtractions: () => {}, clear: () => {},
    };
  }
  return ctx;
}
