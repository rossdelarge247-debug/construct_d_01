import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O7 } from '@/app/dev/proto/pre-signup-interview/screens/O7';

const GENERATING_DURATION_MS = 3000;

function renderO7() {
  return render(
    <ProtoProvider>
      <O7 />
    </ProtoProvider>,
  );
}

function advanceToReady() {
  act(() => {
    vi.advanceTimersByTime(GENERATING_DURATION_MS + 50);
  });
}

describe('O7 reassurance copy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the V1 closing copy once the generating state resolves', () => {
    renderO7();
    advanceToReady();
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/ve built a strong starting position\./);
  });

  it('positions the reassurance after the situation section and before the Footer CTA', () => {
    renderO7();
    advanceToReady();
    const text = document.body.textContent ?? '';
    const situationIdx = text.indexOf('Your situation');
    const reassuranceMatch = text.search(/ve built a strong starting position/);
    const footerCtaIdx = text.indexOf("What's next");

    expect(situationIdx).toBeGreaterThanOrEqual(0);
    expect(reassuranceMatch).toBeGreaterThanOrEqual(0);
    expect(footerCtaIdx).toBeGreaterThanOrEqual(0);
    expect(reassuranceMatch).toBeGreaterThan(situationIdx);
    expect(reassuranceMatch).toBeLessThan(footerCtaIdx);
  });
});
