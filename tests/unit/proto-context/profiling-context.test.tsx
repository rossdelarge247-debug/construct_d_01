import { describe, expect, it } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ProfilingProvider, useProfiling } from '@/app/dev/proto/_context/profiling-context';

function Consumer() {
  const ctx = useProfiling();
  return (
    <div>
      <span data-testid="property">{ctx.answers.propertyStatus ?? 'none'}</span>
      <span data-testid="mortgage">{ctx.answers.mortgageProvider ?? 'none'}</span>
      <span data-testid="selfEmp">{ctx.answers.selfEmployment ?? 'none'}</span>
      <span data-testid="pension">{ctx.answers.hasPension ?? 'none'}</span>
      <button onClick={() => ctx.setAnswer('propertyStatus', 'mortgage')}>set-property</button>
      <button onClick={() => ctx.setAnswer('mortgageProvider', 'Halifax')}>set-mortgage</button>
      <button onClick={() => ctx.setAnswer('selfEmployment', 'neither')}>set-selfemp</button>
      <button onClick={() => ctx.setAnswer('hasPension', 'yes')}>set-pension</button>
      <button onClick={() => ctx.clear()}>clear</button>
    </div>
  );
}

describe('ProfilingProvider', () => {
  it('starts with empty answers', () => {
    render(<ProfilingProvider><Consumer /></ProfilingProvider>);
    expect(screen.getByTestId('property').textContent).toBe('none');
  });

  it('sets individual answers', () => {
    render(<ProfilingProvider><Consumer /></ProfilingProvider>);
    act(() => screen.getByText('set-property').click());
    expect(screen.getByTestId('property').textContent).toBe('mortgage');
  });

  it('sets multiple answers independently', () => {
    render(<ProfilingProvider><Consumer /></ProfilingProvider>);
    act(() => screen.getByText('set-property').click());
    act(() => screen.getByText('set-mortgage').click());
    expect(screen.getByTestId('property').textContent).toBe('mortgage');
    expect(screen.getByTestId('mortgage').textContent).toBe('Halifax');
  });

  it('clears all answers', () => {
    render(<ProfilingProvider><Consumer /></ProfilingProvider>);
    act(() => screen.getByText('set-property').click());
    act(() => screen.getByText('clear').click());
    expect(screen.getByTestId('property').textContent).toBe('none');
  });
});
