import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O5 } from '@/app/dev/proto/pre-signup-interview/screens/O5';

function renderO5() {
  return render(
    <ProtoProvider>
      <O5 />
    </ProtoProvider>,
  );
}

function radio(name: RegExp | string): HTMLInputElement {
  return screen.getByRole('radio', { name }) as HTMLInputElement;
}

describe('O5 (canvas-as-source)', () => {
  it('renders the step rail via the shared ProgressPill (progressbar role)', () => {
    renderO5();
    const rail = screen.getByRole('progressbar');
    expect(rail.getAttribute('aria-label')).toMatch(/^Step \d+ of 8$/);
  });

  it('renders the canvas eyebrow + heading + helper sub-stem from the copy resolver', () => {
    renderO5();
    expect(screen.getByText('Money · their side')).toBeTruthy();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(
      "How much do you know about your partner's financial situation?",
    );
    expect(
      screen.getByText("There's no wrong answer. Many people don't know everything."),
    ).toBeTruthy();
  });

  it('renders four partner-awareness radio cards, one per PartnerAwareness value', () => {
    renderO5();
    const awareRadios = screen
      .getAllByRole('radio')
      .filter((r) => r.getAttribute('name') === 'o5-partner-awareness');
    expect(awareRadios).toHaveLength(4);
    const values = awareRadios.map((r) => r.getAttribute('value'));
    expect(values).toEqual(expect.arrayContaining(['full', 'some', 'little', 'suspect']));
  });

  it('wraps the question in a fieldset with an sr-only labelling legend', () => {
    renderO5();
    const legend = screen.getByText(
      "How much do you know about your partner's financial situation?",
      { selector: 'legend' },
    );
    expect(legend.getAttribute('id')).toBe('o5-partner-legend');
    expect(legend.className).toContain('sr-only');
    const fieldset = legend.closest('fieldset');
    expect(fieldset).not.toBeNull();
    expect(fieldset?.getAttribute('aria-labelledby')).toBe('o5-partner-legend');
  });

  it('splits the four options into a primary group of 3 and a secondary group of 1 (A3+C2 layout)', () => {
    renderO5();
    const legend = screen.getByText(
      "How much do you know about your partner's financial situation?",
      { selector: 'legend' },
    );
    const fieldset = legend.closest('fieldset')!;
    const radioContainingDivs = Array.from(fieldset.children).filter(
      (c) => c.tagName === 'DIV' && c.querySelectorAll('input[type="radio"]').length > 0,
    );
    expect(radioContainingDivs).toHaveLength(2);
    const primaryRadios = radioContainingDivs[0].querySelectorAll('input[type="radio"]');
    const secondaryRadios = radioContainingDivs[1].querySelectorAll('input[type="radio"]');
    expect(primaryRadios).toHaveLength(3);
    expect(secondaryRadios).toHaveLength(1);
    expect((secondaryRadios[0] as HTMLInputElement).value).toBe('suspect');
  });

  it('renders the A3 separator: thin divider line + "If you have concerns…" italic header above the suspect row', () => {
    renderO5();
    const header = screen.getByText('If you have concerns…');
    expect(header).toBeTruthy();
    const suspectRadio = radio(/I suspect they may be hiding things/);
    const legend = screen.getByText(
      "How much do you know about your partner's financial situation?",
      { selector: 'legend' },
    );
    const fieldset = legend.closest('fieldset')!;
    const children = Array.from(fieldset.children);
    const headerIdx = children.indexOf(header);
    const suspectGroup = suspectRadio.closest('label')?.parentElement;
    const suspectIdx = suspectGroup ? children.indexOf(suspectGroup) : -1;
    expect(headerIdx).toBeGreaterThan(-1);
    expect(suspectIdx).toBeGreaterThan(headerIdx);
    const divider = children[headerIdx - 1] as HTMLElement;
    expect(divider.getAttribute('style')).toMatch(/border-top/i);
    expect(divider.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the "little" option with the canvas detail string as an inline suffix', () => {
    renderO5();
    expect(screen.getByText('— they managed the money')).toBeTruthy();
    const littleRadio = radio(/Very little.*they managed the money/);
    expect(littleRadio.getAttribute('value')).toBe('little');
  });

  it('disables the primary CTA until any awareness option is picked', () => {
    renderO5();
    const cta = screen.getByRole('button', { name: 'Next: what matters to you' }) as HTMLButtonElement;
    expect(cta.disabled).toBe(true);
    fireEvent.click(radio(/I know some things but not all/));
    expect(cta.disabled).toBe(false);
  });

  it('marks the selected radio as checked (controlled state)', () => {
    renderO5();
    fireEvent.click(radio(/I have a good idea of everything/));
    expect(radio(/I have a good idea of everything/).checked).toBe(true);
    expect(radio(/I suspect they may be hiding things/).checked).toBe(false);
  });

  it('toggles the footer caption between pickToContinue and oneAnswered when an option is picked', () => {
    renderO5();
    expect(screen.getByText("Pick the answer closest to what's true today.")).toBeTruthy();
    fireEvent.click(radio(/I suspect they may be hiding things/));
    expect(screen.getByText('Answer recorded — continue when ready.')).toBeTruthy();
  });

  it('hides decorative Arrow SVGs from screen readers (aria-hidden=true)', () => {
    const { container } = renderO5();
    const arrows = container.querySelectorAll('svg');
    expect(arrows.length).toBeGreaterThan(0);
    arrows.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
