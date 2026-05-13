import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhyWeAsk } from '@/app/dev/proto/pre-signup-interview/components/WhyWeAsk';

const baseBody =
  'Civil partnerships, marriages, and cohabiting unions each have their own legal process. Children and housing change what the plan needs to cover.';

describe('WhyWeAsk', () => {
  it('renders the fixed "Why we ask" eyebrow label', () => {
    render(<WhyWeAsk body={baseBody} />);
    const eyebrow = screen.getByText('Why we ask');
    expect(eyebrow.tagName).toBe('P');
    expect(eyebrow.style.textTransform).toBe('uppercase');
  });

  it('renders the body paragraph passed via props', () => {
    render(<WhyWeAsk body={baseBody} />);
    const body = screen.getByText(baseBody);
    expect(body.tagName).toBe('P');
  });

  it('renders eyebrow and body as the only two direct children of the wrapper', () => {
    const { container } = render(<WhyWeAsk body={baseBody} />);
    const wrapper = container.firstElementChild as HTMLElement;
    const children = Array.from(wrapper.children);
    expect(children).toHaveLength(2);
    expect(children[0].tagName).toBe('P');
    expect(children[0].textContent).toBe('Why we ask');
    expect(children[1].tagName).toBe('P');
    expect(children[1].textContent).toBe(baseBody);
  });

  it('writes --stagger-index CSS var to wrapper from staggerIndex prop', () => {
    const { container } = render(<WhyWeAsk body={baseBody} staggerIndex={4} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--stagger-index')).toBe('4');
  });

  it('defaults --stagger-index to 0 when staggerIndex prop omitted', () => {
    const { container } = render(<WhyWeAsk body={baseBody} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--stagger-index')).toBe('0');
  });

  it('composes className prop with internal styles.callout class on wrapper', () => {
    const { container } = render(
      <WhyWeAsk body={baseBody} className="screen-entry" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/callout/);
    expect(wrapper.className).toMatch(/screen-entry/);
  });

  it('applies internal styles.callout class without className prop', () => {
    const { container } = render(<WhyWeAsk body={baseBody} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/callout/);
  });
});
