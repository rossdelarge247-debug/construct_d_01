import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectivePublishToggles, SECTIONS } from '@/app/dev/proto/share-flow/_components/SelectivePublishToggles';

describe('SelectivePublishToggles', () => {
  it('renders the "What to share" heading (AC-4)', () => {
    render(<SelectivePublishToggles />);
    expect(screen.getByText('What to share')).toBeTruthy();
  });

  it('renders supporting copy verbatim (AC-4)', () => {
    render(<SelectivePublishToggles />);
    expect(
      screen.getByText('By default, all sections share. Uncheck any you want to keep private for now.'),
    ).toBeTruthy();
  });

  it('renders 7 checkboxes matching the section list (AC-4)', () => {
    render(<SelectivePublishToggles />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(7);
    for (const section of SECTIONS) {
      expect(screen.getByLabelText(section)).toBeTruthy();
    }
  });

  it('all 7 checkboxes default-CHECKED (AC-4)', () => {
    render(<SelectivePublishToggles />);
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    for (const cb of checkboxes) {
      expect(cb.checked).toBe(true);
    }
  });

  it('clicking a checkbox toggles its state (AC-4)', () => {
    render(<SelectivePublishToggles />);
    const propertyBox = screen.getByLabelText('Property') as HTMLInputElement;
    expect(propertyBox.checked).toBe(true);
    fireEvent.click(propertyBox);
    expect(propertyBox.checked).toBe(false);
    fireEvent.click(propertyBox);
    expect(propertyBox.checked).toBe(true);
  });
});
