import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Footer } from '@/app/dev/proto/pre-signup-interview/components/Footer';

describe('Footer', () => {
  it('renders <footer> contentinfo landmark', () => {
    const { container } = render(<Footer ctaLabel="Continue" onContinue={() => {}} />);
    const footerEl = container.querySelector('footer');
    expect(footerEl).not.toBeNull();
    expect(screen.getByRole('contentinfo')).toBe(footerEl);
  });

  it('renders primary CTA with the passed ctaLabel and fires onContinue on click when enabled', () => {
    const onContinue = vi.fn();
    render(<Footer ctaLabel="Next" onContinue={onContinue} />);
    const button = screen.getByRole('button', { name: /next/i });
    expect(button.tagName).toBe('BUTTON');
    fireEvent.click(button);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('disables CTA when enabled=false', () => {
    const onContinue = vi.fn();
    render(<Footer ctaLabel="Continue" enabled={false} onContinue={onContinue} />);
    const button = screen.getByRole('button', { name: /continue/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('renders caption inside a role=status region above the CTA when caption is provided', () => {
    render(<Footer caption="Pick to continue." ctaLabel="Continue" enabled={false} onContinue={() => {}} />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Pick to continue.');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it('mounts the status region unconditionally; text content is empty when caption prop is omitted', () => {
    render(<Footer ctaLabel="Continue" onContinue={() => {}} />);
    const status = screen.getByRole('status');
    expect(status).toBeTruthy();
    expect(status.textContent).toBe('');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it('keeps the status region mounted across the caption-toggles-on transition', () => {
    const { rerender } = render(<Footer ctaLabel="Continue" onContinue={() => {}} />);
    const before = screen.getByRole('status');
    expect(before.textContent).toBe('');
    rerender(<Footer caption="Now visible." ctaLabel="Continue" onContinue={() => {}} />);
    const after = screen.getByRole('status');
    expect(after).toBe(before);
    expect(after.textContent).toBe('Now visible.');
  });

  it('renders secondaryActions row between caption and primary CTA when provided', () => {
    render(
      <Footer
        ctaLabel="What's next"
        onContinue={() => {}}
        secondaryActions={<button type="button">Download</button>}
      />,
    );
    expect(screen.getByRole('button', { name: /download/i })).not.toBeNull();
    expect(screen.getByRole('button', { name: /what's next/i })).not.toBeNull();
  });

  it('applies cream variant class by default and light variant class when variant="light"', () => {
    const { container: creamContainer, unmount } = render(
      <Footer ctaLabel="A" onContinue={() => {}} />,
    );
    const creamFooter = creamContainer.querySelector('footer');
    expect(creamFooter?.className).toMatch(/footerCream/);
    unmount();
    const { container: lightContainer } = render(
      <Footer ctaLabel="B" onContinue={() => {}} variant="light" />,
    );
    const lightFooter = lightContainer.querySelector('footer');
    expect(lightFooter?.className).toMatch(/footerLight/);
  });

  it('enables the CTA by default when enabled prop is omitted', () => {
    render(<Footer ctaLabel="Continue" onContinue={() => {}} />);
    const button = screen.getByRole('button', { name: /continue/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('applies captionEnabled class when enabled and captionDisabled class when not', () => {
    const { rerender } = render(
      <Footer caption="status" ctaLabel="Continue" enabled onContinue={() => {}} />,
    );
    expect(screen.getByRole('status').className).toMatch(/captionEnabled/);
    rerender(
      <Footer caption="status" ctaLabel="Continue" enabled={false} onContinue={() => {}} />,
    );
    expect(screen.getByRole('status').className).toMatch(/captionDisabled/);
  });

  it('renders no secondaryActions row when prop is omitted', () => {
    const { container } = render(<Footer ctaLabel="Continue" onContinue={() => {}} />);
    expect(container.querySelector('[class*="secondaryRow"]')).toBeNull();
  });

  it('focuses the primary CTA when programmatically focused', () => {
    render(<Footer ctaLabel="Continue" onContinue={() => {}} />);
    const button = screen.getByRole('button', { name: /continue/i });
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('adds the ctaEnabled class on enabled false → true transition', () => {
    const { rerender } = render(
      <Footer ctaLabel="Continue" enabled={false} onContinue={() => {}} />,
    );
    let button = screen.getByRole('button', { name: /continue/i });
    expect(button.className).not.toMatch(/ctaEnabled/);
    rerender(<Footer ctaLabel="Continue" enabled onContinue={() => {}} />);
    button = screen.getByRole('button', { name: /continue/i });
    expect(button.className).toMatch(/ctaEnabled/);
  });
});
