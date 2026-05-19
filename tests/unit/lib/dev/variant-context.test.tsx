import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  VariantProvider,
  useVariant,
  useSetVariant,
  useResetVariant,
} from '@/lib/dev/variant-context';
import type { VariantRegistry } from '@/lib/dev/variant-manifest';

const REGISTRY: VariantRegistry = {
  testProto: {
    prototypeId: 'testProto',
    prototypeLabel: 'Test prototype',
    manifest: {
      flavor: {
        label: 'Flavor',
        options: [
          { id: 'vanilla', label: 'Vanilla' },
          { id: 'chocolate', label: 'Chocolate' },
        ],
        default: 'vanilla',
      },
    },
  },
};

const STORAGE_KEY = 'dev:variant:testProto:flavor';

function Consumer() {
  const active = useVariant('testProto', 'flavor');
  return <div data-testid="active">{active}</div>;
}

function Setter() {
  const set = useSetVariant('testProto', 'flavor');
  return <button onClick={() => set('chocolate')}>Set chocolate</button>;
}

function InvalidSetter() {
  const set = useSetVariant('testProto', 'flavor');
  return <button onClick={() => set('strawberry')}>Set invalid</button>;
}

function Resetter() {
  const reset = useResetVariant('testProto', 'flavor');
  return <button onClick={reset}>Reset</button>;
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('variant-context — initial resolution', () => {
  it('renders the manifest default when no URL or storage', () => {
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
  });

  it('reads localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'chocolate');
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('chocolate');
  });

  it('URL searchParam overrides localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'vanilla');
    window.history.replaceState({}, '', '/?variant.flavor=chocolate');
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('chocolate');
  });

  it('falls back to default for unknown localStorage value', () => {
    localStorage.setItem(STORAGE_KEY, 'unknown-flavor');
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
  });

  it('falls back to default for unknown URL value', () => {
    window.history.replaceState({}, '', '/?variant.flavor=invalid');
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
  });
});

describe('variant-context — useSetVariant', () => {
  it('updates state and localStorage when called with a valid id', () => {
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
        <Setter />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
    fireEvent.click(screen.getByText('Set chocolate'));
    expect(screen.getByTestId('active').textContent).toBe('chocolate');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('chocolate');
  });

  it('ignores invalid variant id and leaves storage untouched', () => {
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
        <InvalidSetter />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
    fireEvent.click(screen.getByText('Set invalid'));
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('variant-context — useResetVariant', () => {
  it('clears localStorage and reverts to default', () => {
    localStorage.setItem(STORAGE_KEY, 'chocolate');
    render(
      <VariantProvider registry={REGISTRY}>
        <Consumer />
        <Resetter />
      </VariantProvider>,
    );
    expect(screen.getByTestId('active').textContent).toBe('chocolate');
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('active').textContent).toBe('vanilla');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('variant-context — useVariant without provider', () => {
  it('returns empty string safely', () => {
    render(<Consumer />);
    expect(screen.getByTestId('active').textContent).toBe('');
  });
});
