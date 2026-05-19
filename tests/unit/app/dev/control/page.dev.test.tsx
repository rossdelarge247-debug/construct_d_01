import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@/lib/auth', () => ({ MODE: 'dev' }));

import VariantControlPage from '@/app/dev/control/page.dev';

const STORAGE_KEY = 'dev:variant:pre-signup-interview:helpRail';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('VariantControlPage — render', () => {
  it('renders the prototype label and helpRail options', () => {
    render(<VariantControlPage />);
    expect(screen.getByText('Prototype variant control')).toBeTruthy();
    expect(screen.getByText('Pre-signup interview')).toBeTruthy();
    expect(screen.getByText('Desktop Help Rail')).toBeTruthy();
    expect(screen.getByText('Off (mobile-only behaviour)')).toBeTruthy();
    expect(screen.getByText(/V1 · Glossary/)).toBeTruthy();
    expect(screen.getByText(/V5 · Hybrid \(tabbed\)/)).toBeTruthy();
  });

  it('marks the default option (off) as initially checked', () => {
    render(<VariantControlPage />);
    const offRadio = screen.getByLabelText(/Off \(mobile-only behaviour\)/) as HTMLInputElement;
    expect(offRadio.checked).toBe(true);
  });
});

describe('VariantControlPage — interaction', () => {
  it('selecting V2 updates localStorage and active state', () => {
    render(<VariantControlPage />);
    const v2Radio = screen.getByLabelText(/V2 · AI Coach/) as HTMLInputElement;
    fireEvent.click(v2Radio);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('v2');
    expect(v2Radio.checked).toBe(true);
  });

  it('reset clears localStorage and reverts to default', () => {
    localStorage.setItem(STORAGE_KEY, 'v3');
    render(<VariantControlPage />);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('v3');
    const resetButton = screen.getByText('Reset to default');
    fireEvent.click(resetButton);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    const offRadio = screen.getByLabelText(/Off \(mobile-only behaviour\)/) as HTMLInputElement;
    expect(offRadio.checked).toBe(true);
  });
});

describe('VariantControlPage — mode gate', () => {
  it('returns null when MODE is not dev', async () => {
    vi.resetModules();
    vi.doMock('@/lib/auth', () => ({ MODE: 'prod' }));
    const { default: GatedPage } = await import('@/app/dev/control/page.dev');
    const { container } = render(<GatedPage />);
    expect(container.firstChild).toBeNull();
    vi.resetModules();
    vi.doMock('@/lib/auth', () => ({ MODE: 'dev' }));
  });
});
