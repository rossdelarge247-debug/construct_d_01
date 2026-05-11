import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ScreenShell } from '@/app/dev/proto/pre-signup-interview/components/ScreenShell';

const noop = () => undefined;

function renderShell(heading: Parameters<typeof ScreenShell>[0]['heading']) {
  return render(
    <ScreenShell step={2} heading={heading} onContinue={noop} onBack={noop}>
      <div data-testid="child-slot" />
    </ScreenShell>,
  );
}

describe('ScreenShell title rendering (AC-1 TitleShape)', () => {
  it('normalises a plain string heading into an h1', () => {
    const { getByRole } = renderShell('Hello world');
    expect(getByRole('heading', { level: 1 }).textContent).toBe('Hello world');
  });

  it('renders TitleShape.plain into an h1 with no italic span', () => {
    const { getByRole } = renderShell({ kind: 'plain', text: 'Plain title' });
    const h1 = getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Plain title');
    expect(h1.querySelector('span')).toBeNull();
  });

  it('renders TitleShape.split with bold pre-segment + italic accent + terminal period', () => {
    const { getByRole } = renderShell({ kind: 'split', bold: 'Your', accent: 'situation', period: true });
    const h1 = getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Your situation.');
    const accent = h1.querySelector('span') as HTMLElement;
    expect(accent.textContent).toBe('situation');
    expect(accent.style.fontStyle).toBe('italic');
    expect(accent.style.fontWeight).toBe('400');
  });

  it('omits the terminal period when period flag is unset', () => {
    const { getByRole } = renderShell({ kind: 'split', bold: 'Your', accent: 'situation' });
    expect(getByRole('heading', { level: 1 }).textContent).toBe('Your situation');
  });

  it('renders the h1 with canvas typography (26px serif, lh 1.05, letterSpacing -0.02em)', () => {
    const { getByRole } = renderShell('Anything');
    const h1 = getByRole('heading', { level: 1 }) as HTMLElement;
    const styleAttr = h1.getAttribute('style') ?? '';
    expect(styleAttr).toContain('26px');
    expect(styleAttr).toContain('1.05');
    expect(styleAttr).toContain('-0.02em');
  });
});
