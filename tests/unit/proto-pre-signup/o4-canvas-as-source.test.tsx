import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O4 } from '@/app/dev/proto/pre-signup-interview/screens/O4';

function renderO4() {
  return render(
    <ProtoProvider>
      <O4 />
    </ProtoProvider>,
  );
}

function radio(name: RegExp | string): HTMLInputElement {
  return screen.getByRole('radio', { name }) as HTMLInputElement;
}

describe('O4 (canvas-as-source)', () => {
  it('renders the step rail via the shared ProgressPill (progressbar role)', () => {
    renderO4();
    const rail = screen.getByRole('progressbar');
    expect(rail.getAttribute('aria-label')).toMatch(/^Step \d+ of 8$/);
  });

  it('renders the canvas eyebrow + plain heading + helper sub-stem from the copy resolver', () => {
    renderO4();
    expect(screen.getByText('Money · your side')).toBeTruthy();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(
      'Does either of you work for yourself, or run a limited company?',
    );
    expect(
      screen.getByText('This affects how we handle income evidence later.'),
    ).toBeTruthy();
  });

  it('renders four self-employment radio cards, one per SelfEmployment value', () => {
    renderO4();
    const empRadios = screen
      .getAllByRole('radio')
      .filter((r) => r.getAttribute('name') === 'o4-self-employment');
    expect(empRadios).toHaveLength(4);
    const values = empRadios.map((r) => r.getAttribute('value'));
    expect(values).toEqual(expect.arrayContaining(['no', 'me', 'ex', 'both']));
  });

  it('wraps the question in a fieldset with an sr-only labelling legend', () => {
    renderO4();
    const legend = screen.getByText(
      'Does either of you work for yourself, or run a limited company?',
      { selector: 'legend' },
    );
    expect(legend.getAttribute('id')).toBe('o4-emp-legend');
    expect(legend.className).toContain('sr-only');
    const fieldset = legend.closest('fieldset');
    expect(fieldset).not.toBeNull();
    expect(fieldset?.getAttribute('aria-labelledby')).toBe('o4-emp-legend');
  });

  it('disables the primary CTA until any self-employment option is picked', () => {
    renderO4();
    const cta = screen.getByRole('button', { name: 'Next: their side' }) as HTMLButtonElement;
    expect(cta.disabled).toBe(true);
    fireEvent.click(radio(/Yes.*I am/));
    expect(cta.disabled).toBe(false);
  });

  it('marks the selected radio as checked (controlled state)', () => {
    renderO4();
    fireEvent.click(radio(/Yes.*my partner is/));
    expect(radio(/Yes.*my partner is/).checked).toBe(true);
    expect(radio(/Yes.*I am/).checked).toBe(false);
  });

  it('applies the emphasised treatment to the canvas-emphasised option ("no")', () => {
    renderO4();
    const noLabel = radio(/^No.*both employed, or not working/).closest('label');
    expect(noLabel).not.toBeNull();
    expect(noLabel?.className).toMatch(/cardEmphasised/);
    const meLabel = radio(/Yes.*I am/).closest('label');
    expect(meLabel?.className).not.toMatch(/cardEmphasised/);
  });

  it('toggles the footer caption between pickToContinue and oneAnswered when an option is picked', () => {
    renderO4();
    expect(screen.getByText("Pick the answer closest to what's true today.")).toBeTruthy();
    fireEvent.click(radio(/Yes.*we both are/));
    expect(screen.getByText("Noted — keep going when you're ready.")).toBeTruthy();
  });

  it('hides decorative Arrow SVGs from screen readers (aria-hidden=true)', () => {
    const { container } = renderO4();
    const arrows = container.querySelectorAll('svg');
    expect(arrows.length).toBeGreaterThan(0);
    arrows.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
