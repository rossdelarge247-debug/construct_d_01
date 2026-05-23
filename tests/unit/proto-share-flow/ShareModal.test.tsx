import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareModal } from '@/app/dev/proto/share-flow/_components/ShareModal';

describe('ShareModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ShareModal open={false} onClose={vi.fn()} />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders a dialog with aria-modal when open (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('renders the heading "Share with Mark" (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /share with mark/i })).toBeTruthy();
  });

  it('renders 3 tabs in DOM order [Ex, Solicitor, Mediator] (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].textContent).toBe('Ex');
    expect(tabs[1].textContent).toBe('Solicitor');
    expect(tabs[2].textContent).toBe('Mediator');
  });

  it('sets Ex tab as default-active with aria-selected (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    const exTab = screen.getByRole('tab', { name: 'Ex' });
    expect(exTab.getAttribute('aria-selected')).toBe('true');
    expect(exTab.getAttribute('aria-controls')).toBe('panel-ex');
  });

  it('renders Ex panel with name + email required inputs (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    const nameInput = screen.getByLabelText(/mark's name/i);
    const emailInput = screen.getByLabelText(/mark's email/i);
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(nameInput.hasAttribute('required')).toBe(true);
    expect(emailInput.hasAttribute('required')).toBe(true);
    expect(emailInput.getAttribute('type')).toBe('email');
  });

  it('renders Solicitor panel with TBD placeholder (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Solicitor' }));
    expect(screen.getByText('Form fields TBD per 68f S-1.')).toBeTruthy();
  });

  it('renders Mediator panel with TBD placeholder (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Mediator' }));
    expect(screen.getByText('Form fields TBD per 68f S-1.')).toBeTruthy();
  });

  it('arrow keys traverse tabs (AC-3)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    const exTab = screen.getByRole('tab', { name: 'Ex' });
    exTab.focus();
    fireEvent.keyDown(exTab.parentElement!, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Solicitor' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(exTab.parentElement!, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Mediator' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(exTab.parentElement!, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Solicitor' }).getAttribute('aria-selected')).toBe('true');
  });

  it('Escape closes the modal (AC-3)', () => {
    const onClose = vi.fn();
    render(<ShareModal open={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Cancel button closes the modal (AC-3)', () => {
    const onClose = vi.fn();
    render(<ShareModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('submit replaces body with confirmation using entered name (AC-5)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/mark's name/i), { target: { value: 'Mark Hughes' } });
    fireEvent.change(screen.getByLabelText(/mark's email/i), { target: { value: 'mark@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));
    expect(screen.getByText('Invite sent to Mark Hughes.')).toBeTruthy();
  });

  it('submit on Solicitor tab falls back to "Mark" (AC-5)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Solicitor' }));
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));
    expect(screen.getByText('Invite sent to Mark.')).toBeTruthy();
  });

  it('confirmation shows the stub note and Close button (AC-5)', () => {
    render(<ShareModal open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Solicitor' }));
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));
    expect(screen.getByTestId('submit-confirmation')).toBeTruthy();
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy();
  });

  it('Close button in confirmation fires onClose (AC-5)', () => {
    const onClose = vi.fn();
    render(<ShareModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Solicitor' }));
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
