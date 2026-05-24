import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/dev/proto/moment-1-ack/page';

describe('/dev/proto/moment-1-ack page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the back-link to /dev/proto', () => {
    render(<Page />);
    const back = screen.getByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/dev/proto');
  });

  it('renders the greeting copy (AC-1)', () => {
    render(<Page />);
    expect(screen.getByText(/Based on what you told us/)).toBeTruthy();
  });

  it('renders scenario recap bullets (AC-1)', () => {
    render(<Page />);
    const list = screen.getByRole('list', { name: /your situation/i });
    expect(list).toBeTruthy();
    expect(list.querySelectorAll('li').length).toBeGreaterThanOrEqual(3);
  });

  it('renders the transition copy (AC-1)', () => {
    render(<Page />);
    expect(
      screen.getByText(/go deeper so we can build your picture/i),
    ).toBeTruthy();
  });

  it('renders Continue CTA (AC-3)', () => {
    render(<Page />);
    expect(screen.getByRole('link', { name: /continue/i })).toBeTruthy();
  });

  it('has a dev-mode toggle for safety flags (AC-2)', () => {
    render(<Page />);
    expect(screen.getByRole('switch', { name: /safety/i })).toBeTruthy();
  });

  it('shows safety messaging when flag is toggled (AC-2)', () => {
    render(<Page />);
    const toggle = screen.getByRole('switch', { name: /safety/i });
    fireEvent.click(toggle);
    expect(screen.getByText(/Setting up your account safely/i)).toBeTruthy();
  });

  it('shows Exit this page component in flagged state (AC-4)', () => {
    render(<Page />);
    const toggle = screen.getByRole('switch', { name: /safety/i });
    fireEvent.click(toggle);
    expect(screen.getByTestId('exit-this-page')).toBeTruthy();
  });

  it('does not show Exit this page in standard state (AC-4)', () => {
    render(<Page />);
    expect(screen.queryByTestId('exit-this-page')).toBeNull();
  });
});
