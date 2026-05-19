import { useProto } from './proto-context';
import type { Quantitative } from './types';

export function useQuantitativeUpdate() {
  const { answers, setAnswer } = useProto();
  return <K extends keyof Quantitative>(key: K, value: Quantitative[K]) => {
    setAnswer('quantitative', { ...(answers.quantitative ?? {}), [key]: value });
  };
}
