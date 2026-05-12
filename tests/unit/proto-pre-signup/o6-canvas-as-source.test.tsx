import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O6 } from '@/app/dev/proto/pre-signup-interview/screens/O6';

function renderO6() {
  return render(
    <ProtoProvider>
      <O6 />
    </ProtoProvider>,
  );
}

function chip(name: RegExp | string): HTMLButtonElement {
  return screen.getByRole('button', { name, pressed: false }) as HTMLButtonElement;
}

describe('O6 (canvas-as-source)', () => {
  it('renders the step rail via the shared ProgressPill (progressbar role)', () => {
    renderO6();
    const rail = screen.getByRole('progressbar');
    expect(rail.getAttribute('aria-label')).toMatch(/^Step \d+ of 8$/);
  });

  it('renders the canvas eyebrow + heading from the copy resolver', () => {
    renderO6();
    expect(screen.getByText('What matters · last step before your plan')).toBeTruthy();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe(
      "A few words on what matters to you, and what's worrying you.",
    );
  });

  it('renders two semantic groups with H3 headings labeling each card-plate', () => {
    renderO6();
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(2);
    const priHeading = screen.getByRole('heading', { level: 3, name: /What's most important to you right now\?/ });
    const worHeading = screen.getByRole('heading', { level: 3, name: /What worries you most\?/ });
    expect(priHeading.getAttribute('id')).toBe('o6-priorities-heading');
    expect(worHeading.getAttribute('id')).toBe('o6-worries-heading');
    expect(groups[0].getAttribute('aria-labelledby')).toBe('o6-priorities-heading');
    expect(groups[1].getAttribute('aria-labelledby')).toBe('o6-worries-heading');
  });

  it('renders 8 priority chips + 8 worry chips, each as a toggle button with aria-pressed', () => {
    renderO6();
    const groups = screen.getAllByRole('group');
    const priChips = within(groups[0]).getAllByRole('button');
    const worChips = within(groups[1]).getAllByRole('button');
    expect(priChips).toHaveLength(8);
    expect(worChips).toHaveLength(8);
    priChips.forEach((c) => expect(c.getAttribute('aria-pressed')).toBe('false'));
    worChips.forEach((c) => expect(c.getAttribute('aria-pressed')).toBe('false'));
  });

  it('renders the C1 terse "Pick up to 3." caption under each group heading', () => {
    renderO6();
    const captions = screen.getAllByText('Pick up to 3.');
    expect(captions).toHaveLength(2);
  });

  it('toggles a priority chip to selected and announces aria-pressed=true', () => {
    renderO6();
    const c = chip(/A fair split of everything/);
    expect(c.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(c);
    const after = screen.getByRole('button', { name: /A fair split of everything/ });
    expect(after.getAttribute('aria-pressed')).toBe('true');
  });

  it('disables unselected chips when 3 priorities are picked (B1 cap behaviour)', () => {
    renderO6();
    fireEvent.click(chip(/A fair split of everything/));
    fireEvent.click(chip(/Keeping the family home/));
    fireEvent.click(chip(/Protecting my pension/));
    // 4th priority chip should now be disabled
    const fourth = screen.getByRole('button', { name: /Stability for the children/ });
    expect((fourth as HTMLButtonElement).disabled).toBe(true);
    // Selected chips remain enabled (so the user can de-select)
    const selected = screen.getByRole('button', { name: /A fair split of everything/ });
    expect((selected as HTMLButtonElement).disabled).toBe(false);
  });

  it('worries cap is independent of priorities cap', () => {
    renderO6();
    fireEvent.click(chip(/A fair split of everything/));
    fireEvent.click(chip(/Keeping the family home/));
    fireEvent.click(chip(/Protecting my pension/));
    // Worry chips should NOT be disabled — caps are per-group
    const firstWorry = screen.getByRole('button', { name: /Not having enough to live on/ });
    expect((firstWorry as HTMLButtonElement).disabled).toBe(false);
  });

  it('keeps the Continue ("Build my plan") CTA always enabled — no min-pick gate', () => {
    renderO6();
    const cta = screen.getByRole('button', { name: /Build my plan/ }) as HTMLButtonElement;
    expect(cta.disabled).toBe(false);
  });

  it('toggles the footer caption from empty-state to noted-state on first pick', () => {
    renderO6();
    expect(
      screen.getByText('You can continue without picking — your plan adapts either way.'),
    ).toBeTruthy();
    fireEvent.click(chip(/A fair split of everything/));
    expect(screen.getByText('1 thing noted — your plan will weight these.')).toBeTruthy();
    fireEvent.click(chip(/Not having enough to live on/));
    expect(screen.getByText('2 things noted — your plan will weight these.')).toBeTruthy();
  });

  it('hides decorative Arrow + checkmark SVGs from screen readers (aria-hidden=true)', () => {
    const { container } = renderO6();
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
