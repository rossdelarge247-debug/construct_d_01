import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dev/proto/ai-coach/page';

describe('/dev/proto/ai-coach page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the back-link to /dev/proto', () => {
    render(<Page />);
    const back = screen.getByRole('link', { name: /back to registry/i });
    expect(back.getAttribute('href')).toBe('/dev/proto');
  });

  it('renders the AI coach tab as default-active (S-A1)', () => {
    render(<Page />);
    const aiTab = screen.getByRole('tab', { name: /AI coach/ });
    expect(aiTab.getAttribute('aria-selected')).toBe('true');
  });

  it('renders all 4 coach card variants under the AI coach panel', () => {
    const { container } = render(<Page />);
    for (const type of ['court-reasonableness', 'fairness-check', 'coaching', 'on-this-comment'] as const) {
      const card = container.querySelector(`[data-card-type="${type}"]`);
      expect(card, `card type ${type} missing`).toBeTruthy();
    }
  });

  it('renders the S-A3 verbatim summary banner intro', () => {
    render(<Page />);
    expect(screen.getByText(/Your draft sits at 54\/46 to you/)).toBeTruthy();
  });

  it('renders the C-A3 verbatim footer disclaimer', () => {
    render(<Page />);
    expect(screen.getByText(/AI suggestions are guidance based on typical court outcomes/)).toBeTruthy();
  });

  it('court-reasonableness card carries FALLBACK POSITIONS subsection', () => {
    render(<Page />);
    expect(screen.getByText('FALLBACK POSITIONS')).toBeTruthy();
  });
});
