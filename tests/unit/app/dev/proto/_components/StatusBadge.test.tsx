import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/app/dev/proto/_components/StatusBadge';
import type { Status } from '@/app/dev/proto/registry-schema';

describe('StatusBadge', () => {
  const statuses: Status[] = [
    'not-started',
    'spec-only',
    'canvas-drafted',
    'prototype-built',
    'shipped',
  ];

  it.each(statuses)('renders %s without crash', (status) => {
    const { unmount } = render(<StatusBadge status={status} />);
    unmount();
  });

  it('exposes accessible aria-label', () => {
    render(<StatusBadge status="shipped" />);
    expect(screen.getByLabelText(/Status: shipped/i)).toBeInTheDocument();
  });
});
