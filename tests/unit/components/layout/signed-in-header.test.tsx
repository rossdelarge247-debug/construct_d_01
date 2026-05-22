import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SignedInHeader } from '@/components/layout/signed-in-header';

describe('SignedInHeader', () => {
  describe('app mode (default)', () => {
    it('renders the wordmark', () => {
      render(<SignedInHeader />);
      expect(screen.getByText('decouple')).toBeTruthy();
    });

    it('renders page label when provided', () => {
      render(<SignedInHeader pageLabel="Dashboard" />);
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });

    it('omits page label when not provided', () => {
      render(<SignedInHeader />);
      expect(screen.queryByText('Dashboard')).toBeNull();
    });

    it('renders Help / Notifications / Settings buttons', () => {
      render(<SignedInHeader />);
      expect(screen.getByRole('button', { name: 'Help' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Notifications' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeTruthy();
    });

    it('renders an Open menu button for the mobile breakpoint', () => {
      render(<SignedInHeader />);
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeTruthy();
    });

    it('renders user avatar + name + status when user provided', () => {
      render(
        <SignedInHeader user={{ name: 'Sarah', initial: 'S', status: 'Just joined' }} />,
      );
      expect(screen.getByLabelText('Avatar for Sarah')).toBeTruthy();
      expect(screen.getByText('Sarah')).toBeTruthy();
      expect(screen.getByText('Just joined')).toBeTruthy();
    });

    it('omits avatar block when user not provided', () => {
      render(<SignedInHeader />);
      expect(screen.queryByText('Sarah')).toBeNull();
    });

    it('renders name without status if status omitted', () => {
      render(<SignedInHeader user={{ name: 'Sarah', initial: 'S' }} />);
      expect(screen.getByText('Sarah')).toBeTruthy();
      expect(screen.queryByText('Just joined')).toBeNull();
    });
  });

  describe('tour mode', () => {
    it('renders rightSlot content instead of app actions', () => {
      render(
        <SignedInHeader
          mode="tour"
          rightSlot={<button type="button">Skip tour</button>}
        />,
      );
      expect(screen.getByRole('button', { name: 'Skip tour' })).toBeTruthy();
      expect(screen.queryByRole('button', { name: 'Help' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'Notifications' })).toBeNull();
    });

    it('still renders the wordmark', () => {
      render(<SignedInHeader mode="tour" rightSlot={null} />);
      expect(screen.getByText('decouple')).toBeTruthy();
    });
  });
});
