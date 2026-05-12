import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TopBar } from '@/app/dev/proto/pre-signup-interview/components/TopBar';
import { TOTAL_STEPS } from '@/app/dev/proto/pre-signup-interview/lib/types';

describe('TopBar', () => {
  it('renders <header> banner landmark', () => {
    const { container } = render(<TopBar step={3} onBack={() => {}} />);
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(screen.getByRole('banner')).toBe(header);
  });

  it('renders Back <button> when onBack is provided and invokes onBack on click', () => {
    const onBack = vi.fn();
    render(<TopBar step={3} onBack={onBack} />);
    const button = screen.getByRole('button', { name: /back/i });
    expect(button.tagName).toBe('BUTTON');
    fireEvent.click(button);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders Home <a> with href="#" when onBack is omitted', () => {
    render(<TopBar step={1} />);
    const link = screen.getByRole('link', { name: /home/i });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#');
  });

  it('forwards step and total to ProgressPill', () => {
    render(<TopBar step={5} total={8} onBack={() => {}} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('5');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('8');
  });

  it('defaults total to TOTAL_STEPS when omitted', () => {
    render(<TopBar step={2} onBack={() => {}} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuemax')).toBe(String(TOTAL_STEPS));
  });

  it('renders the aria-hidden spacer with the spacer class in the right slot', () => {
    const { container } = render(<TopBar step={3} onBack={() => {}} />);
    const spacer = container.querySelector('div[aria-hidden="true"]');
    expect(spacer).not.toBeNull();
    expect(spacer?.className).toMatch(/spacer/);
  });

  it('Back button is focusable (keyboard reachable)', () => {
    render(<TopBar step={3} onBack={() => {}} />);
    const button = screen.getByRole('button', { name: /back/i }) as HTMLButtonElement;
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
