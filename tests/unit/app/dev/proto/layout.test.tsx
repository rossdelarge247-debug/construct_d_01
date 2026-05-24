import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtoLayout from '@/app/dev/proto/layout';

describe('ProtoLayout', () => {
  it('renders children', () => {
    render(<ProtoLayout><p>hello</p></ProtoLayout>);
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('provides BankDataProvider to children', () => {
    expect(() => render(<ProtoLayout><div /></ProtoLayout>)).not.toThrow();
  });
});
