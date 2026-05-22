import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoachFooter } from '@/app/dev/proto/ai-coach/_components/CoachFooter';

const C_A3_VERBATIM =
  'AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice.';

describe('CoachFooter', () => {
  it('renders the C-A3 verbatim disclaimer copy', () => {
    render(<CoachFooter />);
    expect(screen.getByText(C_A3_VERBATIM)).toBeTruthy();
  });
});
