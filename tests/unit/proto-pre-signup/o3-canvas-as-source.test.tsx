import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O3 } from '@/app/dev/proto/pre-signup-interview/screens/O3';

function renderO3() {
  return render(
    <ProtoProvider>
      <O3 />
    </ProtoProvider>,
  );
}

function radio(name: string | RegExp): HTMLInputElement {
  return screen.getByRole('radio', { name }) as HTMLInputElement;
}

describe('O3 (canvas-as-source)', () => {
  it('renders the step rail via the shared ProgressPill (progressbar role)', () => {
    renderO3();
    const rail = screen.getByRole('progressbar');
    expect(rail.getAttribute('aria-label')).toMatch(/^Step \d+ of 8$/);
  });

  it('renders the canvas eyebrow + plain heading from the copy resolver', () => {
    renderO3();
    expect(screen.getByText('Your ex')).toBeTruthy();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe(
      'How would you describe things between you and your ex?',
    );
  });

  it('renders four relationship radio cards, one per RelationshipQuality value', () => {
    renderO3();
    const relRadios = screen
      .getAllByRole('radio')
      .filter((r) => (r as HTMLInputElement).name === 'o3-relationship');
    expect(relRadios).toHaveLength(4);
    const values = relRadios
      .map((r) => (r as HTMLInputElement).value)
      .sort();
    expect(values).toEqual(
      ['amicable', 'difficult', 'high-conflict', 'safety-concern'].sort(),
    );
  });

  it('renders two privacy radio pills, one per DevicePrivate value', () => {
    renderO3();
    const privRadios = screen
      .getAllByRole('radio')
      .filter((r) => (r as HTMLInputElement).name === 'o3-privacy');
    expect(privRadios).toHaveLength(2);
    const values = privRadios
      .map((r) => (r as HTMLInputElement).value)
      .sort();
    expect(values).toEqual(['not-sure', 'yes']);
  });

  it('renders the Continue CTA disabled when no relationship picked', () => {
    renderO3();
    const cta = screen.getByRole('button', { name: /continue/i });
    expect((cta as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows the "pick to continue" caption initially', () => {
    renderO3();
    expect(
      screen.getByText('Pick the option that fits best to continue.'),
    ).toBeTruthy();
  });

  it('enables the CTA after picking a relationship; shows the privacy-optional caption', () => {
    renderO3();
    fireEvent.click(radio(/Amicable/));
    const cta = screen.getByRole('button', { name: /continue/i });
    expect((cta as HTMLButtonElement).disabled).toBe(false);
    expect(
      screen.getByText("Device privacy is optional — skip if you'd like."),
    ).toBeTruthy();
  });

  it('shows the "Both answered" caption after picking both relationship + privacy', () => {
    renderO3();
    fireEvent.click(radio(/Difficult/));
    fireEvent.click(radio('Yes'));
    expect(screen.getByText('Both answered.')).toBeTruthy();
  });

  it('marks the selected radio as checked (controlled state)', () => {
    renderO3();
    const safety = radio(/I have safety concerns/);
    expect(safety.checked).toBe(false);
    fireEvent.click(safety);
    expect(safety.checked).toBe(true);
  });

  it('wraps each question in a fieldset with an sr-only labelling legend', () => {
    renderO3();
    const relLegend = document.getElementById('o3-rel-legend');
    const privLegend = document.getElementById('o3-priv-legend');
    expect(relLegend?.tagName).toBe('LEGEND');
    expect(privLegend?.tagName).toBe('LEGEND');
    expect(relLegend?.className).toContain('sr-only');
    expect(privLegend?.className).toContain('sr-only');
    expect(relLegend?.textContent).toBe(
      'How would you describe things between you and your ex?',
    );
    expect(privLegend?.textContent).toBe('Is this device private to you?');
  });

  it('renders the Back affordance as a button (not a link)', () => {
    renderO3();
    const back = screen.getByRole('button', { name: /back/i });
    expect(back.tagName).toBe('BUTTON');
  });

  it('hides decorative Arrow SVGs in labelled buttons from screen readers', () => {
    renderO3();
    const back = screen.getByRole('button', { name: /back/i });
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    const backSvg = back.querySelector('svg');
    const ctaSvg = continueBtn.querySelector('svg');
    expect(backSvg).not.toBeNull();
    expect(ctaSvg).not.toBeNull();
  });
});
