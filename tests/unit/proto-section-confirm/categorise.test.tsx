import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CategorisePage from '@/app/dev/proto/section-confirm/categorise/page';

describe('section-confirm categorise page', () => {
  it('renders FormTop title + step', () => {
    render(<CategorisePage />);
    expect(screen.getByText('Categorise')).toBeTruthy();
    expect(screen.getByText('Q20 of 22')).toBeTruthy();
  });

  it('renders anchor TxnRow (Aviva £1,250.00 with negative sign)', () => {
    render(<CategorisePage />);
    expect(screen.getByText('Aviva Life Insurance')).toBeTruthy();
    expect(screen.getByText('DD · monthly · since 2019')).toBeTruthy();
    expect(screen.getByText('−£1,250.00')).toBeTruthy();
  });

  it('renders the question heading', () => {
    render(<CategorisePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'What kind of policy is this?' })).toBeTruthy();
  });

  it('renders all 4 radio options', () => {
    render(<CategorisePage />);
    expect(screen.getByText('Joint life cover (you + Mark)')).toBeTruthy();
    expect(screen.getByText('Just my life cover')).toBeTruthy();
    expect(screen.getByText('Critical illness only')).toBeTruthy();
    expect(screen.getByText('Not insurance — I miscategorised it')).toBeTruthy();
  });

  it("'Joint life cover' is selected by default", () => {
    render(<CategorisePage />);
    const radios = screen.getAllByRole('radio');
    const joint = radios.find((r) => r.textContent?.includes('Joint life cover'));
    expect(joint?.getAttribute('aria-checked')).toBe('true');
  });

  it('clicking a different option shifts selection', () => {
    render(<CategorisePage />);
    const radios = screen.getAllByRole('radio');
    const myLife = radios.find((r) => r.textContent?.includes('Just my life cover'))!;
    expect(myLife.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(myLife);
    expect(myLife.getAttribute('aria-checked')).toBe('true');
    const joint = radios.find((r) => r.textContent?.includes('Joint life cover'))!;
    expect(joint.getAttribute('aria-checked')).toBe('false');
  });

  it('renders the AIMarginCard title', () => {
    render(<CategorisePage />);
    expect(screen.getByText(/Aviva typically bundles life \+ critical illness/)).toBeTruthy();
  });

  it('renders Skip + Save buttons', () => {
    render(<CategorisePage />);
    expect(screen.getByRole('button', { name: 'Skip' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Save & continue/ })).toBeTruthy();
  });
});
