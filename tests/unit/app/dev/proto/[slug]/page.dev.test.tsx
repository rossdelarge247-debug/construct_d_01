import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StubPage from '@/app/dev/proto/[slug]/page.dev.tsx';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

describe('Stub-route page', () => {
  it('renders for known slug with status > not-started', async () => {
    const result = await StubPage({
      params: Promise.resolve({ slug: 'marketing-landing' }),
    });
    render(result);
    expect(screen.getByText('Marketing landing')).toBeInTheDocument();
    expect(screen.getByLabelText(/Status:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confidence:/)).toBeInTheDocument();
  });

  it('renders Open questions section when row has open questions', async () => {
    const result = await StubPage({
      params: Promise.resolve({ slug: 'marketing-landing' }),
    });
    render(result);
    expect(screen.getByText('Open questions')).toBeInTheDocument();
  });

  it('renders Linked artefacts section when row has links', async () => {
    const result = await StubPage({
      params: Promise.resolve({ slug: 'marketing-landing' }),
    });
    render(result);
    expect(screen.getByText('Linked artefacts')).toBeInTheDocument();
  });

  it('back link points to /dev/proto', async () => {
    const result = await StubPage({
      params: Promise.resolve({ slug: 'marketing-landing' }),
    });
    render(result);
    const backLink = screen.getByRole('link', { name: /back to hub/i });
    expect(backLink).toHaveAttribute('href', '/dev/proto');
  });

  it('throws NEXT_NOT_FOUND for unknown slug', async () => {
    await expect(
      StubPage({ params: Promise.resolve({ slug: 'no-such-slug-xyz' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('throws NEXT_NOT_FOUND for slug whose status is not-started', async () => {
    await expect(
      StubPage({ params: Promise.resolve({ slug: 'invitation-landing' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
