import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import {
  ConnectedBanner,
  resolveVariant,
} from '@/app/dev/proto/post-connect-dashboard/page';

describe('resolveVariant', () => {
  it('returns conservative when raw is null', () => {
    expect(resolveVariant(null)).toBe('conservative');
  });

  it('returns conservative when raw is undefined', () => {
    expect(resolveVariant(undefined)).toBe('conservative');
  });

  it('returns expressive when raw equals "expressive"', () => {
    expect(resolveVariant('expressive')).toBe('expressive');
  });

  it('returns conservative for any other value', () => {
    expect(resolveVariant('not-a-real-variant')).toBe('conservative');
    expect(resolveVariant('Expressive')).toBe('conservative');
    expect(resolveVariant('')).toBe('conservative');
  });
});

function ConnectedBannerHarness({
  initial = false,
}: {
  initial?: boolean;
}) {
  const [expanded, setExpanded] = useState(initial);
  return (
    <ConnectedBanner
      variant="conservative"
      expanded={expanded}
      onToggle={() => setExpanded((e) => !e)}
    />
  );
}

describe('ConnectedBanner', () => {
  it('renders the toggle button with aria-expanded=false initially', () => {
    render(<ConnectedBannerHarness initial={false} />);
    const toggle = screen.getByRole('button', {
      name: /Connected to Barclays — toggle accounts panel/i,
    });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('flips aria-expanded to true after one click', () => {
    render(<ConnectedBannerHarness initial={false} />);
    const toggle = screen.getByRole('button', {
      name: /Connected to Barclays — toggle accounts panel/i,
    });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('flips aria-expanded back to false on second click', () => {
    render(<ConnectedBannerHarness initial={false} />);
    const toggle = screen.getByRole('button', {
      name: /Connected to Barclays — toggle accounts panel/i,
    });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals the accounts panel when expanded', () => {
    render(<ConnectedBannerHarness initial={true} />);
    expect(screen.getByText('Everyday Current')).toBeTruthy();
    expect(screen.getByText('Reward Credit Card')).toBeTruthy();
    expect(screen.getByText('Joint Savings')).toBeTruthy();
  });

  it('hides the accounts panel when collapsed', () => {
    render(<ConnectedBannerHarness initial={false} />);
    expect(screen.queryByText('Everyday Current')).toBeNull();
  });

  it('invokes onToggle when the toggle button is clicked', () => {
    const onToggle = vi.fn();
    render(
      <ConnectedBanner
        variant="conservative"
        expanded={false}
        onToggle={onToggle}
      />,
    );
    const toggle = screen.getByRole('button', {
      name: /Connected to Barclays — toggle accounts panel/i,
    });
    fireEvent.click(toggle);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
