import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RadioRow } from '@/app/dev/proto/section-confirm/_components/RadioRow';

describe('RadioRow', () => {
  it('unchecked variant has aria-checked=false', () => {
    render(<RadioRow checked={false} label="Option A" />);
    const radio = screen.getByRole('radio', { name: /Option A/ });
    expect(radio.getAttribute('aria-checked')).toBe('false');
  });

  it('checked variant has aria-checked=true', () => {
    render(<RadioRow checked label="Option B" />);
    const radio = screen.getByRole('radio', { name: /Option B/ });
    expect(radio.getAttribute('aria-checked')).toBe('true');
  });

  it('recommended variant renders "AI suggests" badge', () => {
    render(<RadioRow checked={false} label="Option C" recommended />);
    expect(screen.getByText('AI suggests')).toBeTruthy();
  });

  it('omits "AI suggests" badge when recommended is false', () => {
    render(<RadioRow checked={false} label="Option D" />);
    expect(screen.queryByText('AI suggests')).toBeNull();
  });

  it('renders sub text when provided', () => {
    render(<RadioRow checked={false} label="Option E" sub="explainer line" />);
    expect(screen.getByText('explainer line')).toBeTruthy();
  });

  it('fires onClick when clicked', () => {
    const handler = vi.fn();
    render(<RadioRow checked={false} label="Option F" onClick={handler} />);
    fireEvent.click(screen.getByRole('radio', { name: /Option F/ }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
