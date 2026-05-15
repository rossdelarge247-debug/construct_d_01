import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O1 } from '@/app/dev/proto/pre-signup-interview/screens/O1';

function renderO1() {
  return render(
    <ProtoProvider>
      <O1 />
    </ProtoProvider>,
  );
}

describe('O1 (canvas-as-source)', () => {
  it('renders the canvas literal heading "Tell us where you\'re at."', () => {
    renderO1();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe("Tell us where you're at.");
  });

  it('renders the shared BrandBar wordmark', () => {
    renderO1();
    expect(screen.getByText('Decouple.')).toBeTruthy();
  });

  it('renders three native radio inputs with canvas option labels', () => {
    renderO1();
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(3);
    expect(screen.getByText("We've decided to separate")).toBeTruthy();
    expect(screen.getByText("I'm thinking about separating")).toBeTruthy();
    expect(screen.getByText("We're already in the process")).toBeTruthy();
  });

  it('keeps the primary CTA disabled until a stage is selected', () => {
    renderO1();
    const cta = screen.getByRole('button', { name: 'Set up your situation' });
    expect((cta as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getAllByRole('radio')[0]);
    expect((cta as HTMLButtonElement).disabled).toBe(false);
  });

  it('renders the trust band literal "Private until saved"', () => {
    renderO1();
    expect(screen.getByText('Private until saved')).toBeTruthy();
  });

  it('updates checked state when a different radio is selected', () => {
    renderO1();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    fireEvent.click(radios[0]);
    expect(radios[0].checked).toBe(true);
    fireEvent.click(radios[1]);
    expect(radios[1].checked).toBe(true);
    expect(radios[0].checked).toBe(false);
  });

  it('wraps the radio group in a fieldset with the legend as accessible name', () => {
    renderO1();
    const group = screen.getByRole('group', { name: "Tell us where you're at." });
    expect(group).toBeTruthy();
    expect((group as HTMLFieldSetElement).tagName).toBe('FIELDSET');
  });

  it('renders a Home link (not Back) at top-left of the TopBar', () => {
    renderO1();
    const home = screen.getByRole('link', { name: /home/i });
    expect(home).toBeTruthy();
  });
});
