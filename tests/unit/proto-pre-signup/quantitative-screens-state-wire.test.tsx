import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BucketPicker } from '@/app/dev/proto/pre-signup-interview/components/BucketPicker';
import { ExpansionToggle } from '@/app/dev/proto/pre-signup-interview/components/ExpansionToggle';
import { MultiPicker } from '@/app/dev/proto/pre-signup-interview/components/MultiPicker';

describe('BucketPicker', () => {
  it('marks the selected value as aria-checked', () => {
    render(
      <BucketPicker
        id="test"
        label="Test"
        options={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
        selected="a"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Apple' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Banana' }).getAttribute('aria-checked')).toBe('false');
  });

  it('fires onChange with the option value when an option is clicked', () => {
    const onChange = vi.fn();
    render(
      <BucketPicker
        id="test"
        label="Test"
        options={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
        selected={undefined}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Banana' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('fires onChange with null when "Prefer not to say" is clicked', () => {
    const onChange = vi.fn();
    render(
      <BucketPicker
        id="test"
        label="Test"
        options={[{ value: 'a', label: 'Apple' }]}
        selected={undefined}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Prefer not to say' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('marks "Prefer not to say" as aria-checked when selected is null', () => {
    render(
      <BucketPicker
        id="test"
        label="Test"
        options={[{ value: 'a', label: 'Apple' }]}
        selected={null}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'Prefer not to say' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(screen.getByRole('radio', { name: 'Apple' }).getAttribute('aria-checked')).toBe('false');
  });

  it('leaves all radios unchecked when selected is undefined', () => {
    render(
      <BucketPicker
        id="test"
        label="Test"
        options={[{ value: 'a', label: 'Apple' }]}
        selected={undefined}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Apple' }).getAttribute('aria-checked')).toBe('false');
    expect(
      screen.getByRole('radio', { name: 'Prefer not to say' }).getAttribute('aria-checked'),
    ).toBe('false');
  });
});

describe('MultiPicker', () => {
  it('marks selected values as aria-checked', () => {
    render(
      <MultiPicker
        id="test"
        label="Test"
        options={[
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
        ]}
        selected={['x']}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'X' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('checkbox', { name: 'Y' }).getAttribute('aria-checked')).toBe('false');
  });

  it('adds a value when an unchecked option is clicked', () => {
    const onChange = vi.fn();
    render(
      <MultiPicker
        id="test"
        label="Test"
        options={[
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
        ]}
        selected={['x']}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Y' }));
    expect(onChange).toHaveBeenCalledWith(['x', 'y']);
  });

  it('removes a value when a checked option is clicked', () => {
    const onChange = vi.fn();
    render(
      <MultiPicker
        id="test"
        label="Test"
        options={[
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
        ]}
        selected={['x', 'y']}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'X' }));
    expect(onChange).toHaveBeenCalledWith(['y']);
  });
});

describe('ExpansionToggle', () => {
  it('renders rationale and hides children when closed', () => {
    render(
      <ExpansionToggle
        id="test"
        label="Show more"
        rationale={<span>Why it matters</span>}
        open={false}
        onToggle={vi.fn()}
      >
        <div>Hidden field</div>
      </ExpansionToggle>,
    );
    expect(screen.getByText('Why it matters')).toBeTruthy();
    expect(screen.queryByText('Hidden field')).toBeNull();
    const toggle = screen.getByRole('button', { name: /Show more/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBeNull();
  });

  it('shows children when open and aria-expanded is true', () => {
    render(
      <ExpansionToggle
        id="test"
        label="Show more"
        rationale={<span>Why it matters</span>}
        open={true}
        onToggle={vi.fn()}
      >
        <div>Visible field</div>
      </ExpansionToggle>,
    );
    expect(screen.getByText('Visible field')).toBeTruthy();
    const toggle = screen.getByRole('button', { name: /Show more/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-controls')).toBe('test-content');
  });

  it('fires onToggle when the toggle button is clicked', () => {
    const onToggle = vi.fn();
    render(
      <ExpansionToggle
        id="test"
        label="Show more"
        rationale={<span>Why</span>}
        open={false}
        onToggle={onToggle}
      >
        <div />
      </ExpansionToggle>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Show more/ }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
