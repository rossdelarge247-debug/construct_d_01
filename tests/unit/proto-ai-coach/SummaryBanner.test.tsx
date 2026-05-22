import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryBanner } from '@/app/dev/proto/ai-coach/_components/SummaryBanner';

const VERBATIM_INTRO =
  "Your draft sits at 54/46 to you. That's within normal court range, but two items will likely be challenged — here's what to expect.";

describe('SummaryBanner', () => {
  it('renders the S-A3 verbatim intro paragraph', () => {
    render(<SummaryBanner intro={VERBATIM_INTRO} flagCount={2} noticeCount={1} />);
    expect(screen.getByText(VERBATIM_INTRO)).toBeTruthy();
  });

  it('renders a FLAG count badge with the passed-in count', () => {
    render(<SummaryBanner intro={VERBATIM_INTRO} flagCount={2} noticeCount={1} />);
    expect(screen.getByText('2 FLAG')).toBeTruthy();
  });

  it('renders a NOTICE count badge with the passed-in count', () => {
    render(<SummaryBanner intro={VERBATIM_INTRO} flagCount={2} noticeCount={1} />);
    expect(screen.getByText('1 NOTICE')).toBeTruthy();
  });

  it('renders zero counts when passed zero', () => {
    render(<SummaryBanner intro="ok" flagCount={0} noticeCount={0} />);
    expect(screen.getByText('0 FLAG')).toBeTruthy();
    expect(screen.getByText('0 NOTICE')).toBeTruthy();
  });
});
