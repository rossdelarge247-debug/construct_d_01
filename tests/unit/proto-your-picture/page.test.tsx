import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dev/proto/your-picture/page';

describe('/dev/proto/your-picture page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the document title', () => {
    render(<Page />);
    expect(screen.getByText(/Sarah.s Picture/i)).toBeTruthy();
  });

  it('renders the provenance intro copy (spec 68b B-D5)', () => {
    render(<Page />);
    expect(screen.getByText(/structured record/i)).toBeTruthy();
  });

  it('renders the left rail TOC (spec 68b B-D2)', () => {
    render(<Page />);
    expect(screen.getByTestId('left-rail-toc')).toBeTruthy();
  });

  it('renders section headings in the document body (spec 68b B-D3)', () => {
    render(<Page />);
    expect(screen.getAllByText(/The home/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Income/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the right rail with three panels (spec 68b B-D4)', () => {
    render(<Page />);
    expect(screen.getByText(/Snapshot/i)).toBeTruthy();
    expect(screen.getByText(/Data sources/i)).toBeTruthy();
    expect(screen.getByText(/Needs your attention/i)).toBeTruthy();
  });

  it('renders completion icons in the TOC', () => {
    render(<Page />);
    const toc = screen.getByTestId('left-rail-toc');
    expect(toc.querySelectorAll('[data-status]').length).toBeGreaterThanOrEqual(3);
  });

  it('renders the Share with Mark CTA (spec 68b B-S1)', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: /share with mark/i })).toBeTruthy();
  });

  it('renders section numbers in the body', () => {
    render(<Page />);
    expect(screen.getByText(/§1/)).toBeTruthy();
  });
});
