import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CoachCard } from '@/app/dev/proto/ai-coach/_components/CoachCard';

const BASE = {
  title: 'Test title',
  body: 'Test body prose.',
  reasoning: 'Detailed reasoning paragraph that appears when SHOW REASONING is clicked.',
};

describe('CoachCard', () => {
  describe('type variants', () => {
    it.each([
      ['court-reasonableness', 'No pension sharing is unusually weak'],
      ['fairness-check', '3-year spousal is on the longer end'],
      ['coaching', 'Your home split is clean'],
      ['on-this-comment', 'On this comment'],
    ] as const)('renders %s card with data-card-type attribute', (type, title) => {
      const { container } = render(<CoachCard {...BASE} type={type} title={title} />);
      const card = container.querySelector(`[data-card-type="${type}"]`);
      expect(card).toBeTruthy();
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  describe('SHOW REASONING toggle (S-A4)', () => {
    it('starts with reasoning content collapsed (not in DOM)', () => {
      render(<CoachCard {...BASE} type="court-reasonableness" />);
      expect(screen.queryByText(BASE.reasoning)).toBeNull();
    });

    it('expands reasoning content on click', () => {
      render(<CoachCard {...BASE} type="court-reasonableness" />);
      const toggle = screen.getByRole('button', { name: /SHOW REASONING/i });
      fireEvent.click(toggle);
      expect(screen.getByText(BASE.reasoning)).toBeTruthy();
    });

    it('collapses reasoning content on second click', () => {
      render(<CoachCard {...BASE} type="court-reasonableness" />);
      const toggle = screen.getByRole('button', { name: /SHOW REASONING/i });
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      expect(screen.queryByText(BASE.reasoning)).toBeNull();
    });
  });

  describe('FALLBACK POSITIONS subsection (S-A5)', () => {
    const fallbacks = [
      { title: 'Open with 20% share', rationale: '£36,082 to Mark · likely middle ground' },
      { title: 'Offset against home equity', rationale: 'Keep pension, Mark takes more of home' },
      { title: 'Defer to next review', rationale: '12-month structured review tied to home sale' },
    ];

    it('renders FALLBACK POSITIONS label when fallbacks prop is present', () => {
      render(<CoachCard {...BASE} type="court-reasonableness" fallbacks={fallbacks} />);
      expect(screen.getByText('FALLBACK POSITIONS')).toBeTruthy();
    });

    it('renders 3 fallback entries with title + rationale + Adopt button', () => {
      render(<CoachCard {...BASE} type="court-reasonableness" fallbacks={fallbacks} />);
      for (const fb of fallbacks) {
        expect(screen.getByText(fb.title)).toBeTruthy();
        expect(screen.getByText(fb.rationale)).toBeTruthy();
      }
      const adoptButtons = screen.getAllByRole('button', { name: /Adopt/i });
      expect(adoptButtons.length).toBe(3);
    });

    it('omits FALLBACK POSITIONS subsection when fallbacks prop is absent', () => {
      render(<CoachCard {...BASE} type="fairness-check" />);
      expect(screen.queryByText('FALLBACK POSITIONS')).toBeNull();
    });
  });
});
