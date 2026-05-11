import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandBar } from '@/app/dev/proto/pre-signup-interview/components/BrandBar';
import { ScreenShell } from '@/app/dev/proto/pre-signup-interview/components/ScreenShell';
import { O2 } from '@/app/dev/proto/pre-signup-interview/screens/O2';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';

const noop = () => undefined;

describe('BrandBar (component isolation)', () => {
  it('renders the literal wordmark "Decouple."', () => {
    render(<BrandBar />);
    expect(screen.getByText('Decouple.')).toBeTruthy();
  });

  it('renders the wordmark inside a non-interactive <span> (no button, no anchor)', () => {
    render(<BrandBar />);
    const wordmark = screen.getByText('Decouple.');
    expect(wordmark.tagName).toBe('SPAN');
    expect(screen.queryByRole('button', { name: /decouple/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /decouple/i })).toBeNull();
  });

  it('applies canvas-verbatim typography (14px / 700 / -0.02em)', () => {
    render(<BrandBar />);
    const wordmark = screen.getByText('Decouple.') as HTMLElement;
    const styleAttr = wordmark.getAttribute('style') ?? '';
    expect(styleAttr).toContain('14px');
    expect(styleAttr).toContain('font-weight: 700');
    expect(styleAttr).toContain('-0.02em');
  });
});

describe('BrandBar via ScreenShell (covers O1, O3-O8)', () => {
  it('renders "Decouple." inside the ScreenShell main', () => {
    render(
      <ScreenShell step={2} heading="Test" onContinue={noop} onBack={noop}>
        <div data-testid="child-slot" />
      </ScreenShell>,
    );
    expect(screen.getByText('Decouple.')).toBeTruthy();
  });
});

describe('BrandBar via O2 (canvas-as-source)', () => {
  it('renders "Decouple." inside the O2 screen', () => {
    render(
      <ProtoProvider>
        <O2 />
      </ProtoProvider>,
    );
    expect(screen.getByText('Decouple.')).toBeTruthy();
  });
});
