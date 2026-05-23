import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarkStatusCard } from '@/app/dev/proto/share-flow/_components/MarkStatusCard';

describe('MarkStatusCard', () => {
  it('renders the "Mark · Not invited" label', () => {
    render(<MarkStatusCard onShareClick={vi.fn()} />);
    expect(screen.getByText('Mark')).toBeTruthy();
    expect(screen.getByText('Not invited')).toBeTruthy();
  });

  it('renders a button with accessible name "Share with Mark"', () => {
    render(<MarkStatusCard onShareClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: /share with mark/i })).toBeTruthy();
  });

  it('invokes onShareClick when the CTA is clicked', () => {
    const handler = vi.fn();
    render(<MarkStatusCard onShareClick={handler} />);
    fireEvent.click(screen.getByRole('button', { name: /share with mark/i }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('renders the card container with data-testid', () => {
    const { container } = render(<MarkStatusCard onShareClick={vi.fn()} />);
    expect(container.querySelector('[data-testid="mark-status-card"]')).toBeTruthy();
  });
});
