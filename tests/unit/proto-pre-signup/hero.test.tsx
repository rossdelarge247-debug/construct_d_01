import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/app/dev/proto/pre-signup-interview/components/Hero';

describe('Hero', () => {
  it('renders an <h1> with the heading text when heading is a plain string', () => {
    render(<Hero eyebrow="Step one" heading="Tell us where you're at." />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.tagName).toBe('H1');
    expect(heading.textContent).toBe("Tell us where you're at.");
  });

  it('renders heading content with JSX fragment passed (preserves nested italic span)', () => {
    render(
      <Hero
        eyebrow="Step one"
        heading={
          <>
            Here&apos;s <span style={{ fontStyle: 'italic' }}>your plan</span>.
          </>
        }
      />,
    );
    const heading = screen.getByRole('heading', { level: 1 });
    const italicSpan = heading.querySelector('span');
    expect(italicSpan).not.toBeNull();
    expect(italicSpan?.style.fontStyle).toBe('italic');
    expect(heading.textContent).toBe("Here's your plan.");
  });

  it('renders eyebrow text with default muted color when eyebrowColor is omitted', () => {
    render(<Hero eyebrow="Quiet eyebrow" heading="Heading" />);
    const eyebrow = screen.getByText('Quiet eyebrow');
    expect(eyebrow.style.color).toBe('var(--ds-color-text-muted)');
  });

  it('renders eyebrow with overridden color when eyebrowColor is provided', () => {
    render(<Hero eyebrow="Accent eyebrow" eyebrowColor="#7C3AED" heading="Heading" />);
    const eyebrow = screen.getByText('Accent eyebrow');
    expect(eyebrow.style.color).toBe('rgb(124, 58, 237)');
  });

  it('renders helper paragraph with sans variant (default) when helper provided', () => {
    render(<Hero eyebrow="Step" heading="Heading" helper="Sans helper text." />);
    const helper = screen.getByText('Sans helper text.');
    expect(helper.tagName).toBe('P');
    expect(helper.style.fontStyle).not.toBe('italic');
  });

  it('renders helper paragraph with italic-serif variant when helperVariant set', () => {
    render(
      <Hero
        eyebrow="Step"
        heading="Heading"
        helper="Italic serif helper."
        helperVariant="italic-serif"
      />,
    );
    const helper = screen.getByText('Italic serif helper.');
    expect(helper.tagName).toBe('P');
    expect(helper.style.fontStyle).toBe('italic');
  });

  it('renders no <p> helper when helper prop is omitted', () => {
    const { container } = render(<Hero eyebrow="Step" heading="Heading" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('writes --stagger-index CSS var to wrapper from staggerIndex prop', () => {
    const { container } = render(
      <Hero eyebrow="Step" heading="Heading" staggerIndex={2} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--stagger-index')).toBe('2');
  });

  it('composes className prop with internal styles.hero class on wrapper', () => {
    const { container } = render(
      <Hero eyebrow="Step" heading="Heading" className="screen-entry" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/hero/);
    expect(wrapper.className).toMatch(/screen-entry/);
  });
});
