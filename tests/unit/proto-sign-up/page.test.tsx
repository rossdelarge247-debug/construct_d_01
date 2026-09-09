import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/dev/proto/sign-up/page';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

function fillValid() {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Sarah Harris' } });
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'sarah.harris@example.com' } });
  fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'correct-horse-battery' } });
  fireEvent.click(screen.getByRole('checkbox', { name: /terms/i }));
}

describe('proto sign-up page', () => {
  beforeEach(() => push.mockClear());

  it('renders the canvas structure', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /start your case/i })).toBeTruthy();
    for (const step of ['Account', 'About you', 'Pay']) {
      expect(screen.getByText(step, { exact: true })).toBeTruthy();
    }
    expect(screen.getByLabelText(/full name/i)).toBeTruthy();
    expect(screen.getByLabelText(/^email/i)).toBeTruthy();
    expect(screen.getByLabelText(/create password/i).getAttribute('type')).toBe('password');
    expect(screen.getByText(/min 12 characters/i)).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: /terms/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy();
    expect(screen.getByText(/your account is yours/i)).toBeTruthy();
  });

  it('announces an error and stays put on an empty submit', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(push).not.toHaveBeenCalled();
  });

  it('rejects a password under 12 characters', () => {
    render(<Page />);
    fillValid();
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'short-pw' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(push).not.toHaveBeenCalled();
  });

  it('hands valid details off to welcome-tour', () => {
    render(<Page />);
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(push).toHaveBeenCalledWith('/dev/proto/welcome-tour');
  });
});
