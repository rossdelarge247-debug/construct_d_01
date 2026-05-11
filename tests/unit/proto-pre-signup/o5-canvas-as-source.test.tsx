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
    const heading = screen.getByRole('heading', { level: 2 });
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

  it('splits the four options into a primary group of 3 and a secondary group of 1 (C2 layout)', () => {
    renderO5();
    const legend = screen.getByText(
      "How much do you know about your partner's financial situation?",
      { selector: 'legend' },
    );
    const fieldset = legend.closest('fieldset')!;
    const groupDivs = Array.from(fieldset.children).filter((c) => c.tagName === 'DIV');
    expect(groupDivs).toHaveLength(2);
    const primaryRadios = groupDivs[0].querySelectorAll('input[type="radio"]');
    const secondaryRadios = groupDivs[1].querySelectorAll('input[type="radio"]');
    expect(primaryRadios).toHaveLength(3);
    expect(secondaryRadios).toHaveLength(1);
    expect((secondaryRadios[0] as HTMLInputElement).value).toBe('suspect');
  });

  it('renders the "little" option with the canvas detail string as an inline suffix', () => {
    renderO5();
    expect(screen.getByText('— they managed the money')).toBeTruthy();
    const littleRadio = radio(/Very little.*they managed the money/);
    expect(littleRadio.getAttribute('value')).toBe('little');
  });

  it('disables the Continue CTA until any awareness option is picked', () => {
    renderO5();
    const cta = screen.getByRole('button', { name: /Continue/ }) as HTMLButtonElement;
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
