import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/dev/proto/moment-2-profiling/page';

describe('/dev/proto/moment-2-profiling page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the back-link to /dev/proto', () => {
    render(<Page />);
    const back = screen.getByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/dev/proto');
  });

  it('starts on the P1 property step by default (AC-1)', () => {
    render(<Page />);
    expect(screen.getByText(/mortgage with/i)).toBeTruthy();
  });

  it('shows progress indicator (AC-5)', () => {
    render(<Page />);
    expect(screen.getByTestId('step-indicator')).toBeTruthy();
  });

  it('navigates forward on Next (AC-5)', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Do you have any pensions/i)).toBeTruthy();
  });

  it('skips P2 self-employed when toggle is off (AC-2 + AC-6)', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.queryByText(/Tell us about your business/i)).toBeNull();
    expect(screen.getByText(/Do you have any pensions/i)).toBeTruthy();
  });

  it('shows P2 screens when self-employment toggle is on (AC-2)', () => {
    render(<Page />);
    const toggle = screen.getByRole('combobox', { name: /self.employment/i });
    fireEvent.change(toggle, { target: { value: 'me' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Tell us about your business/i)).toBeTruthy();
  });

  it('renders P4a pension existence with 5 options (AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(5);
  });

  it('renders P6 other-accounts heads-up as final step (AC-4)', () => {
    render(<Page />);
    const next = () => fireEvent.click(screen.getByRole('button', { name: /next/i }));
    next(); // P1 → P4a
    next(); // P4a → P4b
    next(); // P4b → P4c
    next(); // P4c → P6
    expect(screen.getByText(/before we connect/i)).toBeTruthy();
    expect(screen.getByText(/app-only banks/i)).toBeTruthy();
  });

  it('P6 shows "Got it" CTA as a link (AC-4)', () => {
    render(<Page />);
    const next = () => fireEvent.click(screen.getByRole('button', { name: /next/i }));
    next(); next(); next(); next();
    expect(screen.getByRole('link', { name: /got it/i })).toBeTruthy();
  });

  it('renders dev-mode pre-signup toggles (AC-6)', () => {
    render(<Page />);
    expect(screen.getByRole('combobox', { name: /property/i })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: /self.employment/i })).toBeTruthy();
  });

  it('skips P1 when property is own_outright (AC-1 + AC-6)', () => {
    render(<Page />);
    const toggle = screen.getByRole('combobox', { name: /property/i });
    fireEvent.change(toggle, { target: { value: 'own_outright' } });
    expect(screen.getByText(/Do you have any pensions/i)).toBeTruthy();
  });

  it('shows rent fields when property is rent (AC-1)', () => {
    render(<Page />);
    const toggle = screen.getByRole('combobox', { name: /property/i });
    fireEvent.change(toggle, { target: { value: 'rent' } });
    expect(screen.getByText(/pay rent to/i)).toBeTruthy();
  });
});
