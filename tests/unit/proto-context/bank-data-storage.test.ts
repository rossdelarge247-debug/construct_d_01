import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PENDING_KEY,
  getBankDataServerSnapshot,
  getBankDataSnapshot,
  resetBankDataCache,
  subscribeBankData,
  writeBankData,
} from '@/app/dev/proto/_context/bank-data-storage';
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas';

const extraction = (provider: string): BankStatementExtraction => ({
  document_type: 'bank_statement', provider, account_number_last4: '1234', account_type: 'current',
  is_joint: false, joint_holder_name: null, statement_period_start: '2026-01-01', statement_period_end: '2026-06-30',
  closing_balance: 100, income_deposits: [], regular_payments: [], spending_categories: [], notable_transactions: [],
});

describe('bank-data-storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetBankDataCache();
  });

  it('is empty when nothing is stored', () => {
    expect(getBankDataSnapshot()).toBeNull();
    expect(getBankDataServerSnapshot()).toBeNull();
  });

  it('consumes the callback payload once and keeps it as saved data', () => {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify([
      { extraction: extraction('Demo Bank') },
      { extraction: extraction('Monzo') },
      { result: null },
    ]));
    const snap = getBankDataSnapshot();
    expect(snap?.name).toBe('Demo Bank, Monzo — Live');
    expect(snap?.extractions.map(e => e.provider)).toEqual(['Demo Bank', 'Monzo']);
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();

    resetBankDataCache();
    expect(getBankDataSnapshot()?.name).toBe('Demo Bank, Monzo — Live');
  });

  it('survives a reload via the saved key and notifies subscribers on write', () => {
    const listener = vi.fn();
    subscribeBankData(listener);
    writeBankData({ name: 'Sarah', extractions: [extraction('Barclays')] });
    expect(listener).toHaveBeenCalledTimes(1);

    resetBankDataCache();
    expect(getBankDataSnapshot()?.extractions[0].provider).toBe('Barclays');

    writeBankData(null);
    resetBankDataCache();
    expect(getBankDataSnapshot()).toBeNull();
  });

  it('ignores malformed or empty payloads', () => {
    sessionStorage.setItem(PENDING_KEY, 'not json');
    expect(getBankDataSnapshot()).toBeNull();
    resetBankDataCache();
    sessionStorage.setItem(PENDING_KEY, JSON.stringify([{ result: null }]));
    expect(getBankDataSnapshot()).toBeNull();
  });
});
