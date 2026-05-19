import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SkipScreenButton } from '@/app/dev/proto/pre-signup-interview/components/SkipScreenButton';

describe('SkipScreenButton', () => {
  it('renders with the "Skip this screen" label', () => {
    render(<SkipScreenButton onSkip={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Skip this screen' })).toBeTruthy();
  });

  it('fires onSkip when clicked', () => {
    const onSkip = vi.fn();
    render(<SkipScreenButton onSkip={onSkip} />);
    fireEvent.click(screen.getByRole('button', { name: 'Skip this screen' }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('preserves the 44px minHeight touch target', () => {
    render(<SkipScreenButton onSkip={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Skip this screen' });
    expect(button.style.minHeight).toBe('44px');
  });
});
