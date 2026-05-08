import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtoHubPage from '@/app/dev/proto/page.dev.tsx';

describe('ProtoHubPage', () => {
  it('renders main h1 heading', () => {
    render(<ProtoHubPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /design uncertainty registry/i }),
    ).toBeInTheDocument();
  });

  it('renders all 11 section headers', () => {
    render(<ProtoHubPage />);
    const expectedSectionTitles = [
      'Pre-auth public',
      'Auth boundary',
      'Post-signup onboarding',
      'Bank-connect',
      'Hub',
      'Build',
      'Reconcile',
      'Settle',
      'Finalise',
      'Cross-cutting',
      'Dev tools',
    ];
    for (const title of expectedSectionTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('renders 61 flow rows across all sections', () => {
    const { container } = render(<ProtoHubPage />);
    expect(container.querySelectorAll('article')).toHaveLength(61);
  });

  it('header reports the count and section total', () => {
    render(<ProtoHubPage />);
    expect(screen.getByText(/61 flows tracked/i)).toBeInTheDocument();
    expect(screen.getByText(/11 sections/i)).toBeInTheDocument();
  });
});
