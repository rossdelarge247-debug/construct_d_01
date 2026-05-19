import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VariantProvider } from '@/lib/dev/variant-context';
import { VARIANT_REGISTRY } from '@/lib/dev/variants-registry';
import { RailGlossary } from '@/app/dev/proto/pre-signup-interview/components/rails/RailGlossary';
import { RailCoach } from '@/app/dev/proto/pre-signup-interview/components/rails/RailCoach';
import { RailWhy } from '@/app/dev/proto/pre-signup-interview/components/rails/RailWhy';
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

  it('renders deferred placeholder when variant is v4 (RailHuman parked)', () => {
    localStorage.setItem(STORAGE_KEY, 'v4');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText(/Talk to a human/i)).toBeTruthy();
  });

  it('renders deferred placeholder when variant is v5 (RailHybrid parked)', () => {
    localStorage.setItem(STORAGE_KEY, 'v5');
    render(
      <VariantProvider registry={VARIANT_REGISTRY}>
        <HelpRailLayout>
          <div data-testid="content">Form</div>
        </HelpRailLayout>
      </VariantProvider>,
    );
    expect(screen.getByLabelText(/Hybrid \(tabbed\)/i)).toBeTruthy();
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
