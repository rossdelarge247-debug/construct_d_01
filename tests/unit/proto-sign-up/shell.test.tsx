import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUpPage from '@/app/dev/proto/sign-up/page';

describe('sign-up shell', () => {
  it('renders H1 "Sign up"', () => {
    render(<SignUpPage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Sign up');
  });

  it('renders body paragraph with canvas-pending placeholder', () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Sign-up canvas pending/)).toBeTruthy();
  });

  it('renders back-link with href="/dev/proto"', () => {
    render(<SignUpPage />);
    const link = screen.getByRole('link', { name: /Back to registry/ });
    expect(link.getAttribute('href')).toBe('/dev/proto');
  });
});
