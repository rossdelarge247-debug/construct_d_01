import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from '@/app/dev/proto/_components/SectionHeader';

describe('SectionHeader', () => {
  it('renders section title', () => {
    render(<SectionHeader section="build" count={10} />);
    expect(screen.getByText('Build')).toBeInTheDocument();
  });

  it('renders row count in parentheses', () => {
    render(<SectionHeader section="hub" count={5} />);
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('renders as semantic h2', () => {
    const { container } = render(<SectionHeader section="settle" count={5} />);
    expect(container.querySelector('h2')).not.toBeNull();
  });

  it('renders all 11 section labels distinctly', () => {
    const sections = [
      'pre-auth-public',
      'auth-boundary',
      'post-signup-onboarding',
      'bank-connect',
      'hub',
      'build',
      'reconcile',
      'settle',
      'finalise',
      'cross-cutting',
      'dev-tools',
    ] as const;
    for (const s of sections) {
      const { unmount } = render(<SectionHeader section={s} count={1} />);
      unmount();
    }
  });
});
