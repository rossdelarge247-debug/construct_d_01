'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
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
  allScenarios: TestScenario[];
  loadScenario: (id: string) => void;
  clear: () => void;
};

const BankDataContext = createContext<BankDataContextValue | null>(null);

export function BankDataProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<TestScenario | null>(null);
  const [extractions, setExtractions] = useState<BankStatementExtraction[]>([]);

  const allScenarios = useMemo(() => getAllTestScenarios(), []);

  const sectionSteps = useMemo(() => {
    const result = {} as Record<ConfirmationSectionKey, ConfirmationStep[]>;
    for (const key of CONFIRMATION_SECTIONS) {
      result[key] = extractions.length > 0 ? generateSectionSteps(key, extractions) : [];
    }
    return result;
  }, [extractions]);

  const sectionSummaries = useMemo(() => {
    if (extractions.length === 0) return [];
    const emptyAnswers: Record<string, string> = {};
    return CONFIRMATION_SECTIONS.map(key => generateSectionSummary(key, emptyAnswers, extractions));
  }, [extractions]);

  const loadScenario = useCallback((id: string) => {
    const found = allScenarios.find(s => s.id === id);
    if (!found) return;
    setScenario(found);
    const personaKey = SCENARIO_TO_PERSONA[id];
    setExtractions(createDemoExtractions(personaKey));
  }, [allScenarios]);

  const clear = useCallback(() => {
    setScenario(null);
    setExtractions([]);
  }, []);

  const value = useMemo<BankDataContextValue>(() => ({
    scenario, extractions, sectionSteps, sectionSummaries, allScenarios, loadScenario, clear,
  }), [scenario, extractions, sectionSteps, sectionSummaries, allScenarios, loadScenario, clear]);

  return <BankDataContext.Provider value={value}>{children}</BankDataContext.Provider>;
}

export function useBankData(): BankDataContextValue {
  const ctx = useContext(BankDataContext);
  if (!ctx) {
    return {
      scenario: null, extractions: [], sectionSteps: {} as Record<ConfirmationSectionKey, ConfirmationStep[]>,
      sectionSummaries: [], allScenarios: [], loadScenario: () => {}, clear: () => {},
    };
  }
  return ctx;
}
