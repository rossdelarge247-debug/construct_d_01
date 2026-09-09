import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/dev/proto/sign-in/page';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const emailInput = () => screen.getByLabelText(/^email/i) as HTMLInputElement;
const passwordInput = () => screen.getByLabelText(/^password/i) as HTMLInputElement;
const submit = () => fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

function describedText(input: HTMLElement): string[] {
  return (input.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? `<missing #${id}>`);
}

describe('proto sign-in page', () => {
  beforeEach(() => push.mockClear());

  it('renders the canvas structure under the password model', () => {
    render(<Page />);
    expect(screen.getByRole('link', { name: /need an account/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeTruthy();
    expect(screen.getByText(/pick up where you left off/i)).toBeTruthy();
    expect(emailInput().value).toMatch(/@/);
    expect(passwordInput().getAttribute('type')).toBe('password');
    expect(screen.getByRole('button', { name: /forgot/i })).toBeTruthy();
    expect((screen.getByRole('checkbox', { name: /remember this device/i }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /start your case/i })).toBeTruthy();
    expect(screen.queryByText(/continue with google|passkey/i)).toBeNull();
  });

  it('empty password: announces the problem beside the field, focuses it, stays put', () => {
    render(<Page />);
    fireEvent.change(passwordInput(), { target: { value: '' } });
    submit();
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/password/i);
    expect(passwordInput().getAttribute('aria-invalid')).toBe('true');
    expect(describedText(passwordInput())).toEqual([expect.stringMatching(/password/i)]);
    expect(document.activeElement).toBe(passwordInput());
  });

  it('malformed email is rejected and the message clears once corrected', () => {
    render(<Page />);
    fireEvent.change(emailInput(), { target: { value: 'sarah.harris' } });
    fireEvent.change(passwordInput(), { target: { value: 'correct-horse-battery' } });
    submit();
    expect(push).not.toHaveBeenCalled();
    expect(emailInput().getAttribute('aria-invalid')).toBe('true');
    fireEvent.change(emailInput(), { target: { value: 'sarah.harris@example.com' } });
    expect(emailInput().getAttribute('aria-invalid')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('valid details hand off to the dashboard', () => {
    render(<Page />);
    fireEvent.change(passwordInput(), { target: { value: 'correct-horse-battery' } });
    submit();
    expect(push).toHaveBeenCalledWith('/dev/proto/post-connect-dashboard');
  });

  it('forgot password explains the reset path in a polite live region', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /forgot/i }));
    expect(screen.getByRole('status').textContent).toMatch(/reset link/i);
    expect(push).not.toHaveBeenCalled();
  });
});
