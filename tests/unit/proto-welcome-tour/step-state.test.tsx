import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import WelcomeTourPage from '@/app/dev/proto/welcome-tour/page';

const STORAGE_KEY = 'decouple_tour_step';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('WelcomeTourPage — step state machine (AC-11)', () => {
  it('renders intro CTAs by default and persists step 0 to localStorage after mount', () => {
    render(<WelcomeTourPage />);
    expect(screen.getByText('Take the tour')).toBeTruthy();
    expect(screen.getByText('Skip to dashboard')).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('0');
  });

  it('ArrowRight advances the step and shows phase 1 kicker', () => {
    render(<WelcomeTourPage />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1');
    expect(screen.getByText('Phase 1 · Disclose')).toBeTruthy();
  });

  it('Enter advances the step (treated as ArrowRight per canvas)', () => {
    render(<WelcomeTourPage />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1');
  });

  it('five ArrowRight events reach DASH_STEP (5)', () => {
    render(<WelcomeTourPage />);
    for (let i = 0; i < 5; i += 1) {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    }
    expect(localStorage.getItem(STORAGE_KEY)).toBe('5');
  });

  it('ArrowRight at DASH_STEP is a no-op (canvas handler returns early)', () => {
    render(<WelcomeTourPage />);
    for (let i = 0; i < 5; i += 1) {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    }
    expect(localStorage.getItem(STORAGE_KEY)).toBe('5');
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('5');
  });

  it('ArrowLeft retreats one step', () => {
    render(<WelcomeTourPage />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('2');
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1');
  });

  it('ArrowLeft at step 0 is capped (cannot go negative)', () => {
    render(<WelcomeTourPage />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('0');
  });

  it('Escape jumps to DASH_STEP from any non-dashboard step', () => {
    render(<WelcomeTourPage />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('5');
  });

  it('"Skip to dashboard" click jumps to DASH_STEP', () => {
    render(<WelcomeTourPage />);
    fireEvent.click(screen.getByText('Skip to dashboard'));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('5');
  });

  it('hydrates step from localStorage on mount when value is finite', () => {
    localStorage.setItem(STORAGE_KEY, '3');
    render(<WelcomeTourPage />);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('3');
    expect(screen.getByText('Phase 3 · Settle')).toBeTruthy();
  });
});
