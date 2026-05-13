import { useEffect, useState } from 'react';

export type ScreenTransitionPhase = 'idle' | 'leaving';

export const SCREEN_TRANSITION_FADE_OUT_MS = 200;

interface ScreenTransitionState {
  renderedStep: number;
  phase: ScreenTransitionPhase;
}

export function useScreenTransition(step: number): ScreenTransitionState {
  const [renderedStep, setRenderedStep] = useState(step);

  useEffect(() => {
    if (step === renderedStep) return;
    const leaveTimer = setTimeout(() => {
      setRenderedStep(step);
    }, SCREEN_TRANSITION_FADE_OUT_MS);
    return () => {
      clearTimeout(leaveTimer);
    };
  }, [step, renderedStep]);

  const phase: ScreenTransitionPhase = step !== renderedStep ? 'leaving' : 'idle';
  return { renderedStep, phase };
}
