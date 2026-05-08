import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceBadge } from '@/app/dev/proto/_components/ConfidenceBadge';
import type { Confidence } from '@/app/dev/proto/registry-schema';

describe('ConfidenceBadge', () => {
  const confidences: Confidence[] = ['high', 'medium', 'low', 'low-blocked'];

  it.each(confidences)('renders %s without crash', (c) => {
    const { unmount } = render(<ConfidenceBadge confidence={c} />);
    unmount();
  });

  it('exposes accessible aria-label', () => {
    render(<ConfidenceBadge confidence="high" />);
    expect(screen.getByLabelText(/Confidence: high/i)).toBeInTheDocument();
  });
});
