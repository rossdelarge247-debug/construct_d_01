import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/dev/proto/sign-up/page';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const nameInput = () => screen.getByLabelText(/full name/i);
const emailInput = () => screen.getByLabelText(/^email/i);
const passwordInput = () => screen.getByLabelText(/create password/i);
const termsBox = () => screen.getByRole('checkbox', { name: /terms/i });
const submit = () => fireEvent.click(screen.getByRole('button', { name: /create account/i }));

function fillValid() {
  fireEvent.change(nameInput(), { target: { value: 'Sarah Harris' } });
  fireEvent.change(emailInput(), { target: { value: 'sarah.harris@example.com' } });
  fireEvent.change(passwordInput(), { target: { value: 'correct-horse-battery' } });
  fireEvent.click(termsBox());
}

function describedText(input: HTMLElement): string[] {
  return (input.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? `<missing #${id}>`);
}

describe('proto sign-up page', () => {
  beforeEach(() => push.mockClear());

  it('renders the canvas structure', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /start your case/i })).toBeTruthy();
    for (const step of ['Account', 'About you', 'Pay']) {
      expect(screen.getByText(step, { exact: true })).toBeTruthy();
    }
    expect(nameInput()).toBeTruthy();
    expect(emailInput()).toBeTruthy();
    expect(passwordInput().getAttribute('type')).toBe('password');
    expect(screen.getByText(/min 12 characters/i)).toBeTruthy();
    expect(termsBox()).toBeTruthy();
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy();
    expect(screen.getByText(/your account is yours/i)).toBeTruthy();
  });

  it('routes existing users to sign-in and links the legal documents', () => {
    render(<Page />);
    expect(screen.getByRole('link', { name: /have an account\? sign in/i }).getAttribute('href')).toBe(
      '/dev/proto/sign-in',
    );
    expect(screen.getByRole('link', { name: 'Terms' }).getAttribute('href')).toBe('/dev/proto/legal-trio');
    expect(screen.getByRole('link', { name: 'Privacy Policy' }).getAttribute('href')).toBe('/dev/proto/legal-trio');
  });

  it('keeps the tab order name → email → password → terms → button', () => {
    render(<Page />);
    const form = nameInput().closest('form')!;
    const tabbable = Array.from(
      form.querySelectorAll<HTMLElement>('input, button, a[href]'),
    ).filter((el) => el.tabIndex >= 0);
    expect(tabbable.slice(0, 5)).toEqual([
      nameInput(),
      emailInput(),
      passwordInput(),
      termsBox(),
      screen.getByRole('button', { name: /create account/i }),
    ]);
  });

  it('announces an error and stays put on an empty submit', () => {
    render(<Page />);
    submit();
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(push).not.toHaveBeenCalled();
  });

  it('flags every invalid field on an empty submit and focuses the first', () => {
    render(<Page />);
    submit();

    for (const input of [nameInput(), emailInput(), passwordInput(), termsBox()]) {
      expect(input.getAttribute('aria-invalid')).toBe('true');
    }
    expect(describedText(nameInput())).toEqual(['Please enter your full name.']);
    expect(describedText(emailInput())).toEqual(['Please enter your email address.']);
    expect(describedText(passwordInput())).toEqual([
      'Your password needs at least 12 characters.',
      'Min 12 characters',
    ]);
    expect(describedText(termsBox())).toEqual(['Please agree to the Terms and Privacy Policy to continue.']);

    expect(document.activeElement).toBe(nameInput());
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(1);
    expect(alerts[0].id).toBe('signup-name-error');
    expect(alerts[0].textContent).toBe('Please enter your full name.');
  });

  it('renders each message directly beneath its own field', () => {
    render(<Page />);
    submit();
    expect(nameInput().nextElementSibling?.id).toBe('signup-name-error');
    expect(emailInput().nextElementSibling?.id).toBe('signup-email-error');
    expect(passwordInput().nextElementSibling?.id).toBe('signup-password-error');
    expect(termsBox().closest('label')?.nextElementSibling?.id).toBe('signup-terms-error');
  });

  it('reports every problem at once, not just the first', () => {
    render(<Page />);
    fireEvent.change(nameInput(), { target: { value: 'Sarah Harris' } });
    fireEvent.change(emailInput(), { target: { value: 'sarah@' } });
    fireEvent.change(passwordInput(), { target: { value: 'short' } });
    submit();

    expect(nameInput().getAttribute('aria-invalid')).toBeNull();
    expect(describedText(emailInput())).toEqual(["That email address doesn't look right."]);
    expect(describedText(passwordInput())[0]).toBe('Your password needs at least 12 characters.');
    expect(termsBox().getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(emailInput());
    expect(screen.getByRole('alert').id).toBe('signup-email-error');
  });

  it('clears a field error as soon as the field becomes valid', () => {
    render(<Page />);
    submit();

    fireEvent.change(emailInput(), { target: { value: 'sarah@' } });
    expect(describedText(emailInput())).toEqual(["That email address doesn't look right."]);

    fireEvent.change(emailInput(), { target: { value: 'sarah.harris@example.com' } });
    expect(emailInput().getAttribute('aria-invalid')).toBeNull();
    expect(emailInput().getAttribute('aria-describedby')).toBeNull();
    expect(document.getElementById('signup-email-error')).toBeNull();

    fireEvent.click(termsBox());
    expect(termsBox().getAttribute('aria-invalid')).toBeNull();
    expect(document.getElementById('signup-terms-error')).toBeNull();

    expect(nameInput().getAttribute('aria-invalid')).toBe('true');
  });

  it('does not validate untouched fields before the first submit', () => {
    render(<Page />);
    fireEvent.change(emailInput(), { target: { value: 'sarah@' } });
    expect(emailInput().getAttribute('aria-invalid')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('rejects a password under 12 characters', () => {
    render(<Page />);
    fillValid();
    fireEvent.change(passwordInput(), { target: { value: 'short-pw' } });
    submit();
    expect(screen.getByRole('alert').id).toBe('signup-password-error');
    expect(passwordInput().getAttribute('aria-describedby')).toBe('signup-password-error signup-password-hint');
    expect(document.activeElement).toBe(passwordInput());
    expect(push).not.toHaveBeenCalled();
  });

  it('hands valid details off to welcome-tour', () => {
    render(<Page />);
    fillValid();
    submit();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(push).toHaveBeenCalledWith('/dev/proto/welcome-tour');
  });
});
