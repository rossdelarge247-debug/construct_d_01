import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JoinedAvatarsHero } from '@/app/dev/proto/share-flow/_components/JoinedAvatarsHero';

describe('JoinedAvatarsHero', () => {
  it('renders the hero container with data-testid', () => {
    const { container } = render(<JoinedAvatarsHero />);
    expect(container.querySelector('[data-testid="joined-avatars-hero"]')).toBeTruthy();
  });

  it('renders Sarah avatar first (left) with label', () => {
    render(<JoinedAvatarsHero />);
    const sarah = screen.getByLabelText('Sarah');
    expect(sarah.textContent).toBe('S');
  });

  it('renders Mark placeholder avatar (right) with dashed border', () => {
    const { container } = render(<JoinedAvatarsHero />);
    const mark = container.querySelector('[data-testid="mark-avatar-placeholder"]');
    expect(mark).toBeTruthy();
    expect(mark!.textContent).toBe('?');
    expect((mark as HTMLElement).style.borderStyle).toContain('dashed');
  });
});
