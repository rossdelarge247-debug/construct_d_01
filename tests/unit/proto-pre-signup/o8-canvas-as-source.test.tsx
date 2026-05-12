import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O8 } from '@/app/dev/proto/pre-signup-interview/screens/O8';

function renderO8() {
  return render(
    <ProtoProvider>
      <O8 />
    </ProtoProvider>,
  );
}

describe('O8 (canvas-as-source)', () => {
  it('renders the TopBar Back button and Step 8/8 terminal indicator', () => {
    renderO8();
    const back = screen.getByRole('button', { name: /Back/ });
    expect(back.tagName).toBe('BUTTON');
    const rail = screen.getByRole('progressbar');
    expect(rail.getAttribute('aria-label')).toBe('Step 8 of 8');
    expect(rail.getAttribute('aria-valuenow')).toBe('8');
    expect(rail.getAttribute('aria-valuemax')).toBe('8');
  });

  it('renders the PlanRecall B2 chip with "Your plan is ready" affordance', () => {
    renderO8();
    expect(screen.getByText('Your plan is ready')).toBeTruthy();
    expect(screen.getByText('back to plan')).toBeTruthy();
  });

  it('renders the Hero eyebrow + serif H1 + helper copy', () => {
    renderO8();
    expect(screen.getByText("What's next · take it from here")).toBeTruthy();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('What would you like to do next?');
    expect(screen.getByText(/There's no wrong answer/)).toBeTruthy();
  });

  it('renders 4 native radio inputs grouped under a fieldset with sr-only legend', () => {
    renderO8();
    const group = screen.getByRole('group', { name: /What would you like to do next/ });
    expect(group.tagName).toBe('FIELDSET');
    const radios = within(group).getAllByRole('radio');
    expect(radios).toHaveLength(4);
    radios.forEach((r) => {
      expect(r.tagName).toBe('INPUT');
      expect((r as HTMLInputElement).type).toBe('radio');
      expect((r as HTMLInputElement).name).toBe('o8-next-step');
      expect((r as HTMLInputElement).checked).toBe(false);
    });
  });

  it('renders all 4 option titles + sub copy verbatim from canvas', () => {
    renderO8();
    expect(screen.getByText('Create a free account and start building my picture')).toBeTruthy();
    expect(screen.getByText('Download my plan and come back later')).toBeTruthy();
    expect(screen.getByText('I want to go the conventional route')).toBeTruthy();
    expect(screen.getByText('I need to talk to someone first')).toBeTruthy();
    expect(screen.getByText('Free to start; no card needed.')).toBeTruthy();
    expect(screen.getByText('Here are people who can help.')).toBeTruthy();
  });

  it('C1 empty state: shows "Pick an option above to continue." with no CTA button', () => {
    renderO8();
    expect(screen.getByText('Pick an option above to continue.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Create my account/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Download my plan/ })).toBeNull();
  });

  it('selecting an option flips the checked state and surfaces the option-specific CTA', () => {
    renderO8();
    const signupRadio = screen.getByRole('radio', { name: /Create a free account/ }) as HTMLInputElement;
    expect(signupRadio.checked).toBe(false);
    fireEvent.click(signupRadio);
    const afterClick = screen.getByRole('radio', { name: /Create a free account/ }) as HTMLInputElement;
    expect(afterClick.checked).toBe(true);
    expect(screen.getByRole('button', { name: /Create my account/ })).toBeTruthy();
    expect(screen.queryByText('Pick an option above to continue.')).toBeNull();
  });

  it('switching selection updates the CTA label to match the newly-selected option', () => {
    renderO8();
    fireEvent.click(screen.getByRole('radio', { name: /Create a free account/ }));
    expect(screen.getByRole('button', { name: /Create my account/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: /go the conventional route/ }));
    expect(screen.getByRole('button', { name: /See helpful links/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Create my account/ })).toBeNull();
  });

  it('only one option is checked at a time (radio mutual exclusion via native name grouping)', () => {
    renderO8();
    fireEvent.click(screen.getByRole('radio', { name: /Create a free account/ }));
    fireEvent.click(screen.getByRole('radio', { name: /need to talk to someone/ }));
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    const checked = radios.filter((r) => r.checked);
    expect(checked).toHaveLength(1);
    expect(checked[0].value).toBe('support');
  });

  it('hides decorative SVGs from screen readers (aria-hidden=true)', () => {
    const { container } = renderO8();
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
