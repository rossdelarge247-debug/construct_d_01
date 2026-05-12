import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EntryScaffold } from '@/app/dev/proto/pre-signup-interview/components/EntryScaffold';

const baseProps = {
  timeIntro: 'In the next ~3 minutes, you\'ll:',
  outcomes: [
    'See the likely process for your specific situation',
    'Shape a starting plan for children, housing, and finances',
    'Know exactly what to focus on next',
  ],
  reassurance: 'You don\'t need to know everything. You just need to start.',
};

describe('EntryScaffold', () => {
  it('renders the time-intro paragraph', () => {
    render(<EntryScaffold {...baseProps} />);
    const intro = screen.getByText(baseProps.timeIntro);
    expect(intro.tagName).toBe('P');
  });

  it('renders each outcome as a list item inside a single <ul>', () => {
    render(<EntryScaffold {...baseProps} />);
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(1);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('See the likely process for your specific situation');
    expect(items[1].textContent).toContain('Shape a starting plan for children, housing, and finances');
    expect(items[2].textContent).toContain('Know exactly what to focus on next');
  });

  it('marks the checkmark glyph in each outcome as aria-hidden', () => {
    const { container } = render(<EntryScaffold {...baseProps} />);
    const hiddenSpans = container.querySelectorAll('li > span[aria-hidden="true"]');
    expect(hiddenSpans).toHaveLength(3);
    hiddenSpans.forEach((span) => {
      expect(span.textContent).toBe('✓');
    });
  });

  it('renders reassurance as an italic-serif paragraph', () => {
    render(<EntryScaffold {...baseProps} />);
    const reassurance = screen.getByText(baseProps.reassurance);
    expect(reassurance.tagName).toBe('P');
    expect(reassurance.style.fontStyle).toBe('italic');
  });

  it('writes --stagger-index CSS var to wrapper from staggerIndex prop', () => {
    const { container } = render(<EntryScaffold {...baseProps} staggerIndex={3} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--stagger-index')).toBe('3');
  });

  it('defaults --stagger-index to 0 when staggerIndex prop omitted', () => {
    const { container } = render(<EntryScaffold {...baseProps} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--stagger-index')).toBe('0');
  });

  it('composes className prop with internal styles.scaffold class on wrapper', () => {
    const { container } = render(
      <EntryScaffold {...baseProps} className="screen-entry" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/scaffold/);
    expect(wrapper.className).toMatch(/screen-entry/);
  });

  it('renders all three pieces (time intro + outcomes + reassurance) in DOM order', () => {
    const { container } = render(<EntryScaffold {...baseProps} />);
    const wrapper = container.firstElementChild as HTMLElement;
    const children = Array.from(wrapper.children);
    expect(children).toHaveLength(3);
    expect(children[0].tagName).toBe('P');
    expect(children[0].textContent).toBe(baseProps.timeIntro);
    expect(children[1].tagName).toBe('UL');
    expect(children[2].tagName).toBe('P');
    expect(children[2].textContent).toBe(baseProps.reassurance);
  });
});
