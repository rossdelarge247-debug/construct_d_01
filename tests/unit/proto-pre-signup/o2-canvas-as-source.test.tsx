import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O2 } from '@/app/dev/proto/pre-signup-interview/screens/O2';

function renderO2() {
  return render(
    <ProtoProvider>
      <O2 />
    </ProtoProvider>,
  );
}

function cardFor(label: string): HTMLElement {
  const labelEl = screen.getByText(label);
  const card = labelEl.parentElement;
  if (!card) throw new Error(`No parent card for label "${label}"`);
  return card;
}

describe('O2 (canvas-as-source)', () => {
  it('renders the step rail with default "Step 1 of 8" (provider initial step)', () => {
    renderO2();
    const rail = screen.getByRole('progressbar');
    expect(rail.getAttribute('aria-label')).toBe('Step 1 of 8');
  });

  it('renders the eyebrow + heading from the copy resolver (TitleShape split)', () => {
    renderO2();
    expect(screen.getByText('O2 · Your situation')).toBeTruthy();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('Your situation.');
    const accent = within(heading).getByText('situation');
    const accentStyle = (accent as HTMLElement).style;
    expect(accentStyle.fontStyle).toBe('italic');
    expect(accentStyle.fontWeight).toBe('400');
  });

  it('renders the Continue CTA disabled when no answers picked', () => {
    renderO2();
    const cta = screen.getByRole('button', { name: /continue/i });
    expect((cta as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows "0 of 4 answered" caption initially and updates as questions are answered', () => {
    renderO2();
    expect(screen.getByText('0 of 4 answered')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Married' }));
    expect(screen.getByText('1 of 4 answered')).toBeTruthy();
  });

  it('hides the child-count row until hasChildren=Yes is picked, and clears it when reverting to No', () => {
    renderO2();
    const childrenCard = cardFor('Children under 18');
    expect(within(childrenCard).queryByText('How many?')).toBeNull();

    fireEvent.click(within(childrenCard).getByRole('button', { name: 'Yes' }));
    expect(within(childrenCard).getByText('How many?')).toBeTruthy();

    fireEvent.click(within(childrenCard).getByRole('button', { name: '2' }));
    expect(
      (within(childrenCard).getByRole('button', { name: '2' }) as HTMLButtonElement).getAttribute('aria-pressed'),
    ).toBe('true');

    fireEvent.click(within(childrenCard).getByRole('button', { name: 'No' }));
    expect(within(childrenCard).queryByText('How many?')).toBeNull();
  });

  it('enables the Continue CTA once all four sub-questions are answered', () => {
    renderO2();
    fireEvent.click(within(cardFor('Relationship')).getByRole('button', { name: 'Married' }));
    fireEvent.click(within(cardFor('Living together')).getByRole('button', { name: 'Yes' }));
    fireEvent.click(within(cardFor('Children under 18')).getByRole('button', { name: 'No' }));
    fireEvent.click(within(cardFor('Your home')).getByRole('button', { name: 'Rent' }));

    const cta = screen.getByRole('button', { name: /continue/i });
    expect((cta as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByText('4 of 4 answered')).toBeTruthy();
  });

  it('marks a chip aria-pressed=true after selection (chip click → answer update path)', () => {
    renderO2();
    const cohabiting = screen.getByRole('button', { name: 'Cohabiting' });
    expect(cohabiting.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(cohabiting);
    expect(cohabiting.getAttribute('aria-pressed')).toBe('true');
  });

  it('renders the Back affordance in the top bar as a button (not a link)', () => {
    renderO2();
    const back = screen.getByRole('button', { name: /back/i });
    expect(back.tagName).toBe('BUTTON');
  });

  it('hides decorative Arrow SVGs inside labelled buttons from screen readers (aria-hidden)', () => {
    renderO2();
    const back = screen.getByRole('button', { name: /back/i });
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(back.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(continueBtn.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('carries focus-visible + motion-reduce utility classes on the Chip (a11y essentials)', () => {
    renderO2();
    const married = screen.getByRole('button', { name: 'Married' });
    const cls = married.className;
    expect(cls).toContain('focus-visible:outline');
    expect(cls).toContain('motion-reduce:!transition-none');
  });

  it('caps the page width at 480px and centers on desktop (matches ScreenShell convention)', () => {
    const { container } = renderO2();
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('max-w-[480px]');
    expect(root.className).toContain('mx-auto');
    expect(root.className).toContain('w-full');
  });
});
