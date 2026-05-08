import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlowRow } from '@/app/dev/proto/_components/FlowRow';
import type { RegistryRow } from '@/app/dev/proto/registry-schema';

const sampleRow: RegistryRow = {
  id: 'sample-row',
  title: 'Sample row',
  section: 'build',
  status: 'spec-only',
  confidence: 'medium',
  owner: 'both',
  tags: ['test-tag', 'other-tag'],
  openQuestions: ['What is this?', 'And this?'],
  lastTouched: { session: 74, date: '2026-05-08' },
  links: { spec: 'docs/sample.md' },
};

describe('FlowRow', () => {
  it('renders title', () => {
    render(<FlowRow row={sampleRow} />);
    expect(screen.getByText('Sample row')).toBeInTheDocument();
  });

  it('renders row id as visible text', () => {
    render(<FlowRow row={sampleRow} />);
    expect(screen.getByText('sample-row')).toBeInTheDocument();
  });

  it('renders top open question with Q: prefix', () => {
    render(<FlowRow row={sampleRow} />);
    expect(screen.getByText(/Q:.*What is this/)).toBeInTheDocument();
  });

  it('renders tags with # prefix', () => {
    render(<FlowRow row={sampleRow} />);
    expect(screen.getByText(/#test-tag/)).toBeInTheDocument();
    expect(screen.getByText(/#other-tag/)).toBeInTheDocument();
  });

  it('renders owner + last-touched session in footer', () => {
    render(<FlowRow row={sampleRow} />);
    expect(screen.getByText(/owner: both/)).toBeInTheDocument();
    expect(screen.getByText(/session 74/)).toBeInTheDocument();
  });

  it('renders title as link to /dev/proto/<id> when status > not-started', () => {
    render(<FlowRow row={sampleRow} />);
    const link = screen.getByRole('link', { name: /Sample row/ });
    expect(link).toHaveAttribute('href', '/dev/proto/sample-row');
  });

  it('renders title as plain text (no link) when status is not-started', () => {
    const notStartedRow = { ...sampleRow, status: 'not-started' as const };
    render(<FlowRow row={notStartedRow} />);
    expect(screen.queryByRole('link', { name: /Sample row/ })).not.toBeInTheDocument();
    expect(screen.getByText('Sample row')).toBeInTheDocument();
  });

  it('omits Q section when no open questions', () => {
    const noQRow = { ...sampleRow, openQuestions: [] };
    render(<FlowRow row={noQRow} />);
    expect(screen.queryByText(/^Q:/)).not.toBeInTheDocument();
  });
});
