import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { VariantProvider } from '@/lib/dev/variant-context';
import { VARIANT_REGISTRY } from '@/lib/dev/variants-registry';
import { RailGlossary } from '@/app/dev/proto/pre-signup-interview/components/rails/RailGlossary';
import { RailCoach } from '@/app/dev/proto/pre-signup-interview/components/rails/RailCoach';
import { RailWhy } from '@/app/dev/proto/pre-signup-interview/components/rails/RailWhy';
import { RailHuman } from '@/app/dev/proto/pre-signup-interview/components/rails/RailHuman';
import { RailHybrid } from '@/app/dev/proto/pre-signup-interview/components/rails/RailHybrid';
import { HelpRailLayout } from '@/app/dev/proto/pre-signup-interview/components/HelpRailLayout';

const STORAGE_KEY = 'dev:variant:pre-signup-interview:helpRail';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('Help Rail components — smoke', () => {
  it('RailGlossary renders with focused="relationship"', () => {
    render(<RailGlossary focused="relationship" />);
    expect(screen.getByLabelText('Glossary help rail')).toBeTruthy();
    expect(screen.getByText('What this means.')).toBeTruthy();
    expect(screen.getByText('Married')).toBeTruthy();
  });

  it('RailGlossary renders without focused prop', () => {
    render(<RailGlossary />);
    expect(screen.getByLabelText('Glossary help rail')).toBeTruthy();
  });

  it('RailCoach renders with placeholder input + suggestions', () => {
    render(<RailCoach />);
    expect(screen.getByLabelText('Decouple AI coach help rail')).toBeTruthy();
    expect(screen.getByText('Ask anything.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Type your question…')).toBeTruthy();
  });

  it('RailWhy renders four numbered rows', () => {
    render(<RailWhy />);
    expect(screen.getByLabelText('Why we ask help rail')).toBeTruthy();
    expect(screen.getByText('Why we ask.')).toBeTruthy();
    expect(screen.getByText('Relationship')).toBeTruthy();
    expect(screen.getByText('Your home')).toBeTruthy();
  });

  it('RailHuman renders with safety footer + founder note', () => {
    render(<RailHuman />);
    expect(screen.getByLabelText('Talk to a human help rail')).toBeTruthy();
    expect(screen.getByText("We're here.")).toBeTruthy();
    expect(screen.getByText('Decouple Listen')).toBeTruthy();
    expect(screen.getByText('A note from Sarah, founder.')).toBeTruthy();
    expect(screen.getByTestId('rail-human-safety').textContent).toMatch(
      /999 OR REFUGE 0808 2000 247/,
    );
  });

  it('RailHybrid renders with default Ask Decouple tab active', () => {
    render(<RailHybrid />);
    expect(screen.getByLabelText('Help options rail')).toBeTruthy();
    expect(screen.getByText('Stuck? Here.')).toBeTruthy();
    const askTab = screen.getByRole('tab', { name: 'Ask Decouple' });
    expect(askTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Ask anything.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Type your question…')).toBeTruthy();
  });

  it('RailHybrid tab-switch reveals different rail bodies', () => {
    render(<RailHybrid />);
    const humanTab = screen.getByRole('tab', { name: 'Human' });
    fireEvent.click(humanTab);
    expect(humanTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('rail-human-safety')).toBeTruthy();
    expect(screen.queryByText('Ask anything.')).toBeNull();

    const meanTab = screen.getByRole('tab', { name: 'What this means' });
    fireEvent.click(meanTab);
    expect(meanTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('What this means.')).toBeTruthy();
    expect(screen.queryByTestId('rail-human-safety')).toBeNull();
  });
});

describe('HelpRailLayout — variant selection', () => {
  it('hides rail column when variant is off (default)', () => {
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByTestId('content')).toBeTruthy();
    expect(screen.queryByLabelText(/help rail/i)).toBeNull();
  });

  it('renders RailGlossary when variant is v1', () => {
    localStorage.setItem(STORAGE_KEY, 'v1');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText('Glossary help rail')).toBeTruthy();
  });

  it('renders RailCoach when variant is v2', () => {
    localStorage.setItem(STORAGE_KEY, 'v2');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText('Decouple AI coach help rail')).toBeTruthy();
  });

  it('renders RailWhy when variant is v3', () => {
    localStorage.setItem(STORAGE_KEY, 'v3');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText('Why we ask help rail')).toBeTruthy();
  });

  it('renders RailHuman when variant is v4', () => {
    localStorage.setItem(STORAGE_KEY, 'v4');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText('Talk to a human help rail')).toBeTruthy();
    expect(screen.getByText("We're here.")).toBeTruthy();
  });

  it('renders RailHybrid when variant is v5', () => {
    localStorage.setItem(STORAGE_KEY, 'v5');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText('Help options rail')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Ask Decouple' })).toBeTruthy();
  });
});

describe('HelpRailLayout — URL override', () => {
  it('URL searchParam selects rail variant over default', () => {
    window.history.replaceState({}, '', '/?variant.helpRail=v2');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText('Decouple AI coach help rail')).toBeTruthy();
  });
});

describe('HelpRailLayout — aria-live region unconditional mount', () => {
  it('mounts the rail-column aria-live region even when no variant is selected', () => {
    const { container } = render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(screen.queryByLabelText(/help rail/i)).toBeNull();
  });

  it('keeps the live region as a stable host across variant toggles', () => {
    const { container, rerender } = render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    const before = container.querySelector('[aria-live="polite"]');
    expect(before).not.toBeNull();
    localStorage.setItem(STORAGE_KEY, 'v1');
    rerender(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    const after = container.querySelector('[aria-live="polite"]');
    expect(after).toBe(before);
    expect(screen.getByLabelText('Glossary help rail')).toBeTruthy();
  });
});

describe('RailHybrid — keyboard navigation (WAI-ARIA Tabs APG)', () => {
  it('ArrowRight cycles tabs forward, wrapping at the end', () => {
    render(<RailHybrid />);
    const tablist = screen.getByRole('tablist');

    expect(screen.getByRole('tab', { name: 'Ask Decouple' }).getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'What this means' }).getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Why we ask' }).getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Human' }).getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Ask Decouple' }).getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowLeft cycles tabs backward, wrapping at the start', () => {
    render(<RailHybrid />);
    const tablist = screen.getByRole('tablist');

    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Human' }).getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Why we ask' }).getAttribute('aria-selected')).toBe('true');
  });

  it('non-arrow keys leave the tab selection unchanged', () => {
    render(<RailHybrid />);
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'Enter' });
    expect(screen.getByRole('tab', { name: 'Ask Decouple' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tablist, { key: ' ' });
    expect(screen.getByRole('tab', { name: 'Ask Decouple' }).getAttribute('aria-selected')).toBe('true');
  });
});

describe('RailCoach — suggested-button semantics', () => {
  it('suggested buttons declare aria-disabled="true" (no onClick wired yet)', () => {
    render(<RailCoach />);
    const disabledButtons = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-disabled') === 'true');
    expect(disabledButtons.length).toBeGreaterThanOrEqual(3);
    expect(disabledButtons.some((b) => b.textContent?.includes('cohabiting'))).toBe(true);
  });
});
