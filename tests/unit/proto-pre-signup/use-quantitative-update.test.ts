import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ProtoProvider, useProto } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { useQuantitativeUpdate } from '@/app/dev/proto/pre-signup-interview/lib/use-quantitative-update';

function wrapper({ children }: { children: ReactNode }) {
  return createElement(ProtoProvider, null, children);
}

function setup() {
  return renderHook(
    () => {
      const { answers } = useProto();
      const update = useQuantitativeUpdate();
      return { quantitative: answers.quantitative, update };
    },
    { wrapper },
  );
}

describe('useQuantitativeUpdate', () => {
  it('writes a value to the quantitative state when called', () => {
    const { result } = setup();
    act(() => {
      result.current.update('combined_monthly_income', '2-4k');
    });
    expect(result.current.quantitative).toEqual({ combined_monthly_income: '2-4k' });
  });

  it('merges subsequent updates rather than overwriting prior fields', () => {
    const { result } = setup();
    act(() => {
      result.current.update('combined_monthly_income', '2-4k');
    });
    act(() => {
      result.current.update('total_assets', '10-50k');
    });
    expect(result.current.quantitative).toEqual({
      combined_monthly_income: '2-4k',
      total_assets: '10-50k',
    });
  });

  it('overwrites the same key on repeat calls', () => {
    const { result } = setup();
    act(() => {
      result.current.update('your_age', '30-39');
    });
    act(() => {
      result.current.update('your_age', '40-49');
    });
    expect(result.current.quantitative).toEqual({ your_age: '40-49' });
  });

  it('writes null to a field for "Prefer not to say" semantics', () => {
    const { result } = setup();
    act(() => {
      result.current.update('combined_monthly_income', null);
    });
    expect(result.current.quantitative).toEqual({ combined_monthly_income: null });
  });
});
