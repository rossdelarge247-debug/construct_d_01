import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SCREEN_TRANSITION_FADE_OUT_MS,
  useScreenTransition,
} from '@/app/dev/proto/pre-signup-interview/lib/use-screen-transition';

describe('useScreenTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at phase=idle with renderedStep matching the initial step', () => {
    const { result } = renderHook(({ step }) => useScreenTransition(step), {
      initialProps: { step: 1 },
    });
    expect(result.current.phase).toBe('idle');
    expect(result.current.renderedStep).toBe(1);
  });

  it('switches to phase=leaving immediately on step change, keeping renderedStep', () => {
    const { result, rerender } = renderHook(
      ({ step }) => useScreenTransition(step),
      { initialProps: { step: 1 } },
    );
    rerender({ step: 2 });
    expect(result.current.phase).toBe('leaving');
    expect(result.current.renderedStep).toBe(1);
  });

  it('advances to phase=idle with the new renderedStep after the fade-out timer', () => {
    const { result, rerender } = renderHook(
      ({ step }) => useScreenTransition(step),
      { initialProps: { step: 1 } },
    );
    rerender({ step: 2 });
    act(() => {
      vi.advanceTimersByTime(SCREEN_TRANSITION_FADE_OUT_MS);
    });
    expect(result.current.phase).toBe('idle');
    expect(result.current.renderedStep).toBe(2);
  });

  it('does not advance renderedStep before the fade-out timer completes', () => {
    const { result, rerender } = renderHook(
      ({ step }) => useScreenTransition(step),
      { initialProps: { step: 1 } },
    );
    rerender({ step: 2 });
    act(() => {
      vi.advanceTimersByTime(SCREEN_TRANSITION_FADE_OUT_MS - 1);
    });
    expect(result.current.phase).toBe('leaving');
    expect(result.current.renderedStep).toBe(1);
  });

  it('handles a step change during the leaving phase by resetting the timer to target the latest step', () => {
    const { result, rerender } = renderHook(
      ({ step }) => useScreenTransition(step),
      { initialProps: { step: 1 } },
    );
    rerender({ step: 2 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ step: 3 });
    expect(result.current.phase).toBe('leaving');
    expect(result.current.renderedStep).toBe(1);
    act(() => {
      vi.advanceTimersByTime(SCREEN_TRANSITION_FADE_OUT_MS);
    });
    expect(result.current.phase).toBe('idle');
    expect(result.current.renderedStep).toBe(3);
  });

  it('exposes the spec-26 §5 fade-out timing constant (200ms)', () => {
    expect(SCREEN_TRANSITION_FADE_OUT_MS).toBe(200);
  });
});
